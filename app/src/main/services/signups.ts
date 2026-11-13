/**
 * Shift sign-ups and the waitlist.
 *
 * Rules:
 * 1. A sign-up runs in one transaction. If the activity is full, the volunteer
 *    joins the waitlist instead.
 * 2. A volunteer can't hold two shifts (confirmed or waitlisted) whose times overlap.
 * 3. When a confirmed volunteer cancels, the first person on the waitlist moves up
 *    and gets a notification.
 */
import { all, one, run, tx, type Db } from '../db'
import { AppError } from '@shared/errors'
import { idSchema } from '@shared/schemas'
import { prettyStamp } from '@shared/time'
import type { Activity, SignupStatus } from '@shared/types'
import { type Ctx, parse, requireVolunteer } from './context'
import { notify } from './log'
import { loadActivities } from './activities'

interface ActivityTimes {
  id: number
  title: string
  start_at: string
  end_at: string
  capacity: number
  status: string
}

export function signUp(ctx: Ctx, id: unknown): { status: SignupStatus; position: number | null } {
  const user = requireVolunteer(ctx)
  const activityId = parse(idSchema, id)

  return tx(ctx.db, () => {
    const a = one<ActivityTimes>(ctx.db, 'SELECT * FROM activities WHERE id = ?', activityId)
    if (!a || a.status !== 'open') throw new AppError('NOT_FOUND', 'That activity is no longer available.')
    if (a.start_at <= ctx.now()) throw new AppError('CONFLICT', 'This shift has already started, so sign-ups are closed.')

    const existing = one<{ id: number; status: SignupStatus }>(
      ctx.db,
      'SELECT id, status FROM signups WHERE activity_id = ? AND user_id = ?',
      activityId,
      user.id
    )
    if (existing && existing.status !== 'cancelled') {
      throw new AppError('CONFLICT', existing.status === 'confirmed' ? 'You’re already signed up for this shift.' : 'You’re already on the waitlist for this shift.')
    }

    // No double-booking: look for any other shift of theirs that overlaps this one.
    const clash = one<{ title: string; start_at: string }>(
      ctx.db,
      `SELECT a.title, a.start_at FROM signups s JOIN activities a ON a.id = s.activity_id
       WHERE s.user_id = ? AND s.status IN ('confirmed', 'waitlisted') AND a.status = 'open' AND a.id <> ?
         AND a.start_at < ? AND ? < a.end_at`,
      user.id,
      activityId,
      a.end_at,
      a.start_at
    )
    if (clash) {
      throw new AppError('CONFLICT', `This overlaps with "${clash.title}" (${prettyStamp(clash.start_at)}). Cancel that one first if you want this shift.`)
    }

    const confirmed = one<{ n: number }>(
      ctx.db,
      "SELECT COUNT(*) AS n FROM signups WHERE activity_id = ? AND status = 'confirmed'",
      activityId
    )!.n
    const status: SignupStatus = confirmed < a.capacity ? 'confirmed' : 'waitlisted'

    if (existing) {
      // Re-joining after cancelling goes to the back of the line.
      run(ctx.db, 'UPDATE signups SET status = ?, queued_at = ? WHERE id = ?', status, ctx.now(), existing.id)
    } else {
      run(ctx.db, 'INSERT INTO signups (activity_id, user_id, status, queued_at) VALUES (?, ?, ?, ?)', activityId, user.id, status, ctx.now())
    }

    const position = status === 'waitlisted' ? waitlistPosition(ctx.db, activityId, user.id) : null
    notify(
      ctx.db,
      ctx.now(),
      user.id,
      status === 'confirmed' ? 'signup_confirmed' : 'signup_waitlisted',
      status === 'confirmed' ? `You’re signed up: ${a.title}` : `You’re on the waitlist: ${a.title}`,
      status === 'confirmed'
        ? `Hi ${user.fullName},\n\nYou’re confirmed for "${a.title}" on ${prettyStamp(a.start_at)}. Thank you for helping out!`
        : `Hi ${user.fullName},\n\n"${a.title}" is full right now. You’re #${position} on the waitlist, and we’ll email you if a spot opens.`
    )
    return { status, position }
  })
}

export function cancelSignup(ctx: Ctx, id: unknown): void {
  const user = requireVolunteer(ctx)
  const activityId = parse(idSchema, id)
  tx(ctx.db, () => {
    const s = one<{ id: number; status: SignupStatus }>(
      ctx.db,
      "SELECT id, status FROM signups WHERE activity_id = ? AND user_id = ? AND status <> 'cancelled'",
      activityId,
      user.id
    )
    if (!s) throw new AppError('NOT_FOUND', 'You aren’t signed up for this shift.')
    const a = one<ActivityTimes>(ctx.db, 'SELECT * FROM activities WHERE id = ?', activityId)!
    if (a.start_at <= ctx.now()) throw new AppError('CONFLICT', 'This shift has already started, so it can’t be cancelled here.')

    run(ctx.db, "UPDATE signups SET status = 'cancelled' WHERE id = ?", s.id)
    notify(ctx.db, ctx.now(), user.id, 'signup_cancelled', `Cancelled: ${a.title}`, `You’ve been removed from "${a.title}" on ${prettyStamp(a.start_at)}.`)
    if (s.status === 'confirmed') promoteFromWaitlist(ctx.db, ctx.now(), activityId)
  })
}

/** Fills open spots from the front of the waitlist. Call inside a transaction. */
export function promoteFromWaitlist(db: Db, now: string, activityId: number): void {
  const a = one<ActivityTimes>(db, 'SELECT * FROM activities WHERE id = ?', activityId)
  if (!a || a.status !== 'open') return
  const confirmed = one<{ n: number }>(db, "SELECT COUNT(*) AS n FROM signups WHERE activity_id = ? AND status = 'confirmed'", activityId)!.n
  const openSpots = a.capacity - confirmed
  if (openSpots <= 0) return

  const next = all<{ id: number; user_id: number; full_name: string }>(
    db,
    `SELECT s.id, s.user_id, u.full_name FROM signups s JOIN users u ON u.id = s.user_id
     WHERE s.activity_id = ? AND s.status = 'waitlisted' ORDER BY s.queued_at, s.id LIMIT ?`,
    activityId,
    openSpots
  )
  for (const p of next) {
    run(db, "UPDATE signups SET status = 'confirmed' WHERE id = ?", p.id)
    notify(
      db,
      now,
      p.user_id,
      'waitlist_promoted',
      `A spot opened up: ${a.title}`,
      `Good news, ${p.full_name}! A spot opened for "${a.title}" on ${prettyStamp(a.start_at)}, and you’re now confirmed.`
    )
  }
}

function waitlistPosition(db: Db, activityId: number, userId: number): number {
  const rows = all<{ user_id: number }>(
    db,
    "SELECT user_id FROM signups WHERE activity_id = ? AND status = 'waitlisted' ORDER BY queued_at, id",
    activityId
  )
  return rows.findIndex((r) => r.user_id === userId) + 1
}

/** The volunteer's upcoming confirmed and waitlisted shifts. */
export function mySignups(ctx: Ctx): Activity[] {
  const user = requireVolunteer(ctx)
  return loadActivities(
    ctx.db,
    user.id,
    "a.status = 'open' AND a.end_at >= ? AND EXISTS (SELECT 1 FROM signups s WHERE s.activity_id = a.id AND s.user_id = ? AND s.status IN ('confirmed', 'waitlisted'))",
    [ctx.now(), user.id]
  )
}
