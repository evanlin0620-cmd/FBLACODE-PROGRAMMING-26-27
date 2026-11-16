/**
 * Status pills and the capacity bar. Every status has a word, not only a color,
 * so meaning never depends on color alone.
 */
import type { Activity, HourStatus, SignupStatus } from '@shared/types'
import { cn } from '@/lib/utils'
import { fmtCount, spotsLabel } from '@/lib/format'
import { Slots } from './slots'

type Tone = 'green' | 'amber' | 'red' | 'gray' | 'outline'

const TONES: Record<Tone, string> = {
  green: 'bg-success-bg text-success-fg',
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
  if (status === 'waitlisted') return <Pill tone="amber">Waitlist{position ? ` #${fmtCount(position)}` : ''}</Pill>
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
 * The signature element: how full a shift is, drawn as the lines of a sign-up sheet.
 * The words turn amber with the waitlist count once it is full.
 */
export function CapacityBar({ activity, className }: { activity: Activity; className?: string }): React.JSX.Element {
  const { confirmed, capacity, waitlisted } = activity
  const full = confirmed >= capacity
  const label = spotsLabel({ confirmed, capacity, waitlisted })
  return (
    <div className={cn('min-w-0', className)}>
      <p className={cn('font-mono text-xs tabular-nums', full ? 'text-warning' : 'text-muted-foreground')}>{label}</p>
      <div className="mt-1.5">
        <Slots filled={confirmed} total={capacity} label={`${activity.title}: ${label}`} />
      </div>
    </div>
  )
}

/**
 * A labeled progress bar for hours toward a goal or bars in a ranked list.
 * `introDelay` fills it from empty once (the dashboard's first view after login).
 */
export function Meter({
  value,
  max,
  tone = 'green',
  label,
  introDelay
}: {
  value: number
  max: number
  tone?: 'green' | 'amber'
  label: string
  introDelay?: number
}): React.JSX.Element {
  const pct = max <= 0 ? 0 : Math.min(100, (value / max) * 100)
  return (
    <div className="h-2 overflow-hidden rounded-full bg-track" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
      <div
        className={cn(FILL, tone === 'green' ? 'bg-primary' : 'bg-warning', introDelay !== undefined && 'animate-fill')}
        style={{ transform: `translateX(${pct - 100}%)`, ...(introDelay !== undefined && { animationDelay: `${introDelay}ms`, animationDuration: '600ms' }) }}
      />
    </div>
  )
}
