/** Ledger (axis: density). One ranked list in a single panel; the score breakdown opens per row on request. */
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { RECS, spots, useSignup, type Rec } from './data'
import { ScoreBar, SignupControl } from './shared'

function Row({ rec, rank }: { rec: Rec; rank: number }): React.JSX.Element {
  const [open, setOpen] = useState(false)
  const s = useSignup(rec)
  return (
    <li className="px-5 py-4">
      <div className="flex items-center gap-4">
        <span className="w-4 shrink-0 text-sm font-semibold text-muted-foreground tabular">{rank}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{rec.title}</p>
          <p className="truncate text-sm text-muted-foreground tabular">
            {rec.day} · {rec.time} · {rec.place}
          </p>
        </div>
        <div className="w-56 shrink-0">
          <p className="flex items-baseline justify-between gap-2 text-sm whitespace-nowrap tabular">
            <span className="font-semibold">{rec.score}% match</span>
            <span className="text-xs text-muted-foreground">{spots(s.left, rec.capacity)}</span>
          </p>
          <ScoreBar factors={rec.factors} label={`${rec.score}% match`} />
        </div>
        <Button variant="ghost" size="sm" aria-expanded={open} onClick={() => setOpen(!open)} className="shrink-0">
          Why?
          <ChevronDown className={cn('transition-transform duration-200 ease-snappy', open && 'rotate-180')} aria-hidden />
        </Button>
        <div className="flex w-24 shrink-0 justify-end">
          <SignupControl joined={s.joined} join={s.join} title={rec.title} />
        </div>
      </div>
      {/* Measured-height accordion via grid rows (the sanctioned height exception), 200ms ease-out. */}
      <div className={cn('grid transition-[grid-template-rows] duration-200 ease-snappy', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')} inert={!open}>
        <div className="overflow-hidden">
          <dl className="mt-3 ml-8 grid grid-cols-3 gap-3">
            {rec.factors.map((f) => (
              <div key={f.label} className="rounded-lg bg-muted px-3 py-2">
                <dt className="flex justify-between text-xs font-medium">
                  {f.label}
                  <span className="tabular">
                    {f.points}/{f.max}
                  </span>
                </dt>
                <dd className="mt-0.5 text-xs text-muted-foreground">{f.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </li>
  )
}

export function Ledger(): React.JSX.Element {
  return (
    <ol className="divide-y rounded-xl border bg-card">
      {RECS.map((r, i) => (
        <Row key={r.id} rec={r} rank={i + 1} />
      ))}
    </ol>
  )
}
