import { describe, expect, it } from 'vitest'
import { makeWorld } from './helpers'
import { calendarFile, cancelSignup, signUp } from '../../src/main/services/signups'
import { toIcs } from '../../src/shared/calendar'

describe('add to calendar', () => {
  it('writes a valid event with escaped text, local times and CRLF lines', () => {
    const text = toIcs({
      uid: 'u1',
      title: 'Sort, pack; deliver',
      location: 'Hall A\nBack door',
      description: 'Bring gloves',
      startAt: '2026-12-01T09:00',
      endAt: '2026-12-01T13:00',
      now: '2026-11-25T10:30'
    })
    expect(text).toContain('SUMMARY:Sort\\, pack\\; deliver\r\n')
    expect(text).toContain('LOCATION:Hall A\\nBack door\r\n')
    expect(text).toContain('DTSTART:20261201T090000\r\n')
    expect(text).toContain('DTEND:20261201T130000\r\n')
    expect(text.split('\r\n')[0]).toBe('BEGIN:VCALENDAR')
    expect(text.replace(/\r\n/g, '')).not.toContain('\n')
  })

  it('only exports the volunteer’s own active shifts', () => {
    const w = makeWorld()
    const id = w.activity({ title: 'Food Pantry Sort' })
    const [mine, other] = [w.volunteer(), w.volunteer()]
    signUp(w.as(mine), id)

    const file = calendarFile(w.as(mine), id)
    expect(file.name).toBe('Food Pantry Sort.ics')
    expect(file.text).toContain(`UID:turnout-${id}-${mine.id}`)

    expect(() => calendarFile(w.as(other), id)).toThrow(/own upcoming shifts/)
    expect(() => calendarFile(w.as(w.admin), id)).toThrow(/Only volunteers/)
    cancelSignup(w.as(mine), id)
    expect(() => calendarFile(w.as(mine), id)).toThrow(/own upcoming shifts/)
  })
})
