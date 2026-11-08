/**
 * Activities (service events/shifts): browsing and searching for everyone,
 * plus create / edit / cancel / delete for admins.
 */
import { all, one, run, tx, type Db } from '../db'
import { AppError } from '@shared/errors'
import { activityFilterSchema, activitySchema, idSchema } from '@shared/schemas'
import { prettyStamp } from '@shared/time'
import type { Activity, ActivityType, RosterEntry, Skill } from '@shared/types'
import { type Ctx, parse, requireAdmin, requireUser } from './context'
import { audit, notify } from './log'
import { promoteFromWaitlist } from './signups'

interface ActivityRow {
  id: number
  title: string
  type: ActivityType
  description: string
  location: string
  start_at: string
  end_at: string
  capacity: number
  status: 'open' | 'cancelled'
  confirmed: number
  waitlisted: number
  my_status: 'confirmed' | 'waitlisted' | 'cancelled' | null
  my_position: number | null
}

/**
 * Loads activities with their sign-up counts and the viewer's own status.
 * `where` is a SQL fragment using a.* columns; params fill its ? marks.
 */
export function loadActivities(
  db: Db,
  viewerId: number,
  where = '1 = 1',
  params: (string | number)[] = [],
  order = 'a.start_at ASC'
): Activity[] {
  const rows = all<ActivityRow>(
    db,
    `SELECT a.*,
       (SELECT COUNT(*) FROM signups s WHERE s.activity_id = a.id AND s.status = 'confirmed') AS confirmed,
       (SELECT COUNT(*) FROM signups s WHERE s.activity_id = a.id AND s.status = 'waitlisted') AS waitlisted,
       (SELECT s.status FROM signups s WHERE s.activity_id = a.id AND s.user_id = ?) AS my_status,
       (SELECT COUNT(*) FROM signups w JOIN signups me ON me.activity_id = w.activity_id
          WHERE me.activity_id = a.id AND me.user_id = ? AND me.status = 'waitlisted' AND w.status = 'waitlisted'
            AND (w.queued_at < me.queued_at OR (w.queued_at = me.queued_at AND w.id <= me.id))) AS my_position
     FROM activities a
     WHERE ${where}
     ORDER BY ${order}`,
    viewerId,
    viewerId,
    ...params
  )
  if (rows.length === 0) return []

  // Fetch every activity's required skills in one query instead of one per activity.
  const skillRows = all<{ activity_id: number; id: number; name: string }>(
    db,
    `SELECT a.activity_id, s.id, s.name FROM activity_skills a JOIN skills s ON s.id = a.skill_id
     WHERE a.activity_id IN (${rows.map(() => '?').join(',')}) ORDER BY s.name`,
    ...rows.map((r) => r.id)
  )
  const skillsByActivity = new Map<number, Skill[]>()
  for (const s of skillRows) {
    const list = skillsByActivity.get(s.activity_id) ?? []
    list.push({ id: s.id, name: s.name })
    skillsByActivity.set(s.activity_id, list)
  }

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    type: r.type,
    description: r.description,
    location: r.location,
    startAt: r.start_at,
    endAt: r.end_at,
    capacity: r.capacity,
    status: r.status,
    skills: skillsByActivity.get(r.id) ?? [],
    confirmed: r.confirmed,
    waitlisted: r.waitlisted,
    mySignup: r.my_status === 'cancelled' ? null : r.my_status,
    myWaitlistPosition: r.my_status === 'waitlisted' ? r.my_position : null
  }))
}

