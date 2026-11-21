/**
 * Fan deck: a pile of cards that fans into an arc when you reach for it; pick one and it lifts out and tucks in on top.
 * Logic adapted from "Fan Deck Card" by ham7a311 on 21st.dev (https://21st.dev/@ham7a311/components/fan-deck-card):
 * order / open / over / lifting state, toTop, arrow keys and swipe are theirs. The styling is ours (app tokens,
 * transforms computed inline), and `promote` is added so a parent can bring a card to the top.
 */
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DeckItem {
  id: string | number
  title: string
}

export function FanDeck<T extends DeckItem>({
  cards,
  render,
  label,
  promote,
  onTop,
  width = 210,
  height = 280
}: {
  cards: T[]
  render: (card: T, top: boolean) => ReactNode
  label: string
  /** Id of a card the parent wants on top (for example the best match). */
  promote?: string | number
  onTop?: (card: T) => void
  width?: number
  height?: number
}): React.JSX.Element {
  const [order, setOrder] = useState(cards.map((c) => c.id)) // order[0] is on top
  const [open, setOpen] = useState(false)
  const [over, setOver] = useState<string | number | null>(null)
  const [lifting, setLifting] = useState<string | number | null>(null)
  const swipe = useRef<{ x: number; t: number } | null>(null)
  const n = cards.length
  const reduced = (): boolean => matchMedia('(prefers-reduced-motion: reduce)').matches

  /** Bring a card to the top: it lifts clear of the hand first, then tucks in. */
  const toTop = (id: string | number): void => {
    if (order[0] === id || lifting) return
    const move = (): void => setOrder((o) => [id, ...o.filter((x) => x !== id)])
    if (reduced()) return move()
    setLifting(id)
    window.setTimeout(move, 230)
    window.setTimeout(() => setLifting(null), 560)
  }
  const deal = (dir: 1 | -1): void => toTop(dir === 1 ? order[1]! : order[n - 1]!)

  useEffect(() => {
    // The lift-then-tuck needs timers, so this can't be derived during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (promote) toTop(promote)
    // Only a new `promote` should move the deck, not every re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promote])
  useEffect(() => {
    const top = cards.find((c) => c.id === order[0])
    if (top) onTop?.(top)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order[0]])

  const onKey = (e: KeyboardEvent): void => {
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    deal(dir)
  }
  const top = cards.find((c) => c.id === order[0])!

  return (
    <section
      aria-label={label}
      onPointerEnter={(e) => e.pointerType !== 'touch' && setOpen(true)}
      onPointerLeave={() => (setOpen(false), setOver(null))}
      onFocus={() => setOpen(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOpen(false)}
      onKeyDown={onKey}
    >
      <div
        className="relative mx-auto"
        style={{ width, height }}
        onPointerDown={(e) => (swipe.current = { x: e.clientX, t: e.timeStamp })}
        onPointerUp={(e) => {
          const s = swipe.current
          swipe.current = null
          if (!s) return
          const dx = e.clientX - s.x
          if (Math.abs(dx) > 40 && e.timeStamp - s.t < 600) deal(dx < 0 ? 1 : -1)
        }}
      >
        {cards.map((c) => {
          const i = order.indexOf(c.id)
          // In the fan, the top card sits on the right and deeper cards spread left on an arc, so every title shows.
          const f = n > 1 ? 0.5 - i / (n - 1) : 0
          const lift = lifting === c.id
          const isTop = i === 0
          const up = (lift ? 64 : 0) + (open && over === c.id && !isTop ? 14 : 0)
          const transform = open
            ? `translate(${f * 200}px, ${(0.25 - f * f) * -60 - up}px) rotate(${f * 26}deg)`
            : `translate(${i * 5}px, ${-i * 3 - up}px) rotate(${(i % 2 ? -1 : 1) * i * 1.5}deg)`
          return (
            <button
              key={c.id}
              type="button"
              tabIndex={isTop ? 0 : -1}
              aria-current={isTop || undefined}
              aria-label={isTop ? `${c.title}. On top.` : `Bring ${c.title} to the top`}
              onPointerEnter={() => setOver(c.id)}
              onPointerLeave={() => setOver((o) => (o === c.id ? null : o))}
              onClick={() => toTop(c.id)}
              style={{ transform, zIndex: lift ? 100 : n - i, width, height }}
              className={cn(
                'absolute inset-0 overflow-hidden rounded-2xl border bg-card text-left transition-[transform,box-shadow] duration-300 ease-snappy',
                isTop ? 'shadow-[0_1px_2px_rgb(0_0_0/0.08),0_18px_36px_-14px_rgb(0_0_0/0.35)]' : 'shadow-[0_1px_2px_rgb(0_0_0/0.06),0_8px_18px_-10px_rgb(0_0_0/0.25)]'
              )}
            >
              {render(c, isTop)}
            </button>
          )
        })}
      </div>
      <div className="mt-5 flex items-center justify-center gap-3 text-sm">
        <button type="button" onClick={() => deal(-1)} aria-label="Previous card" className="grid size-8 place-items-center rounded-full border bg-card transition-[background-color,scale] duration-150 ease-snappy hover:bg-accent active:scale-[0.94]">
          <ChevronLeft className="size-4" strokeWidth={1.5} aria-hidden />
        </button>
        <span aria-live="polite" className="min-w-44 text-center">
          <span className="font-medium">{top.title}</span>
          <span className="opacity-70"> · {cards.indexOf(top) + 1} of {n}</span>
        </span>
        <button type="button" onClick={() => deal(1)} aria-label="Next card" className="grid size-8 place-items-center rounded-full border bg-card transition-[background-color,scale] duration-150 ease-snappy hover:bg-accent active:scale-[0.94]">
          <ChevronRight className="size-4" strokeWidth={1.5} aria-hidden />
        </button>
      </div>
    </section>
  )
}
