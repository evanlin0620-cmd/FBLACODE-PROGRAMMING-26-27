/**
 * Log in and sign up. Public sign-up always creates a volunteer account;
 * admins are added by another admin in Settings.
 */
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { Check, Heart, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
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
    <p className={cn('flex items-center gap-2 text-[17px] font-medium', className)}>
      <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
        <Heart className="size-4" strokeWidth={2} aria-hidden />
      </span>
      ServeHub
    </p>
  )
}

const SHEET = ['Maria Lopez', 'James Carter', 'Aisha Rahman', 'Tom Nguyen', '', '']

/** The one moment on the screen: a clipboard and sign-up sheet, built in code so it stays sharp and offline. */
function Clipboard({ org }: { org: string }): React.JSX.Element {
  const filled = SHEET.filter(Boolean).length
  return (
    // A picture of the product: one short description for screen readers instead of every line of the sheet.
    <div
      role="img"
      aria-label={`Example sign-up sheet for Creek Cleanup with ${filled} of ${SHEET.length} spots filled`}
      className="relative mx-auto w-full max-w-[400px] -rotate-1 rounded-2xl bg-[linear-gradient(180deg,#c9a57b,#bb9568)] p-5 pt-10 shadow-[0_1px_2px_rgb(0_0_0/0.08),0_16px_40px_-12px_rgb(60_40_20/0.35)]"
    >
      <div className="absolute top-[-14px] left-1/2 h-11 w-32 -translate-x-1/2 rounded-lg bg-[linear-gradient(180deg,#e4e4e4,#a9a9a9)] shadow-[inset_0_1px_0_rgb(255_255_255/0.7),0_2px_4px_rgb(0_0_0/0.25)]">
        <div className="mx-auto mt-3 h-2 w-16 rounded-full bg-[#8f8f8f] shadow-[inset_0_1px_1px_rgb(0_0_0/0.35)]" />
      </div>
      {/* The sheet is paper in both themes. */}
      <div className="rounded-[4px] bg-[#fffdf8] px-6 pt-6 pb-4 text-[#1f1b16] shadow-[0_1px_2px_rgb(0_0_0/0.1)]">
        <p className="truncate font-mono text-[11px] text-[#5e554a]">{org} · volunteer sign-up</p>
        <p className="mt-1 font-serif text-2xl leading-tight">Creek Cleanup</p>
        <p className="mt-1 text-xs text-[#5e554a]">Sat, Dec 5 · 8:00 AM – 12:00 PM</p>
        <ol className="mt-4">
          {SHEET.map((name, i) => (
            <li key={i} className="flex h-8 items-end gap-3 border-b border-[#ddd5c6] pb-1">
              <span className="w-4 font-mono text-[11px] text-[#5e554a] tabular-nums">{i + 1}</span>
              <span className="font-hand text-lg leading-none text-[#26387a]">{name}</span>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex items-center justify-between">
          <span className="flex gap-[3px]">
            {SHEET.map((n, i) => (
              <span key={i} className={cn('h-3 w-1.5 rounded-[2px]', n ? 'bg-[#404040]' : 'bg-[#e2e2e2]')} />
            ))}
          </span>
          <span className="font-mono text-[11px] text-[#5e554a] tabular-nums">{SHEET.length - filled} spots left</span>
        </div>
      </div>
    </div>
  )
}

function AuthFrame({ title, subtitle, children, footer }: { title: string; subtitle: ReactNode; children: ReactNode; footer: ReactNode }): React.JSX.Element {
  const { org } = useSession()
  return (
    <main className="grid min-h-svh md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <section className="relative hidden flex-col overflow-hidden bg-paper px-12 pt-10 text-paper-ink md:flex" aria-label="About ServeHub">
        <Brand />
        <p className="mt-10 max-w-[30rem] font-serif text-[44px] leading-[1.04] tracking-[-0.02em] lg:text-[52px]">Every shift’s sign-up sheet, in one place</p>
        <p className="mt-5 max-w-[28rem] text-[17px] leading-7 text-paper-ink-2">
          Volunteers pick shifts and log their hours. Coordinators approve them and see what the hours added up to.
        </p>
        <div className="mt-auto pt-6 pb-12">
          <Clipboard org={org} />
        </div>
      </section>
      <section className="flex flex-col justify-center bg-card px-6 py-10 md:px-16">
        <div className="mx-auto w-full max-w-[360px]">
          <Brand className="mb-8 md:hidden" />
          <h1 className="text-2xl font-medium">{title}</h1>
          <p className="mt-1 mb-8 text-sm text-text-2">{subtitle}</p>
          {children}
          <p className="mt-4 text-center text-sm text-text-2">{footer}</p>
        </div>
        <p className="mx-auto mt-16 flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="size-3.5" strokeWidth={1.5} aria-hidden /> Works offline. Your data stays on this computer
        </p>
      </section>
    </main>
  )
}

function Org(): React.JSX.Element {
  return <span className="font-medium text-foreground">{useSession().org}</span>
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
  const [demo, setDemo] = useState<'volunteer' | 'admin' | null>(null)
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
      title="Sign in"
      subtitle={
        <>
          to <Org />. Volunteers and staff use the same sign-in.
        </>
      }
      footer={
        <>
          New here?{' '}
          <Link to="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <div className="mb-6">
        <p className="mb-2 text-sm font-medium" id="demo-label">
          Try a demo account
        </p>
        <div className="grid grid-cols-2 gap-2" role="group" aria-labelledby="demo-label">
          {(['volunteer', 'admin'] as const).map((role) => (
            <Button
              key={role}
              type="button"
              variant="outline"
              aria-pressed={demo === role}
              className="aria-pressed:border-foreground aria-pressed:shadow-[inset_0_0_0_1px_var(--foreground)]"
              onClick={() => {
                setDemo(role)
                setEmail(DEMO[role].email)
                setPassword(DEMO[role].password)
                login.clearField('email')
                login.clearField('password')
              }}
            >
              {demo === role && <Check className="size-4" strokeWidth={1.75} aria-hidden />}
              {role === 'volunteer' ? 'Volunteer' : 'Admin'}
            </Button>
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
                autoComplete="username"
                autoFocus
                value={email}
                placeholder="you@example.com"
                onChange={(e) => {
                  setDemo(null)
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
                  setDemo(null)
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
      subtitle={
        <>
          Volunteer with <Org />. Coordinators add staff accounts in Settings.
        </>
      }
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
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
