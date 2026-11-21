/** Volunteer home: the next shift as a ticket, progress toward the hour goal, and shifts dealt by match. */
import { useRef } from 'react'
import { Link } from 'react-router'
import { CalendarDays, Check, Clock, Info, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Loader, PageBody, PageHeader, EmptyState } from '@/components/page'
import { SignupButton, TypeBand } from '@/components/activity'
import { Slots } from '@/components/slots'
import { useQuery, useWelcome } from '@/lib/hooks'
import { fmtDay, fmtHours, fmtRange, spotsLabel } from '@/lib/format'
import { typeGradient } from '@/lib/activity-style'
import { cn, entrance } from '@/lib/utils'
import type { Activity, Recommendation } from '@shared/types'

/** A card that tips toward the pointer. Stays flat for keyboard users and with reduced motion. */
function Tilt({ className, children }: { className?: string; children: React.ReactNode }): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null)
  const move = (e: React.PointerEvent): void => {
    const el = ref.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`
    el.style.setProperty('--gx', `${(x + 0.5) * 100}%`)
    el.style.setProperty('--gy', `${(y + 0.5) * 100}%`)
  }
  const reset = (): void => {
    if (ref.current) ref.current.style.transform = ''
  }
  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={reset} className={cn('group relative transition-transform duration-200 ease-snappy', className)}>
      {children}
      {/* Glare that follows the pointer. */}
      <span
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{ background: 'radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgb(255 255 255 / 0.2), transparent 55%)' }}
        aria-hidden
      />
    </div>
  )
}

/** "today", "tomorrow", "in 5 days": how soon a shift starts, by calendar day. */
function soon(stamp: string): string {
  const day = (d: Date): number => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000
  const n = day(new Date(stamp)) - day(new Date())
  return n <= 0 ? 'today' : n === 1 ? 'tomorrow' : `in ${n} days`
}

/** The next shift as a ticket: a stub with the date, the body with the details. */
function Ticket({ a, more }: { a: Activity; more: number }): React.JSX.Element {
  const d = new Date(a.startAt)
  return (
    <Tilt className="rounded-2xl">
      <section className="flex h-full overflow-hidden rounded-2xl text-white" style={{ background: typeGradient(a.type) }} aria-label="Your next shift">
        <div className="flex w-28 shrink-0 flex-col items-center justify-center border-r border-dashed border-white/40 py-6" aria-hidden>
          <span className="text-sm text-white/85">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
          <span className="text-5xl font-medium tabular-nums">{d.getDate()}</span>
          <span className="text-sm text-white/85">{d.toLocaleDateString('en-US', { weekday: 'long' })}</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col p-6">
          <p className="font-mono text-[11px] text-white/85">Your next shift · {soon(a.startAt)}</p>
          <h2 className="mt-1 font-serif text-[28px] leading-tight">
            <Link to={`/activities/${a.id}`} className="underline-offset-4 hover:underline">
              {a.title}
            </Link>
          </h2>
          <p className="mt-1 truncate text-sm text-white/90">
            <span className="sr-only">{fmtDay(a.startAt)}, </span>
            {fmtRange(a.startAt, a.endAt)} · {a.location}
          </p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4 text-sm">
            <span className="flex items-center gap-1.5">
              {a.mySignup === 'confirmed' ? <Check className="size-4" strokeWidth={2.5} aria-hidden /> : <Clock className="size-4" strokeWidth={2} aria-hidden />}
              {a.mySignup === 'confirmed' ? 'Spot confirmed' : `Waitlist #${a.myWaitlistPosition ?? '?'}`}
            </span>
            {more > 0 && (
              <Link to="/shifts" className="text-white/90 underline-offset-4 hover:underline">
                +{more} more {more === 1 ? 'shift' : 'shifts'}
              </Link>
            )}
          </div>
        </div>
      </section>
    </Tilt>
  )
}

/**
 * Hours toward the goal as a ring: approved in the accent, hours waiting for a coordinator in pale green.
 * On the first view after login the arcs fill from zero.
 */
function HoursRing({ approved, pending, goal, intro }: { approved: number; pending: number; goal: number; intro: boolean }): React.JSX.Element {
  const a = Math.min(100, (approved / goal) * 100)
  const p = Math.min(100, ((approved + pending) / goal) * 100)
  const arc = (len: number, color: string): React.JSX.Element => (
    <circle
      cx="56"
      cy="56"
      r="48"
      fill="none"
      stroke={color}
      strokeWidth="10"
      strokeLinecap={len > 0 && len < 100 ? 'round' : 'butt'}
      pathLength={100}
      strokeDasharray={`${len} 100`}
      className={intro ? 'animate-ring' : undefined}
    />
  )
  return (
    <div
      className="relative grid size-28 shrink-0 place-items-center"
      role="meter"
      aria-label="Approved hours toward your goal"
      aria-valuemin={0}
      aria-valuemax={goal}
      aria-valuenow={Math.min(approved, goal)}
      aria-valuetext={`${fmtHours(approved)} of ${fmtHours(goal)} hours approved${pending ? `, ${fmtHours(pending)} waiting for approval` : ''}`}
    >
      <svg viewBox="0 0 112 112" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx="56" cy="56" r="48" fill="none" stroke="var(--track)" strokeWidth="10" />
        {p > a && arc(p, 'var(--pending-a)')}
        {a > 0 && arc(a, 'var(--primary)')}
      </svg>
      <span className="text-3xl font-medium tabular-nums">{fmtHours(approved)}</span>
    </div>
  )
}

