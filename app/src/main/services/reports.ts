/**
 * Dashboards, the customizable hours report, and service certificates.
 * Every total here counts approved hours only.
 */
import { randomBytes } from 'node:crypto'
import { all, one, run } from '../db'
import { AppError } from '@shared/errors'
import { certificateCodeSchema, idSchema, reportFilterSchema } from '@shared/schemas'
import { ORGANIZATION, type ActivityType, type Certificate, type HoursReport, type ImpactStats, type ReportRow, type VolunteerDashboard } from '@shared/types'
import { type Ctx, parse, requireAdmin, requireUser, requireVolunteer } from './context'
import { audit } from './log'
import { loadActivities } from './activities'
import { approvedTotal } from './hours'
import { loadProfile } from './profiles'
import { recommend } from './recommendations'

export function volunteerDashboard(ctx: Ctx): VolunteerDashboard {
  const user = requireVolunteer(ctx)
  const now = ctx.now()
  const profile = loadProfile(ctx.db, user.id)
  const upcomingOpen = loadActivities(ctx.db, user.id, "a.status = 'open' AND a.start_at > ?", [now])
  return {
    upcoming: upcomingOpen.filter((a) => a.mySignup !== null),
    approvedHours: approvedTotal(ctx.db, user.id),
    pendingHours: one<{ t: number }>(ctx.db, "SELECT COALESCE(SUM(hours), 0) AS t FROM hour_logs WHERE user_id = ? AND status = 'pending'", user.id)!.t,
    hourGoal: profile.hourGoal,
    unread: one<{ n: number }>(ctx.db, 'SELECT COUNT(*) AS n FROM notifications WHERE user_id = ? AND read_at IS NULL', user.id)!.n,
    recommendations: recommend(upcomingOpen, profile, 3)
  }
}

/** Groups rows into totals with one pass and a Map. */
function totalsBy<T>(items: T[], key: (t: T) => string, value: (t: T) => number): { key: string; total: number }[] {
  const map = new Map<string, number>()
  for (const item of items) map.set(key(item), (map.get(key(item)) ?? 0) + value(item))
  return [...map].map(([k, total]) => ({ key: k, total: Math.round(total * 100) / 100 }))
}

export function impactStats(ctx: Ctx): ImpactStats {
  requireAdmin(ctx)
  const now = ctx.now()
  const approved = all<{ title: string; type: string; start_at: string; hours: number }>(
    ctx.db,
    `SELECT a.title, a.type, a.start_at, h.hours FROM hour_logs h JOIN activities a ON a.id = h.activity_id WHERE h.status = 'approved'`
  )

  // Last 6 months, including months with zero hours, so the chart has no gaps.
  const months: string[] = []
  const d = new Date(now.slice(0, 7) + '-01T00:00')
  for (let i = 5; i >= 0; i--) {
    const m = new Date(d.getFullYear(), d.getMonth() - i, 1)
    months.push(`${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`)
  }
  const byMonth = new Map(totalsBy(approved, (r) => r.start_at.slice(0, 7), (r) => r.hours).map((t) => [t.key, t.total]))

  // Skill gaps: upcoming activities needing a skill that none of their confirmed volunteers has.
  const upcoming = loadActivities(ctx.db, 0, "a.status = 'open' AND a.start_at > ?", [now])
  const skillGaps = upcoming
    .map((a) => {
      const covered = new Set(
        all<{ skill_id: number }>(
          ctx.db,
          `SELECT DISTINCT v.skill_id FROM signups s JOIN volunteer_skills v ON v.user_id = s.user_id
           WHERE s.activity_id = ? AND s.status = 'confirmed'`,
          a.id
        ).map((r) => r.skill_id)
      )
      return { activityId: a.id, activityTitle: a.title, startAt: a.startAt, missingSkills: a.skills.filter((s) => !covered.has(s.id)).map((s) => s.name) }
    })
    .filter((g) => g.missingSkills.length > 0)

  return {
    totalApprovedHours: approved.reduce((sum, r) => sum + r.hours, 0),
    volunteerCount: one<{ n: number }>(ctx.db, "SELECT COUNT(*) AS n FROM users WHERE role = 'volunteer'")!.n,
    upcomingActivities: upcoming.length,
    pendingApprovals: one<{ n: number }>(ctx.db, "SELECT COUNT(*) AS n FROM hour_logs WHERE status = 'pending'")!.n,
    hoursByMonth: months.map((month) => ({ month, hours: byMonth.get(month) ?? 0 })),
    topActivities: totalsBy(approved, (r) => r.title, (r) => r.hours)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map((t) => ({ title: t.key, hours: t.total })),
    hoursByType: totalsBy(approved, (r) => r.type, (r) => r.hours)
      .sort((a, b) => b.total - a.total)
      .map((t) => ({ type: t.key, hours: t.total })),
    skillGaps
  }
}

