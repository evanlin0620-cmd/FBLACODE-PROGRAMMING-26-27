import { describe, expect, it } from 'vitest'
import { makeWorld } from './helpers'
import { cancelSignup, signUp } from '../../src/main/services/signups'
import { getActivity, roster, updateActivity } from '../../src/main/services/activities'
import { myNotifications } from '../../src/main/services/log'

describe('sign-ups and the waitlist', () => {
  it('confirms until full, then waitlists in order', () => {
    const w = makeWorld()
    const id = w.activity({ capacity: 2 })
    const [a, b, c, d] = [w.volunteer(), w.volunteer(), w.volunteer(), w.volunteer()]

    expect(signUp(w.as(a), id)).toEqual({ status: 'confirmed', position: null })
    expect(signUp(w.as(b), id)).toEqual({ status: 'confirmed', position: null })
    expect(signUp(w.as(c), id)).toEqual({ status: 'waitlisted', position: 1 })
    expect(signUp(w.as(d), id)).toEqual({ status: 'waitlisted', position: 2 })
    expect(getActivity(w.as(d), id).myWaitlistPosition).toBe(2)
  })

  it('moves the first waitlisted person up when a confirmed person cancels, and notifies them', () => {
    const w = makeWorld()
    const id = w.activity({ capacity: 1 })
    const [a, b, c] = [w.volunteer(), w.volunteer(), w.volunteer()]
    signUp(w.as(a), id)
    signUp(w.as(b), id)
    signUp(w.as(c), id)

    cancelSignup(w.as(a), id)

    const r = roster(w.as(w.admin), id)
    expect(r.map((x) => [x.userId, x.status, x.position])).toEqual([
      [b.id, 'confirmed', null],
      [c.id, 'waitlisted', 1]
    ])
    expect(myNotifications(w.as(b))[0].type).toBe('waitlist_promoted')
  })

  it('does not promote anyone when a waitlisted person cancels', () => {
    const w = makeWorld()
    const id = w.activity({ capacity: 1 })
    const [a, b, c] = [w.volunteer(), w.volunteer(), w.volunteer()]
    signUp(w.as(a), id)
    signUp(w.as(b), id)
    signUp(w.as(c), id)
    cancelSignup(w.as(b), id)
    expect(getActivity(w.as(c), id).myWaitlistPosition).toBe(1)
    expect(getActivity(w.as(c), id).mySignup).toBe('waitlisted')
  })

  it('refuses a duplicate sign-up', () => {
    const w = makeWorld()
    const id = w.activity()
    const a = w.volunteer()
    signUp(w.as(a), id)
    expect(() => signUp(w.as(a), id)).toThrow(/already signed up/)
  })

  it('refuses a shift that overlaps one the volunteer already has (no double-booking)', () => {
    const w = makeWorld()
    const first = w.activity({ startAt: '2026-11-10T09:00', endAt: '2026-11-10T12:00' })
    const overlapping = w.activity({ title: 'Coat Drive', startAt: '2026-11-10T11:00', endAt: '2026-11-10T14:00' })
    const backToBack = w.activity({ title: 'Lunch', startAt: '2026-11-10T12:00', endAt: '2026-11-10T13:00' })
    const a = w.volunteer()
    signUp(w.as(a), first)
    expect(() => signUp(w.as(a), overlapping)).toThrow(/overlaps/)
    expect(signUp(w.as(a), backToBack).status).toBe('confirmed')
  })

  it('refuses sign-ups once the shift has started', () => {
    const w = makeWorld('2026-11-10T09:30')
    const id = w.activity({ startAt: '2026-11-10T09:00', endAt: '2026-11-10T12:00' })
    expect(() => signUp(w.as(w.volunteer()), id)).toThrow(/already started/)
  })

  it('sends a re-joining volunteer to the back of the line', () => {
    const w = makeWorld()
    const id = w.activity({ capacity: 1 })
    const [a, b, c] = [w.volunteer(), w.volunteer(), w.volunteer()]
    signUp(w.as(a), id)
    w.clock.now = '2026-11-01T12:01'
    signUp(w.as(b), id)
    w.clock.now = '2026-11-01T12:02'
    signUp(w.as(c), id)
    cancelSignup(w.as(b), id)
    w.clock.now = '2026-11-01T12:03'
    expect(signUp(w.as(b), id)).toEqual({ status: 'waitlisted', position: 2 })
  })

  it('fills new spots from the waitlist when an admin raises the capacity', () => {
    const w = makeWorld()
    const id = w.activity({ capacity: 1 })
    const [a, b] = [w.volunteer(), w.volunteer()]
    signUp(w.as(a), id)
    signUp(w.as(b), id)
    const current = getActivity(w.as(w.admin), id)
    updateActivity(w.as(w.admin), id, {
      title: current.title,
      type: current.type,
      description: current.description,
      location: current.location,
      startAt: current.startAt,
      endAt: current.endAt,
      capacity: 2,
      skillIds: []
    })
    expect(getActivity(w.as(b), id).mySignup).toBe('confirmed')
  })
})
