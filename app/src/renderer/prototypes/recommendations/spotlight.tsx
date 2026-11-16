/** Spotlight (axis: hierarchy). The best match gets the room and shows its whole score; runners-up stay compact. */
import { CalendarDays, MapPin } from 'lucide-react'
import { Pill } from '@/components/status'
import { RECS, spots, useSignup, type Rec } from './data'
import { ScoreBar, SignupControl } from './shared'

function When({ rec }: { rec: Rec }): React.JSX.Element {
  return (
    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
      <li className="flex items-center gap-2">
        <CalendarDays className="size-4 shrink-0" aria-hidden />
        <span className="tabular">
          {rec.day} · {rec.time}
        </span>
      </li>
      <li className="flex items-center gap-2">
        <MapPin className="size-4 shrink-0" aria-hidden />
        <span className="truncate">{rec.place}</span>
      </li>
    </ul>
  )
}

function Featured({ rec }: { rec: Rec }): React.JSX.Element {
  const s = useSignup(rec)
  return (
    <article className="flex flex-col rounded-xl border bg-card p-6">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <Pill tone="outline">{rec.type}</Pill>
          <h3 className="mt-3 text-xl font-semibold tracking-tight">{rec.title}</h3>
          <When rec={rec} />
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
              {/* Bars fill once as the card lands; gaps shrink (120, 190, 240ms) so they read as one wave. */}
              <div
                className="h-full w-full animate-fill rounded-full bg-primary"
                style={{ transform: `translateX(${(f.points / f.max) * 100 - 100}%)`, animationDelay: `${[120, 190, 240][i]}ms`, animationDuration: '600ms' }}
              />
            </div>
          </div>
        ))}
      </dl>
      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
        <span className="text-sm text-muted-foreground tabular">{spots(s.left, rec.capacity)}</span>
        <SignupControl joined={s.joined} join={s.join} title={rec.title} size="default" />
      </div>
    </article>
  )
}

function RunnerUp({ rec }: { rec: Rec }): React.JSX.Element {
  const s = useSignup(rec)
  const top = [...rec.factors].sort((a, b) => b.points / b.max - a.points / a.max)[0]
  return (
    <article className="rounded-xl border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold">{rec.title}</h3>
          <p className="truncate text-sm text-muted-foreground tabular">
            {rec.day} · {rec.time}
          </p>
        </div>
        <span className="shrink-0 text-sm font-semibold tabular">{rec.score}%</span>
      </div>
      <ScoreBar factors={rec.factors} label={`${rec.score}% match`} />
      <p className="mt-2 text-sm text-accent-foreground">{top.note}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground tabular">{spots(s.left, rec.capacity)}</span>
        <SignupControl joined={s.joined} join={s.join} title={rec.title} />
      </div>
    </article>
  )
}

export function Spotlight(): React.JSX.Element {
  const [best, ...rest] = RECS
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <Featured rec={best} />
      <div className="flex flex-col gap-4">
        {rest.map((r) => (
          <RunnerUp key={r.id} rec={r} />
        ))}
      </div>
    </div>
  )
}
