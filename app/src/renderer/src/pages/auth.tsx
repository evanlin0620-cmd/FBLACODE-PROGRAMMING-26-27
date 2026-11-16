/**
 * Log in and sign up. Public sign-up always creates a volunteer account;
 * admins are added by another admin in Settings.
 */
import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { Award, Check, Clock, Heart, Lock, Sparkles } from 'lucide-react'
import { Pill } from '@/components/status'
import { cn } from '@/lib/utils'
import { ORGANIZATION } from '@shared/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup } from '@/components/ui/field'
import { FormField } from '@/components/form'
import { useMutation } from '@/lib/hooks'
import { useSession } from '@/lib/session'
import type { SessionUser } from '@shared/types'

const DEMO = {
  volunteer: { email: 'maria@servehub.test', password: 'Volunteer2026' },
  admin: { email: 'admin@servehub.test', password: 'ServeHub2026' }
}

function Brand({ className }: { className?: string }): React.JSX.Element {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Heart className="size-[18px]" strokeWidth={2.4} aria-hidden />
      </span>
      <span className="text-xl font-semibold">ServeHub</span>
    </div>
  )
}

const FLOAT = 'shadow-[0_2px_4px_rgb(0_0_0/0.04),0_16px_32px_-16px_rgb(0_0_0/0.25)]'
const HEADLINE = ['Find a shift.', 'Log your hours.', 'See the good it did.']
const LAST_WORD = HEADLINE.join(' ').split(' ').length - 1
// Gaps shrink word by word (88ms down to ~8ms, 420ms total) so the headline reads as one wave, not a metronome.
const wordDelay = (i: number): number => Math.round(420 * (1 - (1 - i / LAST_WORD) ** 2))

/**
 * The left half of the sign-in screen. The headline rises word by word, then a sample
 * shift card settles in with the three states the app tracks: match, waitlist, approved.
 * The card is a picture of the product, so it is hidden from screen readers.
 */
// The entrance plays once per app session. Switching between Sign in and Sign up remounts the hero,
// and replaying a 1.2 s entrance each time left the panel half-empty for a beat, which read as broken.
let heroPlayed = false

function Hero(): React.JSX.Element {
  const [intro] = useState(() => !heroPlayed)
  useEffect(() => {
    heroPlayed = true
  }, [])
  // Without the intro, drop the animation classes so everything renders in place.
  const a = (cls: string): string | false => intro && cls
  let word = 0
  return (
    <div className="relative hidden overflow-hidden bg-[radial-gradient(ellipse_at_30%_35%,color-mix(in_srgb,var(--primary)_16%,var(--background)),color-mix(in_srgb,var(--primary)_4%,var(--background))_70%)] p-10 md:flex md:flex-col lg:p-12">
      <Brand />
      <p className="mt-10 text-[2.75rem] leading-[1.08] font-semibold tracking-tight lg:text-5xl">
        {HEADLINE.map((line, i) => (
          <span key={line} className={cn('block', i === 2 && 'text-primary')}>
            {line.split(' ').map((w) => (
              // The outer span is the mask each word rises out of; the padding keeps descenders from being clipped.
              <span key={w} className="-mb-[0.15em] inline-block overflow-hidden pb-[0.15em] align-bottom">
                <span className={cn('inline-block', a('animate-rise'))} style={{ animationDelay: `${wordDelay(word++)}ms` }}>
                  {w}&nbsp;
                </span>
              </span>
            ))}
          </span>
        ))}
      </p>
      <p className="mt-4 max-w-[38ch] text-sm text-accent-foreground">{ORGANIZATION} runs its volunteer program here, from the first sign-up to the certificate.</p>

      <div aria-hidden className="relative z-10 my-auto h-60 w-[440px] tabular">
        <div className={cn('absolute top-10 left-44 h-40 w-64 rotate-6 rounded-xl bg-primary p-4 text-primary-foreground', a('animate-settle'), FLOAT)} style={{ animationDelay: '500ms' }}>
          <Award className="ml-auto size-5" />
          <p className="absolute right-4 bottom-3 text-xs font-medium">Certificate of service</p>
        </div>
        <div className={cn('absolute top-4 left-0 w-72 -rotate-3 rounded-xl border bg-card p-5', a('animate-settle'), FLOAT)} style={{ animationDelay: '600ms' }}>
          <Pill tone="outline">Environmental</Pill>
          <p className="mt-2 font-semibold">Creek Cleanup</p>
          <p className="text-xs text-muted-foreground">Saturday · 8:00 AM – 12:00 PM</p>
          <p className="mt-3 text-xs font-medium">2 of 20 spots left</p>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-track">
            <div className={cn('h-full w-[90%] rounded-full bg-primary', a('animate-fill'))} style={{ animationDelay: '900ms' }} />
          </div>
        </div>
        {(
          [
            ['green', '-top-2 left-56', <Sparkles key="i" className="size-3.5" />, '92% match · fits your skills'],
            ['amber', 'top-24 left-[21rem]', <Clock key="i" className="size-3.5" />, 'Waitlist #2'],
            ['green', 'top-[13rem] left-36', <Check key="i" className="size-3.5" />, '4 hours approved']
          ] as const
        ).map(([tone, pos, icon, text], i) => (
          <span key={text} className={cn('absolute', a('animate-settle'), pos)} style={{ animationDelay: `${[1000, 1100, 1170][i]}ms` }}>
            <Pill tone={tone} className={cn('h-7 border border-border/60', FLOAT)}>
              {icon}
              {text}
            </Pill>
          </span>
        ))}
      </div>
      <span aria-hidden className="pointer-events-none absolute -bottom-12 left-6 text-[11rem] leading-none font-semibold tracking-tighter text-primary/[0.07] select-none">
        serve
      </span>
    </div>
  )
}

