/**
 * Unslopped volunteer dashboard. The hours card is the moment; Spotlight keeps its shape with quiet chrome.
 * Interactive: Log hours (dialog → hatched "waiting" cells), Sign up (slot fills, Undo in the toast), match explainer.
 */
import { useState } from 'react'
import { CalendarDays, Check, Info, MapPin, Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { entrance } from '@/lib/utils'
import { FEATURED, LOGGABLE, RUNNER_UP, VOLUNTEER as V, type Rec } from './data'
import { Card, Shell } from './shell'
import { SpotsRow } from './slots'

/** One cell per goal hour: approved fill green, hours waiting for a coordinator are hatched. */
function HourCells({ approved, pending, goal }: { approved: number; pending: number; goal: number }): React.JSX.Element {
  // shortcut: whole hours only and a 20-column grid; a 100-hour goal or half hours need a scaled grid before rollout.
  return (
    <div
      className="grid grid-cols-20 gap-1"
      role="meter"
      aria-label="Approved hours toward your goal"
      aria-valuemin={0}
      aria-valuemax={goal}
      aria-valuenow={approved}
      aria-valuetext={`${approved} of ${goal} hours approved${pending ? `, ${pending} waiting for approval` : ''}`}
    >
      {Array.from({ length: goal }, (_, i) => (
        <span
          key={i}
          className={`h-5 rounded-[4px] transition-colors duration-200 ${i < approved ? 'bg-primary' : i < approved + pending ? 'cell-pending' : 'bg-track'}`}
        />
      ))}
    </div>
  )
}

function LogHours({ open, onOpenChange, onLogged }: { open: boolean; onOpenChange: (o: boolean) => void; onLogged: (hours: number) => void }): React.JSX.Element {
  const [shift, setShift] = useState(0)
  const [hours, setHours] = useState(LOGGABLE[0]!.length)
  const max = LOGGABLE[shift]!.length
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="unslop sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Log hours</DialogTitle>
          <DialogDescription>A coordinator reviews every entry before it counts toward your goal.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onLogged(hours)
          }}
        >
          <fieldset>
            <legend className="text-sm font-medium">Which shift?</legend>
            <div className="mt-2 space-y-2">
              {LOGGABLE.map((s, i) => (
                <label
                  key={s.title}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors has-checked:border-foreground has-checked:bg-white has-checked:shadow-[inset_0_0_0_1px_var(--foreground)]"
                >
                  <input
                    type="radio"
                    name="shift"
                    className="accent-[var(--primary)]"
                    checked={shift === i}
                    onChange={() => {
                      setShift(i)
                      setHours((h) => Math.min(h, s.length))
                    }}
                  />
                  <span className="min-w-0 flex-1 text-sm">
                    <span className="block font-medium">{s.title}</span>
                    <span className="block text-muted-foreground">
                      {s.when} · {s.length} hour shift
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="mt-5">
            <Label htmlFor="log-hours">Hours</Label>
            <div className="mt-2 flex items-center gap-2">
              <Button type="button" variant="outline" size="icon" aria-label="Fewer hours" disabled={hours <= 0.5} onClick={() => setHours((h) => h - 0.5)}>
                <Minus strokeWidth={1.5} aria-hidden />
              </Button>
              <output id="log-hours" className="w-16 text-center text-2xl font-medium tabular-nums" aria-live="polite">
                {hours}
              </output>
              <Button type="button" variant="outline" size="icon" aria-label="More hours" disabled={hours >= max} onClick={() => setHours((h) => h + 0.5)}>
                <Plus strokeWidth={1.5} aria-hidden />
              </Button>
            </div>
            {/* Show why: the limit comes from the shift, not an arbitrary rule. */}
            <p className="mt-2 text-sm text-muted-foreground">This shift was {max} hours long, so you can log up to {max}.</p>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Send for approval</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/** Sign up flips to a confirmation in place; the sheet gains a filled slot and the toast offers Undo. */
function useSignup(rec: Rec): { joined: boolean; confirmed: number; toggle: () => void } {
  const [joined, setJoined] = useState(false)
  const toggle = (): void => {
    if (joined) return setJoined(false)
    setJoined(true)
    toast(`You’re signed up for ${rec.title}`, {
      description: `${rec.when}. It’s in My shifts.`,
      action: { label: 'Undo', onClick: () => setJoined(false) }
    })
  }
  return { joined, confirmed: rec.confirmed + (joined ? 1 : 0), toggle }
}

function SignupControl({ rec, joined, toggle, size }: { rec: Rec; joined: boolean; toggle: () => void; size?: 'sm' }): React.JSX.Element {
  if (joined)
    return (
      <span className="flex items-center gap-1.5 text-sm font-medium transition-[opacity,filter,scale] duration-200 ease-snappy starting:scale-95 starting:opacity-0 starting:blur-[2px]">
        <Check className="size-4 text-primary" strokeWidth={2} aria-hidden /> Signed up
      </span>
    )
  return (
    <Button size={size} variant="outline" onClick={toggle} aria-label={`Sign up for ${rec.title}`}>
      Sign up
    </Button>
  )
}

function Featured({ rec }: { rec: Rec }): React.JSX.Element {
  const s = useSignup(rec)
  return (
    <article className="flex flex-col rounded-2xl border bg-card p-6">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{rec.type}</p>
          <h3 className="mt-0.5 text-xl font-medium">{rec.title}</h3>
          <ul className="mt-3 space-y-1.5 text-sm text-[var(--text-2)]">
            <li className="flex items-center gap-2.5">
              <CalendarDays className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.5} aria-hidden />
              <span className="tabular-nums">{rec.when}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.5} aria-hidden />
              {rec.place}
            </li>
          </ul>
        </div>
        <p className="shrink-0 text-right">
          <span className="text-5xl font-medium tracking-[-0.02em] tabular-nums">{rec.score}%</span>
          <span className="mt-1 block text-sm text-muted-foreground">match for you</span>
        </p>
      </div>
      {/* One line per factor so the action stays above the fold at 1280 × 800. */}
      <dl className="mt-5 divide-y border-y">
        {rec.factors.map((f) => (
          <div key={f.label} className="grid grid-cols-[88px_minmax(0,1fr)_72px_40px] items-center gap-3 py-2 text-sm">
            <dt className="font-medium">{f.label}</dt>
            <dd className="truncate text-muted-foreground">{f.note}</dd>
            <dd className="h-1 overflow-hidden rounded-full bg-track" aria-hidden>
              <div className="h-full rounded-full bg-[#8a8a8a]" style={{ width: `${(f.points / f.max) * 100}%` }} />
            </dd>
            <dd className="text-right text-[var(--text-2)] tabular-nums">
              {f.points}/{f.max}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <SpotsRow confirmed={s.confirmed} capacity={rec.capacity} />
        <SignupControl rec={rec} joined={s.joined} toggle={s.toggle} />
      </div>
    </article>
  )
}

function RunnerUp({ rec }: { rec: Rec }): React.JSX.Element {
  const s = useSignup(rec)
  const top = [...rec.factors].sort((a, b) => b.points / b.max - a.points / a.max)[0]!
  return (
    <article className="rounded-2xl border bg-card p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="truncate font-medium">{rec.title}</h3>
        <span className="shrink-0 text-sm text-[var(--text-2)] tabular-nums">{rec.score}% match</span>
      </div>
      <p className="mt-0.5 truncate text-sm text-muted-foreground tabular-nums">{rec.when}</p>
      <p className="mt-3 text-sm text-[var(--text-2)]">{top.note}</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <SpotsRow confirmed={s.confirmed} capacity={rec.capacity} />
        <SignupControl rec={rec} joined={s.joined} toggle={s.toggle} size="sm" />
      </div>
    </article>
  )
}

const MIN_MATCH = 50 // same threshold as recommend() in the main process

export function UnslopVolunteer({ goalReached = false }: { goalReached?: boolean }): React.JSX.Element {
  const [pending, setPending] = useState(0)
  const [logging, setLogging] = useState(false)
  const approved = goalReached ? V.goal : V.approved
  const left = V.goal - approved
  // One entrance on arrival: the goal leads, the rest follow with shorter gaps and smaller rises.
  const lead = entrance(true, 0, 12)
  const next = entrance(true, 50, 8)
  const recs = entrance(true, 90, 6)
  return (
    <Shell
      role="volunteer"
      user={[V.name, V.email]}
      title="Dashboard"
      meta="Sunday, November 15"
      actions={
        <>
          <Button variant="outline">Find activities</Button>
          <Button onClick={() => setLogging(true)}>Log hours</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Card title="Service hours" aside={<span className="text-sm text-muted-foreground">Goal: {V.goal} hours</span>} {...lead}>
          <p className="flex items-baseline gap-2">
            <span className="text-[56px] leading-none font-medium tracking-[-0.03em] tabular-nums">{approved}</span>
            <span className="text-sm text-[var(--text-2)]">of {V.goal} hours approved</span>
          </p>
          <div className="mt-6">
            <HourCells approved={approved} pending={pending} goal={V.goal} />
          </div>
          {goalReached ? (
            // The moment the product builds toward: say it plainly and hand over the next step.
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#f0f7f2] p-4 transition-[opacity,translate] duration-300 ease-snappy starting:translate-y-1 starting:opacity-0">
              <p className="text-sm">
                <span className="block font-medium">You reached your {V.goal}-hour goal</span>
                <span className="block text-[var(--text-2)]">Your certificate is ready, with a code anyone can verify.</span>
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  Set a new goal
                </Button>
                <Button size="sm">Get my certificate</Button>
              </div>
            </div>
          ) : null}
          <div className={`mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm ${goalReached ? 'hidden' : ''}`}>
            <p className="text-muted-foreground">{left} more hours to reach your goal</p>
            <p className="flex items-center gap-4 text-xs text-[var(--text-2)]">
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-[3px] bg-primary" aria-hidden /> Approved
              </span>
              <span className="flex items-center gap-1.5">
                <span className="cell-pending size-3 rounded-[3px]" aria-hidden /> Waiting{pending ? ` (${pending})` : ''}
              </span>
            </p>
          </div>
        </Card>

        <Card
          title="Upcoming shifts"
          {...next}
          aside={
            <a href="#" className="text-sm text-[var(--text-2)] hover:text-foreground" aria-label="See all your shifts">
              See all
            </a>
          }
        >
          <ul className="divide-y">
            {V.upcoming.map((s) => (
              <li key={s.title} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <span className="w-10 shrink-0 text-center leading-tight">
                  <span className="block text-xs text-muted-foreground">{s.month}</span>
                  <span className="block text-lg font-medium tabular-nums">{s.day}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{s.title}</span>
                  <span className="block truncate text-sm text-muted-foreground" title={`${s.when} · ${s.place}`}>
                    {s.when} · {s.place}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1 text-xs text-[var(--text-2)]">
                  <Check className="size-3.5" strokeWidth={2} aria-hidden />
                  Confirmed
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <section aria-labelledby="u-recs" className={`mt-10 ${recs.className ?? ''}`} style={recs.style}>
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 id="u-recs" className="text-[15px] font-medium">
              Recommended for you
            </h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="grid size-6 place-items-center rounded-md text-muted-foreground hover:text-foreground" aria-label="How matches work">
                  <Info className="size-4" strokeWidth={1.5} aria-hidden />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[260px]">
                A match adds up to 100 points: up to 50 for your skills, 30 for your free times and 20 for your interests. Full shifts drop 25.
              </TooltipContent>
            </Tooltip>
          </div>
          <a href="#" className="text-sm text-[var(--text-2)] hover:text-foreground">
            Edit my skills
          </a>
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <Featured rec={FEATURED} />
          <div className="flex flex-col gap-4">
            {/* Matches under 50% aren't recommended (Winter Coat Drive is 24%), so the second slot says so instead of padding. */}
            {RUNNER_UP.score >= MIN_MATCH ? (
              <RunnerUp rec={RUNNER_UP} />
            ) : (
              <div className="rounded-2xl border border-dashed p-5 text-sm">
                <p className="font-medium">Nothing else fits you well this week</p>
                <p className="mt-1 text-muted-foreground">Other open shifts are under a 50% match for your skills and free times.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline">
                    Browse all activities
                  </Button>
                  <Button size="sm" variant="ghost">
                    Add free times
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <LogHours
        open={logging}
        onOpenChange={setLogging}
        onLogged={(h) => {
          setPending((p) => p + Math.ceil(h))
          setLogging(false)
          toast('Hours sent for approval', { description: `${h} hours. You’ll get a notification when a coordinator reviews them.` })
        }}
      />
    </Shell>
  )
}
