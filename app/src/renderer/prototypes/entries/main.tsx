/**
 * Prototype: three directions for the Reports "All entries" list (approved hour logs), shown with the example
 * organization's kind of data. Keys 1-3 pick a direction, T toggles the theme. Nothing in the app imports this.
 */
/* eslint-disable react-refresh/only-export-components -- page entry file; nothing imports it */
import '@fontsource-variable/geist'
import '../../src/assets/main.css'

import { StrictMode, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ChevronDown } from 'lucide-react'
import { TYPE_STYLE } from '@/lib/activity-style'
import { fmtHours, initials } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { ActivityType, ReportRow } from '@shared/types'

const row = (volunteerName: string, activityTitle: string, activityType: ActivityType, date: string, hours: number): ReportRow => ({
  volunteerName,
  volunteerEmail: '',
  activityTitle,
  activityType,
  date,
  hours
})

// Shaped like the example organization's approved hours (src/main/db/seed.ts), newest first.
const ROWS: ReportRow[] = [
  row('Ethan Brooks', 'Saturday Food Pantry Sort', 'Food Bank', '2026-11-21', 2.5),
  row('Maria Lopez', 'Free Health Screening Day', 'Health', '2026-11-14', 5),
  row('Liam Carter', 'Free Health Screening Day', 'Health', '2026-11-14', 4.5),
  row('Grace Okafor', 'Holiday Toy Drive Gala', 'Fundraising', '2026-11-07', 4),
  row('Noah Rivera', 'Saturday Food Pantry Sort', 'Food Bank', '2026-10-31', 3),
  row('Jordan Kim', 'Fall Festival Setup', 'Event Support', '2026-09-19', 2),
  row('Maria Lopez', 'Senior Center Lunch Service', 'Senior Care', '2026-09-12', 2),
  row('Sofia Nguyen', 'Creek Cleanup', 'Environmental', '2026-08-29', 4),
  row('Ethan Brooks', 'Creek Cleanup', 'Environmental', '2026-08-29', 3.5),
  row('Aisha Patel', 'Homework Help Hour', 'Tutoring', '2026-07-24', 2),
  row('Sofia Nguyen', 'Shelter Dog Walking', 'Animal Care', '2026-07-18', 1.5),
  row('Maria Lopez', 'Saturday Food Pantry Sort', 'Food Bank', '2026-06-27', 3)
]

