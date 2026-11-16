/**
 * Install-wide settings. ServeHub serves any nonprofit, so the organization's
 * name is stored here and shown on sign-in, the sidebar, reports and certificates.
 */
import { one, run } from '../db'
import { ORGANIZATION } from '@shared/types'
import { orgNameSchema } from '@shared/schemas'
import { audit } from './log'
import { parse, requireAdmin, type Ctx } from './context'

/** Public: the sign-in screen shows it before anyone logs in. */
export function orgName(ctx: Ctx): string {
  return one<{ value: string }>(ctx.db, "SELECT value FROM settings WHERE key = 'org_name'")?.value ?? ORGANIZATION
}

export function setOrgName(ctx: Ctx, input: unknown): string {
  const admin = requireAdmin(ctx)
  const { name } = parse(orgNameSchema, input)
  run(ctx.db, "INSERT INTO settings (key, value) VALUES ('org_name', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value", name)
  audit(ctx.db, ctx.now(), admin.id, 'Renamed organization', 'settings', null, name)
  return name
}
