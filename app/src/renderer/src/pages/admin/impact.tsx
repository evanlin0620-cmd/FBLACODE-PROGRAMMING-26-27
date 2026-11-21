/**
 * Admin home. What needs the coordinator comes first (hour logs to approve in place,
 * skill gaps); the chart answers "how are we doing" second.
 */
import { useState } from 'react'
import { Link } from 'react-router'
import { ChartColumn, Check, UserSearch, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { FormField } from '@/components/form'
import { ChartTable, EmptyState, Loader, PageBody, PageHeader, Panel } from '@/components/page'
import { SpotsRow } from '@/components/slots'
import { refreshNavCounts, useMutation, useQuery, useWelcome } from '@/lib/hooks'
import { useSession } from '@/lib/session'
import { fmtCount, fmtDay, fmtHours, fmtMonth, today } from '@/lib/format'
import { cn, entrance } from '@/lib/utils'
import { smoothPath } from '@/lib/chart'
import type { HourLog } from '@shared/types'

function Stat({ label, value, note, intro }: { label: string; value: string; note: string; intro?: ReturnType<typeof entrance> }): React.JSX.Element {
  return (
    <div className={cn('h-full rounded-2xl border bg-card p-5', intro?.className)} style={intro?.style}>
      <p className="text-sm text-text-2">{label}</p>
      <p className="mt-2 text-[32px] leading-none font-medium tracking-[-0.02em] tabular-nums">{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{note}</p>
    </div>
  )
}

/**
 * Approved hours as one smooth line on a muted grid. The line is the accent; the month still in progress gets the
 * only labelled point. Each month is a focusable column, so keyboard users get the same detail as hover.
 */
function MonthChart({ months, intro }: { months: { label: string; hours: number }[]; intro: boolean }): React.JSX.Element {
  // Round up to a multiple of 4 with headroom, so the line and the label never touch the top.
  const max = Math.max(4, Math.ceil((Math.max(...months.map((m) => m.hours)) * 1.2) / 4) * 4)
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max)
  const W = 600
  const H = 220
  const n = months.length
  const pts = months.map((m, i): [number, number] => [((i + 0.5) / n) * W, H - (m.hours / max) * H])
  const line = smoothPath(pts, H)
  const area = `${line} L${pts[n - 1]![0]},${H} L${pts[0]![0]},${H} Z`
  const last = months[n - 1]!
  return (
    <figure>
      <div className="relative h-[220px] pl-8">
        {ticks.map((t) => (
          <div key={t} className="absolute right-0 left-8 border-t border-border" style={{ bottom: `${(t / max) * 100}%` }} aria-hidden>
            <span className="absolute -top-2 -left-8 w-6 text-right font-mono text-[11px] text-muted-foreground tabular-nums">{fmtCount(t)}</span>
          </div>
        ))}
        <div className="relative h-full">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={cn('absolute inset-0 size-full overflow-visible', intro && 'animate-draw')} aria-hidden>
            <defs>
              <linearGradient id="impact-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--primary)" stopOpacity="0.22" />
                <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#impact-area)" />
            <path d={line} fill="none" stroke="var(--primary)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          </svg>
          {/* The current month's point and value, drawn in HTML so they stay round when the chart stretches. */}
          <span
            className={cn('pointer-events-none absolute flex -translate-x-1/2 translate-y-1/2 flex-col items-center', intro && 'animate-appear')}
            style={{ left: `${((n - 0.5) / n) * 100}%`, bottom: `${(last.hours / max) * 100}%`, animationDelay: intro ? '900ms' : undefined }}
            aria-hidden
          >
            <span className="mb-2 rounded-md bg-foreground px-1.5 font-mono text-[11px] leading-5 text-background tabular-nums">{fmtHours(last.hours)}</span>
            <span className="size-2.5 rounded-full border-2 border-card bg-primary shadow-[0_0_0_1px_var(--primary)]" />
          </span>
          <div className="absolute inset-0 flex">
            {months.map((m, i) => {
              const current = i === n - 1
              return (
                <Tooltip key={m.label}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="group relative h-full min-w-0 flex-1 rounded-md"
                      aria-label={`${m.label}: ${fmtHours(m.hours)} approved hours${current ? ' so far' : ''}`}
                    >
                      {/* A hairline under the pointer, so hover reads as "this month". */}
                      <span className="absolute inset-y-0 left-1/2 w-px bg-foreground/15 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {fmtHours(m.hours)} hours approved in {m.label}
                    {current ? ', month still in progress' : ''}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </div>
      </div>
      <div className="mt-2 flex pl-8" aria-hidden>
        {months.map((m, i) => (
          <span key={m.label} className={cn('min-w-0 flex-1 truncate text-center font-mono text-[11px]', i === n - 1 ? 'text-foreground' : 'text-muted-foreground')}>
            {m.label}
            {i === n - 1 && ' so far'}
          </span>
        ))}
      </div>
    </figure>
  )
}

function SendBack({ entry, onClose, onSent }: { entry: HourLog | null; onClose: () => void; onSent: () => void }): React.JSX.Element {
  const [reason, setReason] = useState('')
  const review = useMutation('hours.review')
  const close = (): void => {
    setReason('')
    review.clearField('note')
    onClose()
  }
  return (
    <Dialog open={entry !== null} onOpenChange={(o) => !o && close()}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Send these hours back?</DialogTitle>
          <DialogDescription>
            {entry?.volunteerName} sees your reason and can log the hours again. {entry && fmtHours(entry.hours)} hours, {entry?.activityTitle}.
          </DialogDescription>
        </DialogHeader>
        <form
          noValidate
          onSubmit={async (e) => {
            e.preventDefault()
            if (entry && (await review.run({ ids: [entry.id], decision: 'rejected', note: reason }))) {
              toast(`Sent back to ${entry.volunteerName}`, { description: 'They can see your reason and log the hours again.' })
              setReason('')
              onSent()
            }
          }}
        >
          <FormField label="Reason" error={review.fieldErrors.note}>
            {(p) => (
              <Textarea
                {...p}
                rows={3}
                autoFocus
                value={reason}
                placeholder="The sign-in sheet shows 2 hours, not 4"
                onChange={(e) => {
                  setReason(e.target.value)
                  review.clearField('note')
                }}
              />
            )}
          </FormField>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={close}>
              Keep reviewing
            </Button>
            <Button type="submit" variant="destructive" disabled={review.pending}>
              Send back
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

type Decision = 'approved' | 'sent back'

/**
 * Hour logs as a stack of cards, reviewed one at a time: Approve throws the top card right, Send back throws it
 * left (after asking for a reason). Arrow keys do the same while the stack has focus. Decision and keyboard model
 * from "Card Stack" by kuratlielia on 21st.dev, rebuilt with CSS transitions (this app doesn't ship `motion`).
 * shortcut: no undo, because the backend can't reverse a review; add a reverse endpoint before offering one.
 */
function ReviewStack({ onChange }: { onChange: () => void }): React.JSX.Element {
  const waiting = useQuery('hours.forReview', 'pending')
  const review = useMutation('hours.review')
  const [leaving, setLeaving] = useState<Decision | null>(null)
  const [log, setLog] = useState<{ e: HourLog; decision: Decision }[]>([])
  const [sendingBack, setSendingBack] = useState<HourLog | null>(null)
  const list = waiting.data ?? []
  const top = list[0]

  /** The card flies off, then the list reloads so the next one rises. */
  const finish = async (e: HourLog, decision: Decision): Promise<void> => {
    setLeaving(decision)
    await new Promise((r) => setTimeout(r, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 260))
    setLog((l) => [{ e, decision }, ...l].slice(0, 5))
    await waiting.reload()
    setLeaving(null)
    onChange()
    refreshNavCounts()
  }
  const approve = async (): Promise<void> => {
    if (!top || leaving) return
    if (await review.run({ ids: [top.id], decision: 'approved', note: '' })) {
      toast(`Approved ${fmtHours(top.hours)} hours for ${top.volunteerName}`, { description: 'They’ve been notified.' })
      await finish(top, 'approved')
    }
  }

  return (
    <Panel title={top ? `${fmtCount(list.length)} hour ${list.length === 1 ? 'log' : 'logs'} to review` : 'Hour logs'}>
      <div
        className="relative mx-auto mt-2 h-[232px] max-w-[380px] rounded-2xl"
        role="group"
        aria-roledescription="card stack"
        aria-label="Hour logs to review"
        aria-describedby="stack-hint"
        tabIndex={top ? 0 : -1}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget || !top) return
          if (e.key === 'ArrowRight') {
            e.preventDefault()
            void approve()
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault()
            setSendingBack(top)
          }
        }}
      >
        {waiting.data === undefined ? null : !top ? (
          <p className="absolute inset-0 grid place-items-center rounded-2xl border border-dashed text-sm text-text-2">No hour logs waiting. You’re caught up.</p>
        ) : (
          list.slice(0, 3).map((e, depth) => {
            const flying = depth === 0 && leaving
            return (
              <article
                key={e.id}
                aria-hidden={depth > 0 || undefined}
                style={{
                  zIndex: 10 - depth,
                  transform: flying ? `translate(${leaving === 'approved' ? 440 : -440}px, -24px) rotate(${leaving === 'approved' ? 14 : -14}deg)` : `translateY(${depth * 12}px) scale(${1 - depth * 0.05})`,
                  opacity: flying ? 0 : 1
                }}
                className="absolute inset-0 flex flex-col rounded-2xl border bg-card p-5 shadow-[0_1px_2px_rgb(0_0_0/0.06),0_14px_30px_-14px_rgb(0_0_0/0.3)] transition-[transform,opacity] duration-300 ease-snappy"
              >
                {flying && (
                  <span
                    className={cn(
                      'absolute top-4 flex items-center gap-1 rounded-md border-2 px-2 py-0.5 text-sm font-medium',
                      leaving === 'approved' ? 'left-4 border-primary text-primary' : 'right-4 border-destructive text-destructive'
                    )}
                  >
                    {leaving === 'approved' ? <Check className="size-4" aria-hidden /> : <X className="size-4" aria-hidden />}
                    {leaving === 'approved' ? 'Approved' : 'Sent back'}
                  </span>
                )}
                <p className="font-mono text-[11px] text-muted-foreground">
                  {depth + 1} of {fmtCount(list.length)} · {fmtDay(e.date)}
                </p>
                <h3 className="mt-auto truncate text-xl font-medium">{e.volunteerName}</h3>
                <p className="truncate text-sm text-text-2">{e.activityTitle}</p>
                {e.note && <p className="mt-1 truncate text-xs text-muted-foreground">“{e.note}”</p>}
                <p className="mt-3 text-[40px] leading-none font-medium tracking-[-0.02em] tabular-nums">
                  {fmtHours(e.hours)}
                  <span className="ml-1 text-base font-normal text-muted-foreground">hours</span>
                </p>
              </article>
            )
          })
        )}
      </div>
      <div className="mt-6 flex items-center justify-center gap-2">
        <Button variant="outline" disabled={!top || !!leaving} onClick={() => top && setSendingBack(top)} aria-label={top ? `Send back ${top.volunteerName}’s hours` : 'Send back'}>
          <X aria-hidden /> Send back
        </Button>
        <Button disabled={!top || !!leaving || review.pending} onClick={() => void approve()} aria-label={top ? `Approve ${fmtHours(top.hours)} hours for ${top.volunteerName}` : 'Approve'}>
          <Check aria-hidden /> Approve
        </Button>
      </div>
      <p id="stack-hint" className="mt-2 text-center text-xs text-muted-foreground">
        Focus the stack, then use the right arrow to approve and the left arrow to send back.
      </p>
      {log.length > 0 && (
        <ul className="mt-4 divide-y border-t text-sm" aria-label="Just reviewed" aria-live="polite">
          {log.map(({ e, decision }) => (
            <li key={e.id} className="flex items-center gap-3 py-2 transition-[opacity,translate] duration-300 ease-snappy starting:-translate-y-1 starting:opacity-0">
              <span className={cn('grid size-5 place-items-center rounded-full', decision === 'approved' ? 'bg-success-bg text-success-fg' : 'bg-destructive/10 text-destructive')}>
                {decision === 'approved' ? <Check className="size-3" aria-hidden /> : <X className="size-3" aria-hidden />}
              </span>
              <span className="min-w-0 flex-1 truncate">
                <span className="font-medium">{e.volunteerName}</span>{' '}
                <span className="text-muted-foreground">
                  · {fmtHours(e.hours)} h {decision}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
      <SendBack
        entry={sendingBack}
        onClose={() => setSendingBack(null)}
        onSent={() => {
          const e = sendingBack
          setSendingBack(null)
          if (e) void finish(e, 'sent back')
        }}
      />
    </Panel>
  )
}

/** Upcoming shifts where nobody confirmed has a skill the shift needs. */
function SkillGaps({ gaps, upcoming }: { gaps: { activityId: number; activityTitle: string; startAt: string; missingSkills: string[] }[]; upcoming: number }): React.JSX.Element {
  return (
    <Panel title="Skill gaps" description="Shifts where nobody confirmed has a skill it needs">
      {gaps.length === 0 ? (
        <p className="text-sm text-muted-foreground">{upcoming === 0 ? 'No upcoming shifts to check yet.' : 'Every upcoming shift has the skills it needs.'}</p>
      ) : (
        <ul className="divide-y">
          {gaps.slice(0, 4).map((g) => (
            <li key={g.activityId} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
              <UserSearch className="size-[18px] shrink-0 text-muted-foreground" strokeWidth={1.5} aria-hidden />
              <p className="min-w-0 flex-1 text-sm">
                <span className="font-medium">{g.activityTitle}</span> <span className="text-text-2">· {fmtDay(g.startAt)} · needs {g.missingSkills.join(', ')}</span>
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/admin/activities/${g.activityId}`}>Find volunteers</Link>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}

/** Upcoming open shifts with the most empty spots, as slot marks. */
function ShortShifts(): React.JSX.Element | null {
  const q = useQuery('activities.list', { from: today() })
  const short = (q.data ?? [])
    .filter((a) => a.status === 'open' && a.confirmed < a.capacity)
    .sort((a, b) => a.confirmed / a.capacity - b.confirmed / b.capacity)
    .slice(0, 4)
  if (short.length === 0) return null
  return (
    <Panel title="Shifts that need people" action={<span className="text-sm text-muted-foreground">Fewest people first</span>}>
      <ul className="divide-y">
        {short.map((a) => (
          <li key={a.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3 first:pt-0 last:pb-0">
            <span className="min-w-0 flex-1 truncate text-sm">
              <Link to={`/admin/activities/${a.id}`} className="font-medium hover:underline">
                {a.title}
              </Link>{' '}
              <span className="text-muted-foreground">· {fmtDay(a.startAt)}</span>
            </span>
            <SpotsRow confirmed={a.confirmed} capacity={a.capacity} waitlisted={a.waitlisted} />
          </li>
        ))}
      </ul>
    </Panel>
  )
}

export function ImpactDashboard(): React.JSX.Element {
  const q = useQuery('dashboard.impact')
  const w = useWelcome()
  const { org } = useSession()
  const panels = entrance(w, 120, 6) // chart and side panels arrive together, carried by their row
  return (
    <>
      <PageHeader
        title="Impact"
        subtitle={org}
        actions={
          <Button asChild>
            <Link to="/admin/reports">Create report</Link>
          </Button>
        }
      />
      <PageBody>
        <Loader query={q}>
          {(s) => {
            const topMax = Math.max(1, ...s.topActivities.map((t) => t.hours))
            const sixMonthTotal = s.hoursByMonth.reduce((t, m) => t + m.hours, 0)
            const months = s.hoursByMonth.map((m) => ({ label: fmtMonth(m.month), hours: m.hours }))
            return (
              <div className="space-y-4">
                {/* What needs the coordinator sits beside how it's going. */}
                <div className={cn('grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]', panels.className)} style={panels.style}>
                  <ReviewStack onChange={() => void q.reload()} />
                  <Panel
                    className="flex flex-col"
                    title="Approved hours by month"
                    action={sixMonthTotal > 0 && <span className="text-sm text-muted-foreground tabular-nums">{fmtHours(sixMonthTotal)} hours in 6 months</span>}
                  >
                    <p className="-mt-1 mb-4 text-[44px] leading-none font-medium tracking-[-0.02em] tabular-nums">
                      {fmtHours(s.totalApprovedHours)}
                      <span className="ml-2 text-sm font-normal tracking-normal text-muted-foreground">approved hours, all time</span>
                    </p>
                    {sixMonthTotal === 0 ? (
                      <EmptyState className="flex-1" icon={<ChartColumn />} title="No approved hours yet" description="Once you approve logged hours, they show up here by month." />
                    ) : (
                      <>
                        <ChartTable caption="Approved hours by month" unit="hours" rows={months.map((m) => ({ label: m.label, value: m.hours }))} />
                        <MonthChart months={months} intro={w} />
                      </>
                    )}
                  </Panel>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* Once per login, left to right in reading order; gaps shrink so it lands as one wave. */}
                  <Stat label="Volunteers" value={fmtCount(s.volunteerCount)} note="With a ServeHub account" intro={entrance(w, 0, 10)} />
                  <Stat label="Upcoming activities" value={fmtCount(s.upcomingActivities)} note="Open and scheduled" intro={entrance(w, 40, 8)} />
                  <Stat label="Waiting for approval" value={fmtCount(s.pendingApprovals)} note="Hour logs to review" intro={entrance(w, 70, 8)} />
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <SkillGaps gaps={s.skillGaps} upcoming={s.upcomingActivities} />
                  <Panel title="Top activities" action={<span className="text-sm text-muted-foreground">Hours</span>}>
                    {s.topActivities.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No approved hours yet.</p>
                    ) : (
                      <ol className="space-y-3">
                        {s.topActivities.map((t) => (
                          <li key={t.title}>
                            <div className="flex justify-between gap-3 text-sm">
                              <span className="truncate">{t.title}</span>
                              <span className="text-text-2 tabular-nums">{fmtHours(t.hours)}</span>
                            </div>
                            <div className="mt-1.5 h-1 rounded-full bg-track" aria-hidden>
                              <div className="h-full rounded-full bg-muted-foreground/60" style={{ width: `${(t.hours / topMax) * 100}%` }} />
                            </div>
                          </li>
                        ))}
                      </ol>
                    )}
                  </Panel>
                </div>

                <ShortShifts />
              </div>
            )
          }}
        </Loader>
      </PageBody>
    </>
  )
}
