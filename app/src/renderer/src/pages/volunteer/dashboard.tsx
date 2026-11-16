/** Volunteer home: progress toward the hour goal, upcoming shifts, and recommendations. */
import { Link } from 'react-router'
import { CalendarDays, MapPin, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Loader, PageBody, PageHeader, Panel, EmptyState } from '@/components/page'
import { Meter, Pill, SignupPill } from '@/components/status'
import { DateTile, SignupButton } from '@/components/activity'
import { useQuery, useWelcome } from '@/lib/hooks'
import { useUser } from '@/lib/session'
import { fmtDay, fmtHours, fmtRange, spotsLabel } from '@/lib/format'
import { cn, entrance } from '@/lib/utils'
import type { Activity, Recommendation } from '@shared/types'

function When({ a }: { a: Activity }): React.JSX.Element {
  return (
    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
      <li className="flex items-center gap-2">
        <CalendarDays className="size-4 shrink-0" aria-hidden />
        <span className="tabular">
          {fmtDay(a.startAt)} · {fmtRange(a.startAt, a.endAt)}
        </span>
      </li>
      <li className="flex items-center gap-2">
        <MapPin className="size-4 shrink-0" aria-hidden />
        <span className="truncate">{a.location}</span>
      </li>
    </ul>
  )
}

/** The top match: big score, then each factor's points so the volunteer sees why. */
function Featured({ rec, onChange, fill }: { rec: Recommendation; onChange: () => Promise<unknown>; fill: boolean }): React.JSX.Element {
  const a = rec.activity
  return (
    <article className="flex flex-col rounded-xl border bg-card p-6" style={{ viewTransitionName: `rec-${a.id}` }}>
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <Pill tone="outline">{a.type}</Pill>
          <h3 className="mt-3 text-xl font-semibold tracking-tight">
            <Link to={`/activities/${a.id}`} className="hover:underline">
              {a.title}
            </Link>
          </h3>
          <When a={a} />
        </div>
        <p className="shrink-0 text-right">
          <span className="text-5xl font-semibold tracking-tight tabular">{rec.score}</span>
          <span className="text-2xl font-semibold">%</span>
          <span className="block text-xs text-muted-foreground">best match for you</span>
        </p>
      </div>
      <dl className="mt-6 space-y-3">
        {rec.factors.map((f, i) => (
          <div key={f.label}>
            <div className="flex justify-between gap-4 text-sm">
              <dt>
                <span className="font-medium">{f.label}</span> <span className="text-muted-foreground">· {f.note}</span>
              </dt>
              <dd className="shrink-0 font-medium tabular">
                {f.points} / {f.max}
              </dd>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-track">
              {/* On the post-login entrance the bars fill once; gaps shrink (120, 190, 240ms) so they read as one wave. */}
              <div
                className={cn('h-full w-full rounded-full bg-primary', fill && 'animate-fill')}
                style={{
                  transform: `translateX(${(f.points / f.max) * 100 - 100}%)`,
                  ...(fill && { animationDelay: `${[120, 190, 240][i]}ms`, animationDuration: '600ms' })
                }}
              />
            </div>
          </div>
        ))}
      </dl>
      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
        <span className="text-sm text-muted-foreground tabular">{spotsLabel(a)}</span>
        <SignupButton activity={a} onChange={onChange} />
      </div>
    </article>
  )
}

const SHADES = ['bg-primary', 'bg-primary/65', 'bg-primary/35']

function RunnerUp({ rec, onChange }: { rec: Recommendation; onChange: () => Promise<unknown> }): React.JSX.Element {
  const a = rec.activity
  const top = [...rec.factors].sort((x, y) => y.points / y.max - x.points / x.max)[0]
  return (
    <article className="rounded-xl border bg-card p-4" style={{ viewTransitionName: `rec-${a.id}` }}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold">
            <Link to={`/activities/${a.id}`} className="hover:underline">
              {a.title}
            </Link>
          </h3>
          <p className="truncate text-sm text-muted-foreground tabular">
            {fmtDay(a.startAt)} · {fmtRange(a.startAt, a.endAt)}
          </p>
        </div>
        <span className="shrink-0 text-sm font-semibold tabular">{rec.score}%</span>
      </div>
      {/* One bar, three segments (skills, availability, interest), each as wide as its points out of 100. */}
      <div className="mt-1.5 flex h-1.5 gap-px overflow-hidden rounded-full bg-track" role="img" aria-label={`${rec.score}% match`}>
        {rec.factors.map((f, i) => (
          <span key={f.label} className={SHADES[i]} style={{ width: `${f.points}%` }} />
        ))}
      </div>
      {top && <p className="mt-2 text-sm text-accent-foreground">{top.note}</p>}
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground tabular">{spotsLabel(a)}</span>
        <SignupButton activity={a} onChange={onChange} size="sm" />
      </div>
    </article>
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
        subtitle="Here’s what’s next and how close you are to your goal."
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
            const pct = Math.min(100, Math.round((d.approvedHours / d.hourGoal) * 100))
            return (
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <Panel title="Your service hours" description={`Your goal: ${fmtHours(d.hourGoal)} hours`} {...lead}>
                    <p className="flex items-baseline gap-2">
                      <span className="text-4xl font-semibold tracking-tight tabular">{fmtHours(d.approvedHours)}</span>
                      <span className="text-sm text-muted-foreground">of {fmtHours(d.hourGoal)} hours approved</span>
                    </p>
                    <div className="mt-4">
                      {/* The bar fills as the panel settles: cause (panel lands), then effect (progress shows). */}
                      <Meter value={d.approvedHours} max={d.hourGoal} label="Approved hours toward your goal" introDelay={welcome ? 220 : undefined} />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {left > 0 ? `${fmtHours(left)} more hours to reach your goal.` : 'You reached your goal. Nice work!'}
                      {d.pendingHours > 0 && ` ${fmtHours(d.pendingHours)} hours are waiting for approval.`}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Pill tone="green">{pct}% of goal</Pill>
                      {d.pendingHours > 0 && <Pill tone="amber">{fmtHours(d.pendingHours)} h pending</Pill>}
                    </div>
                  </Panel>

                  <Panel
                    {...next}
                    title="Upcoming shifts"
                    action={
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/shifts">See all</Link>
                      </Button>
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
                      <ul className="space-y-3">
                        {d.upcoming.slice(0, 3).map((a) => (
                          <li key={a.id} className="flex items-center gap-3" style={{ viewTransitionName: `upcoming-${a.id}` }}>
                            <DateTile stamp={a.startAt} />
                            <div className="min-w-0 flex-1">
                              <Link to={`/activities/${a.id}`} className="block truncate font-medium hover:underline">
                                {a.title}
                              </Link>
                              <p className="truncate text-sm text-muted-foreground tabular">
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
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <div>
                      <h2 id="recs" className="text-lg font-semibold">
                        Recommended for you
                      </h2>
                      <p className="text-sm text-muted-foreground">Ranked by your skills, free times, and interests.</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/profile">Edit my skills</Link>
                    </Button>
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
                      <Featured rec={d.recommendations[0]!} onChange={q.reload} fill={welcome} />
                      {d.recommendations.length > 1 && (
                        <div className="flex flex-col gap-4">
                          {d.recommendations.slice(1).map((r) => (
                            <RunnerUp key={r.activity.id} rec={r} onChange={q.reload} />
                          ))}
                        </div>
                      )}
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
