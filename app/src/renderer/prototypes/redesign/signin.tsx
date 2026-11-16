/** Unslopped sign-in: warm paper panel with the sign-up sheet as its one moment, a plain form beside it. */
import { useState } from 'react'
import { Heart, Lock } from 'lucide-react'
import { CreateAccountForm, SignInForm } from './auth-forms'
import { Slots } from './slots'
import { useOrg } from './data'

const SHEET = ['Maria Lopez', 'James Carter', 'Aisha Rahman', 'Tom Nguyen', '', '']

/** The moment: a real clipboard and sheet, built in code so it stays sharp and offline. */
function Clipboard(): React.JSX.Element {
  const org = useOrg()
  const filled = SHEET.filter(Boolean).length
  return (
    // A picture of the product: one short description for screen readers instead of every line of the sheet.
    <div
      role="img"
      aria-label={`Example sign-up sheet for Creek Cleanup with ${filled} of ${SHEET.length} spots filled`}
      className="relative mx-auto w-[400px] -rotate-1 rounded-2xl bg-[linear-gradient(180deg,#c9a57b,#bb9568)] p-5 pt-10 shadow-[0_1px_2px_rgb(0_0_0/0.08),0_16px_40px_-12px_rgb(60_40_20/0.35)]">
      {/* The clip: brushed steel in one neutral, a small tone shift only. */}
      <div className="absolute top-[-14px] left-1/2 h-11 w-32 -translate-x-1/2 rounded-lg bg-[linear-gradient(180deg,#e4e4e4,#a9a9a9)] shadow-[inset_0_1px_0_rgb(255_255_255/0.7),0_2px_4px_rgb(0_0_0/0.25)]">
        <div className="mx-auto mt-3 h-2 w-16 rounded-full bg-[#8f8f8f] shadow-[inset_0_1px_1px_rgb(0_0_0/0.35)]" />
      </div>
      <div className="rounded-[4px] bg-[#fffdf8] px-6 pt-6 pb-4 text-[var(--paper-ink)] shadow-[0_1px_2px_rgb(0_0_0/0.1)]">
        <p className="truncate font-mono text-[11px] text-[var(--paper-ink-2)]">{org} · volunteer sign-up</p>
        <p className="serif mt-1 text-2xl leading-tight">Creek Cleanup</p>
        <p className="mt-1 text-xs text-[var(--paper-ink-2)]">Sat, Dec 5 · 8:00 AM – 12:00 PM</p>
        <ol className="mt-4">
          {SHEET.map((name, i) => (
            <li key={i} className="flex h-8 items-end gap-3 border-b border-[#ddd5c6] pb-1">
              <span className="w-4 font-mono text-[11px] text-[var(--paper-ink-2)] tabular-nums">{i + 1}</span>
              <span className="hand text-lg leading-none text-[#26387a]">{name}</span>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex items-center justify-between">
          <Slots filled={filled} total={SHEET.length} label={`${filled} of ${SHEET.length} spots filled`} />
          <span className="font-mono text-[11px] text-[var(--paper-ink-2)] tabular-nums">{SHEET.length - filled} spots left</span>
        </div>
      </div>
    </div>
  )
}

export function UnslopSignIn(): React.JSX.Element {
  const org = useOrg()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  return (
    <main className="unslop grid h-svh grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <section className="relative flex flex-col overflow-hidden bg-[var(--paper)] px-12 pt-10" aria-label="About ServeHub">
        <p className="flex items-center gap-2 text-[17px] font-medium text-[var(--paper-ink)]">
          <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
            <Heart className="size-4" strokeWidth={2} aria-hidden />
          </span>
          ServeHub
        </p>
        <h1 className="serif mt-10 max-w-[30rem] text-[52px] leading-[1.04] tracking-[-0.02em] text-[var(--paper-ink)]">
          Every shift’s sign-up sheet, in one place
        </h1>
        <p className="mt-5 max-w-[28rem] text-[17px] leading-7 text-[var(--paper-ink-2)]">
          Volunteers pick shifts and log their hours. Coordinators approve them and see what the hours added up to.
        </p>
        {/* Whole sheet in view, open spots included: the open lines are the point of the object. */}
        <div className="mt-auto pt-6 pb-12">
          <Clipboard />
        </div>
      </section>

      <section className="flex flex-col justify-center bg-card px-16">
        {mode === 'signin' ? (
          <SignInForm org={org} onCreate={() => setMode('signup')} />
        ) : (
          <CreateAccountForm org={org} onSignIn={() => setMode('signin')} />
        )}
        <p className="mx-auto mt-16 flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="size-3.5" strokeWidth={1.5} aria-hidden /> Works offline. Your data stays on this computer
        </p>
      </section>
    </main>
  )
}
