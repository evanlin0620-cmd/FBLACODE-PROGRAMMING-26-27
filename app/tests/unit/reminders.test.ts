import { describe, expect, it } from 'vitest'
import { makeWorld } from './helpers'
import { remindUpcoming, signUp } from '../../src/main/services/signups'
import { myNotifications } from '../../src/main/services/log'

describe('shift reminders at sign-in', () => {
  it('reminds once for each confirmed shift in the next 7 days, and skips the rest', () => {
    const w = makeWorld('2026-11-01T12:00')
    const v = w.volunteer()
    const soon = w.activity({
      title: 'Soon',
      startAt: '2026-11-04T09:00',
      endAt: '2026-11-04T12:00'
    })
    const later = w.activity({
      title: 'Later',
      startAt: '2026-11-20T09:00',
      endAt: '2026-11-20T12:00'
    })
    const full = w.activity({
      title: 'Full',
      startAt: '2026-11-05T09:00',
      endAt: '2026-11-05T12:00',
      capacity: 1
    })
    signUp(w.as(w.volunteer()), full)
    for (const id of [soon, later, full]) signUp(w.as(v), id) // v is waitlisted on Full

    expect(remindUpcoming(w.as(v))).toBe(1)
    const reminders = myNotifications(w.as(v)).filter((n) => n.type === 'shift_reminder')
    expect(reminders.map((n) => n.subject)).toEqual(['Coming up: Soon'])

    expect(remindUpcoming(w.as(v))).toBe(0) // a second sign-in sends nothing new
    w.clock.now = '2026-11-14T12:00'
    expect(remindUpcoming(w.as(v))).toBe(1) // Later is now inside the week
  })

  it('is for volunteers only', () => {
    const w = makeWorld()
    expect(() => remindUpcoming(w.as(w.admin))).toThrow(/Only volunteers/)
  })
})
