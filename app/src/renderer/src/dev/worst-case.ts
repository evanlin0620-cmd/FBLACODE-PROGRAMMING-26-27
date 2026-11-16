/**
 * OPT-IN ONLY (VITE_STRESS_TEST=1): the "Worst case" and "Empty" data modes for stress-testing screens.
 * Real API answers pass through here and get realistic worst-case values swapped in, so every
 * screen is tested through the same boundary real data uses. Values stay inside the limits in
 * shared/schemas.ts (names 80, titles 100, locations 200, notes 500, 10 skills per activity).
 */
export type DataMode = 'demo' | 'worst' | 'empty'

export function dataMode(): DataMode {
  const m = new URLSearchParams(location.search).get('data')
  return m === 'worst' || m === 'empty' ? m : 'demo'
}

const LONG_TITLE = 'Riverside Community Garden Spring Planting, Mulching & Raised-Bed Repair Day (All Ages)'
const LONG_PLACE = 'St. Bartholomew’s Episcopal Church Fellowship Hall, Lower Level Room 104 (enter from the Maple Avenue lot)'
const LONG_NAME = 'Aleksandra Wiśniewska-Kowalczyk'
const LONGEST_NAME = 'María Fernanda de los Ángeles Gutiérrez-Santamaría y Villanueva-Ortega'
const LONG_EMAIL = 'bartholomew.fitzgerald@northwind-industries-holdings.example.com'
const LONG_NOTE =
  'Stayed an extra 45 minutes to help the pantry manager re-shelve the canned goods delivery after the truck arrived late, then broke down all the cardboard boxes for recycling. The sign-in sheet was already collected when I left, so my end time is not on it — please ask Denise if you need to confirm.'
const TEN_SKILLS = [
  'American Sign Language (ASL) interpreter',
  'Spanish translator',
  'First aid / CPR',
  'Driving (licensed)',
  'Forklift certification',
  'Grant writing',
  'Photography',
  'Web designer',
  'Animal handling',
  'Event setup'
]

type Obj = Record<string, unknown>

/** Spreads different failures across the first rows (what's on screen), as real data does. */
function worst(o: Obj, i: number): Obj {
  if ('capacity' in o && 'startAt' in o) {
    if (i % 4 === 0)
      return { ...o, title: LONG_TITLE, skills: TEN_SKILLS.map((name, id) => ({ id: 900 + id, name })), capacity: 1, confirmed: 1, waitlisted: 1284, myWaitlistPosition: o.mySignup === 'waitlisted' ? 1284 : o.myWaitlistPosition }
    if (i % 4 === 1) return { ...o, location: LONG_PLACE, capacity: 500, confirmed: 1 }
    if (i % 4 === 2) return { ...o, title: 'Run', location: 'Gym', skills: [], capacity: 1, confirmed: 0, waitlisted: 0 }
    return o
  }
  if ('volunteerName' in o) return { ...o, volunteerName: i % 2 ? LONGEST_NAME : LONG_NAME, activityTitle: i % 3 === 0 ? LONG_TITLE : o.activityTitle, note: i === 0 ? LONG_NOTE : o.note, hours: i === 1 ? 23.75 : o.hours }
  if ('fullName' in o && 'email' in o) return { ...o, fullName: i % 2 ? 'Jo' : LONGEST_NAME, email: LONG_EMAIL }
  if ('subject' in o && 'body' in o) return i === 0 ? { ...o, subject: `You’re on the waitlist: ${LONG_TITLE}`, recipientEmail: LONG_EMAIL } : o
  if ('reasons' in o && Array.isArray(o.reasons)) return { ...o, score: i === 0 ? 100 : 0, reasons: ['Uses your skills: American Sign Language (ASL) interpreter, Spanish translator, First aid / CPR', ...o.reasons] }
  if ('hourGoal' in o) return { ...o, approvedHours: 1284.25, hourGoal: 1000, pendingHours: 23.75, unread: 1284 }
  if ('totalApprovedHours' in o) return { ...o, totalApprovedHours: 12845.5, volunteerCount: 1, upcomingActivities: 1, pendingApprovals: 1284 }
  if ('missingSkills' in o) return { ...o, activityTitle: LONG_TITLE, missingSkills: TEN_SKILLS }
  if ('title' in o && 'hours' in o) return i === 0 ? { ...o, title: LONG_TITLE } : o
  return o
}

function walk(v: unknown, i: number): unknown {
  if (Array.isArray(v)) return v.map((x, j) => walk(x, j))
  if (!v || typeof v !== 'object') return v
  return worst(Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x, i)])), i)
}

const COUNTS = ['approvedHours', 'pendingHours', 'unread', 'totalApprovedHours', 'volunteerCount', 'upcomingActivities', 'pendingApprovals', 'totalHours']

/** Zero items everywhere: every list empty, every count 0 (goals keep their value, they can't be 0). */
function empty(v: unknown): unknown {
  if (Array.isArray(v)) return []
  if (!v || typeof v !== 'object') return v
  return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, Array.isArray(x) ? [] : COUNTS.includes(k) ? 0 : x]))
}

export function applyDataMode<T>(name: string, data: T): T {
  const mode = dataMode()
  if (mode === 'demo' || (mode === 'empty' && name.startsWith('auth.'))) return data // an empty session would log you out
  return (mode === 'worst' ? walk(data, 0) : empty(data)) as T
}