const day = (d: string): Date => new Date(`${d}T12:00`)
const monthKey = (d: string): string => day(d).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
const short = (d: string): string => day(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
const sum = (rs: ReportRow[]): number => rs.reduce((t, r) => t + r.hours, 0)

/** The activity type's mark on its tint: the same signature as the shift-card bands, at row size. */
function TypeMark({ type, size = 28 }: { type: ActivityType; size?: number }): React.JSX.Element {
  const { tint, Icon } = TYPE_STYLE[type]
  return (
    <span className="grid shrink-0 place-items-center rounded-lg text-white" style={{ background: tint, width: size, height: size }} aria-hidden>
      <Icon className="size-[55%]" strokeWidth={1.75} />
    </span>
  )
}

function Hours({ h, className }: { h: number; className?: string }): React.JSX.Element {
  return (
    <span className={cn('text-right tabular-nums', className)}>
      {fmtHours(h)}
      <span className="ml-0.5 text-muted-foreground">h</span>
    </span>
  )
}

/** A: Ledger. Grouped by month, each month headed by its total; one quiet row per entry. */
function Ledger(): React.JSX.Element {
  const months = useMemo(() => Object.entries(Object.groupBy(ROWS, (r) => monthKey(r.date))) as [string, ReportRow[]][], [])
  return (
    <div className="space-y-6">
      {months.map(([month, rs]) => (
        <section key={month} aria-label={`${month}, ${fmtHours(sum(rs))} hours`}>
          <header className="flex items-baseline justify-between border-b pb-2">
            <h3 className="text-sm font-medium">{month}</h3>
            <p className="text-xs text-muted-foreground tabular-nums">
              {rs.length} {rs.length === 1 ? 'entry' : 'entries'} · <span className="text-text-2">{fmtHours(sum(rs))} h</span>
            </p>
          </header>
          <ul>
            {rs.map((r, i) => (
              <li key={i} className="grid grid-cols-[28px_minmax(0,1fr)_96px_56px] items-center gap-3 rounded-lg px-2 py-2.5 transition-colors duration-150 hover:bg-foreground/[0.04]">
                <TypeMark type={r.activityType} />
                <div className="min-w-0">
                  <p className="truncate text-sm">{r.activityTitle}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {r.volunteerName} · {r.activityType}
                  </p>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">{short(r.date)}</span>
                <Hours h={r.hours} className="text-sm font-medium" />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

/** B: By volunteer. One row per person with their total; open a row to see the entries behind it. */
function ByVolunteer(): React.JSX.Element {
  const people = useMemo(
    () => (Object.entries(Object.groupBy(ROWS, (r) => r.volunteerName)) as [string, ReportRow[]][]).sort((a, b) => sum(b[1]) - sum(a[1])),
    []
  )
  const [open, setOpen] = useState<string | null>(people[0]?.[0] ?? null)
  const top = sum(people[0]?.[1] ?? [])
  return (
    <ul className="divide-y rounded-xl border">
      {people.map(([name, rs]) => {
        const isOpen = open === name
        const id = `entries-${name.replace(/\W/g, '')}`
        return (
          <li key={name}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={id}
              onClick={() => setOpen(isOpen ? null : name)}
              className="grid w-full grid-cols-[32px_minmax(0,1fr)_120px_64px_16px] items-center gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-foreground/[0.03] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
            >
              <span className="grid size-8 place-items-center rounded-full bg-muted text-xs font-medium text-text-2" aria-hidden>
                {initials(name)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{name}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {rs.length} {rs.length === 1 ? 'entry' : 'entries'} · last {short(rs[0]!.date)}
                </span>
              </span>
              {/* Share of the top volunteer's hours: a ranked list with thin bars, scaled, never width-animated. */}
              <span className="h-1 rounded-full bg-track" aria-hidden>
                <span className="block h-full origin-left rounded-full bg-muted-foreground/60" style={{ transform: `scaleX(${sum(rs) / top})` }} />
              </span>
              <Hours h={sum(rs)} className="text-sm font-medium" />
              <ChevronDown
                className={cn('size-4 text-muted-foreground transition-transform duration-200 ease-snappy', isOpen && 'rotate-180')}
                aria-hidden
              />
            </button>
            {/* 0fr → 1fr opens to the content's real height without measuring it. */}
            <div id={id} className={cn('grid transition-[grid-template-rows] duration-200 ease-snappy', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
              <div className="overflow-hidden">
                <ul className={cn('pb-2 pl-[60px] pr-[52px] transition-opacity duration-200', isOpen ? 'opacity-100' : 'opacity-0')} inert={!isOpen}>
                  {rs.map((r, i) => (
                    <li key={i} className="flex items-center gap-2.5 border-t border-dashed py-2 text-sm first:border-t-0">
                      <span className="size-2 shrink-0 rounded-full" style={{ background: TYPE_STYLE[r.activityType].tint }} aria-hidden />
                      <span className="min-w-0 flex-1 truncate">{r.activityTitle}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">{short(r.date)}</span>
                      <Hours h={r.hours} className="w-12 text-text-2" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/** C: Stubs. Each entry is a small timesheet stub: the date behind a dashed tear line, like the next-shift ticket. */
function Stubs(): React.JSX.Element {
  return (
    <ul className="grid gap-2">
      {ROWS.map((r, i) => {
        const d = day(r.date)
        const { tint } = TYPE_STYLE[r.activityType]
        return (
          <li key={i} className="flex items-stretch overflow-hidden rounded-xl border bg-card transition-colors duration-150 hover:border-foreground/15">
            <div className="flex w-16 shrink-0 flex-col items-center justify-center border-r border-dashed py-2.5" aria-hidden>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
              <span className="text-xl leading-tight font-medium tabular-nums">{d.getDate()}</span>
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-2.5">
              <TypeMark type={r.activityType} size={24} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{r.activityTitle}</p>
                <p className="truncate text-xs text-muted-foreground">
                  <span className="sr-only">{short(r.date)}, </span>
                  {r.volunteerName}
                </p>
              </div>
              <span className="hidden text-xs sm:inline" style={{ color: `color-mix(in srgb, ${tint} 70%, var(--foreground))` }}>
                {r.activityType}
              </span>
              <Hours h={r.hours} className="w-16 text-lg font-medium" />
            </div>
          </li>
        )
      })}
    </ul>
  )
}

const DIRECTIONS = [
  { name: 'Ledger', View: Ledger, idea: 'Grouped by month with each month’s total; the type mark leads every row, so a column of colour shows what kind of work filled the month.' },
  { name: 'By volunteer', View: ByVolunteer, idea: 'One row per person, ranked by hours with a thin share bar; open a row to see the entries behind the total. Best for “who did the most”.' },
  { name: 'Stubs', View: Stubs, idea: 'Each entry is a timesheet stub with its date behind a dashed tear line, echoing the next-shift ticket. Most personal, least dense.' }
] as const

function Prototype(): React.JSX.Element {
  const [pick, setPick] = useState(0)
  const [dark, setDark] = useState(true)
  const { name, View, idea } = DIRECTIONS[pick]!

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if ((e.target as HTMLElement).closest('button')) return
      if (e.key >= '1' && e.key <= '3') setPick(Number(e.key) - 1)
      if (e.key.toLowerCase() === 't') setDark((d) => !d)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="flex h-16 items-center gap-3 border-b px-8">
        <span className="text-xl font-medium">All entries</span>
        <span className="text-sm text-muted-foreground">Prototype · keys 1–3 and T</span>
        <div className="ml-auto flex items-center gap-2" role="group" aria-label="Direction">
          {DIRECTIONS.map((d, i) => (
            <button
              key={d.name}
              type="button"
              aria-pressed={pick === i}
              onClick={() => setPick(i)}
              className="h-9 rounded-full border px-3 text-sm transition-[transform,background-color,border-color] duration-150 ease-snappy active:scale-[0.97] aria-pressed:border-foreground aria-pressed:bg-card"
            >
              {d.name}
            </button>
          ))}
          <button type="button" onClick={() => setDark((d) => !d)} className="ml-2 h-9 rounded-md border px-3 text-sm active:scale-[0.97]">
            {dark ? 'Light' : 'Dark'} theme
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-[880px] p-8">
        <section className="rounded-2xl border bg-card p-6">
          <div className="mb-5 flex items-baseline justify-between gap-6">
            <div>
              <h2 className="text-[15px] font-medium">All entries</h2>
              <p className="mt-0.5 text-sm text-muted-foreground tabular-nums">
                {ROWS.length} approved entries · {fmtHours(sum(ROWS))} hours
              </p>
            </div>
            <p className="max-w-[46ch] text-right text-xs text-muted-foreground">{idea}</p>
          </div>
          <div key={name}>
            <View />
          </div>
        </section>
      </main>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Prototype />
  </StrictMode>
)
