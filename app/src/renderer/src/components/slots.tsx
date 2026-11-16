/**
 * The signature: a shift's capacity drawn as the lines of a paper sign-up sheet, filled or open.
 * Used everywhere spots appear, and nowhere else.
 */
import { spotsLabel } from '@/lib/format'

export function Slots({ filled, total, label }: { filled: number; total: number; label: string }): React.JSX.Element {
  // shortcut: one mark per spot up to 20 (about 200px, fits a table cell); past that the marks scale and the label carries the count.
  const shown = Math.min(total, 20)
  // Scaled marks never read as full (or empty) unless the shift really is.
  const shownFilled = filled >= total ? shown : filled <= 0 ? 0 : Math.min(shown - 1, Math.max(1, Math.floor((filled / total) * shown)))
  return (
    <span className="flex shrink-0 gap-[3px]" role="img" aria-label={label}>
      {Array.from({ length: shown }, (_, i) => (
        <span key={i} className={i < shownFilled ? 'h-3 w-1.5 rounded-[2px] bg-[var(--slot-filled)]' : 'h-3 w-1.5 rounded-[2px] bg-[var(--slot-open)]'} />
      ))}
    </span>
  )
}

/** Slot marks plus the words, for a shift row. */
export function SpotsRow({ confirmed, capacity, waitlisted = 0 }: { confirmed: number; capacity: number; waitlisted?: number }): React.JSX.Element {
  const text = spotsLabel({ confirmed, capacity, waitlisted })
  return (
    <span className="flex min-w-0 items-center gap-3">
      <Slots filled={confirmed} total={capacity} label={text} />
      <span className="truncate font-mono text-xs text-muted-foreground tabular-nums" aria-hidden>
        {text}
      </span>
    </span>
  )
}
