/**
 * Status pills and the capacity bar. Every status has a word, not only a color,
 * so meaning never depends on color alone.
 */
import type { Activity, HourStatus, SignupStatus } from '@shared/types'
import { cn } from '@/lib/utils'

type Tone = 'green' | 'amber' | 'red' | 'gray' | 'outline'

const TONES: Record<Tone, string> = {
  green: 'bg-success-bg text-accent-foreground',
  amber: 'bg-warning-bg text-warning',
  red: 'bg-destructive/10 text-destructive',
  gray: 'bg-muted text-muted-foreground',
  outline: 'border bg-background text-foreground'
}

export function Pill({ tone = 'gray', children, className }: { tone?: Tone; children: React.ReactNode; className?: string }): React.JSX.Element {
  return (
    <span className={cn('inline-flex h-6 items-center gap-1 rounded-md px-2 text-xs font-medium whitespace-nowrap', TONES[tone], className)}>
      {children}
    </span>
  )
}

export function SignupPill({ status, position }: { status: SignupStatus; position?: number | null }): React.JSX.Element {
  if (status === 'confirmed') return <Pill tone="green">Confirmed</Pill>
  if (status === 'waitlisted') return <Pill tone="amber">Waitlist{position ? ` #${position}` : ''}</Pill>
  return <Pill tone="gray">Cancelled</Pill>
}

export function HourPill({ status }: { status: HourStatus }): React.JSX.Element {
  if (status === 'approved') return <Pill tone="green">Approved</Pill>
  if (status === 'rejected') return <Pill tone="red">Not approved</Pill>
  return <Pill tone="amber">Pending</Pill>
}

// Full-width fill slid left inside the clipped track: animates on the compositor, unlike width.
const FILL = 'h-full w-full rounded-full transition-transform duration-300 ease-snappy'

/**
 * The signature element: how full a shift is. Green while there is room,
 * amber with the waitlist count once full.
 */
export function CapacityBar({ activity, className }: { activity: Activity; className?: string }): React.JSX.Element {
  const { confirmed, capacity, waitlisted } = activity
  const full = confirmed >= capacity
  const left = Math.max(0, capacity - confirmed)
  const pct = Math.min(100, Math.round((confirmed / capacity) * 100))
  const label = full ? (waitlisted > 0 ? `Full · ${waitlisted} on waitlist` : 'Full · waitlist open') : `${left} of ${capacity} spots left`
  return (
    <div className={cn('min-w-0', className)}>
      <p className={cn('text-xs font-medium tabular', full ? 'text-warning' : 'text-foreground')}>{label}</p>
      <div
        className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-track"
        role="meter"
        aria-label={`Spots filled for ${activity.title}`}
        aria-valuemin={0}
        aria-valuemax={capacity}
        aria-valuenow={confirmed}
        aria-valuetext={label}
      >
        <div className={cn(FILL, full ? 'bg-warning' : 'bg-primary')} style={{ transform: `translateX(${pct - 100}%)` }} />
      </div>
    </div>
  )
}

/** A labeled progress bar for hours toward a goal or bars in a ranked list. */
export function Meter({ value, max, tone = 'green', label }: { value: number; max: number; tone?: 'green' | 'amber'; label: string }): React.JSX.Element {
  const pct = max <= 0 ? 0 : Math.min(100, (value / max) * 100)
  return (
    <div className="h-2 overflow-hidden rounded-full bg-track" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
      <div className={cn(FILL, tone === 'green' ? 'bg-primary' : 'bg-warning')} style={{ transform: `translateX(${pct - 100}%)` }} />
    </div>
  )
}