/** Search and filter the catalog. Volunteers only ever see open activities. */
export function listActivities(ctx: Ctx, filter: unknown = {}): Activity[] {
  const user = requireUser(ctx)
  const f = parse(activityFilterSchema, filter)
  const where: string[] = []
  const params: (string | number)[] = []

  if (user.role === 'volunteer') where.push("a.status = 'open'")
  if (!f.includePast) {
    where.push('a.end_at >= ?')
    params.push(ctx.now())
  }
  if (f.q) {
    where.push('(a.title LIKE ? OR a.description LIKE ? OR a.location LIKE ?)')
    const like = `%${f.q}%`
    params.push(like, like, like)
  }
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
  if (f.skillId) {
    where.push('EXISTS (SELECT 1 FROM activity_skills x WHERE x.activity_id = a.id AND x.skill_id = ?)')
    params.push(f.skillId)
  }
  return loadActivities(ctx.db, user.id, where.join(' AND ') || '1 = 1', params)
}

export function getActivity(ctx: Ctx, id: unknown): Activity {
  const user = requireUser(ctx)
  const activityId = parse(idSchema, id)
  const [activity] = loadActivities(ctx.db, user.id, 'a.id = ?', [activityId])
  if (!activity || (user.role === 'volunteer' && activity.status !== 'open')) {
    throw new AppError('NOT_FOUND', 'That activity no longer exists.')
  }
  return activity
}

function checkSkillsExist(db: Db, skillIds: number[]): void {
  for (const id of skillIds) {
    if (!one(db, 'SELECT 1 FROM skills WHERE id = ?', id)) {
      throw new AppError('VALIDATION', 'One of the selected skills no longer exists.', { skillIds: 'Pick skills from the list' })
    }
  }
}

function setActivitySkills(db: Db, activityId: number, skillIds: number[]): void {
  run(db, 'DELETE FROM activity_skills WHERE activity_id = ?', activityId)
  for (const id of new Set(skillIds)) run(db, 'INSERT INTO activity_skills (activity_id, skill_id) VALUES (?, ?)', activityId, id)
}

