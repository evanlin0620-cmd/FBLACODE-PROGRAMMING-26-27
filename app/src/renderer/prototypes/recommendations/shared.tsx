/** Pieces every variant shares: the sign-up control and the stacked score bar. */
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Pill } from '@/components/status'
import type { Factor } from './data'

/** Sign up becomes a Confirmed pill; the pill settles in with a short fade and blur so it reads as one control changing. */
export function SignupControl({ joined, join, title, size = 'sm' }: { joined: boolean; join: () => void; title: string; size?: 'sm' | 'default' }): React.JSX.Element {
  if (joined)
    return (
      <Pill tone="green" className="transition-[opacity,filter,scale] duration-200 ease-snappy starting:scale-95 starting:opacity-0 starting:blur-[2px]">
        <Check className="size-3.5" aria-hidden /> Confirmed
      </Pill>
    )
  return (
    <Button size={size} onClick={join} aria-label={`Sign up for ${title}`}>
      Sign up
    </Button>
  )
}

const SHADES = ['bg-primary', 'bg-primary/65', 'bg-primary/35']

/** One bar, three segments (skills, availability, interest), each as wide as its points. Green only, per the Three Signals rule. */
export function ScoreBar({ factors, label }: { factors: Factor[]; label: string }): React.JSX.Element {
  return (
    <div className="mt-1.5 flex h-1.5 gap-px overflow-hidden rounded-full bg-track" role="img" aria-label={label}>
      {factors.map((f, i) => (
        <span key={f.label} className={SHADES[i]} style={{ width: `${f.points}%` }} />
      ))}
    </div>
  )
}
