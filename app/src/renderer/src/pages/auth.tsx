/**
 * Log in and sign up. Public sign-up always creates a volunteer account;
 * admins are added by another admin in Settings.
 */
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { Heart, Lock } from 'lucide-react'
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

function AuthFrame({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }): React.JSX.Element {
  return (
    <main className="grid min-h-svh place-items-center bg-muted/60 px-4 py-10">
      <div className="w-full max-w-[400px]">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Heart className="size-[18px]" strokeWidth={2.4} aria-hidden />
          </span>
          <span className="text-xl font-semibold">ServeHub</span>
        </div>
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
    navigate(u.role === 'admin' ? '/admin' : '/dashboard', { replace: true })
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
