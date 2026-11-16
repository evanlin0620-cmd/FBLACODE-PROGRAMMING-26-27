/**
 * Admin home. What needs the coordinator comes first (hour logs to approve in place,
 * skill gaps); the chart answers "how are we doing" second.
 */
import { useState } from 'react'
import { Link } from 'react-router'
import { ChartColumn, ChevronDown, ClipboardCheck, UserSearch } from 'lucide-react'
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

/** Bars in neutral steps; only the month in progress takes the accent, because it's the one still changing. */
function MonthChart({ months }: { months: { label: string; hours: number }[] }): React.JSX.Element {
  // Round up to a multiple of 4 with headroom for the value label, so a bar never touches the top.
  const max = Math.max(4, Math.ceil((Math.max(...months.map((m) => m.hours)) * 1.1) / 4) * 4)
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max)
  return (
    <figure>
      <div className="relative h-[220px] pl-8">
        {ticks.map((t) => (
          <div key={t} className="absolute right-0 left-8 border-t border-dashed border-border" style={{ bottom: `${(t / max) * 100}%` }} aria-hidden>
            <span className="absolute -top-2 -left-8 w-6 text-right text-[11px] text-muted-foreground tabular-nums">{fmtCount(t)}</span>
          </div>
        ))}
        <div className="relative flex h-full items-end gap-6 px-2">
          {months.map((m, i) => {
            const current = i === months.length - 1
            return (
              <Tooltip key={m.label}>
                <TooltipTrigger asChild>
                  {/* Focusable so keyboard users get the same detail as hover. */}
                  <button
                    type="button"
                    className="group flex h-full min-w-0 flex-1 flex-col justify-end rounded-t-md"
                    aria-label={`${m.label}: ${fmtHours(m.hours)} approved hours${current ? ' so far' : ''}`}
                  >
                    <span className={cn('mb-1.5 text-center text-xs tabular-nums', current ? 'font-medium text-primary' : 'text-muted-foreground')}>{fmtHours(m.hours)}</span>
                    <span
                      className={cn('block rounded-t-md transition-colors duration-150', current ? 'bg-primary' : 'bg-[var(--slot-open)] brightness-95 group-hover:brightness-90')}
                      style={{ height: `${(m.hours / max) * 100}%` }}
                    />
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
      <div className="mt-2 flex gap-6 pr-2 pl-10" aria-hidden>
        {months.map((m, i) => (
          <span key={m.label} className="min-w-0 flex-1 truncate text-center text-xs text-muted-foreground">
            {m.label}
            {i === months.length - 1 && ' so far'}
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

/** The "Needs you" strip: hour logs waiting (approve in place) and shifts missing a skill. */
function NeedsYou({ gaps, onChange }: { gaps: { activityId: number; activityTitle: string; startAt: string; missingSkills: string[] }[]; onChange: () => void }): React.JSX.Element {
  const waiting = useQuery('hours.forReview', 'pending')
  const review = useMutation('hours.review')
  const [open, setOpen] = useState(false)
  const [sendingBack, setSendingBack] = useState<HourLog | null>(null)
  const list = waiting.data ?? []
  const changed = (): void => {
    void waiting.reload()
    onChange()
    refreshNavCounts()
  }
  const approve = async (e: HourLog): Promise<void> => {
    if (await review.run({ ids: [e.id], decision: 'approved', note: '' })) {
      toast(`Approved ${fmtHours(e.hours)} hours for ${e.volunteerName}`, { description: 'They’ve been notified.' })
      changed()
    }
  }
  return (
    <section aria-labelledby="needs" className="rounded-2xl border bg-card">
      <h2 id="needs" className="px-6 pt-5 text-[15px] font-medium">
        Needs you
      </h2>
      <ul className="mt-3 divide-y border-t">
        <li>
          <div className="flex items-center gap-4 px-6 py-3">
            <ClipboardCheck className="size-[18px] shrink-0 text-muted-foreground" strokeWidth={1.5} aria-hidden />
            <p className="min-w-0 flex-1 text-sm">
              {list.length === 0 ? (
                <span className="text-text-2">{waiting.loading ? 'Checking for hour logs…' : 'No hour logs waiting. You’re caught up.'}</span>
              ) : (
                <>
                  <span className="font-medium tabular-nums">
                    {fmtCount(list.length)} hour {list.length === 1 ? 'log' : 'logs'}
                  </span>{' '}
                  <span className="text-text-2">waiting for approval</span>
                </>
              )}
            </p>
            {list.length > 0 && (
              <Button variant="outline" size="sm" aria-expanded={open} aria-controls="waiting-list" onClick={() => setOpen((o) => !o)}>
                {open ? 'Hide' : 'Review'}
                <ChevronDown className={cn('transition-transform duration-200 ease-snappy', open && 'rotate-180')} strokeWidth={1.5} aria-hidden />
              </Button>
            )}
          </div>
          {open && list.length > 0 && (
            <ul id="waiting-list" className="mx-6 mb-4 divide-y rounded-xl border bg-background">
              {list.slice(0, 5).map((e) => (
                <li key={e.id} className="flex items-center gap-4 px-4 py-3">
                  <span className="min-w-0 flex-1 text-sm">
                    <span className="block truncate font-medium">
                      {e.volunteerName} <span className="font-normal text-muted-foreground">· {e.activityTitle}</span>
                    </span>
                    <span className="block truncate text-muted-foreground">
                      {fmtDay(e.date)}
                      {e.note && ` · “${e.note}”`}
                    </span>
                  </span>
                  <span className="w-14 shrink-0 text-right text-sm font-medium tabular-nums">{fmtHours(e.hours)} h</span>
                  <Button variant="ghost" size="sm" onClick={() => setSendingBack(e)} aria-label={`Send back ${e.volunteerName}’s hours`}>
                    Send back
                  </Button>
                  <Button size="sm" disabled={review.pending} onClick={() => approve(e)} aria-label={`Approve ${fmtHours(e.hours)} hours for ${e.volunteerName}`}>
                    Approve
                  </Button>
                </li>
              ))}
              {list.length > 5 && (
                <li className="px-4 py-3 text-sm">
                  <Link to="/admin/approvals" className="text-text-2 hover:text-foreground">
                    See all {fmtCount(list.length)} in Hour approvals
                  </Link>
                </li>
              )}
            </ul>
          )}
        </li>
        {gaps.slice(0, 3).map((g) => (
          <li key={g.activityId} className="flex items-center gap-4 px-6 py-3">
            <UserSearch className="size-[18px] shrink-0 text-muted-foreground" strokeWidth={1.5} aria-hidden />
            <p className="min-w-0 flex-1 text-sm">
              <span className="font-medium">{g.activityTitle}</span>{' '}
              <span className="text-text-2">
                on {fmtDay(g.startAt)} has no one confirmed with {g.missingSkills.join(', ')}
              </span>
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/admin/activities/${g.activityId}`}>Find volunteers</Link>
            </Button>
          </li>
        ))}
      </ul>
      <SendBack
        entry={sendingBack}
        onClose={() => setSendingBack(null)}
        onSent={() => {
          setSendingBack(null)
          changed()
        }}
      />
    </section>
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
                <NeedsYou gaps={s.skillGaps} onChange={() => void q.reload()} />

                <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                  {/* Once per login, left to right in reading order; gaps shrink (40, 30, 20ms) so it lands as one wave. */}
                  <Stat label="Approved hours" value={fmtHours(s.totalApprovedHours)} note="All time, approved only" intro={entrance(w, 0, 10)} />
                  <Stat label="Volunteers" value={fmtCount(s.volunteerCount)} note="With a ServeHub account" intro={entrance(w, 40, 8)} />
                  <Stat label="Upcoming activities" value={fmtCount(s.upcomingActivities)} note="Open and scheduled" intro={entrance(w, 70, 8)} />
                  <Stat label="Waiting for approval" value={fmtCount(s.pendingApprovals)} note="Hour logs to review" intro={entrance(w, 90, 8)} />
                </div>

                <div className={cn('grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]', panels.className)} style={panels.style}>
                  <Panel
                    className="flex flex-col"
                    title="Approved hours by month"
                    action={sixMonthTotal > 0 && <span className="text-sm text-muted-foreground tabular-nums">{fmtHours(sixMonthTotal)} hours in 6 months</span>}
                  >
                    {sixMonthTotal === 0 ? (
                      <EmptyState className="flex-1" icon={<ChartColumn />} title="No approved hours yet" description="Once you approve logged hours, they show up here by month." />
                    ) : (
                      <>
                        <ChartTable caption="Approved hours by month" unit="hours" rows={months.map((m) => ({ label: m.label, value: m.hours }))} />
                        <MonthChart months={months} />
                      </>
                    )}
                  </Panel>

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
