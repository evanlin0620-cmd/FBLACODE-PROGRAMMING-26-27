/**
 * Sign-in and create-account forms for the redesign. Validation runs the app's own zod schemas
 * (loginSchema / signupSchema), so every message matches the real app word for word.
 */
import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { fieldErrors, loginSchema, signupSchema } from '@shared/schemas'

type Errors = Record<string, string>

/** After a failed submit, focus the first field with an error (in form order) so keyboard users land on it. */
const focusFirst = (errors: Errors, ids: Record<string, string>): void => {
  const k = Object.keys(ids).find((key) => errors[key])
  if (k) document.getElementById(ids[k]!)?.focus()
}

/** Clears one field's error as soon as the user edits it. */
const without = (errors: Errors, k: string): Errors => {
  const next = { ...errors }
  delete next[k]
  return next
}

/** Label, input, optional hint, and an error that replaces the hint and is announced with the field. */
function Field({
  id,
  label,
  error,
  hint,
  ...input
}: { id: string; label: string; error?: string; hint?: string } & React.ComponentProps<typeof Input>): React.JSX.Element {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={error ? 'text-destructive' : undefined}>
        {label}
      </Label>
      <Input id={id} className="h-10" aria-invalid={error ? true : undefined} aria-describedby={describedBy} {...input} />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

/** Brief pending state on submit; nothing authenticates in the prototype. */
function useBusy(): [boolean, () => void] {
  const [busy, setBusy] = useState(false)
  return [busy, () => (setBusy(true), void setTimeout(() => setBusy(false), 1200))]
}

export function SignInForm({ org, onCreate }: { org: string; onCreate: () => void }): React.JSX.Element {
  const [demo, setDemo] = useState<'volunteer' | 'admin' | null>(null)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [busy, start] = useBusy()
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [k]: e.target.value })
    setDemo(null)
    setErrors((e) => without(e, k))
  }
  const pick = (r: 'volunteer' | 'admin'): void => {
    setDemo(r)
    setForm({ email: r === 'volunteer' ? 'maria@servehub.test' : 'admin@servehub.test', password: 'demo-password' }) // shortcut: prototype only
    setErrors({})
  }
  return (
    <form
      className="mx-auto w-full max-w-[360px]"
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        const r = loginSchema.safeParse(form)
        if (!r.success) {
          const errs = fieldErrors(r.error)
          setErrors(errs)
          return focusFirst(errs, { email: 'u-email', password: 'u-pass' })
        }
        start()
      }}
    >
      <h2 className="text-2xl font-medium">Sign in</h2>
      <p className="mt-1 text-sm text-[var(--text-2)]">
        to <span className="font-medium text-foreground">{org}</span>. Volunteers and staff use the same sign-in.
      </p>

      <p className="mt-8 text-sm font-medium" id="u-demo">
        Try a demo account
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2" role="group" aria-labelledby="u-demo">
        {(['volunteer', 'admin'] as const).map((r) => (
          <Button
            key={r}
            type="button"
            variant="outline"
            aria-pressed={demo === r}
            onClick={() => pick(r)}
            className="aria-pressed:border-foreground aria-pressed:bg-white aria-pressed:shadow-[inset_0_0_0_1px_var(--foreground)]"
          >
            {demo === r && <Check className="size-4" strokeWidth={1.75} aria-hidden />}
            {r === 'volunteer' ? 'Volunteer' : 'Admin'}
          </Button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <Field id="u-email" label="Email" type="email" autoComplete="username" placeholder="you@example.com" value={form.email} onChange={set('email')} error={errors.email} />
        <Field id="u-pass" label="Password" type="password" autoComplete="current-password" placeholder="Password" value={form.password} onChange={set('password')} error={errors.password} />
      </div>
      <Button type="submit" className="mt-6 h-10 w-full" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in'}
      </Button>
      <p className="mt-4 text-center text-sm text-[var(--text-2)]">
        New here?{' '}
        <button type="button" onClick={onCreate} className="font-medium text-foreground underline-offset-4 hover:underline">
          Create an account
        </button>
      </p>
    </form>
  )
}

export function CreateAccountForm({ org, onSignIn }: { org: string; onSignIn: () => void }): React.JSX.Element {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [busy, start] = useBusy()
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [k]: e.target.value })
    setErrors((e) => without(e, k))
  }
  return (
    <form
      className="mx-auto w-full max-w-[360px]"
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        const r = signupSchema.safeParse(form)
        if (!r.success) {
          const errs = fieldErrors(r.error)
          setErrors(errs)
          return focusFirst(errs, { fullName: 'c-name', email: 'c-email', password: 'c-pass', confirmPassword: 'c-confirm' })
        }
        start()
      }}
    >
      <h2 className="text-2xl font-medium">Create your account</h2>
      <p className="mt-1 text-sm text-[var(--text-2)]">
        Volunteer with <span className="font-medium text-foreground">{org}</span>. Coordinators add staff accounts in Settings.
      </p>
      <div className="mt-8 space-y-4">
        <Field id="c-name" label="Full name" autoComplete="name" autoFocus value={form.fullName} onChange={set('fullName')} error={errors.fullName} />
        <Field id="c-email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set('email')} error={errors.email} />
        <Field
          id="c-pass"
          label="Password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={set('password')}
          error={errors.password}
          hint="At least 8 characters, with a letter and a number"
        />
        <Field id="c-confirm" label="Confirm password" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} />
      </div>
      <Button type="submit" className="mt-6 h-10 w-full" disabled={busy}>
        {busy ? 'Creating account…' : 'Create account'}
      </Button>
      <p className="mt-4 text-center text-sm text-[var(--text-2)]">
        Already have an account?{' '}
        <button type="button" onClick={onSignIn} className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign in
        </button>
      </p>
    </form>
  )
}
