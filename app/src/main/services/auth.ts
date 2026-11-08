/**
 * Accounts: sign up, log in, and admin-created admin accounts.
 * Passwords are never stored. We store a salted scrypt hash, which is slow
 * to compute on purpose so stolen hashes are hard to crack.
 */
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { one, run, tx } from '../db'
import { AppError } from '@shared/errors'
import { createAdminSchema, loginSchema, signupSchema } from '@shared/schemas'
import type { SessionUser } from '@shared/types'
import { type Ctx, parse, requireAdmin } from './context'
import { audit, notify } from './log'

export function hashPassword(password: string): string {
  const salt = randomBytes(16)
  const key = scryptSync(password, salt, 64)
  return `scrypt$${salt.toString('hex')}$${key.toString('hex')}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, saltHex, keyHex] = stored.split('$')
  if (scheme !== 'scrypt' || !saltHex || !keyHex) return false
  const expected = Buffer.from(keyHex, 'hex')
  const actual = scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length)
  // timingSafeEqual takes the same time whether the first or last byte differs.
  return timingSafeEqual(actual, expected)
}

interface UserRow {
  id: number
  email: string
  role: 'volunteer' | 'admin'
  full_name: string
  password_hash: string
}

const toSession = (u: UserRow): SessionUser => ({ id: u.id, email: u.email, role: u.role, fullName: u.full_name })

/** Creates a user row (and a profile for volunteers). Shared by sign-up, admin creation and the demo seed. */
export function createUser(
  ctx: Ctx,
  input: { fullName: string; email: string; password: string },
  role: 'volunteer' | 'admin'
): SessionUser {
  if (one(ctx.db, 'SELECT 1 FROM users WHERE email = ?', input.email)) {
    throw new AppError('CONFLICT', 'An account with that email already exists.', {
      email: 'This email is already registered. Try logging in instead.'
    })
  }
  return tx(ctx.db, () => {
    const id = run(
      ctx.db,
      'INSERT INTO users (email, password_hash, role, full_name, created_at) VALUES (?, ?, ?, ?, ?)',
      input.email,
      hashPassword(input.password),
      role,
      input.fullName,
      ctx.now()
    )
    if (role === 'volunteer') run(ctx.db, 'INSERT INTO volunteer_profiles (user_id) VALUES (?)', id)
    return { id, email: input.email, role, fullName: input.fullName }
  })
}

/** Public sign-up. Always creates a volunteer, so nobody can make themselves an admin. */
export function signup(ctx: Ctx, input: unknown): SessionUser {
  const data = parse(signupSchema, input)
  const user = createUser(ctx, data, 'volunteer')
  notify(
    ctx.db,
    ctx.now(),
    user.id,
    'welcome',
    'Welcome to ServeHub!',
    `Hi ${user.fullName},\n\nThanks for joining. Add your skills and availability on your profile so we can recommend shifts that fit you.`
  )
  audit(ctx.db, ctx.now(), user.id, 'signup', 'user', user.id)
  return user
}

export function login(ctx: Ctx, input: unknown): SessionUser {
  const data = parse(loginSchema, input)
  const user = one<UserRow>(ctx.db, 'SELECT * FROM users WHERE email = ?', data.email)
  // Same message whether the email or the password is wrong, so the form
  // doesn't reveal which emails have accounts.
  if (!user || !verifyPassword(data.password, user.password_hash)) {
    throw new AppError('UNAUTHORIZED', 'That email and password don’t match an account.')
  }
  return toSession(user)
}

export function createAdmin(ctx: Ctx, input: unknown): SessionUser {
  const actor = requireAdmin(ctx)
  const data = parse(createAdminSchema, input)
  const user = createUser(ctx, data, 'admin')
  audit(ctx.db, ctx.now(), actor.id, 'create_admin', 'user', user.id, user.email)
  return user
}