export function createActivity(ctx: Ctx, input: unknown): Activity {
  const admin = requireAdmin(ctx)
  const a = parse(activitySchema, input)
  if (a.startAt <= ctx.now()) {
    throw new AppError('VALIDATION', 'New activities must start in the future.', { startAt: 'Pick a time in the future' })
  }
  checkSkillsExist(ctx.db, a.skillIds)
  const id = tx(ctx.db, () => {
    const newId = run(
      ctx.db,
      `INSERT INTO activities (title, type, description, location, start_at, end_at, capacity, created_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      a.title,
      a.type,
      a.description,
      a.location,
      a.startAt,
      a.endAt,
      a.capacity,
      admin.id,
      ctx.now()
    )
    setActivitySkills(ctx.db, newId, a.skillIds)
    audit(ctx.db, ctx.now(), admin.id, 'create', 'activity', newId, a.title)
    return newId
  })
  return getActivity(ctx, id)
}

export function updateActivity(ctx: Ctx, id: unknown, input: unknown): Activity {
  const admin = requireAdmin(ctx)
  const activityId = parse(idSchema, id)
  const a = parse(activitySchema, input)
  const before = getActivity(ctx, activityId)
  if (before.endAt < ctx.now()) {
    throw new AppError('CONFLICT', 'This activity already happened, so it can’t be edited.')
  }
  // Meaning check: you can't shrink a shift below the people already confirmed.
  if (a.capacity < before.confirmed) {
    throw new AppError('VALIDATION', 'Capacity is lower than the number of confirmed volunteers.', {
      capacity: `${before.confirmed} volunteers are already confirmed. Set capacity to at least ${before.confirmed}.`
    })
  }
  checkSkillsExist(ctx.db, a.skillIds)

  tx(ctx.db, () => {
    run(
      ctx.db,
      `UPDATE activities SET title = ?, type = ?, description = ?, location = ?, start_at = ?, end_at = ?, capacity = ?
       WHERE id = ?`,
      a.title,
      a.type,
      a.description,
      a.location,
      a.startAt,
      a.endAt,
      a.capacity,
      activityId
    )
    setActivitySkills(ctx.db, activityId, a.skillIds)

    const timeChanged = before.startAt !== a.startAt || before.endAt !== a.endAt || before.location !== a.location
    if (timeChanged) {
      for (const p of activeSignups(ctx.db, activityId)) {
        notify(
          ctx.db,
          ctx.now(),
          p.user_id,
          'activity_changed',
          `Update: ${a.title}`,
          `The time or place for "${a.title}" changed.\n\nNew time: ${prettyStamp(a.startAt)} to ${prettyStamp(a.endAt).split(' at ')[1]}\nLocation: ${a.location}`
        )
      }
    }
    // More room? Move people up from the waitlist.
    if (a.capacity > before.capacity) promoteFromWaitlist(ctx.db, ctx.now(), activityId)
    audit(ctx.db, ctx.now(), admin.id, 'update', 'activity', activityId, a.title)
  })
  return getActivity(ctx, activityId)
}

function activeSignups(db: Db, activityId: number): { user_id: number }[] {
  return all(db, "SELECT user_id FROM signups WHERE activity_id = ? AND status IN ('confirmed', 'waitlisted')", activityId)
}

/** Cancels an activity but keeps its history (sign-ups, logged hours). Everyone signed up is told. */
export function cancelActivity(ctx: Ctx, id: unknown): Activity {
  const admin = requireAdmin(ctx)
  const activity = getActivity(ctx, id)
  if (activity.status === 'cancelled') return activity
  tx(ctx.db, () => {
    run(ctx.db, "UPDATE activities SET status = 'cancelled' WHERE id = ?", activity.id)
    for (const p of activeSignups(ctx.db, activity.id)) {
      notify(
        ctx.db,
        ctx.now(),
        p.user_id,
        'activity_cancelled',
        `Cancelled: ${activity.title}`,
        `Sorry, "${activity.title}" on ${prettyStamp(activity.startAt)} has been cancelled. You don’t need to do anything.`
      )
    }
    audit(ctx.db, ctx.now(), admin.id, 'cancel', 'activity', activity.id, activity.title)
  })
  return getActivity(ctx, activity.id)
}

/** Deletes an activity for good. Refused once hours are logged, so service records are never lost. */
export function deleteActivity(ctx: Ctx, id: unknown): void {
  const admin = requireAdmin(ctx)
  const activity = getActivity(ctx, id)
  if (one(ctx.db, 'SELECT 1 FROM hour_logs WHERE activity_id = ?', activity.id)) {
    throw new AppError('CONFLICT', 'Volunteers have logged hours for this activity, so it can’t be deleted. Cancel it instead.')
  }
  tx(ctx.db, () => {
    for (const p of activeSignups(ctx.db, activity.id)) {
      notify(
        ctx.db,
        ctx.now(),
        p.user_id,
        'activity_cancelled',
        `Cancelled: ${activity.title}`,
        `Sorry, "${activity.title}" on ${prettyStamp(activity.startAt)} has been removed from the schedule.`
      )
    }
    run(ctx.db, 'DELETE FROM activities WHERE id = ?', activity.id)
    audit(ctx.db, ctx.now(), admin.id, 'delete', 'activity', activity.id, activity.title)
  })
}

/** Who is confirmed and who is waiting, in waitlist order. */
export function roster(ctx: Ctx, id: unknown): RosterEntry[] {
  requireAdmin(ctx)
  const activityId = parse(idSchema, id)
  const rows = all<{ user_id: number; full_name: string; email: string; status: 'confirmed' | 'waitlisted' }>(
    ctx.db,
    `SELECT s.user_id, u.full_name, u.email, s.status FROM signups s JOIN users u ON u.id = s.user_id
     WHERE s.activity_id = ? AND s.status IN ('confirmed', 'waitlisted')
     ORDER BY s.status = 'waitlisted', s.queued_at, s.id`,
    activityId
  )
  let position = 0
  return rows.map((r) => ({
    userId: r.user_id,
    fullName: r.full_name,
    email: r.email,
    status: r.status,
    position: r.status === 'waitlisted' ? ++position : null
  }))
}
