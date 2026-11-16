/** Volunteer home: progress toward the hour goal, upcoming shifts, and recommendations. */
import { Link } from 'react-router'
import { CalendarDays, Info, MapPin, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Loader, PageBody, PageHeader, Panel, EmptyState } from '@/components/page'
import { SignupPill } from '@/components/status'
import { DateTile, SignupButton } from '@/components/activity'
import { SpotsRow } from '@/components/slots'
import { useQuery, useWelcome } from '@/lib/hooks'
import { useUser } from '@/lib/session'
import { cellCounts, fmtDay, fmtHours, fmtRange } from '@/lib/format'
import { cn, entrance } from '@/lib/utils'
import type { Activity, Recommendation } from '@shared/types'

/** One cell per goal hour: approved fills green, hours waiting for a coordinator are hatched. */
function HourCells({ approved, pending, goal }: { approved: number; pending: number; goal: number }): React.JSX.Element {
  const c = cellCounts(approved, pending, goal)
  return (
    <div
      className="grid grid-cols-20 gap-1"
      role="meter"
      aria-label="Approved hours toward your goal"
      aria-valuemin={0}
      aria-valuemax={goal}
      aria-valuenow={Math.min(approved, goal)}
      aria-valuetext={`${fmtHours(approved)} of ${fmtHours(goal)} hours approved${pending ? `, ${fmtHours(pending)} waiting for approval` : ''}`}
    >
      {Array.from({ length: c.cells }, (_, i) => (
        <span key={i} className={cn('h-5 rounded-[4px]', i < c.approved ? 'bg-primary' : i < c.approved + c.pending ? 'cell-pending' : 'bg-track')} />
      ))}
    </div>
  )
}

function When({ a }: { a: Activity }): React.JSX.Element {
  return (
    <ul className="mt-3 space-y-1.5 text-sm text-text-2">
      <li className="flex items-center gap-2.5">
        <CalendarDays className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.5} aria-hidden />
        <span className="tabular-nums">
          {fmtDay(a.startAt)} · {fmtRange(a.startAt, a.endAt)}
        </span>
      </li>
      <li className="flex min-w-0 items-center gap-2.5">
        <MapPin className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.5} aria-hidden />
        <span className="truncate">{a.location}</span>
      </li>
    </ul>
  )
}

