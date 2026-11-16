/**
 * Prototype harness: three directions for "Recommended for you" on the volunteer dashboard,
 * shown one at a time, full size, inside a static copy of the dashboard around it.
 * Keys: 1-3 or arrows switch, R replays. Nothing in the app imports from this folder.
 */
/* eslint-disable react-refresh/only-export-components -- page entry file; nothing imports it, so hot reload rules don't apply */
import '@fontsource-variable/geist'
import './styles.css'
import './picker.css'

import { StrictMode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { CalendarDays, Clock, Heart, Home, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { PageBody, PageHeader, Panel } from '@/components/page'
import { Meter, Pill } from '@/components/status'
import { Ledger } from './ledger'
import { Spotlight } from './spotlight'
import { Scorecard } from './scorecard'

const VARIANTS = [
  ['Ledger', Ledger],
  ['Spotlight', Spotlight],
  ['Scorecard', Scorecard]
] as const

/** A still copy of the dashboard around the piece under test, so it's judged in context. */
function DashboardFrame({ children }: { children: React.ReactNode }): React.JSX.Element {
  const nav: [typeof Home, string][] = [
    [Home, 'Dashboard'],
    [Search, 'Find activities'],
    [CalendarDays, 'My shifts'],
    [Clock, 'My hours'],
    [User, 'My profile']
  ]
  return (
    <div className="flex h-svh">
      <aside className="flex w-60 shrink-0 flex-col border-r bg-sidebar px-2 pt-5" aria-label="App menu (static in this prototype)">
        <div className="flex items-center gap-2.5 px-2 pb-6">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Heart className="size-[18px]" strokeWidth={2.4} aria-hidden />
          </span>
          <span className="font-semibold">ServeHub</span>
        </div>
        {nav.map(([Icon, label], i) => (
          <p key={label} className={i === 0 ? 'flex h-9 items-center gap-2.5 rounded-md bg-sidebar-accent px-2 text-sm font-medium text-sidebar-accent-foreground' : 'flex h-9 items-center gap-2.5 px-2 text-sm'}>
            <Icon className="size-4" aria-hidden /> {label}
          </p>
        ))}
      </aside>
      <main className="min-w-0 flex-1 overflow-y-auto pb-24">
        <PageHeader
          title="Hi, Maria"
          subtitle="Here’s what’s next and how close you are to your goal."
          actions={
            <>
              <Button variant="outline">Find activities</Button>
              <Button>Log hours</Button>
            </>
          }
        />
        <PageBody>
          <div className="space-y-8">
            <Panel title="Your service hours" description="Your goal: 40 hours">
              <p className="flex items-baseline gap-2">
                <span className="text-4xl font-semibold tracking-tight tabular">10</span>
                <span className="text-sm text-muted-foreground">of 40 hours approved</span>
              </p>
              <div className="mt-4">
                <Meter value={10} max={40} label="Approved hours toward your goal" />
              </div>
              <div className="mt-3">
                <Pill tone="green">25% of goal</Pill>
              </div>
            </Panel>
            <section aria-labelledby="recs">
              <h2 id="recs" className="text-lg font-semibold">
                Recommended for you
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">Ranked by your skills, free times, and interests.</p>
              {children}
            </section>
          </div>
        </PageBody>
      </main>
    </div>
  )
}

function Harness(): React.JSX.Element {
  const requested = Number(new URLSearchParams(location.search).get('v'))
  const [current, setCurrent] = useState(requested >= 1 && requested <= VARIANTS.length ? requested - 1 : 0)
  const [mount, setMount] = useState(0) // bumping it re-mounts the variant so entrance motion replays
  const [ready, setReady] = useState(false)
  const items = useRef<(HTMLButtonElement | null)[]>([])
  const highlight = useRef<HTMLSpanElement>(null)
  const latest = useRef(current) // for the arrow keys, which are bound once

  const select = (i: number): void => {
    setCurrent((i + VARIANTS.length) % VARIANTS.length)
    setMount((m) => m + 1)
  }

  useLayoutEffect(() => {
    latest.current = current
    const move = (): void => {
      const el = items.current[current]
      if (!el || !highlight.current) return
      highlight.current.style.width = `${el.offsetWidth}px`
      highlight.current.style.transform = `translateX(${el.offsetLeft}px)`
    }
    move()
    window.addEventListener('resize', move)
    const url = new URL(location.href)
    url.searchParams.set('v', String(current + 1))
    history.replaceState(null, '', url)
    return () => window.removeEventListener('resize', move)
  }, [current])

  useEffect(() => {
    // Enable the slide only after first paint, so load doesn't animate.
    requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)))
    const onKey = (e: KeyboardEvent): void => {
      const t = e.target as HTMLElement
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable || e.metaKey || e.ctrlKey || e.altKey) return
      const n = Number(e.key)
      if (n >= 1 && n <= VARIANTS.length) select(n - 1)
      else if (e.key === 'ArrowRight') select(latest.current + 1)
      else if (e.key === 'ArrowLeft') select(latest.current - 1)
      else if (e.key === 'r' || e.key === 'R') setMount((m) => m + 1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const Variant = VARIANTS[current][1]
  return (
    <>
      <DashboardFrame>
        <Variant key={`${current}-${mount}`} />
      </DashboardFrame>
      <Toaster position="bottom-right" richColors />
      <nav className="proto-picker" aria-label="Prototype variants" data-ready={ready ? '' : undefined}>
        <span ref={highlight} className="proto-picker-highlight" aria-hidden="true" />
        {VARIANTS.map(([name], i) => (
          <button
            key={name}
            ref={(el) => {
              items.current[i] = el
            }}
            className="proto-picker-item"
            data-active={i === current ? '' : undefined}
            aria-current={i === current ? 'true' : undefined}
            onClick={() => select(i)}
          >
            {name}
          </button>
        ))}
        <span className="proto-picker-divider" aria-hidden="true" />
        <button className="proto-picker-item proto-picker-replay" aria-label="Replay animation (R)" onClick={() => setMount((m) => m + 1)}>
          ↻
        </button>
      </nav>
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Harness />
  </StrictMode>
)
