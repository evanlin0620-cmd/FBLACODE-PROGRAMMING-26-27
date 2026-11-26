import { useEffect, useRef, useState } from 'react'

const decimals = (n: number): number => Math.min(2, (String(n).split('.')[1] ?? '').length)

/**
 * A figure that tweens instead of jumping: from zero on the once-per-login entrance (`intro`), and from the old
 * value to the new one whenever it changes. Ease-out, so it slows into the real number. Screen readers get only
 * the final value; with reduced motion it lands at once.
 */
export function CountUp({
  value,
  format,
  intro = false,
  delay = 0
}: {
  value: number
  format: (n: number) => string
  intro?: boolean
  delay?: number
}): React.JSX.Element {
  const [shown, setShown] = useState(intro ? 0 : value)
  const from = useRef(shown)
  const first = useRef(true)

  useEffect(() => {
    const start = from.current
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = still || start === value ? 0 : first.current ? 900 : 420
    const wait = first.current ? delay : 0
    const places = decimals(value)
    first.current = false
    const t0 = performance.now() + wait
    let raf = 0
    const step = (now: number): void => {
      const p = duration ? Math.min(1, Math.max(0, (now - t0) / duration)) : 1
      const eased = 1 - (1 - p) ** 4
      const v = Number((start + (value - start) * eased).toFixed(places))
      from.current = v
      setShown(v)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, delay])

  return (
    <>
      <span aria-hidden>{format(shown)}</span>
      <span className="sr-only">{format(value)}</span>
    </>
  )
}
