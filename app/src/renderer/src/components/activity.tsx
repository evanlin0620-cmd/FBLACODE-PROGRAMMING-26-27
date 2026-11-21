/**
 * Activity pieces shared by the volunteer screens: the catalog card, the
 * sign-up button (which knows about waitlists), and small detail rows.
 */
import { useState } from 'react'
import { Link } from 'react-router'
import { CalendarDays, Clock, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { CapacityBar, Pill, SignupPill } from '@/components/status'
import { refreshNavCounts, useMutation } from '@/lib/hooks'
import { fmtDay, fmtRange } from '@/lib/format'
import { cn, withViewTransition } from '@/lib/utils'
import type { Activity, ActivityType } from '@shared/types'
import { TYPE_STYLE, typeGradient } from '@/lib/activity-style'

/** The tinted art band at the top of a shift card, with an optional badge (a match score) in the corner. */
export function TypeBand({
  type,
  badge,
  className
}: {
  type: ActivityType
  badge?: React.ReactNode
  className?: string
}): React.JSX.Element {
  const { Icon } = TYPE_STYLE[type]
  return (
    <div
      className={cn('relative h-20 shrink-0 overflow-hidden', className)}
      style={{ background: typeGradient(type) }}
    >
      <Icon
        className="absolute -right-3 -bottom-4 size-24 text-white/20"
        strokeWidth={1}
        aria-hidden
      />
      <Icon className="absolute top-3 left-3 size-5 text-white" strokeWidth={1.75} aria-hidden />
      {badge && (
        <span className="absolute top-3 right-3 rounded-full bg-white px-2 py-0.5 text-xs font-medium text-[#171717] tabular-nums">
          {badge}
        </span>
      )}
    </div>
  )
}

export function WhenWhere({
  activity,
  withDate = false
}: {
  activity: Activity
  withDate?: boolean
}): React.JSX.Element {
  return (
    <ul className="space-y-1 text-sm text-muted-foreground">
      {withDate && (
        <li className="flex items-center gap-2">
          <CalendarDays className="size-4 shrink-0" aria-hidden />
          {fmtDay(activity.startAt)}
        </li>
      )}
      <li className="flex items-center gap-2">
        <Clock className="size-4 shrink-0" aria-hidden />
        <span className="tabular">{fmtRange(activity.startAt, activity.endAt)}</span>
      </li>
      <li className="flex items-center gap-2">
        <MapPin className="size-4 shrink-0" aria-hidden />
        <span className="truncate">{activity.location}</span>
      </li>
    </ul>
  )
}

/** Sign up, join the waitlist, or cancel, depending on where the volunteer stands. */
export function SignupButton({
  activity,
  onChange,
  size = 'default'
}: {
  activity: Activity
  /** Reloads the list; passed to withViewTransition so the button-to-pill swap and moved rows animate. */
  onChange: () => Promise<unknown>
  size?: 'default' | 'sm'
}): React.JSX.Element {
  const join = useMutation('signups.join')
  const cancel = useMutation('signups.cancel')
  const [confirming, setConfirming] = useState(false)
  const full = activity.confirmed >= activity.capacity

  const doJoin = async (): Promise<void> => {
    const r = await join.run(activity.id)
    if (!r) return
    if (r.status === 'confirmed')
      toast.success(`You’re signed up for ${activity.title}.`, {
        description: 'A confirmation is in your notifications.'
      })
    else
      toast.success(`You’re #${r.position} on the waitlist.`, {
        description: 'We’ll notify you if a spot opens.'
      })
    withViewTransition(onChange)
    refreshNavCounts()
  }

  if (activity.mySignup) {
    return (
      <>
        <Button
          variant="outline"
          size={size}
          onClick={() => setConfirming(true)}
          disabled={cancel.pending}
          aria-label={`${activity.mySignup === 'waitlisted' ? 'Leave waitlist' : 'Cancel sign-up'} for ${activity.title}`}
        >
          {activity.mySignup === 'waitlisted' ? 'Leave waitlist' : 'Cancel sign-up'}
        </Button>
        <AlertDialog open={confirming} onOpenChange={setConfirming}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {activity.mySignup === 'waitlisted' ? 'Leave the waitlist?' : 'Cancel this shift?'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {activity.mySignup === 'waitlisted'
                  ? `You’ll lose your place in line for ${activity.title}.`
                  : `Your spot for ${activity.title} on ${fmtDay(activity.startAt)} goes to the next person on the waitlist.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep it</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  if (await cancel.run(activity.id).then((r) => r !== undefined)) {
                    toast.success('Cancelled.')
                    withViewTransition(onChange)
                    refreshNavCounts()
                  }
                }}
              >
                {activity.mySignup === 'waitlisted' ? 'Leave waitlist' : 'Cancel shift'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  return (
    // The visible label starts the accessible name, so voice control still matches "Sign up".
    <Button
      variant={full ? 'outline' : 'default'}
      size={size}
      onClick={doJoin}
      disabled={join.pending}
      aria-label={
        join.pending ? undefined : `${full ? 'Join waitlist' : 'Sign up'} for ${activity.title}`
      }
    >
      {join.pending ? 'Saving…' : full ? 'Join waitlist' : 'Sign up'}
    </Button>
  )
}

/** The catalog card from the Browse mockup. */
export function ActivityCard({
  activity,
  onChange
}: {
  activity: Activity
  onChange: () => Promise<unknown>
}): React.JSX.Element {
  return (
    // Named so signing up crossfades this card (button to pill, bar growing) in place.
    <article
      className="flex flex-col overflow-hidden rounded-2xl border bg-card transition-colors duration-150 hover:border-foreground/15"
      style={{ viewTransitionName: `card-${activity.id}` }}
    >
      <TypeBand type={activity.type} className="h-16" />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] text-muted-foreground">{activity.type}</span>
          <span className="text-xs text-muted-foreground">{fmtDay(activity.startAt)}</span>
        </div>
        <h3 className="mt-1 font-medium">
          <Link to={`/activities/${activity.id}`} className="hover:underline">
            {activity.title}
          </Link>
        </h3>
        <div className="mt-2">
          <WhenWhere activity={activity} />
        </div>
        {activity.skills.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Skills needed">
            {/* Capped so one skill-heavy card doesn't stretch its whole grid row; the detail page lists them all. */}
            {activity.skills.slice(0, 3).map((s) => (
              <li key={s.id}>
                <Pill>{s.name}</Pill>
              </li>
            ))}
            {activity.skills.length > 3 && (
              <li>
                <Pill tone="outline">
                  +{activity.skills.length - 3}
                  <span className="sr-only">
                    {' '}
                    more skills:{' '}
                    {activity.skills
                      .slice(3)
                      .map((s) => s.name)
                      .join(', ')}
                  </span>
                </Pill>
              </li>
            )}
          </ul>
        )}
        <div className="mt-auto flex items-end gap-4 pt-4">
          <CapacityBar activity={activity} className="flex-1" />
          {activity.mySignup ? (
            <SignupPill status={activity.mySignup} position={activity.myWaitlistPosition} />
          ) : (
            <SignupButton activity={activity} onChange={onChange} />
          )}
        </div>
      </div>
    </article>
  )
}

/** Big date tile used in shift lists. */
export function DateTile({ stamp }: { stamp: string }): React.JSX.Element {
  const d = new Date(stamp)
  return (
    <div className="w-10 shrink-0 text-center leading-tight" aria-hidden>
      <span className="block text-xs text-muted-foreground">
        {d.toLocaleDateString('en-US', { month: 'short' })}
      </span>
      <span className="block text-lg font-medium tabular-nums">{d.getDate()}</span>
    </div>
  )
}
