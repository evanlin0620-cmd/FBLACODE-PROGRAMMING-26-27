/**
 * Hour logging and approvals.
 *
 * Format checks (more than 0, at most 24, quarter hours) are in logHoursSchema.
 * Meaning checks happen here: the volunteer must have been confirmed for the
 * shift, the shift must be over, they can't log more hours than the shift lasted,
 * and they can't log the same shift twice.
 */
import { all, one, run, tx, type Db } from '../db'
import { AppError } from '@shared/errors'
import { logHoursSchema, reviewHoursSchema } from '@shared/schemas'
import type { ActivityType, HourLog, HourStatus } from '@shared/types'
import { hoursBetween } from '@shared/time'
import { type Ctx, parse, requireAdmin, requireVolunteer } from './context'
import { audit, notify } from './log'

interface HourRow {
  id: number
  user_id: number
  full_name: string
  activity_id: number
  title: string
  type: ActivityType
  start_at: string
  hours: number
  note: string
  status: HourStatus
  review_note: string
  reviewed_at: string | null
}

const HOUR_SELECT = `
  SELECT h.id, h.user_id, u.full_name, h.activity_id, a.title, a.type, a.start_at, h.hours, h.note,
         h.status, h.review_note, h.reviewed_at
  FROM hour_logs h JOIN users u ON u.id = h.user_id JOIN activities a ON a.id = h.activity_id`

const toHourLog = (r: HourRow): HourLog => ({
  id: r.id,
  userId: r.user_id,
  volunteerName: r.full_name,
  activityId: r.activity_id,
  activityTitle: r.title,
  activityType: r.type,
  date: r.start_at.slice(0, 10),
  hours: r.hours,
  note: r.note,
  status: r.status,
  reviewNote: r.review_note,
  reviewedAt: r.reviewed_at
})

export function hourLogsFor(db: Db, userId: number): HourLog[] {
  return all<HourRow>(db, `${HOUR_SELECT} WHERE h.user_id = ? ORDER BY a.start_at DESC`, userId).map(toHourLog)
}

export function logHours(ctx: Ctx, input: unknown): HourLog {
  const user = requireVolunteer(ctx)
  const data = parse(logHoursSchema, input)

  const a = one<{ title: string; start_at: string; end_at: string; status: string }>(
    ctx.db,
    'SELECT title, start_at, end_at, status FROM activities WHERE id = ?',
    data.activityId
  )
  if (!a) throw new AppError('NOT_FOUND', 'That activity no longer exists.')
  const signup = one(ctx.db, "SELECT 1 FROM signups WHERE activity_id = ? AND user_id = ? AND status = 'confirmed'", data.activityId, user.id)
  if (!signup) {
    throw new AppError('VALIDATION', 'You can only log hours for shifts you were confirmed for.', { activityId: 'Pick one of your confirmed shifts' })
  }
  if (a.status !== 'open') throw new AppError('CONFLICT', 'This activity was cancelled, so hours can’t be logged for it.')
  if (a.end_at > ctx.now()) {
    throw new AppError('VALIDATION', 'You can log hours after the shift ends.', { activityId: 'This shift hasn’t finished yet' })
  }
  const shiftLength = hoursBetween(a.start_at, a.end_at)
  if (data.hours > shiftLength) {
    throw new AppError('VALIDATION', 'That’s more hours than the shift lasted.', {
      hours: `This shift was ${shiftLength} hours long, so you can log at most ${shiftLength}.`
    })
  }
  const existing = one<{ status: HourStatus }>(
    ctx.db,
    "SELECT status FROM hour_logs WHERE activity_id = ? AND user_id = ? AND status IN ('pending', 'approved')",
    data.activityId,
    user.id
  )
  if (existing) {
    throw new AppError(
      'CONFLICT',
      existing.status === 'approved' ? 'Hours for this shift are already approved.' : 'You already logged hours for this shift. They’re waiting for approval.'
    )
  }

  const id = run(
    ctx.db,
    'INSERT INTO hour_logs (user_id, activity_id, hours, note, created_at) VALUES (?, ?, ?, ?, ?)',
    user.id,
    data.activityId,
    data.hours,
    data.note,
    ctx.now()
  )
  return toHourLog(one<HourRow>(ctx.db, `${HOUR_SELECT} WHERE h.id = ?`, id)!)
}

