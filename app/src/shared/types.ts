/**
 * Shared data types used by both the main process (backend) and the renderer (UI).
 * Keeping them in one place means the UI and the backend can never disagree
 * about the shape of the data they pass to each other.
 */

export type Role = 'volunteer' | 'admin'

/** The demo nonprofit's name, shown in the app and on certificates. */
export const ORGANIZATION = 'Riverside Community Partners'

/** Categories an activity can belong to. Also used as volunteer "interests". */
export const ACTIVITY_TYPES = [
  'Food Bank',
  'Tutoring',
  'Environmental',
  'Animal Care',
  'Senior Care',
  'Fundraising',
  'Event Support',
  'Health'
] as const
export type ActivityType = (typeof ACTIVITY_TYPES)[number]

export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const

export type SignupStatus = 'confirmed' | 'waitlisted' | 'cancelled'
export type HourStatus = 'pending' | 'approved' | 'rejected'

/** The person who is logged in right now. */
export interface SessionUser {
  id: number
  email: string
  role: Role
  fullName: string
}

export interface Skill {
  id: number
  name: string
}

/** One block of weekly availability, e.g. Saturday 09:00 to 13:00. */
export interface AvailabilityBlock {
  weekday: number // 0 = Sunday ... 6 = Saturday
  start: string // "HH:mm"
  end: string // "HH:mm"
}

export interface Profile {
  userId: number
  email: string
  fullName: string
  phone: string
  bio: string
  interests: ActivityType[]
  skills: Skill[]
  availability: AvailabilityBlock[]
  hourGoal: number
}

export interface Activity {
  id: number
  title: string
  type: ActivityType
  description: string
  location: string
  startAt: string // "YYYY-MM-DDTHH:mm" local time
  endAt: string
  capacity: number
  status: 'open' | 'cancelled'
  skills: Skill[]
  confirmed: number
  waitlisted: number
  /** The logged-in volunteer's sign-up status for this activity, if any. */
  mySignup: SignupStatus | null
  /** The logged-in volunteer's place in line (1 = next) when waitlisted. */
  myWaitlistPosition: number | null
}

export interface RosterEntry {
  userId: number
  fullName: string
  email: string
  status: 'confirmed' | 'waitlisted'
  position: number | null
}

export interface HourLog {
  id: number
  userId: number
  volunteerName: string
  activityId: number
  activityTitle: string
  activityType: ActivityType
  date: string // "YYYY-MM-DD" of the shift
  hours: number
  note: string
  status: HourStatus
  reviewNote: string
  reviewedAt: string | null
}

export interface Notification {
  id: number
  userId: number
  recipientEmail: string
  type: string
  subject: string
  body: string
  createdAt: string
  readAt: string | null
}

export interface VolunteerSummary {
  userId: number
  fullName: string
  email: string
  skills: string[]
  approvedHours: number
  upcomingShifts: number
}

export interface VolunteerDetail {
  profile: Profile
  hours: HourLog[]
  signups: { activity: Activity; status: SignupStatus }[]
  approvedHours: number
}

export interface Recommendation {
  activity: Activity
  score: number // 0-100
  reasons: string[]
}

export interface VolunteerDashboard {
  upcoming: Activity[]
  approvedHours: number
  pendingHours: number
  hourGoal: number
  unread: number
  recommendations: Recommendation[]
}

export interface ImpactStats {
  totalApprovedHours: number
  volunteerCount: number
  upcomingActivities: number
  pendingApprovals: number
  hoursByMonth: { month: string; hours: number }[]
  topActivities: { title: string; hours: number }[]
  hoursByType: { type: string; hours: number }[]
  skillGaps: { activityId: number; activityTitle: string; startAt: string; missingSkills: string[] }[]
}

export interface ReportFilter {
  from?: string // "YYYY-MM-DD"
  to?: string
  type?: ActivityType
  volunteerId?: number
}

export interface ReportRow {
  volunteerName: string
  volunteerEmail: string
  activityTitle: string
  activityType: ActivityType
  date: string
  hours: number
}

export interface HoursReport {
  filter: ReportFilter
  rows: ReportRow[]
  totalHours: number
  volunteerCount: number
  byMonth: { month: string; hours: number }[]
  byType: { type: string; hours: number }[]
  byVolunteer: { name: string; hours: number }[]
}

export interface Certificate {
  code: string
  volunteerName: string
  totalHours: number
  issuedAt: string
  activities: { title: string; date: string; hours: number }[]
  organization: string
}

export interface AuditEntry {
  id: number
  actorName: string
  action: string
  entity: string
  entityId: number | null
  detail: string
  at: string
}

/** Every backend call returns one of these instead of throwing across the IPC boundary. */
export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string; fields?: Record<string, string> } }