/** The top match: big score, then one line per factor so the volunteer sees why. */
function Featured({ rec, onChange }: { rec: Recommendation; onChange: () => Promise<unknown> }): React.JSX.Element {
  const a = rec.activity
  return (
    <article className="flex flex-col rounded-2xl border bg-card p-6" style={{ viewTransitionName: `rec-${a.id}` }}>
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{a.type}</p>
          <h3 className="mt-0.5 text-xl font-medium">
            <Link to={`/activities/${a.id}`} className="hover:underline">
              {a.title}
            </Link>
          </h3>
          <When a={a} />
        </div>
        <p className="shrink-0 text-right">
          <span className="text-5xl font-medium tracking-[-0.02em] tabular-nums">{rec.score}%</span>
          <span className="mt-1 block text-sm text-muted-foreground">best match for you</span>
        </p>
      </div>
      <dl className="mt-5 divide-y border-y">
        {rec.factors.map((f) => (
          <div key={f.label} className="grid grid-cols-[88px_minmax(0,1fr)_72px_40px] items-center gap-3 py-2 text-sm">
            <dt className="font-medium">{f.label}</dt>
            <dd className="truncate text-muted-foreground" title={f.note}>
              {f.note}
            </dd>
            <dd className="h-1 overflow-hidden rounded-full bg-track" aria-hidden>
              <div className="h-full rounded-full bg-muted-foreground" style={{ width: `${(f.points / f.max) * 100}%` }} />
            </dd>
            <dd className="text-right text-text-2 tabular-nums">
              {f.points}/{f.max}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
        <SpotsRow confirmed={a.confirmed} capacity={a.capacity} waitlisted={a.waitlisted} />
        <SignupButton activity={a} onChange={onChange} />
      </div>
    </article>
  )
}

function RunnerUp({ rec, onChange }: { rec: Recommendation; onChange: () => Promise<unknown> }): React.JSX.Element {
  const a = rec.activity
  const top = [...rec.factors].sort((x, y) => y.points / y.max - x.points / x.max)[0]
  return (
    <article className="rounded-2xl border bg-card p-5" style={{ viewTransitionName: `rec-${a.id}` }}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="truncate font-medium">
          <Link to={`/activities/${a.id}`} className="hover:underline">
            {a.title}
          </Link>
        </h3>
        <span className="shrink-0 text-sm text-text-2 tabular-nums">{rec.score}% match</span>
      </div>
      <p className="mt-0.5 truncate text-sm text-muted-foreground tabular-nums">
        {fmtDay(a.startAt)} · {fmtRange(a.startAt, a.endAt)}
      </p>
      {top && <p className="mt-3 text-sm text-text-2">{top.note}</p>}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <SpotsRow confirmed={a.confirmed} capacity={a.capacity} waitlisted={a.waitlisted} />
        <SignupButton activity={a} onChange={onChange} size="sm" />
      </div>
    </article>
  )
}

/** Shown in the runner-up column when only one shift clears the 50% bar, instead of padding with weak matches. */
function NothingElse(): React.JSX.Element {
  return (
    <div className="rounded-2xl border border-dashed p-5 text-sm">
      <p className="font-medium">Nothing else fits you well right now</p>
      <p className="mt-1 text-muted-foreground">Other open shifts are under a 50% match for your skills and free times.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" asChild>
          <Link to="/activities">Browse all activities</Link>
        </Button>
        <Button size="sm" variant="ghost" asChild>
          <Link to="/profile">Add free times</Link>
        </Button>
      </div>
    </div>
  )
}

export function VolunteerDashboard(): React.JSX.Element {
  const user = useUser()
  const q = useQuery('dashboard.volunteer')
  const welcome = useWelcome()
  const firstName = user.fullName.split(' ')[0]
  // Once per login: the goal panel leads, upcoming shifts and recommendations follow with shorter gaps and smaller rises.
  const lead = entrance(welcome, 0, 12)
  const next = entrance(welcome, 50, 8)
  const recs = entrance(welcome, 90, 6)

  return (
    <>
      <PageHeader
        title={`Hi, ${firstName}`}
        subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/activities">Find activities</Link>
            </Button>
            <Button asChild>
              <Link to="/hours">Log hours</Link>
            </Button>
          </>
        }
      />
      <PageBody>
        <Loader query={q}>
          {(d) => {
            const left = Math.max(0, d.hourGoal - d.approvedHours)
            return (
              <div className="space-y-10">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                  <Panel title="Service hours" action={<span className="text-sm text-muted-foreground">Goal: {fmtHours(d.hourGoal)} hours</span>} {...lead}>
                    <p className="flex items-baseline gap-2">
                      <span className="text-[56px] leading-none font-medium tracking-[-0.03em] tabular-nums">{fmtHours(d.approvedHours)}</span>
                      <span className="text-sm text-text-2">of {fmtHours(d.hourGoal)} hours approved</span>
                    </p>
                    <div className="mt-6">
                      <HourCells approved={d.approvedHours} pending={d.pendingHours} goal={d.hourGoal} />
                    </div>
                    {left === 0 ? (
                      // The moment the product builds toward: say it plainly and hand over the next step.
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-success-bg/60 p-4">
                        <p className="text-sm">
                          <span className="block font-medium">You reached your {fmtHours(d.hourGoal)}-hour goal</span>
                          <span className="block text-text-2">Your certificate is ready, with a code anyone can verify.</span>
                        </p>
                        <Button size="sm" asChild>
                          <Link to="/certificate">Get my certificate</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm">
                        <p className="text-muted-foreground">{fmtHours(left)} more hours to reach your goal</p>
                        <p className="flex items-center gap-4 text-xs text-text-2">
                          <span className="flex items-center gap-1.5">
                            <span className="size-3 rounded-[3px] bg-primary" aria-hidden /> Approved
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="cell-pending size-3 rounded-[3px]" aria-hidden /> Waiting{d.pendingHours > 0 ? ` (${fmtHours(d.pendingHours)})` : ''}
                          </span>
                        </p>
                      </div>
                    )}
                  </Panel>

                  <Panel
                    {...next}
                    title="Upcoming shifts"
                    action={
                      <Link to="/shifts" className="text-sm text-text-2 hover:text-foreground" aria-label="See all your shifts">
                        See all
                      </Link>
                    }
                  >
                    {d.upcoming.length === 0 ? (
                      <EmptyState
                        className="py-6"
                        icon={<CalendarDays />}
                        title="No shifts yet"
                        description="Pick one from the recommendations below or browse all activities."
                      />
                    ) : (
                      <ul className="divide-y">
                        {d.upcoming.slice(0, 3).map((a) => (
                          <li key={a.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0" style={{ viewTransitionName: `upcoming-${a.id}` }}>
                            <DateTile stamp={a.startAt} />
                            <div className="min-w-0 flex-1">
                              <Link to={`/activities/${a.id}`} className="block truncate text-sm font-medium hover:underline">
                                {a.title}
                              </Link>
                              <p className="truncate text-sm text-muted-foreground tabular-nums">
                                {/* The date tile beside this is aria-hidden, so screen readers get the full date here. */}
                                <span className="sr-only">{fmtDay(a.startAt)}</span>
                                <span aria-hidden>{fmtDay(a.startAt).split(',')[0]}</span> {fmtRange(a.startAt, a.endAt)} · {a.location}
                              </p>
                            </div>
                            <SignupPill status={a.mySignup!} position={a.myWaitlistPosition} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </Panel>
                </div>

                {/* Named so the section glides down when Upcoming grows, instead of jumping. */}
                <section aria-labelledby="recs" className={recs.className} style={{ ...recs.style, viewTransitionName: 'recs' }}>
                  <div className="mb-4 flex items-baseline justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <h2 id="recs" className="text-[15px] font-medium">
                        Recommended for you
                      </h2>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="grid size-6 place-items-center rounded-md text-muted-foreground hover:text-foreground" aria-label="How matches work">
                            <Info className="size-4" strokeWidth={1.5} aria-hidden />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-[260px]">
                          A match adds up to 100 points: up to 50 for your skills, 30 for your free times and 20 for your interests. Only 50% or better is shown.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Link to="/profile" className="text-sm text-text-2 hover:text-foreground">
                      Edit my skills
                    </Link>
                  </div>
                  {d.recommendations.length === 0 ? (
                    <EmptyState
                      icon={<Sparkles />}
                      title="Nothing fits you well right now"
                      description="No open shift is a 50% match or better. Browse all activities, or add skills and free times to your profile."
                    />
                  ) : (
                    // Spotlight: the best match gets the room and shows its whole score; runners-up stay compact.
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                      <Featured rec={d.recommendations[0]!} onChange={q.reload} />
                      <div className="flex flex-col gap-4">
                        {d.recommendations.length > 1 ? (
                          d.recommendations.slice(1).map((r) => <RunnerUp key={r.activity.id} rec={r} onChange={q.reload} />)
                        ) : (
                          <NothingElse />
                        )}
                      </div>
                    </div>
                  )}
                </section>
              </div>
            )
          }}
        </Loader>
      </PageBody>
    </>
  )
}
