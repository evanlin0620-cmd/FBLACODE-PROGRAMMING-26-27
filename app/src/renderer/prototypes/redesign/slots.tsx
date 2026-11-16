/**
 * The signature: a shift's capacity drawn as the lines of a paper sign-up sheet, filled or open.
 * Used everywhere spots appear, and nowhere else.
 */
export function Slots({ filled, total, label }: { filled: number; total: number; label: string }): React.JSX.Element {
  // shortcut: one mark per spot reads up to ~30 spots; past that, switch to a bar.
  return (
    <span className="flex shrink-0 gap-[3px]" role="img" aria-label={label}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={i < filled ? 'h-3 w-1.5 rounded-[2px] bg-[#404040]' : 'h-3 w-1.5 rounded-[2px] bg-[#e2e2e2]'} />
      ))}
    </span>
  )
}

export function SpotsRow({ confirmed, capacity }: { confirmed: number; capacity: number }): React.JSX.Element {
  const left = capacity - confirmed
  const text = left === 1 ? 'Last spot' : `${left} of ${capacity} spots left`
  return (
    <span className="flex items-center gap-3">
      <Slots filled={confirmed} total={capacity} label={text} />
      <span className="font-mono text-xs whitespace-nowrap text-muted-foreground tabular-nums" aria-hidden>
        {text}
      </span>
    </span>
  )
}
