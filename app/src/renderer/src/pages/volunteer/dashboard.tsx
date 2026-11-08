/** Volunteer home: progress toward the hour goal, upcoming shifts, and recommendations. */
import { Link } from 'react-router'
import { CalendarDays, MapPin, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Loader, PageBody, PageHeader, Panel, EmptyState } from '@/components/page'
import { Meter, Pill, SignupPill } from '@/components/status'
import { DateTile, SignupButton } from '@/components/activity'
import { useQuery } from '@/lib/hooks'
import { useUser } from '@/lib/session'
import { fmtDay, fmtHours, fmtRange } from '@/lib/format'

export function VolunteerDashboard(): React.JSX.Element {
  const user = useUser()
  const q = useQuery('dashboard.volunteer')
  const firstName = user.fullName.split(' ')[0]

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
                <div className="grid gap-5 lg:grid-cols-2">
                  <Panel title="Your service hours" description={`Your goal: ${d.hourGoal} hours`}>
                    <p className="flex items-baseline gap-2">
                      <span className="text-4xl font-semibold tracking-tight tabular">{fmtHours(d.approvedHours)}</span>
                      <span className="text-sm text-muted-foreground">of {d.hourGoal} hours approved</span>
                    </p>
                    <div className="mt-4">
                      <Meter value={d.approvedHours} max={d.hourGoal} label="Approved hours toward your goal" />
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
                          <li key={a.id} className="flex items-center gap-3">
                            <DateTile stamp={a.startAt} />
                            <div className="min-w-0 flex-1">
                              <Link to={`/activities/${a.id}`} className="block truncate font-medium hover:underline">
                                {a.title}
                              </Link>
                              <p className="truncate text-sm text-muted-foreground tabular">
                                {fmtDay(a.startAt).split(',')[0]} {fmtRange(a.startAt, a.endAt)} · {a.location}
                              </p>
                            </div>
                            <SignupPill status={a.mySignup!} position={a.myWaitlistPosition} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </Panel>
                </div>

                <section aria-labelledby="recs">
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
                      title="No recommendations right now"
                      description="You’ve joined every upcoming activity, or none are scheduled yet."
                    />
                  ) : (
                    <div className="grid gap-4 md:grid-cols-3">
                      {d.recommendations.map((r) => (
                        <article key={r.activity.id} className="flex flex-col rounded-xl border bg-card p-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <Pill tone={r.score >= 60 ? 'green' : 'gray'} className={r.score >= 60 ? 'bg-primary text-primary-foreground' : ''}>
                              {r.score}% match
                            </Pill>
                            <Pill tone="outline">{r.activity.type}</Pill>
                          </div>
                          <h3 className="mt-3 font-semibold">
                            <Link to={`/activities/${r.activity.id}`} className="hover:underline">
                              {r.activity.title}
                            </Link>
                          </h3>
                          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                              <CalendarDays className="size-4" aria-hidden />
                              <span className="tabular">
                                {fmtDay(r.activity.startAt)} · {fmtRange(r.activity.startAt, r.activity.endAt)}
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <MapPin className="size-4" aria-hidden />
                              <span className="truncate">{r.activity.location}</span>
                            </li>
                          </ul>
                          <ul className="mt-3 space-y-1 text-sm text-accent-foreground" aria-label="Why it matches">
                            {r.reasons.slice(0, 2).map((reason) => (
                              <li key={reason} className="flex items-start gap-1.5">
                                <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                                {reason}
                              </li>
                            ))}
                          </ul>
                          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                            <span className="text-sm text-muted-foreground tabular">
                              {r.activity.confirmed >= r.activity.capacity
                                ? r.activity.waitlisted > 0
                                  ? `Full · ${r.activity.waitlisted} waiting`
                                  : 'Full · waitlist open'
                                : `${r.activity.capacity - r.activity.confirmed} of ${r.activity.capacity} spots left`}
                            </span>
                            <SignupButton activity={r.activity} onChange={q.reload} size="sm" />
                          </div>
                        </article>
                      ))}
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
