/**
 * "Recommended for you": ranks upcoming activities for one volunteer.
 *
 * Score (0-100) =
 *   50 points for skills:        share of the activity's required skills the volunteer has
 *                                (activities with no required skills get the full 50)
 *   30 points for availability:  the shift fits inside one of their weekly time blocks
 *                                (partial overlap earns part of the points)
 *   20 points for interest:      the activity type is one of their interests
 * Full activities are moved down by 25 points, because the volunteer would only
 * join a waitlist. Each match also adds a plain-English reason to show on the card.
 */
import type { Activity, Profile, Recommendation } from '@shared/types'
import { WEEKDAYS } from '@shared/types'
import { timeOf, weekdayOf } from '@shared/time'

const minutes = (hhmm: string): number => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5))

export function scoreActivity(activity: Activity, profile: Profile): Recommendation {
  const reasons: string[] = []

  // Skills
  const mySkills = new Set(profile.skills.map((s) => s.id))
  const matched = activity.skills.filter((s) => mySkills.has(s.id))
  const skillPoints = activity.skills.length === 0 ? 50 : (50 * matched.length) / activity.skills.length
  if (matched.length > 0) reasons.push(`Uses your skill${matched.length > 1 ? 's' : ''}: ${matched.map((s) => s.name).join(', ')}`)
  else if (activity.skills.length === 0) reasons.push('No special skills needed')

  // Availability: best overlap between the shift and any block on the same weekday
  const day = weekdayOf(activity.startAt)
  const shiftStart = minutes(timeOf(activity.startAt))
  const shiftEnd = minutes(timeOf(activity.endAt))
  let bestFit = 0
  for (const b of profile.availability) {
    if (b.weekday !== day) continue
    const overlap = Math.min(shiftEnd, minutes(b.end)) - Math.max(shiftStart, minutes(b.start))
    bestFit = Math.max(bestFit, overlap / (shiftEnd - shiftStart))
  }
  const availabilityPoints = 30 * Math.max(0, bestFit)
  if (bestFit >= 1) reasons.push(`Fits your ${WEEKDAYS[day]} availability`)
  else if (bestFit > 0) reasons.push(`Partly fits your ${WEEKDAYS[day]} availability`)

  // Interest
  const interested = profile.interests.includes(activity.type)
  if (interested) reasons.push(`You’re interested in ${activity.type}`)

  let score = skillPoints + availabilityPoints + (interested ? 20 : 0)
  const full = activity.confirmed >= activity.capacity
  if (full) {
    score -= 25
    reasons.push('Full right now, so you’d join the waitlist')
  }
  return { activity, score: Math.max(0, Math.min(100, Math.round(score))), reasons }
}

/** Ranks activities the volunteer hasn't joined yet, best match first. Weak matches (under 20) aren't shown. */
export function recommend(activities: Activity[], profile: Profile, limit = 3): Recommendation[] {
  return activities
    .filter((a) => a.mySignup === null && a.status === 'open')
    .map((a) => scoreActivity(a, profile))
    .filter((r) => r.score >= 20)
    .sort((x, y) => y.score - x.score || x.activity.startAt.localeCompare(y.activity.startAt))
    .slice(0, limit)
}
