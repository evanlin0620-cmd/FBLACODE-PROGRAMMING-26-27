/**
 * Log in and sign up. Public sign-up always creates a volunteer account;
 * admins are added by another admin in Settings.
 */
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Check, Eye, EyeOff, Heart, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup } from '@/components/ui/field'
import { Checkbox } from '@/components/ui/checkbox'
import { FormField } from '@/components/form'
import { FanDeck } from '@/components/fan-deck'
import { TypeBand } from '@/components/activity'
import { Slots } from '@/components/slots'
import { useMutation, useQuery } from '@/lib/hooks'
import { useSession } from '@/lib/session'
import { fmtDay, fmtTime, spotsLabel } from '@/lib/format'
import { FREE_DAY, MIN_MATCH, scoreActivity } from '@shared/recommendations'
import {
  ACTIVITY_TYPES,
  WEEKDAYS,
  type Activity,
  type ActivityType,
  type SessionUser
} from '@shared/types'

const DEMO = {
  volunteer: { email: 'maria@servehub.test', password: 'Volunteer2026' },
  admin: { email: 'admin@servehub.test', password: 'ServeHub2026' }
}

function Brand({ className }: { className?: string }): React.JSX.Element {
  return (
    <p className={cn('flex items-center gap-2 text-[17px] font-medium', className)}>
      <span className="grid size-7 place-items-center rounded-md bg-paper-ink text-paper">
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
              <span
                key={i}
                className={cn('h-3 w-1.5 rounded-[2px]', n ? 'bg-[#404040]' : 'bg-[#e2e2e2]')}
              />
            ))}
          </span>
          <span className="font-mono text-[11px] text-[#5e554a] tabular-nums">
            {SHEET.length - filled} spots left
          </span>
        </div>
      </div>
    </div>
  )
}

function AuthFrame({
  title,
  subtitle,
  children,
  footer,
  hero,
  wide
}: {
  title: string
  subtitle: ReactNode
  children: ReactNode
  footer: ReactNode
  /** Replaces the clipboard panel on the left. */
  hero?: ReactNode
  wide?: boolean
}): React.JSX.Element {
  const { org } = useSession()
  return (
    <main className="grid min-h-svh md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <section
        className="relative hidden flex-col overflow-hidden bg-paper px-12 pt-10 text-paper-ink md:sticky md:top-0 md:flex md:h-svh [@media(max-height:720px)]:pt-6"
        aria-label="About ServeHub"
      >
        {hero ?? (
          <>
            <Brand />
            <p className="mt-10 max-w-[30rem] font-serif text-[44px] [@media(max-height:720px)]:mt-6 leading-[1.04] tracking-[-0.02em] lg:text-[52px]">
              Every shift’s sign-up sheet, in one place
            </p>
            <p className="mt-5 max-w-[28rem] text-[17px] leading-7 text-paper-ink-2 [@media(max-height:720px)]:hidden">
              Volunteers pick shifts and log their hours. Coordinators approve them and see what the
              hours added up to.
            </p>
            {/* Under 720px tall (the 960x640 minimum) the explainer above hides so the whole sheet stays in view. */}
            <div className="mt-auto animate-settle pt-6 pb-12 [@media(max-height:720px)]:pt-4 [@media(max-height:720px)]:pb-5">
              <Clipboard org={org} />
            </div>
          </>
        )}
      </section>
      <section className="flex flex-col justify-center bg-card px-6 py-10 md:px-12 lg:px-16">
        <div className={cn('mx-auto w-full', wide ? 'max-w-[440px]' : 'max-w-[360px]')}>
          <Brand className="mb-8 md:hidden" />
          <h1 className="text-2xl font-medium">{title}</h1>
          <p className="mt-1 mb-8 text-sm text-text-2">{subtitle}</p>
          {children}
          <p className="mt-4 text-center text-sm text-text-2">{footer}</p>
        </div>
        <p className="mx-auto mt-16 flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="size-3.5" strokeWidth={1.5} aria-hidden /> Works offline. Your data stays
          on this computer
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
    navigate(u.role === 'admin' ? '/admin' : '/dashboard', {
      replace: true,
      state: { welcome: true }
    })
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
          <Link
            to="/signup"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
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

/** Mon to Sun on screen; the numbers are the app's weekdays (0 = Sunday). */
const WEEK = [1, 2, 3, 4, 5, 6, 0]

/** A round or pill toggle for the two sign-up questions. */
function Toggle({
  on,
  onClick,
  label,
  children,
  round
}: {
  on: boolean
  onClick: () => void
  label?: string
  children: ReactNode
  round?: boolean
}): React.JSX.Element {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={label}
      onClick={onClick}
      className={cn(
        'h-8 border text-sm transition-[background-color,border-color,color,scale] duration-150 ease-snappy active:scale-95',
        round ? 'w-8 rounded-full' : 'flex items-center gap-1.5 rounded-full px-3',
        on
          ? 'border-foreground bg-foreground text-background'
          : 'bg-card text-text-2 hover:border-input hover:text-foreground'
      )}
    >
      {on && !round && <Check className="size-3.5" strokeWidth={2.5} aria-hidden />}
      {children}
    </button>
  )
}

/** One shift as a card in the deck. */
function ShiftCard({
  a,
  score,
  top
}: {
  a: Activity
  score: number | null
  top: boolean
}): React.JSX.Element {
  return (
    <span className="flex h-full flex-col">
      <TypeBand type={a.type} className="h-[42%]" badge={score !== null && `${score}% match`} />
      <span className="flex flex-1 flex-col p-4">
        <span className="font-mono text-[11px] text-muted-foreground">{a.type}</span>
        <span className="mt-0.5 text-[15px] leading-snug font-medium">{a.title}</span>
        <span className="mt-1 text-xs text-text-2 tabular-nums">
          {fmtDay(a.startAt)} · {fmtTime(a.startAt)}
        </span>
        <span className="mt-auto flex flex-col items-start gap-1.5">
          <span className={cn('font-mono text-[11px] text-muted-foreground', !top && 'invisible')}>
            {spotsLabel(a)}
          </span>
          <Slots filled={a.confirmed} total={a.capacity} label={spotsLabel(a)} />
        </span>
      </span>
    </span>
  )
}

/** The three password rules the app enforces, filled in as they're met. */
const RULES: [string, (p: string) => boolean][] = [
  ['8+ characters', (p) => p.length >= 8],
  ['a letter', (p) => /[a-z]/i.test(p)],
  ['a number', (p) => /\d/.test(p)]
]
function Strength({ value }: { value: string }): React.JSX.Element {
  const missing = RULES.filter(([, ok]) => !ok(value)).map(([label]) => label)
  return (
    <>
      <span className="flex gap-1" aria-hidden>
        {RULES.map(([label], i) => (
          <span
            key={label}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-200',
              i < 3 - missing.length ? 'bg-primary' : 'bg-track'
            )}
          />
        ))}
      </span>
      <span className="mt-1.5 block">
        {missing.length ? `Still needs ${missing.join(', ')}` : 'Strong enough'}
      </span>
    </>
  )
}

