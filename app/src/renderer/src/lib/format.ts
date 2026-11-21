/** Date and number formatting for display. Stored values stay "YYYY-MM-DDTHH:mm". */
import { toStamp } from '@shared/time'
import type { Activity } from '@shared/types'

const asDate = (stamp: string): Date => new Date(stamp.length === 10 ? `${stamp}T00:00` : stamp)

export const fmtDay = (s: string): string =>
  asDate(s).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

export const fmtDate = (s: string): string =>
  asDate(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export const fmtTime = (s: string): string =>
  asDate(s).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

export const fmtRange = (start: string, end: string): string => `${fmtTime(start)} – ${fmtTime(end)}`

export const fmtMonth = (ym: string): string =>
  asDate(`${ym}-01`).toLocaleDateString('en-US', { month: 'short' })

export const fmtWhen = (s: string): string => `${fmtDate(s)}, ${fmtTime(s)}`

/** 2 -> "2", 2.5 -> "2.5", 1284 -> "1,284" */
export const fmtHours = (h: number): string => h.toLocaleString('en-US', { maximumFractionDigits: 2 })

/** 1284 -> "1,284" */
export const fmtCount = (n: number): string => n.toLocaleString('en-US')

/** "3 of 20 spots left", "Last spot", or "Full · 12 on waitlist". */
export function spotsLabel({ confirmed, capacity, waitlisted }: Pick<Activity, 'confirmed' | 'capacity' | 'waitlisted'>): string {
  const left = capacity - confirmed
  if (left <= 0) return waitlisted > 0 ? `Full · ${fmtCount(waitlisted)} on waitlist` : 'Full · waitlist open'
  return left === 1 ? 'Last spot' : `${fmtCount(left)} of ${fmtCount(capacity)} spots left`
}

export const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('')

/** Now as "YYYY-MM-DDTHH:mm" in local time, the same format the database stores. */
export const nowStamp = (): string => toStamp(new Date())

/** Today's date as "YYYY-MM-DD" in local time. */
export const today = (): string => nowStamp().slice(0, 10)
