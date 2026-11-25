/**
 * Name + logo prototype: three directions shown where the brand actually lives in the app
 * (sidebar, sign-in panel, window, taskbar and app icon), in both themes.
 * Keys: 1-3 pick a direction, T toggles the theme. Nothing in the app imports from this folder.
 * Marks drawn with the logo-design skill; the SVG masters sit beside this file.
 */
/* eslint-disable react-refresh/only-export-components -- page entry file; nothing imports it */
import '@fontsource-variable/geist'
import '../../src/assets/main.css'

import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { CalendarDays, Clock, Home, Search } from 'lucide-react'

type MarkProps = { size: number; className?: string }

/** Each mark is one solid path in the text colour (masters beside this file). No strokes, masks or second colour. */
const mark = (d: string) =>
  function Mark({ size, className }: MarkProps): React.JSX.Element {
    return (
      <svg viewBox="0 0 256 256" width={size} height={size} className={className} aria-hidden>
        <path fill="currentColor" fillRule="evenodd" d={d} />
      </svg>
    )
  }

const OPTIONS = [
  {
    name: 'Turnout',
    Mark: mark('M36 36H68V152.78L36 171.26ZM36 198.97L68 180.5V220H36ZM88 36H120V122.76L88 141.24ZM88 168.95L120 150.48V220H88ZM140 36H172V92.74L140 111.22ZM140 138.93L172 120.45V220H140ZM192 36H224V62.72L192 81.19ZM192 108.91L224 90.43V220H192Z'),
    idea: 'Four tally marks with the fifth stroke cut out of them. The missing stroke is the spot a volunteer fills.',
    why: '"Good turnout" is what every coordinator hopes for. The bars are the app’s own slot marks, so the logo and the screens share one signature.',
    risk: 'Tally marks are a familiar sign, so the cut channel carries the ownership. At 16 px it needs a three-bar cut.'
  },
  {
    name: 'Handbill',
    Mark: mark('M72 28H184A12 12 0 0 1 196 40V228H175.2V148H138.4H138.4V228H117.6V148H109.6H109.6V228H88.8V148H80.8H80.8V228H60V40A12 12 0 0 1 72 28Z'),
    idea: 'The flyer on the community-hall board, its tear-off tabs along the bottom, one already taken.',
    why: 'A handbill is how volunteers were always found. The missing tab says someone signed up without a word, and the tabs echo the slot marks.',
    risk: 'Out of context the tabs can read as a barcode or a price tag. It depends on people knowing tear-off flyers.'
  },
  {
    name: 'Rota',
    Mark: mark('M63 56H103V200H63Z M115 56A88 88 0 0 1 191.21 100L153.11 122A44 44 0 0 0 115 100Z'),
    idea: 'A lowercase r built from a stem and an arm cut from a ring, split by one clean gap.',
    why: 'A rota is the posted list of who is on which shift. Short, plain and easy to say, and the letter mark holds up best at 16 px.',
    risk: 'A single-letter mark is the least story-driven of the three; the gap and the cut arm have to make it ownable.'
  }
] as const

const ORG = 'Riverside Community Partners'

function Panel({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }): React.JSX.Element {
  return (
    <section className={`rounded-2xl border bg-card p-5 ${className}`}>
      <h2 className="mb-4 text-xs text-muted-foreground">{label}</h2>
      {children}
    </section>
  )
}