function AuthFrame({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }): React.JSX.Element {
  return (
    <main className="grid min-h-svh md:grid-cols-2">
      <Hero />
      <div className="m-auto w-full max-w-[448px] px-6 py-10">
        <Brand className="mb-6 justify-center md:hidden" />
        <div className="rounded-xl border bg-card p-6 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.12)]">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 mb-5 text-sm text-muted-foreground">{subtitle}</p>
          {children}
          <p className="mt-5 text-center text-sm text-muted-foreground">{footer}</p>
        </div>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3.5" aria-hidden /> Works offline. Your data stays on this computer.
        </p>
      </div>
    </main>
  )
}

function useLanding(): (u: SessionUser) => void {
  const { setUser } = useSession()
  const navigate = useNavigate()
  return (u) => {
    setUser(u)
    // Same `welcome` flag as PublicOnly's redirect, so whichever navigation lands last still plays the entrance.
    navigate(u.role === 'admin' ? '/admin' : '/dashboard', { replace: true, state: { welcome: true } })
  }
}

export function LoginPage(): React.JSX.Element {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const login = useMutation('auth.login')
  const land = useLanding()

  const submit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    const u = await login.run({ email, password })
    if (u) land(u)
  }

  return (
    <AuthFrame
      title="Welcome back"
      subtitle="Sign in to find shifts and track your hours."
      footer={
        <>
          New here?{' '}
          <Link to="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <div className="mb-5">
        <p className="mb-2 text-sm font-medium">Try a demo account</p>
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
          {(['volunteer', 'admin'] as const).map((role) => (
            <button
              key={role}
              type="button"
              className="h-8 rounded-md text-sm text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
              onClick={() => {
                setEmail(DEMO[role].email)
                setPassword(DEMO[role].password)
              }}
            >
              {role === 'volunteer' ? 'Volunteer' : 'Admin'}
            </button>
          ))}
        </div>
      </div>
      <form onSubmit={submit} noValidate>
        <FieldGroup className="gap-4">
          <FormField label="Email" error={login.fieldErrors.email}>
            {(p) => (
              <Input
                {...p}
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                placeholder="you@example.com"
                onChange={(e) => {
                  setEmail(e.target.value)
                  login.clearField('email')
                }}
              />
            )}
          </FormField>
          <FormField label="Password" error={login.fieldErrors.password}>
            {(p) => (
              <Input
                {...p}
                type="password"
                autoComplete="current-password"
                value={password}
                placeholder="Enter your password"
                onChange={(e) => {
                  setPassword(e.target.value)
                  login.clearField('password')
                }}
              />
            )}
          </FormField>
          <Button type="submit" className="mt-1 h-10 w-full" disabled={login.pending}>
            {login.pending ? 'Signing in…' : 'Sign in'}
          </Button>
        </FieldGroup>
      </form>
    </AuthFrame>
  )
}

export function SignupPage(): React.JSX.Element {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const signup = useMutation('auth.signup', { success: 'Account created. Welcome to ServeHub!' })
  const land = useLanding()
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [k]: e.target.value })
    signup.clearField(k)
  }

  const submit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    const u = await signup.run(form)
    if (u) land(u)
  }

  return (
    <AuthFrame
      title="Create your account"
      subtitle="Sign up as a volunteer. It takes a minute."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate>
        <FieldGroup className="gap-4">
          <FormField label="Full name" error={signup.fieldErrors.fullName}>
            {(p) => <Input {...p} autoComplete="name" autoFocus value={form.fullName} onChange={set('fullName')} />}
          </FormField>
          <FormField label="Email" error={signup.fieldErrors.email}>
            {(p) => <Input {...p} type="email" autoComplete="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />}
          </FormField>
          <FormField label="Password" error={signup.fieldErrors.password} hint="At least 8 characters, with a letter and a number.">
            {(p) => <Input {...p} type="password" autoComplete="new-password" value={form.password} onChange={set('password')} />}
          </FormField>
          <FormField label="Confirm password" error={signup.fieldErrors.confirmPassword}>
            {(p) => <Input {...p} type="password" autoComplete="new-password" value={form.confirmPassword} onChange={set('confirmPassword')} />}
          </FormField>
          <Button type="submit" className="mt-1 h-10 w-full" disabled={signup.pending}>
            {signup.pending ? 'Creating account…' : 'Create account'}
          </Button>
        </FieldGroup>
      </form>
    </AuthFrame>
  )
}
