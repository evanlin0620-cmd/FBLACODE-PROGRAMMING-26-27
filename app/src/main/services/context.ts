/**
 * Every service function receives a Ctx: the database, who is logged in,
 * and the current time. Passing the time in (instead of calling new Date()
 * everywhere) lets tests pretend it is any day they want.
 *
 * The require* helpers are the role-based access control (RBAC). Every
 * service calls one first, so a volunteer can't run an admin action even
 * if they find a way to send the request.
 */
import type { Db } from '../db'
import type { SessionUser } from '@shared/types'
import { AppError } from '@shared/errors'
import { fieldErrors } from '@shared/schemas'
import type { z } from 'zod'

export interface Ctx {
  db: Db
  user: SessionUser | null
  now: () => string // "YYYY-MM-DDTHH:mm"
}

export function requireUser(ctx: Ctx): SessionUser {
  if (!ctx.user) throw new AppError('UNAUTHORIZED', 'Please log in to continue.')
  return ctx.user
}

export function requireAdmin(ctx: Ctx): SessionUser {
  const user = requireUser(ctx)
  if (user.role !== 'admin') throw new AppError('FORBIDDEN', 'Only administrators can do that.')
  return user
}

export function requireVolunteer(ctx: Ctx): SessionUser {
  const user = requireUser(ctx)
  if (user.role !== 'volunteer') throw new AppError('FORBIDDEN', 'Only volunteers can do that.')
  return user
}

/** Validates input with a zod schema, or throws a VALIDATION error listing each bad field. */
export function parse<S extends z.ZodType>(schema: S, input: unknown): z.infer<S> {
  const result = schema.safeParse(input)
  if (!result.success) {
    throw new AppError('VALIDATION', 'Please fix the highlighted fields.', fieldErrors(result.error))
  }
  return result.data
}