/** The customizable report: filter by date range, activity type, and/or one volunteer. */
export function hoursReport(ctx: Ctx, input: unknown = {}): HoursReport {
  requireAdmin(ctx)
  const f = parse(reportFilterSchema, input)
  const where = ["h.status = 'approved'"]
  const params: (string | number)[] = []
  if (f.from) {
    where.push('substr(a.start_at, 1, 10) >= ?')
    params.push(f.from)
  }
  if (f.to) {
    where.push('substr(a.start_at, 1, 10) <= ?')
    params.push(f.to)
  }
  if (f.type) {
    where.push('a.type = ?')
    params.push(f.type)
  }
  if (f.volunteerId) {
    where.push('h.user_id = ?')
    params.push(f.volunteerId)
  }
  const rows = all<{ full_name: string; email: string; title: string; type: ActivityType; start_at: string; hours: number }>(
    ctx.db,
    `SELECT u.full_name, u.email, a.title, a.type, a.start_at, h.hours
     FROM hour_logs h JOIN users u ON u.id = h.user_id JOIN activities a ON a.id = h.activity_id
     WHERE ${where.join(' AND ')} ORDER BY a.start_at DESC, u.full_name`,
    ...params
  ).map<ReportRow>((r) => ({
    volunteerName: r.full_name,
    volunteerEmail: r.email,
    activityTitle: r.title,
    activityType: r.type,
    date: r.start_at.slice(0, 10),
    hours: r.hours
  }))

  return {
    filter: f,
    rows,
    totalHours: rows.reduce((s, r) => s + r.hours, 0),
    volunteerCount: new Set(rows.map((r) => r.volunteerEmail)).size,
    byMonth: totalsBy(rows, (r) => r.date.slice(0, 7), (r) => r.hours)
      .sort((a, b) => a.key.localeCompare(b.key))
      .map((t) => ({ month: t.key, hours: t.total })),
    byType: totalsBy(rows, (r) => r.activityType, (r) => r.hours)
      .sort((a, b) => b.total - a.total)
      .map((t) => ({ type: t.key, hours: t.total })),
    byVolunteer: totalsBy(rows, (r) => r.volunteerName, (r) => r.hours)
      .sort((a, b) => b.total - a.total)
      .map((t) => ({ name: t.key, hours: t.total }))
  }
}

/** Turns report rows into CSV text. Quotes every field so commas in titles don't break columns. */
export function reportToCsv(report: HoursReport): string {
  // A leading ' stops Excel from running a volunteer-typed name like =HYPERLINK(...) as a formula.
  const esc = (v: string | number): string => `"${String(v).replace(/^[=+\-@\t\r]/, "'$&").replace(/"/g, '""')}"`
  const lines = [['Volunteer', 'Email', 'Activity', 'Type', 'Date', 'Hours'].map(esc).join(',')]
  for (const r of report.rows) lines.push([r.volunteerName, r.volunteerEmail, r.activityTitle, r.activityType, r.date, r.hours].map(esc).join(','))
  lines.push(['Total', '', '', '', '', report.totalHours].map(esc).join(','))
  return lines.join('\r\n')
}

function newCode(): string {
  // No 0/O or 1/I, so codes are easy to read aloud.
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = randomBytes(8)
  const chars = [...bytes].map((b) => alphabet[b % alphabet.length])
  return `${chars.slice(0, 4).join('')}-${chars.slice(4).join('')}`
}

function buildCertificate(ctx: Ctx, code: string, userId: number, issuedAt: string): Certificate {
  const name = one<{ full_name: string }>(ctx.db, 'SELECT full_name FROM users WHERE id = ?', userId)!.full_name
  const activities = all<{ title: string; start_at: string; hours: number }>(
    ctx.db,
    `SELECT a.title, a.start_at, h.hours FROM hour_logs h JOIN activities a ON a.id = h.activity_id
     WHERE h.user_id = ? AND h.status = 'approved' AND h.reviewed_at <= ? ORDER BY a.start_at`,
    userId,
    issuedAt
  ).map((r) => ({ title: r.title, date: r.start_at.slice(0, 10), hours: r.hours }))
  return {
    code,
    volunteerName: name,
    totalHours: activities.reduce((s, a) => s + a.hours, 0),
    issuedAt,
    activities,
    organization: ORGANIZATION
  }
}

/** Volunteers can issue their own certificate; admins can issue one for any volunteer. */
export function issueCertificate(ctx: Ctx, volunteerId?: unknown): Certificate {
  const user = requireUser(ctx)
  const userId = user.role === 'admin' ? parse(idSchema, volunteerId) : user.id
  if (!one(ctx.db, "SELECT 1 FROM users WHERE id = ? AND role = 'volunteer'", userId)) {
    throw new AppError('NOT_FOUND', 'That volunteer doesn’t exist.')
  }
  const total = approvedTotal(ctx.db, userId)
  if (total <= 0) throw new AppError('CONFLICT', 'A certificate needs at least one approved shift. Log your hours and wait for approval first.')

  const code = newCode()
  const issuedAt = ctx.now()
  run(ctx.db, 'INSERT INTO certificates (code, user_id, total_hours, issued_at, issued_by) VALUES (?, ?, ?, ?, ?)', code, userId, total, issuedAt, user.id)
  audit(ctx.db, issuedAt, user.id, 'issue_certificate', 'user', userId, code)
  return buildCertificate(ctx, code, userId, issuedAt)
}

/** Lets an admin confirm a certificate someone shows them is real. */
export function verifyCertificate(ctx: Ctx, input: unknown): Certificate {
  requireAdmin(ctx)
  const code = parse(certificateCodeSchema, input)
  const row = one<{ user_id: number; issued_at: string }>(ctx.db, 'SELECT user_id, issued_at FROM certificates WHERE code = ?', code)
  if (!row) throw new AppError('NOT_FOUND', 'No certificate has that code. Check for typos.')
  return buildCertificate(ctx, code, row.user_id, row.issued_at)
}