export function myHours(ctx: Ctx): HourLog[] {
  const user = requireVolunteer(ctx)
  return hourLogsFor(ctx.db, user.id)
}

/** Confirmed shifts that have ended and don't have hours logged yet. Used to fill the Log Hours picker. */
export function loggableShifts(ctx: Ctx): { activityId: number; title: string; startAt: string; maxHours: number }[] {
  const user = requireVolunteer(ctx)
  return all<{ id: number; title: string; start_at: string; end_at: string }>(
    ctx.db,
    `SELECT a.id, a.title, a.start_at, a.end_at FROM signups s JOIN activities a ON a.id = s.activity_id
     WHERE s.user_id = ? AND s.status = 'confirmed' AND a.status = 'open' AND a.end_at <= ?
       AND NOT EXISTS (SELECT 1 FROM hour_logs h WHERE h.activity_id = a.id AND h.user_id = s.user_id AND h.status IN ('pending', 'approved'))
     ORDER BY a.start_at DESC`,
    user.id,
    ctx.now()
  ).map((r) => ({ activityId: r.id, title: r.title, startAt: r.start_at, maxHours: hoursBetween(r.start_at, r.end_at) }))
}

export function hoursForReview(ctx: Ctx, status: unknown = 'pending'): HourLog[] {
  requireAdmin(ctx)
  const s = status === 'approved' || status === 'rejected' ? status : 'pending'
  return all<HourRow>(ctx.db, `${HOUR_SELECT} WHERE h.status = ? ORDER BY h.created_at, h.id`, s).map(toHourLog)
}

/** Approves or rejects one or more pending entries. Each volunteer is notified. */
export function reviewHours(ctx: Ctx, input: unknown): { updated: number } {
  const admin = requireAdmin(ctx)
  const r = parse(reviewHoursSchema, input)
  let updated = 0
  tx(ctx.db, () => {
    for (const id of r.ids) {
      const row = one<HourRow>(ctx.db, `${HOUR_SELECT} WHERE h.id = ?`, id)
      if (!row || row.status !== 'pending') continue // already reviewed by someone else; skip it
      run(
        ctx.db,
        'UPDATE hour_logs SET status = ?, review_note = ?, reviewed_by = ?, reviewed_at = ? WHERE id = ?',
        r.decision,
        r.note,
        admin.id,
        ctx.now(),
        id
      )
      updated++
      notify(
        ctx.db,
        ctx.now(),
        row.user_id,
        r.decision === 'approved' ? 'hours_approved' : 'hours_rejected',
        r.decision === 'approved' ? `Hours approved: ${row.title}` : `Hours need changes: ${row.title}`,
        r.decision === 'approved'
          ? `Hi ${row.full_name},\n\nYour ${row.hours} hours for "${row.title}" were approved. Thank you!`
          : `Hi ${row.full_name},\n\nYour ${row.hours} hours for "${row.title}" weren’t approved.\nReason: ${r.note}\n\nYou can log them again with the right details.`
      )
      audit(ctx.db, ctx.now(), admin.id, r.decision === 'approved' ? 'approve_hours' : 'reject_hours', 'hour_log', id, `${row.full_name}: ${row.hours}h, ${row.title}`)
    }
  })
  return { updated }
}

/** Total approved hours for one volunteer. Only approved hours ever count. */
export function approvedTotal(db: Db, userId: number): number {
  return one<{ t: number }>(db, "SELECT COALESCE(SUM(hours), 0) AS t FROM hour_logs WHERE user_id = ? AND status = 'approved'", userId)!.t
}