export function SignupPage(): React.JSX.Element {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [interests, setInterests] = useState<ActivityType[]>([])
  const [freeDays, setFreeDays] = useState<number[]>([])
  const [show, setShow] = useState(false)
  const [hold, setHold] = useState(true)
  const [top, setTop] = useState<Activity | null>(null)
  const deck = useQuery('activities.preview')
  const signup = useMutation('auth.signup')
  const join = useMutation('signups.join')
  const land = useLanding()
  const { org } = useSession()
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [k]: e.target.value })
    signup.clearField(k)
  }
  const flip = <V,>(list: V[], v: V): V[] =>
    list.includes(v) ? list.filter((x) => x !== v) : [...list, v]

  // Score the deck with the same rules the dashboard uses, from the two answers alone.
  const answered = interests.length + freeDays.length > 0
  const profile = {
    skills: [],
    interests,
    availability: freeDays.map((weekday) => ({ weekday, ...FREE_DAY }))
  }
  const score = (a: Activity): number | null => (answered ? scoreActivity(a, profile).score : null)
  // Same bar as the dashboard: under MIN_MATCH a shift isn't called a fit, so the deck isn't reshuffled for it.
  const ranked = answered ? [...(deck.data ?? [])].sort((x, y) => score(y)! - score(x)!)[0] : undefined
  const best = ranked && score(ranked)! >= MIN_MATCH ? ranked : undefined

  const submit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    const u = await signup.run({ ...form, interests, freeDays })
    if (!u) return
    // The account (and its session) exists now, so the held spot goes through the normal sign-up rules.
    const r = hold && top ? await join.run(top.id) : undefined
    if (r && top)
      toast.success(
        r.status === 'confirmed'
          ? `Account created. You’re signed up for ${top.title}`
          : `Account created. You’re #${r.position} on the waitlist for ${top.title}`
      )
    else toast.success('Account created')
    land(u)
  }

  return (
    <AuthFrame
      wide
      title="Create your account"
      subtitle={
        <>
          Volunteer with <Org />. Two quick questions, then your details.
        </>
      }
      footer={
        <>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
      hero={
        <>
          <Brand />
          <p className="mt-8 max-w-[26rem] font-serif text-[40px] leading-[1.05] tracking-[-0.02em] lg:text-[44px] [@media(max-height:720px)]:mt-5">
            Pick a shift. We’ll hold your spot.
          </p>
          <p className="mt-2 text-[15px] text-paper-ink-2" aria-live="polite">
            {best
              ? `Best fit so far: ${best.title}, ${score(best)}% match.`
              : answered
                ? 'Nothing here fits those answers well yet. Try another day or interest.'
                : 'Answer the two questions and watch the deck sort itself.'}
          </p>
          <div className="mt-auto pt-6 pb-8 [@media(max-height:720px)]:pb-5">
            {deck.data === undefined ? null : deck.data.length > 0 ? (
              <FanDeck
                cards={deck.data}
                label="Open shifts"
                promote={best?.id}
                onTop={setTop}
                render={(a, isTop) => <ShiftCard a={a} score={score(a)} top={isTop} />}
              />
            ) : (
              <Clipboard org={org} />
            )}
          </div>
        </>
      }
    >
      <form onSubmit={submit} noValidate>
        <FieldGroup className="gap-5">
          <fieldset>
            <legend className="mb-2 text-sm font-medium">What do you like doing?</legend>
            <div className="flex flex-wrap gap-2">
              {ACTIVITY_TYPES.map((t) => (
                <Toggle
                  key={t}
                  on={interests.includes(t)}
                  onClick={() => setInterests(flip(interests, t))}
                >
                  {t}
                </Toggle>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Which days are you usually free?</legend>
            <div className="flex gap-2">
              {WEEK.map((d) => (
                <Toggle
                  key={d}
                  round
                  on={freeDays.includes(d)}
                  label={WEEKDAYS[d]}
                  onClick={() => setFreeDays(flip(freeDays, d))}
                >
                  {WEEKDAYS[d][0]}
                </Toggle>
              ))}
            </div>
          </fieldset>
          <div className="grid grid-cols-2 gap-3 border-t pt-5">
            <FormField label="Full name" error={signup.fieldErrors.fullName}>
              {(p) => (
                <Input
                  {...p}
                  autoComplete="name"
                  value={form.fullName}
                  onChange={set('fullName')}
                />
              )}
            </FormField>
            <FormField label="Email" error={signup.fieldErrors.email}>
              {(p) => (
                <Input
                  {...p}
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="you@example.com"
                />
              )}
            </FormField>
            <FormField
              label="Password"
              error={signup.fieldErrors.password}
              hint={<Strength value={form.password} />}
            >
              {(p) => (
                <span className="relative block">
                  <Input
                    {...p}
                    className="pr-10"
                    type={show ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={set('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    aria-label={show ? 'Hide passwords' : 'Show passwords'}
                    aria-pressed={show}
                    className="absolute top-0.5 right-0.5 grid size-8 place-items-center rounded-md text-muted-foreground hover:text-foreground"
                  >
                    {show ? (
                      <EyeOff className="size-4" strokeWidth={1.5} aria-hidden />
                    ) : (
                      <Eye className="size-4" strokeWidth={1.5} aria-hidden />
                    )}
                  </button>
                </span>
              )}
            </FormField>
            <FormField label="Confirm password" error={signup.fieldErrors.confirmPassword}>
              {(p) => (
                <Input
                  {...p}
                  type={show ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                />
              )}
            </FormField>
          </div>
          {top && (
            <label className="flex items-center gap-2.5 text-sm">
              <Checkbox checked={hold} onCheckedChange={(v) => setHold(v === true)} />
              <span>
                Hold my spot at <span className="font-medium">{top.title}</span>
                <span className="text-muted-foreground"> · {fmtDay(top.startAt)}</span>
              </span>
            </label>
          )}
          <Button type="submit" className="h-10 w-full" disabled={signup.pending || join.pending}>
            <span className="truncate">
              {signup.pending || join.pending
                ? 'Creating account…'
                : hold && top
                  ? `Create account and join ${top.title}`
                  : 'Create account'}
            </span>
          </Button>
        </FieldGroup>
      </form>
    </AuthFrame>
  )
}
