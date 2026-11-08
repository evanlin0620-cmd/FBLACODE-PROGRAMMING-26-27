import { describe, expect, it } from 'vitest'
import { makeWorld } from './helpers'
import { cancelActivity, createActivity, deleteActivity, listActivities, updateActivity, getActivity } from '../../src/main/services/activities'
import { signUp } from '../../src/main/services/signups'
import { logHours } from '../../src/main/services/hours'
import { myNotifications } from '../../src/main/services/log'
import { searchVolunteers, updateMyProfile } from '../../src/main/services/profiles'

const valid = {
  title: 'Winter Coat Drive',
  type: 'Event Support',
  description: 'Collect and sort donated coats.',
  location: 'Community Hall',
  startAt: '2026-12-05T10:00',
  endAt: '2026-12-05T14:00',
  capacity: 10,
  skillIds: [] as number[]
}

describe('activity management', () => {
  it('creates an activity and validates format and meaning', () => {
    const w = makeWorld()
    const admin = w.as(w.admin)
    expect(createActivity(admin, valid).title).toBe('Winter Coat Drive')

    const bad = (patch: object): string[] => {
      try {
        createActivity(admin, { ...valid, ...patch })
      } catch (e) {
        return Object.keys((e as { fields: object }).fields)
      }
      return []
    }
    expect(bad({ endAt: '2026-12-05T09:00' })).toContain('endAt') // ends before it starts
    expect(bad({ endAt: '2026-12-06T09:00' })).toContain('endAt') // spans two days
    expect(bad({ capacity: 0 })).toContain('capacity')
    expect(bad({ capacity: 2.5 })).toContain('capacity')
    expect(bad({ startAt: '2026-10-01T10:00', endAt: '2026-10-01T12:00' })).toContain('startAt') // in the past
    expect(bad({ type: 'Skydiving' })).toContain('type')
  })

  it('refuses to lower capacity below the confirmed count', () => {
    const w = makeWorld()
    const id = w.activity({ capacity: 3 })
    signUp(w.as(w.volunteer()), id)
    signUp(w.as(w.volunteer()), id)
    const a = getActivity(w.as(w.admin), id)
    expect(() =>
      updateActivity(w.as(w.admin), id, { ...valid, startAt: a.startAt, endAt: a.endAt, capacity: 1 })
    ).toThrow(/lower than the number of confirmed/)
  })

  it('notifies signed-up volunteers when the time changes or the activity is cancelled', () => {
    const w = makeWorld()
    const id = w.activity()
    const v = w.volunteer()
    signUp(w.as(v), id)
    updateActivity(w.as(w.admin), id, { ...valid, startAt: '2026-11-10T10:00', endAt: '2026-11-10T13:00' })
    expect(myNotifications(w.as(v))[0].type).toBe('activity_changed')
    cancelActivity(w.as(w.admin), id)
    expect(myNotifications(w.as(v))[0].type).toBe('activity_cancelled')
  })

  it('refuses to delete an activity once hours are logged', () => {
    const w = makeWorld('2026-11-01T08:00')
    const id = w.activity({ startAt: '2026-11-01T09:00', endAt: '2026-11-01T11:00' })
    const v = w.volunteer()
    signUp(w.as(v), id)
    w.clock.now = '2026-11-01T12:00'
    logHours(w.as(v), { activityId: id, hours: 2, note: '' })
    expect(() => deleteActivity(w.as(w.admin), id)).toThrow(/Cancel it instead/)
  })
})

describe('search and filters', () => {
  it('filters activities by text, date range, type, and required skill', () => {
    const w = makeWorld()
    const spanish = w.skill('Spanish translator')
    w.activity({ title: 'Food Pantry Sort', type: 'Food Bank', startAt: '2026-11-10T09:00', endAt: '2026-11-10T12:00' })
    const clinic = w.activity({ title: 'Health Screening', type: 'Health', startAt: '2026-11-20T09:00', endAt: '2026-11-20T12:00' })
    w.db.prepare('INSERT INTO activity_skills (activity_id, skill_id) VALUES (?, ?)').run(clinic, spanish)
    w.activity({ title: 'Past Cleanup', startAt: '2026-10-01T09:00', endAt: '2026-10-01T12:00' })
    const v = w.as(w.volunteer())

    const titles = (f: object): string[] => listActivities(v, f).map((a) => a.title)
    expect(titles({})).toEqual(['Food Pantry Sort', 'Health Screening']) // past one hidden
    expect(titles({ q: 'pantry' })).toEqual(['Food Pantry Sort'])
    expect(titles({ from: '2026-11-15' })).toEqual(['Health Screening'])
    expect(titles({ to: '2026-11-15' })).toEqual(['Food Pantry Sort'])
    expect(titles({ type: 'Health' })).toEqual(['Health Screening'])
    expect(titles({ skillId: spanish })).toEqual(['Health Screening'])
    expect(titles({ includePast: true })).toHaveLength(3)
  })

  it('finds volunteers by name or by skill text', () => {
    const w = makeWorld()
    const spanish = w.skill('Spanish translator')
    const maria = w.volunteer('Maria Lopez')
    w.volunteer('Jordan Kim')
    updateMyProfile(w.as(maria), {
      fullName: 'Maria Lopez',
      phone: '',
      bio: '',
      interests: [],
      skillIds: [spanish],
      availability: [],
      hourGoal: 20
    })
    const admin = w.as(w.admin)
    expect(searchVolunteers(admin, { q: 'jordan' }).map((v) => v.fullName)).toEqual(['Jordan Kim'])
    expect(searchVolunteers(admin, { q: 'spanish' }).map((v) => v.fullName)).toEqual(['Maria Lopez'])
    expect(searchVolunteers(admin, { skillId: spanish }).map((v) => v.fullName)).toEqual(['Maria Lopez'])
  })

  it('rejects overlapping availability blocks and bad phone numbers in a profile', () => {
    const w = makeWorld()
    const v = w.as(w.volunteer())
    const base = { fullName: 'A Person', phone: '', bio: '', interests: [], skillIds: [], availability: [], hourGoal: 20 }
    expect(() =>
      updateMyProfile(v, { ...base, availability: [{ weekday: 6, start: '09:00', end: '12:00' }, { weekday: 6, start: '11:00', end: '14:00' }] })
    ).toThrow(/fix the highlighted/)
    expect(() => updateMyProfile(v, { ...base, phone: 'call me' })).toThrow(/fix the highlighted/)
    expect(updateMyProfile(v, { ...base, phone: '(555) 123-4567' }).phone).toBe('(555) 123-4567')
  })
})
