/**
 * Date helpers. All dates are stored as local-time strings like "2026-11-14T09:00"
 * (the same format an <input type="datetime-local"> produces). Strings in this
 * format sort in time order, so the database can compare them directly.
 */

const pad = (n: number): string => String(n).padStart(2, '0')

/** Formats a Date as "YYYY-MM-DDTHH:mm" in local time. */
export function toStamp(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Length of a shift in hours. */
export function hoursBetween(start: string, end: string): number {
  return (new Date(end).getTime() - new Date(start).getTime()) / 3_600_000
}

/** True when two time ranges share any minute. Touching end-to-start does not count. */
export function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart < bEnd && bStart < aEnd
}

/** Weekday (0 = Sunday) of a stamp. */
export function weekdayOf(stamp: string): number {
  return new Date(stamp).getDay()
}

/** "HH:mm" part of a stamp. */
export function timeOf(stamp: string): string {
  return stamp.slice(11, 16)
}

/** Friendly form for emails, e.g. "Thu, Dec 3 at 9:00 AM". */
export function prettyStamp(stamp: string): string {
  const d = new Date(stamp)
  const day = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return `${day} at ${time}`
}

/** "YYYY-MM-DD" part of a stamp. */
export function dateOf(stamp: string): string {
  return stamp.slice(0, 10)
}