function Prototype(): React.JSX.Element {
  const [pick, setPick] = useState(0)
  const [dark, setDark] = useState(true)
  const { name, Mark, idea, why, risk } = OPTIONS[pick]!

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.title = `${name} · name and logo prototype`
  }, [dark, name])

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key >= '1' && e.key <= '3') setPick(Number(e.key) - 1)
      if (e.key.toLowerCase() === 't') setDark((d) => !d)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="flex h-16 items-center gap-3 border-b px-8">
        <span className="text-xl font-medium">Name and logo</span>
        <span className="text-sm text-muted-foreground">Prototype · keys 1–3 and T</span>
        <div className="ml-auto flex items-center gap-2" role="group" aria-label="Direction">
          {OPTIONS.map((o, i) => (
            <button
              key={o.name}
              type="button"
              aria-pressed={pick === i}
              onClick={() => setPick(i)}
              className="flex h-9 items-center gap-2 rounded-full border px-3 text-sm aria-pressed:border-foreground aria-pressed:bg-card"
            >
              <o.Mark size={18} />
              {o.name}
            </button>
          ))}
          <button type="button" onClick={() => setDark((d) => !d)} className="ml-2 h-9 rounded-md border px-3 text-sm">
            {dark ? 'Light' : 'Dark'} theme
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1200px] grid-cols-[240px_1fr] gap-4 p-8">
        {/* Sidebar, sized and spaced like components/app-shell.tsx */}
        <aside className="row-span-3 flex flex-col overflow-hidden rounded-2xl border bg-sidebar">
          <div className="flex h-14 shrink-0 items-center gap-2.5 px-5">
            <Mark size={24} className="shrink-0" />
            <span className="min-w-0">
              <span className="block text-[15px] leading-tight font-medium">{name}</span>
              <span className="block truncate text-xs leading-tight text-muted-foreground">{ORG}</span>
            </span>
          </div>
          <nav className="space-y-0.5 px-3 py-4 text-sm text-text-2">
            {[
              [Home, 'Home'],
              [Search, 'Find shifts'],
              [CalendarDays, 'My shifts'],
              [Clock, 'My hours']
            ].map(([Icon, label], i) => {
              const I = Icon as typeof Home
              return (
                <div
                  key={label as string}
                  className={`flex h-8 items-center gap-2.5 rounded-lg px-2.5 ${i === 0 ? 'bg-sidebar-accent text-foreground ring-1 ring-border ring-inset' : ''}`}
                >
                  <I className="size-4" strokeWidth={1.5} aria-hidden />
                  {label as string}
                </div>
              )
            })}
          </nav>
          <div className="mt-auto p-5 text-xs text-muted-foreground">Sidebar · 24 px mark</div>
        </aside>

        <Panel label="The idea">
          <div className="flex items-center gap-8">
            <Mark size={168} className="shrink-0" />
            <div className="space-y-3 text-sm">
              <p className="text-[15px] font-medium">{idea}</p>
              <p className="text-text-2">{why}</p>
              <p className="text-muted-foreground">Risk: {risk}</p>
            </div>
          </div>
        </Panel>

        <div className="grid grid-cols-[1.3fr_1fr] gap-4">
          {/* Sign-in paper panel, like pages/auth.tsx */}
          <section className="rounded-2xl border bg-paper p-8 text-paper-ink">
            <p className="flex items-center gap-2 text-[17px] font-medium">
              <Mark size={28} />
              {name}
            </p>
            <p className="mt-10 font-serif text-[40px] leading-[1.04] tracking-[-0.02em]">
              Every shift&apos;s sign-up sheet, in one place.
            </p>
            <p className="mt-4 text-sm text-paper-ink-2">Sign-in panel · 28 px mark on paper</p>
          </section>

          <Panel label="Window and taskbar">
            <div className="overflow-hidden rounded-lg border">
              <div className="flex h-8 items-center gap-2 bg-sidebar px-3 text-xs">
                <Mark size={16} />
                {name}
                <span className="ml-auto tracking-[0.3em] text-muted-foreground">– ▢ ✕</span>
              </div>
              <div className="h-16 bg-background" />
            </div>
            <div className="mt-5 flex items-end gap-5">
              {[16, 24, 32, 48].map((s) => (
                <div key={s} className="flex flex-col items-center gap-1.5">
                  <Mark size={s} />
                  <span className="font-mono text-[11px] text-muted-foreground">{s}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <Panel label="App icon · desktop, Start menu, installer">
          <div className="flex items-end gap-6">
            <div className="grid size-24 place-items-center rounded-[22px] bg-[#111] text-[#3fbf74] shadow-sm">
              <Mark size={56} />
            </div>
            <div className="grid size-24 place-items-center rounded-[22px] bg-[#15803d] text-white shadow-sm">
              <Mark size={56} />
            </div>
            <div className="grid size-24 place-items-center rounded-[22px] bg-[#f7f4ee] text-[#1f1b16] shadow-sm">
              <Mark size={56} />
            </div>
            <div className="grid size-12 place-items-center rounded-xl bg-[#111] text-[#3fbf74]">
              <Mark size={28} />
            </div>
            <p className="ml-4 max-w-64 text-sm text-text-2">
              Green lives on the icon only. Inside the app the mark takes the text colour, so the chrome stays quiet.
            </p>
          </div>
        </Panel>
      </main>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Prototype />
  </StrictMode>
)