/** One recommended shift: its type band and score, the reason it fits, and the points behind the score. */
function Dealt({ rec, best, onChange }: { rec: Recommendation; best: boolean; onChange: () => Promise<unknown> }): React.JSX.Element {
  const a = rec.activity
  const top = [...rec.factors].sort((x, y) => y.points / y.max - x.points / x.max)[0]
  return (
    <article
      className="flex flex-col overflow-hidden rounded-2xl border bg-card transition-colors duration-150 hover:border-foreground/15"
      style={{ viewTransitionName: `rec-${a.id}` }}
    >
      <TypeBand type={a.type} badge={`${rec.score}% match`} />
      <div className="flex flex-1 flex-col p-4">
        <p className={cn('font-mono text-[11px]', best ? 'text-primary' : 'text-muted-foreground')}>{best ? 'Best match for you' : a.type}</p>
        <h3 className="mt-0.5 font-medium">
          <Link to={`/activities/${a.id}`} className="hover:underline">
            {a.title}
          </Link>
        </h3>
        <p className="mt-0.5 text-xs text-text-2 tabular-nums">
          {fmtDay(a.startAt)} · {fmtRange(a.startAt, a.endAt)}
        </p>
        {top && <p className="mt-3 text-sm text-text-2">{top.note}</p>}
        {/* The whole score, so the match is never a black box. */}
        <dl className="mt-2 flex flex-wrap gap-x-3 text-xs text-muted-foreground tabular-nums">
          {rec.factors.map((f) => (
            <div key={f.label} className="flex gap-1">
              <dt>{f.label}</dt>
              <dd className="text-text-2">
                {f.points}/{f.max}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
          <Slots filled={a.confirmed} total={a.capacity} label={spotsLabel(a)} />
          <SignupButton activity={a} onChange={onChange} size="sm" />
        </div>
      </div>
    </article>
  )
}

/** Fills the empty slots when fewer than three shifts clear the 50% bar, instead of padding with weak matches. */
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
  const q = useQuery('dashboard.volunteer')
  const welcome = useWelcome()
  // Once per login: the ticket leads, hours and recommendations follow with shorter gaps and smaller rises.
  const lead = entrance(welcome, 0, 12)
  const next = entrance(welcome, 50, 8)
  const recs = entrance(welcome, 90, 6)

  return (
    <>
      <PageHeader
        title={new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
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
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                  <div className={lead.className} style={lead.style}>
                    {d.upcoming.length > 0 ? (
                      <Ticket a={d.upcoming[0]!} more={d.upcoming.length - 1} />
                    ) : (
                      <EmptyState className="h-full py-8" icon={<CalendarDays />} title="No shifts yet" description="Pick one of the shifts dealt below, or browse all activities." />
                    )}
                  </div>

                  <section className={cn('flex items-center gap-6 rounded-2xl border bg-card p-6', next.className)} style={next.style} aria-labelledby="hours-title">
                    <HoursRing approved={d.approvedHours} pending={d.pendingHours} goal={d.hourGoal} intro={welcome} />
                    <div className="min-w-0">
                      <h2 id="hours-title" className="text-[15px] font-medium">
                        Service hours
                      </h2>
                      <p className="mt-1 text-sm text-text-2">
                        {fmtHours(d.approvedHours)} of {fmtHours(d.hourGoal)} approved.{' '}
                        {left > 0 ? `${fmtHours(left)} to go.` : 'Goal reached.'}
                      </p>
                      {d.pendingHours > 0 && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-text-2">
                          <span className="size-2.5 rounded-full bg-[var(--pending-a)]" aria-hidden /> {fmtHours(d.pendingHours)} waiting for approval
                        </p>
                      )}
                      {left === 0 && (
                        <Button size="sm" className="mt-3" asChild>
                          <Link to="/certificate">Get my certificate</Link>
                        </Button>
                      )}
                    </div>
                  </section>
                </div>

                {/* Named so the section glides down when the row above changes height, instead of jumping. */}
                <section aria-labelledby="recs" className={recs.className} style={{ ...recs.style, viewTransitionName: 'recs' }}>
                  <div className="mb-4 flex items-baseline justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <h2 id="recs" className="text-[15px] font-medium">
                        Dealt for you
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
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {d.recommendations.map((r, i) => (
                        <Dealt key={r.activity.id} rec={r} best={i === 0} onChange={q.reload} />
                      ))}
                      {d.recommendations.length < 3 && <NothingElse />}
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
