import { describe, expect, it } from 'vitest'
import { makeWorld } from './helpers'
import { signUp } from '../../src/main/services/signups'
import { approvedTotal, hoursForReview, logHours, reviewHours } from '../../src/main/services/hours'
import { issueCertificate, verifyCertificate } from '../../src/main/services/reports'
import { myNotifications } from '../../src/main/services/log'
import { AppError } from '../../src/shared/errors'

/** A volunteer confirmed for a 3-hour shift that has already ended. */
function finishedShift() {
  const w = makeWorld('2026-11-01T08:00')
  const id = w.activity({ startAt: '2026-11-01T09:00', endAt: '2026-11-01T12:00' })
  const v = w.volunteer()
  signUp(w.as(v), id)
  w.clock.now = '2026-11-01T13:00'
  return { w, id, v }
}

const fieldsOf = (fn: () => unknown): Record<string, string> | undefined => {
  try {
    fn()
  } catch (e) {
    return (e as AppError).fields
  }
  throw new Error('expected an error')
}

describe('hour logging', () => {
  it('logs pending hours for a finished, confirmed shift', () => {
    const { w, id, v } = finishedShift()
    const log = logHours(w.as(v), { activityId: id, hours: 3, note: '' })
    expect(log.status).toBe('pending')
    expect(approvedTotal(w.db, v.id)).toBe(0) // pending hours don't count
  })

  it('rejects zero, negative, over-24 and non-quarter hours (format checks)', () => {
    const { w, id, v } = finishedShift()
    for (const hours of [0, -2, 25, 1.1]) {
      expect(fieldsOf(() => logHours(w.as(v), { activityId: id, hours, note: '' }))).toHaveProperty('hours')
    }
  })

  it('rejects more hours than the shift lasted (meaning check)', () => {
    const { w, id, v } = finishedShift()
    expect(fieldsOf(() => logHours(w.as(v), { activityId: id, hours: 4, note: '' }))?.hours).toMatch(/at most 3/)
  })

  it('rejects hours for a shift that has not ended yet', () => {
    const { w, id, v } = finishedShift()
    w.clock.now = '2026-11-01T11:00'
    expect(() => logHours(w.as(v), { activityId: id, hours: 2, note: '' })).toThrow(/after the shift ends/)
  })

  it('rejects hours for a shift the volunteer was not confirmed for', () => {
    const { w, id } = finishedShift()
    const stranger = w.volunteer()
    expect(() => logHours(w.as(stranger), { activityId: id, hours: 2, note: '' })).toThrow(/confirmed for/)
  })

  it('rejects logging the same shift twice', () => {
    const { w, id, v } = finishedShift()
    logHours(w.as(v), { activityId: id, hours: 3, note: '' })
    expect(() => logHours(w.as(v), { activityId: id, hours: 3, note: '' })).toThrow(/already logged/)
  })
})

describe('approvals and certificates', () => {
  it('approves hours, notifies the volunteer, and counts them', () => {
    const { w, id, v } = finishedShift()
    const log = logHours(w.as(v), { activityId: id, hours: 2.5, note: '' })
    expect(reviewHours(w.as(w.admin), { ids: [log.id], decision: 'approved', note: '' })).toEqual({ updated: 1 })
    expect(approvedTotal(w.db, v.id)).toBe(2.5)
    expect(myNotifications(w.as(v))[0].type).toBe('hours_approved')
    expect(hoursForReview(w.as(w.admin))).toHaveLength(0)
  })

  it('requires a reason to reject, and lets the volunteer log again afterwards', () => {
    const { w, id, v } = finishedShift()
    const log = logHours(w.as(v), { activityId: id, hours: 3, note: '' })
    expect(fieldsOf(() => reviewHours(w.as(w.admin), { ids: [log.id], decision: 'rejected', note: '' }))).toHaveProperty('note')
    reviewHours(w.as(w.admin), { ids: [log.id], decision: 'rejected', note: 'You left early' })
    expect(logHours(w.as(v), { activityId: id, hours: 2, note: '' }).status).toBe('pending')
  })

  it('skips entries that were already reviewed', () => {
    const { w, id, v } = finishedShift()
    const log = logHours(w.as(v), { activityId: id, hours: 3, note: '' })
    reviewHours(w.as(w.admin), { ids: [log.id], decision: 'approved', note: '' })
    expect(reviewHours(w.as(w.admin), { ids: [log.id], decision: 'rejected', note: 'Changed my mind' })).toEqual({ updated: 0 })
    expect(approvedTotal(w.db, v.id)).toBe(3)
  })

  it('issues a certificate with a code an admin can verify', () => {
    const { w, id, v } = finishedShift()
    const log = logHours(w.as(v), { activityId: id, hours: 3, note: '' })
    reviewHours(w.as(w.admin), { ids: [log.id], decision: 'approved', note: '' })
    const cert = issueCertificate(w.as(v))
    expect(cert.totalHours).toBe(3)
    expect(cert.code).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/)
    expect(verifyCertificate(w.as(w.admin), cert.code.toLowerCase()).volunteerName).toBe(v.fullName)
  })

  it('refuses a certificate with no approved hours', () => {
    const { w, v } = finishedShift()
    expect(() => issueCertificate(w.as(v))).toThrow(/at least one approved/)
  })
})
