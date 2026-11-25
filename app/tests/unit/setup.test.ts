import { describe, expect, it } from 'vitest'
import { openDb, run } from '../../src/main/db'
import type { Ctx } from '../../src/main/services/context'
import * as settings from '../../src/main/services/settings'
import { login } from '../../src/main/services/auth'
import { EXAMPLE_ORGANIZATION } from '../../src/shared/types'
import { makeWorld } from './helpers'

const fresh = (): Ctx => ({ db: openDb(':memory:'), user: null, now: () => '2026-11-01T12:00' })
const org = { orgName: 'Eastside Food Shelf', fullName: 'Sam Rivera', email: 'sam@eastside.test', password: 'Password1', confirmPassword: 'Password1' }

describe('first-run setup', () => {
  it('starts needed on an empty install', () => {
    expect(settings.setupStatus(fresh())).toEqual({ needed: true, example: false, orgName: 'Your organization' })
  })

  it('names the nonprofit and creates its first coordinator, who can then sign in', () => {
    const ctx = fresh()
    const admin = settings.createOrganization(ctx, org)
    expect(admin.role).toBe('admin')
    expect(settings.setupStatus(ctx)).toEqual({ needed: false, example: false, orgName: 'Eastside Food Shelf' })
    expect(login(ctx, { email: 'sam@eastside.test', password: 'Password1' }).id).toBe(admin.id)
  })

  it('checks the setup form like every other form', () => {
    expect(() => settings.createOrganization(fresh(), { ...org, confirmPassword: 'Other1234' })).toThrow(/fix the highlighted fields/)
  })

  it('refuses to run again once anyone has an account, so nobody can make themselves a coordinator', () => {
    const w = makeWorld()
    const ctx = w.as(null)
    expect(() => settings.createOrganization(ctx, org)).toThrow(/already set up/)
    expect(() => settings.loadExample(ctx)).toThrow(/already set up/)
  })

  it('loads the example organization, labelled as example data', () => {
    const ctx = fresh()
    settings.loadExample(ctx)
    expect(settings.setupStatus(ctx)).toEqual({ needed: false, example: true, orgName: EXAMPLE_ORGANIZATION })
  })

  it('labels an install from before setup existed as the example, keeping a name someone chose', () => {
    const w = makeWorld()
    run(w.db, "INSERT INTO settings (key, value) VALUES ('org_name', 'Renamed Before')")
    settings.migrateLegacyInstall(w.db)
    expect(settings.setupStatus(w.as(null))).toEqual({ needed: false, example: true, orgName: 'Renamed Before' })
  })
})
