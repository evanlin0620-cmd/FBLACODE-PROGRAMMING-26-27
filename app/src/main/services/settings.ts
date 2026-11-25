/**
 * Install-wide settings and first-run setup. Turnout serves any nonprofit: a fresh install
 * asks for the organization's name and its first coordinator, or loads the example
 * organization instead. The name is shown on sign-in, the sidebar, reports and certificates.
 */
import { one, run, type Db } from '../db'
import { seedDemo } from '../db/seed'
import { AppError } from '@shared/errors'
import { DEFAULT_ORGANIZATION, EXAMPLE_ORGANIZATION, type SessionUser, type SetupStatus } from '@shared/types'
import { orgNameSchema, setupSchema } from '@shared/schemas'
import { audit } from './log'
import { createUser } from './auth'
import { parse, requireAdmin, type Ctx } from './context'

const get = (db: Db, key: string): string | undefined => one<{ value: string }>(db, 'SELECT value FROM settings WHERE key = ?', key)?.value

export function putSetting(db: Db, key: string, value: string): void {
  run(db, 'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', key, value)
}

/** Public: the sign-in screen shows it before anyone logs in. */
export function orgName(ctx: Ctx): string {
  return get(ctx.db, 'org_name') ?? DEFAULT_ORGANIZATION
}

export function setOrgName(ctx: Ctx, input: unknown): string {
  const admin = requireAdmin(ctx)
  const { name } = parse(orgNameSchema, input)
  putSetting(ctx.db, 'org_name', name)
  audit(ctx.db, ctx.now(), admin.id, 'Renamed organization', 'settings', null, name)
  return name
}

const hasUsers = (db: Db): boolean => one(db, 'SELECT 1 AS x FROM users LIMIT 1') !== undefined

/** Public: whether this install still needs setting up, and whether it holds the example organization. */
export function setupStatus(ctx: Ctx): SetupStatus {
  return { needed: !hasUsers(ctx.db), example: get(ctx.db, 'example_data') === '1', orgName: orgName(ctx) }
}

/** Setup runs once, on an empty install; after that, nobody can use it to make themselves a coordinator. */
function requireFreshInstall(db: Db): void {
  if (hasUsers(db)) throw new AppError('FORBIDDEN', 'Turnout is already set up on this computer. Sign in instead.')
}

/** Public, first run only: names the nonprofit and creates its first coordinator, who is then signed in. */
export function createOrganization(ctx: Ctx, input: unknown): SessionUser {
  requireFreshInstall(ctx.db)
  const data = parse(setupSchema, input)
  // createUser runs its own transaction (they don't nest), so the account goes first; the two settings can't fail after it.
  const admin = createUser(ctx, data, 'admin')
  putSetting(ctx.db, 'org_name', data.orgName)
  putSetting(ctx.db, 'example_data', '0')
  audit(ctx.db, ctx.now(), admin.id, 'Set up Turnout', 'settings', null, data.orgName)
  return admin
}

/** Public, first run only: loads the example organization and its demo accounts. */
export function loadExample(ctx: Ctx): null {
  requireFreshInstall(ctx.db)
  seedDemo(ctx.db)
  return null
}

/** Installs from before first-run setup were always demo-seeded; label them as the example. */
export function migrateLegacyInstall(db: Db): void {
  if (hasUsers(db) && get(db, 'example_data') === undefined) {
    putSetting(db, 'example_data', '1')
    if (get(db, 'org_name') === undefined) putSetting(db, 'org_name', EXAMPLE_ORGANIZATION)
  }
}
