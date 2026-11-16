/**
 * Comparison harness: the current UI (screenshots of the real app, same seed data) against the unslopped direction.
 * Keys: 1-3 pick a screen, C toggles Current / Unslopped. Nothing in the app imports from this folder.
 * Direction by the unslop skill — unslop by Damir Sokolovsky (@heydamir), CC BY 4.0.
 */
/* eslint-disable react-refresh/only-export-components -- page entry file; nothing imports it */
import '@fontsource-variable/geist'
import './styles.css'

import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import signinPng from './current/signin.png'
import volunteerPng from './current/volunteer.png'
import impactPng from './current/impact.png'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ORGS, OrgContext } from './data'
import { UnslopSignIn } from './signin'
import { UnslopVolunteer } from './volunteer'
import { UnslopImpact } from './impact'

const SCREENS = [
  { id: 'signin', name: 'Sign-in', current: signinPng, Unslop: UnslopSignIn },
  { id: 'volunteer', name: 'Volunteer dashboard', current: volunteerPng, Unslop: UnslopVolunteer },
  { id: 'impact', name: 'Admin impact', current: impactPng, Unslop: UnslopImpact }
] as const

type Side = 'current' | 'unslop'

function Harness(): React.JSX.Element {
  const params = new URLSearchParams(location.search)
  const [screen, setScreen] = useState(Math.max(0, SCREENS.findIndex((s) => s.id === params.get('screen'))))
  const [side, setSide] = useState<Side>(params.get('side') === 'current' ? 'current' : 'unslop')
  const [org, setOrg] = useState(0)
  const [goal, setGoal] = useState(false)

  useEffect(() => {
    const url = new URL(location.href)
    url.searchParams.set('screen', SCREENS[screen]!.id)
    url.searchParams.set('side', side)
    history.replaceState(null, '', url)
  }, [screen, side])

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      const t = e.target as HTMLElement
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || e.metaKey || e.ctrlKey || e.altKey) return
      const n = Number(e.key)
      if (n >= 1 && n <= SCREENS.length) setScreen(n - 1)
      else if (e.key === 'c' || e.key === 'C') setSide((s) => (s === 'current' ? 'unslop' : 'current'))
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const s = SCREENS[screen]!
  return (
    <TooltipProvider delayDuration={300}>
      <Toaster position="bottom-right" />
      {side === 'current' ? (
        // The real app at 1280 × 800, captured by Playwright from the built Electron app.
        <div className="h-svh overflow-auto bg-white">
          <img src={s.current} alt={`Current ${s.name} screen`} className="block w-[1280px] max-w-none" />
        </div>
      ) : (
        <OrgContext.Provider value={ORGS[org]!}>
          {s.id === 'volunteer' ? <UnslopVolunteer goalReached={goal} /> : <s.Unslop />}
        </OrgContext.Provider>
      )}
      <nav className="compare-bar" aria-label="Prototype comparison">
        <div className="compare-group" role="group" aria-label="Screen">
          {SCREENS.map((x, i) => (
            <button key={x.id} type="button" aria-pressed={i === screen} onClick={() => setScreen(i)}>
              {x.name}
            </button>
          ))}
        </div>
        <div className="compare-group" role="group" aria-label="Design">
          {(['current', 'unslop'] as const).map((x) => (
            <button key={x} type="button" aria-pressed={side === x} onClick={() => setSide(x)}>
              {x === 'current' ? 'Current' : 'Unslopped'}
            </button>
          ))}
        </div>
        {side === 'unslop' && s.id === 'volunteer' && (
          <div className="compare-group" role="group" aria-label="Volunteer state">
            <button type="button" aria-pressed={goal} onClick={() => setGoal((g) => !g)}>
              Goal reached
            </button>
          </div>
        )}
        {side === 'unslop' && (
          <div className="compare-group" role="group" aria-label="Example organization">
            {ORGS.map((name, i) => (
              <button key={name} type="button" aria-pressed={i === org} onClick={() => setOrg(i)} title={name}>
                {name.split(' ').slice(0, 2).join(' ')}
              </button>
            ))}
          </div>
        )}
      </nav>
    </TooltipProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Harness />
  </StrictMode>
)
