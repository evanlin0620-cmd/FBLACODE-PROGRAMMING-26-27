/**
 * Role-based access control: every admin function must refuse volunteers,
 * and every function must refuse a logged-out caller.
 */
import { describe, expect, it } from 'vitest'
import { makeWorld } from './helpers'
import * as activities from '../../src/main/services/activities'
import * as hours from '../../src/main/services/hours'
import * as profiles from '../../src/main/services/profiles'
import * as reports from '../../src/main/services/reports'
import * as log from '../../src/main/services/log'
import * as signups from '../../src/main/services/signups'
import { createAdmin, login, signup } from '../../src/main/services/auth'

describe('role-based access', () => {
  it('blocks volunteers from every admin action', () => {
    const w = makeWorld()
    const v = w.as(w.volunteer())
    const id = w.activity()
    const adminOnly: [string, () => unknown][] = [
      ['createActivity', () => activities.createActivity(v, {})],
      ['updateActivity', () => activities.updateActivity(v, id, {})],
      ['cancelActivity', () => activities.cancelActivity(v, id)],
      ['deleteActivity', () => activities.deleteActivity(v, id)],
      ['roster', () => activities.roster(v, id)],
      ['hoursForReview', () => hours.hoursForReview(v)],
      ['reviewHours', () => hours.reviewHours(v, { ids: [1], decision: 'approved', note: '' })],
      ['searchVolunteers', () => profiles.searchVolunteers(v)],
      ['getVolunteer', () => profiles.getVolunteer(v, 1)],
      ['impactStats', () => reports.impactStats(v)],
      ['hoursReport', () => reports.hoursReport(v)],
      ['verifyCertificate', () => reports.verifyCertificate(v, 'ABCD-1234')],
      ['outbox', () => log.outbox(v)],
      ['listAudit', () => log.listAudit(v)],
      ['createAdmin', () => createAdmin(v, { fullName: 'Sneaky', email: 'x@y.test', password: 'Password1' })]
    ]
    for (const [name, call] of adminOnly) {
      expect(call, name).toThrow(/Only administrators/)
    }
  })

  it('blocks admins from volunteer-only actions', () => {
    const w = makeWorld()
    const a = w.as(w.admin)
    expect(() => signups.signUp(a, w.activity())).toThrow(/Only volunteers/)
    expect(() => hours.logHours(a, { activityId: 1, hours: 1, note: '' })).toThrow(/Only volunteers/)
    expect(() => profiles.getMyProfile(a)).toThrow(/Only volunteers/)
  })

  it('blocks logged-out callers', () => {
    const w = makeWorld()
    expect(() => activities.listActivities(w.as(null))).toThrow(/log in/)
    expect(() => log.myNotifications(w.as(null))).toThrow(/log in/)
  })

  it('hides cancelled activities from volunteers but not admins', () => {
    const w = makeWorld()
    const id = w.activity()
    activities.cancelActivity(w.as(w.admin), id)
    expect(activities.listActivities(w.as(w.volunteer()))).toHaveLength(0)
    expect(activities.listActivities(w.as(w.admin))).toHaveLength(1)
  })

  it('lets a volunteer mark only their own notifications as read', () => {
    const w = makeWorld()
    const [a, b] = [w.volunteer(), w.volunteer()]
    const id = w.activity()
    signups.signUp(w.as(a), id)
    const theirs = log.myNotifications(w.as(a))[0].id
    log.markRead(w.as(b), [theirs])
    expect(log.myNotifications(w.as(a))[0].readAt).toBeNull()
  })
})

describe('accounts', () => {
  it('always creates volunteers from public sign-up and logs them in', () => {
    const w = makeWorld()
    const u = signup(w.as(null), { fullName: 'New Person', email: ' New@Example.com ', password: 'abcdefg1', confirmPassword: 'abcdefg1' })
    expect(u.role).toBe('volunteer')
    expect(u.email).toBe('new@example.com')
    expect(login(w.as(null), { email: 'new@example.com', password: 'abcdefg1' }).id).toBe(u.id)
  })

  it('rejects a wrong password with a message that does not reveal which part was wrong', () => {
    const w = makeWorld()
    expect(() => login(w.as(null), { email: 'admin@test.test', password: 'nope' })).toThrow(/don’t match/)
    expect(() => login(w.as(null), { email: 'nobody@test.test', password: 'nope' })).toThrow(/don’t match/)
  })

  it('rejects bad emails, weak passwords, mismatched confirmations and duplicate emails', () => {
    const w = makeWorld()
    const fieldsFor = (input: object): string[] => {
      try {
        signup(w.as(null), input)
      } catch (e) {
        return Object.keys((e as { fields: object }).fields)
      }
      return []
    }
    expect(fieldsFor({ fullName: 'A Person', email: 'not-an-email', password: 'abcdefg1', confirmPassword: 'abcdefg1' })).toContain('email')
    expect(fieldsFor({ fullName: 'A Person', email: 'a@b.test', password: 'short1', confirmPassword: 'short1' })).toContain('password')
    expect(fieldsFor({ fullName: 'A Person', email: 'a@b.test', password: 'abcdefgh', confirmPassword: 'abcdefgh' })).toContain('password')
    expect(fieldsFor({ fullName: 'A Person', email: 'a@b.test', password: 'abcdefg1', confirmPassword: 'abcdefg2' })).toContain('confirmPassword')
    expect(fieldsFor({ fullName: 'A Person', email: 'ADMIN@test.test', password: 'abcdefg1', confirmPassword: 'abcdefg1' })).toContain('email')
  })
})
