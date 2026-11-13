/** Recommendations, the Help assistant, reports, and the demo seed. */
import { describe, expect, it } from 'vitest'
import { scoreActivity } from '../../src/main/services/recommendations'
import { answer } from '../../src/shared/help'
import type { Activity, Profile } from '../../src/shared/types'
import { openDb } from '../../src/main/db'
import { seedDemo, DEMO_ADMIN, DEMO_VOLUNTEER } from '../../src/main/db/seed'
import { login } from '../../src/main/services/auth'
import { hoursReport, impactStats, reportToCsv, volunteerDashboard } from '../../src/main/services/reports'
import { toStamp } from '../../src/shared/time'

const activity = (patch: Partial<Activity> = {}): Activity => ({
  id: 1,
  title: 'Health Screening',
  type: 'Health',
  description: '',
  location: '',
  startAt: '2026-11-14T09:00', // a Saturday
  endAt: '2026-11-14T12:00',
  capacity: 5,
  status: 'open',
  skills: [{ id: 1, name: 'Spanish translator' }, { id: 2, name: 'First aid / CPR' }],
  confirmed: 0,
  waitlisted: 0,
  mySignup: null,
  myWaitlistPosition: null,
  ...patch
})

const profile = (patch: Partial<Profile> = {}): Profile => ({
  userId: 1,
  email: '',
  fullName: '',
  phone: '',
  bio: '',
  interests: [],
  skills: [],
  availability: [],
  hourGoal: 20,
  ...patch
})

describe('recommendation score', () => {
  it('gives 100 for full skill, availability, and interest match', () => {
    const p = profile({
      skills: [{ id: 1, name: 'Spanish translator' }, { id: 2, name: 'First aid / CPR' }],
      availability: [{ weekday: 6, start: '08:00', end: '13:00' }],
      interests: ['Health']
    })
    const r = scoreActivity(activity(), p)
    expect(r.score).toBe(100)
    expect(r.reasons).toContain('Fits your Saturday availability')
  })

  it('gives partial credit for half the skills and half the time', () => {
    const p = profile({ skills: [{ id: 1, name: 'Spanish translator' }], availability: [{ weekday: 6, start: '10:30', end: '15:00' }] })
    expect(scoreActivity(activity(), p).score).toBe(25 + 15)
  })

  it('moves full activities down', () => {
    const p = profile({ interests: ['Health'] })
    expect(scoreActivity(activity({ confirmed: 5 }), p).score).toBeLessThan(scoreActivity(activity(), p).score)
  })
})

describe('help assistant', () => {
  it('answers typed questions in everyday words', () => {
    expect(answer('how do i register for an event', 'volunteer')[0].id).toBe('signup-shift')
    expect(answer('my hours are missing from my total', 'volunteer')[0].id).toBe('hours-pending')
    expect(answer('where do I get a certificate for school?', 'volunteer')[0].id).toBe('certificate')
    expect(answer('find a spanish translator', 'admin')[0].id).toBe('admin-find-volunteer')
  })

  it('only shows answers meant for the user’s role', () => {
    expect(answer('approve hours', 'volunteer').map((f) => f.id)).not.toContain('admin-approve')
  })

  it('returns nothing for gibberish', () => {
    expect(answer('qwzx plorb', 'volunteer')).toEqual([])
  })
})

describe('demo data and reports', () => {
  const now = new Date('2026-11-05T12:00')
  const db = openDb(':memory:')
  seedDemo(db, now)
  const ctxFor = (email: string, password: string) => {
    const guest = { db, user: null, now: () => toStamp(now) }
    return { ...guest, user: login(guest, { email, password }) }
  }

  it('seeds working demo accounts', () => {
    expect(ctxFor(DEMO_ADMIN.email, DEMO_ADMIN.password).user.role).toBe('admin')
    expect(ctxFor(DEMO_VOLUNTEER.email, DEMO_VOLUNTEER.password).user.role).toBe('volunteer')
  })

  it('fills the dashboards', () => {
    const stats = impactStats(ctxFor(DEMO_ADMIN.email, DEMO_ADMIN.password))
    expect(stats.totalApprovedHours).toBeGreaterThan(0)
    expect(stats.pendingApprovals).toBeGreaterThan(0)
    expect(stats.hoursByMonth).toHaveLength(6)
    const dash = volunteerDashboard(ctxFor(DEMO_VOLUNTEER.email, DEMO_VOLUNTEER.password))
    expect(dash.upcoming.length).toBeGreaterThan(0)
    expect(dash.recommendations.length).toBeGreaterThan(0)
  })

  it('filters the report and exports CSV that matches the totals', () => {
    const admin = ctxFor(DEMO_ADMIN.email, DEMO_ADMIN.password)
    const all = hoursReport(admin, {})
    const food = hoursReport(admin, { type: 'Food Bank' })
    expect(food.rows.every((r) => r.activityType === 'Food Bank')).toBe(true)
    expect(food.totalHours).toBeLessThan(all.totalHours)
    expect(() => hoursReport(admin, { from: '2026-11-01', to: '2026-10-01' })).toThrow(/fix the highlighted/)
    const csv = reportToCsv(food).split('\r\n')
    expect(csv[0]).toBe('"Volunteer","Email","Activity","Type","Date","Hours"')
    expect(csv).toHaveLength(food.rows.length + 2)
  })

  it('stops CSV cells from running as spreadsheet formulas', () => {
    const row = { volunteerName: '=HYPERLINK("http://x")', volunteerEmail: '@a', activityTitle: 'Plain', activityType: 'Health' as const, date: '2026-11-01', hours: 2 }
    const line = reportToCsv({ ...hoursReport(ctxFor(DEMO_ADMIN.email, DEMO_ADMIN.password), {}), rows: [row] }).split('\r\n')[1]
    expect(line).toBe(`"'=HYPERLINK(""http://x"")","'@a","Plain","Health","2026-11-01","2"`)
  })
})
