/**
 * Builds an iCalendar (.ics) file for one shift, so a volunteer can drop it into Outlook, Google or Apple Calendar.
 * Times are "floating" local times, the same wall-clock times the app stores ("YYYY-MM-DDTHH:mm").
 */
const esc = (s: string): string =>
  s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')
const ics = (stamp: string): string => `${stamp.replace(/[-:]/g, '')}00`

export function toIcs(e: {
  uid: string
  title: string
  location: string
  description: string
  startAt: string
  endAt: string
  now: string
}): string {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Turnout//Volunteer shifts//EN',
    'BEGIN:VEVENT',
    `UID:${e.uid}`,
    `DTSTAMP:${ics(e.now)}`,
    `DTSTART:${ics(e.startAt)}`,
    `DTEND:${ics(e.endAt)}`,
    `SUMMARY:${esc(e.title)}`,
    `LOCATION:${esc(e.location)}`,
    `DESCRIPTION:${esc(e.description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
    ''
  ].join('\r\n') // the iCalendar format requires CRLF line endings
}
