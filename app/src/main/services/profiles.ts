/**
 * Volunteer profiles (skills, availability, interests) and the admin's
 * volunteer directory.
 */
import { all, one, run, tx, type Db } from '../db'
import { AppError } from '@shared/errors'
import { idSchema, profileSchema, volunteerSearchSchema } from '@shared/schemas'
import type { ActivityType, Profile, Skill, VolunteerDetail, VolunteerSummary } from '@shared/types'
import { type Ctx, parse, requireAdmin, requireUser, requireVolunteer } from './context'
import { loadActivities } from './activities'
import { approvedTotal, hourLogsFor } from './hours'

export function listSkills(ctx: Ctx): Skill[] {
  requireUser(ctx)
  return all<Skill>(ctx.db, 'SELECT id, name FROM skills ORDER BY name')
}

export function loadProfile(db: Db, userId: number): Profile {
  const row = one<{ id: number; email: string; full_name: string; phone: string; bio: string; interests: string; hour_goal: number }>(
    db,
    `SELECT u.id, u.email, u.full_name, p.phone, p.bio, p.interests, p.hour_goal
     FROM users u JOIN volunteer_profiles p ON p.user_id = u.id WHERE u.id = ?`,
    userId
  )
  if (!row) throw new AppError('NOT_FOUND', 'That volunteer doesn’t exist.')
  return {
    userId: row.id,
    email: row.email,
    fullName: row.full_name,
    phone: row.phone,
    bio: row.bio,
    interests: JSON.parse(row.interests) as ActivityType[],
    skills: all<Skill>(
      db,
      'SELECT s.id, s.name FROM volunteer_skills v JOIN skills s ON s.id = v.skill_id WHERE v.user_id = ? ORDER BY s.name',
      userId
    ),
    availability: all<{ weekday: number; start: string; end: string }>(
      db,
      'SELECT weekday, start_time AS start, end_time AS "end" FROM availability WHERE user_id = ? ORDER BY weekday, start_time',
      userId
    ),
    hourGoal: row.hour_goal
  }
}

export function getMyProfile(ctx: Ctx): Profile {
  return loadProfile(ctx.db, requireVolunteer(ctx).id)
}

export function updateMyProfile(ctx: Ctx, input: unknown): Profile {
  const user = requireVolunteer(ctx)
  const p = parse(profileSchema, input)
  for (const id of p.skillIds) {
    if (!one(ctx.db, 'SELECT 1 FROM skills WHERE id = ?', id)) {
      throw new AppError('VALIDATION', 'One of the selected skills no longer exists.', { skillIds: 'Pick skills from the list' })
    }
  }
  tx(ctx.db, () => {
    run(ctx.db, 'UPDATE users SET full_name = ? WHERE id = ?', p.fullName, user.id)
    run(
      ctx.db,
      'UPDATE volunteer_profiles SET phone = ?, bio = ?, interests = ?, hour_goal = ? WHERE user_id = ?',
      p.phone,
      p.bio,
      JSON.stringify([...new Set(p.interests)]),
      p.hourGoal,
      user.id
    )
    run(ctx.db, 'DELETE FROM volunteer_skills WHERE user_id = ?', user.id)
    for (const id of new Set(p.skillIds)) run(ctx.db, 'INSERT INTO volunteer_skills (user_id, skill_id) VALUES (?, ?)', user.id, id)
    run(ctx.db, 'DELETE FROM availability WHERE user_id = ?', user.id)
    for (const b of p.availability) {
      run(ctx.db, 'INSERT INTO availability (user_id, weekday, start_time, end_time) VALUES (?, ?, ?, ?)', user.id, b.weekday, b.start, b.end)
    }
  })
  return loadProfile(ctx.db, user.id)
}

/** Admin directory search by name, email, or a specific skill (e.g. "Spanish translator"). */
export function searchVolunteers(ctx: Ctx, input: unknown = {}): VolunteerSummary[] {
  requireAdmin(ctx)
  const f = parse(volunteerSearchSchema, input)
  const where = ["u.role = 'volunteer'"]
  const params: (string | number)[] = []
  if (f.q) {
    // A text search also matches skill names, so typing "Spanish" finds translators.
    where.push(`(u.full_name LIKE ? OR u.email LIKE ? OR EXISTS (
      SELECT 1 FROM volunteer_skills v JOIN skills s ON s.id = v.skill_id WHERE v.user_id = u.id AND s.name LIKE ?))`)
    const like = `%${f.q}%`
    params.push(like, like, like)
  }
  if (f.skillId) {
    where.push('EXISTS (SELECT 1 FROM volunteer_skills v WHERE v.user_id = u.id AND v.skill_id = ?)')
    params.push(f.skillId)
  }
  return all<{ id: number; full_name: string; email: string; skills: string | null; hours: number; upcoming: number }>(
    ctx.db,
    `SELECT u.id, u.full_name, u.email,
       (SELECT group_concat(s.name, '|') FROM volunteer_skills v JOIN skills s ON s.id = v.skill_id WHERE v.user_id = u.id) AS skills,
       (SELECT COALESCE(SUM(h.hours), 0) FROM hour_logs h WHERE h.user_id = u.id AND h.status = 'approved') AS hours,
       (SELECT COUNT(*) FROM signups s JOIN activities a ON a.id = s.activity_id
          WHERE s.user_id = u.id AND s.status = 'confirmed' AND a.status = 'open' AND a.start_at >= ?) AS upcoming
     FROM users u WHERE ${where.join(' AND ')} ORDER BY u.full_name`,
    ctx.now(),
    ...params
  ).map((r) => ({
    userId: r.id,
    fullName: r.full_name,
    email: r.email,
    skills: r.skills ? r.skills.split('|').sort() : [],
    approvedHours: r.hours,
    upcomingShifts: r.upcoming
  }))
}

export function getVolunteer(ctx: Ctx, id: unknown): VolunteerDetail {
  const admin = requireAdmin(ctx)
  const userId = parse(idSchema, id)
  const profile = loadProfile(ctx.db, userId)
  const statuses = new Map(
    all<{ activity_id: number; status: 'confirmed' | 'waitlisted' | 'cancelled' }>(
      ctx.db,
      'SELECT activity_id, status FROM signups WHERE user_id = ?',
      userId
    ).map((s) => [s.activity_id, s.status])
  )
  const activities = loadActivities(
    ctx.db,
    admin.id,
    'a.id IN (SELECT activity_id FROM signups WHERE user_id = ?)',
    [userId],
    'a.start_at DESC'
  )
  return {
    profile,
    hours: hourLogsFor(ctx.db, userId),
    signups: activities.map((activity) => ({ activity, status: statuses.get(activity.id)! })),
    approvedHours: approvedTotal(ctx.db, userId)
  }
}
