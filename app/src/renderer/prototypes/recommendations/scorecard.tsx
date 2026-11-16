/** Scorecard (axis: explanation model). Equal cards whose body is the scoring rule itself, as a checklist with points. */
import { Check, CircleDashed, Minus } from 'lucide-react'
import { Pill } from '@/components/status'
import { RECS, spots, useSignup, type Factor, type Rec } from './data'
import { SignupControl } from './shared'

/** Full, partial, or none. The note always says it in words, so the icon never carries meaning alone. */
function Mark({ f }: { f: Factor }): React.JSX.Element {
  if (f.points === f.max) return <Check className="size-4 shrink-0 text-primary" aria-hidden />
  if (f.points > 0) return <CircleDashed className="size-4 shrink-0 text-muted-foreground" aria-hidden />
  return <Minus className="size-4 shrink-0 text-muted-foreground" aria-hidden />
}

function Card({ rec }: { rec: Rec }): React.JSX.Element {
  const s = useSignup(rec)
  return (
    <article className="flex flex-col rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <Pill tone="outline">{rec.type}</Pill>
        <span className="text-xs text-muted-foreground tabular">{rec.day}</span>
      </div>
      <h3 className="mt-3 font-semibold">{rec.title}</h3>
      <p className="text-sm text-muted-foreground tabular">
        {rec.time} · {rec.place}
      </p>
      <ul className="mt-4 space-y-2 border-t pt-3 text-sm" aria-label="How this match was scored">
        {rec.factors.map((f) => (
          <li key={f.label} className="flex items-start gap-2">
            <Mark f={f} />
            <span className="min-w-0 flex-1">{f.note}</span>
            <span className="shrink-0 text-muted-foreground tabular">
              +{f.points}
              <span className="sr-only"> of {f.max} points</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 flex justify-between border-t pt-2 text-sm font-semibold tabular">
        Match <span>{rec.score}%</span>
      </p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <span className="text-xs text-muted-foreground tabular">{spots(s.left, rec.capacity)}</span>
        <SignupControl joined={s.joined} join={s.join} title={rec.title} />
      </div>
    </article>
  )
}

export function Scorecard(): React.JSX.Element {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {RECS.map((r) => (
        <Card key={r.id} rec={r} />
      ))}
    </div>
  )
}
