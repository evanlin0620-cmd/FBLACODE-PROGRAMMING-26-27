/**
 * The contract between the UI and the backend: every call the UI can make,
 * with its input and output types. The main process implements each entry
 * (src/main/ipc.ts) and the UI calls them with api('name', input).
 * If either side changes a type without the other, TypeScript catches it.
 */
import type {
  ActivityFilter,
  ActivityInput,
  CreateAdminInput,
  LogHoursInput,
  LoginInput,
  ProfileInput,
  ReviewHoursInput,
  SignupInput,
  VolunteerSearch
} from './schemas'
import type {
  Activity,
  AuditEntry,
  Certificate,
  HourLog,
  HoursReport,
  ImpactStats,
  Notification,
  Profile,
  ReportFilter,
  RosterEntry,
  SessionUser,
  SignupStatus,
  Skill,
  VolunteerDashboard,
  VolunteerDetail,
  VolunteerSummary
} from './types'

export interface ApiMap {
  // Accounts
  'auth.me': { in: void; out: SessionUser | null }
  'auth.login': { in: LoginInput; out: SessionUser }
  'auth.signup': { in: SignupInput; out: SessionUser }
  'auth.logout': { in: void; out: null }
  'auth.createAdmin': { in: CreateAdminInput; out: SessionUser }

  // Activities
  'activities.list': { in: ActivityFilter; out: Activity[] }
  'activities.get': { in: number; out: Activity }
  'activities.create': { in: ActivityInput; out: Activity }
  'activities.update': { in: { id: number; data: ActivityInput }; out: Activity }
  'activities.cancel': { in: number; out: Activity }
  'activities.delete': { in: number; out: null }
  'activities.roster': { in: number; out: RosterEntry[] }

  // Sign-ups
  'signups.join': { in: number; out: { status: SignupStatus; position: number | null } }
  'signups.cancel': { in: number; out: null }
  'signups.mine': { in: void; out: Activity[] }

  // Hours
  'hours.log': { in: LogHoursInput; out: HourLog }
  'hours.mine': { in: void; out: HourLog[] }
  'hours.loggable': { in: void; out: { activityId: number; title: string; startAt: string; maxHours: number }[] }
  'hours.forReview': { in: 'pending' | 'approved' | 'rejected'; out: HourLog[] }
  'hours.review': { in: ReviewHoursInput; out: { updated: number } }

  // Profiles and directory
  'skills.list': { in: void; out: Skill[] }
  'profile.get': { in: void; out: Profile }
  'profile.update': { in: ProfileInput; out: Profile }
  'volunteers.search': { in: VolunteerSearch; out: VolunteerSummary[] }
  'volunteers.get': { in: number; out: VolunteerDetail }

  // Dashboards and reports
  'dashboard.volunteer': { in: void; out: VolunteerDashboard }
  'dashboard.impact': { in: void; out: ImpactStats }
  'reports.hours': { in: ReportFilter; out: HoursReport }
  'reports.exportCsv': { in: ReportFilter; out: { saved: boolean; path?: string } }
  'reports.savePdf': { in: { suggestedName: string }; out: { saved: boolean; path?: string } }
  'certificates.issue': { in: number | undefined; out: Certificate }
  'certificates.verify': { in: string; out: Certificate }

  // Notifications and audit
  'notifications.mine': { in: void; out: Notification[] }
  'notifications.markRead': { in: number[]; out: null }
  'notifications.outbox': { in: string; out: Notification[] }
  'audit.list': { in: void; out: AuditEntry[] }

  // Demo
  'demo.reset': { in: void; out: null }
}

export type ApiName = keyof ApiMap
