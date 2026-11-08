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
import { useMutation } from '@/lib/hooks'
import { fmtDay, fmtRange } from '@/lib/format'
import type { Activity } from '@shared/types'

export function WhenWhere({ activity, withDate = false }: { activity: Activity; withDate?: boolean }): React.JSX.Element {
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
export function SignupButton({ activity, onChange, size = 'default' }: { activity: Activity; onChange: () => void; size?: 'default' | 'sm' }): React.JSX.Element {
  const join = useMutation('signups.join')
  const cancel = useMutation('signups.cancel')
  const [confirming, setConfirming] = useState(false)
  const full = activity.confirmed >= activity.capacity

  const doJoin = async (): Promise<void> => {
    const r = await join.run(activity.id)
    if (!r) return
    if (r.status === 'confirmed') toast.success(`You’re signed up for ${activity.title}.`, { description: 'A confirmation is in your notifications.' })
    else toast.success(`You’re #${r.position} on the waitlist.`, { description: 'We’ll notify you if a spot opens.' })
    onChange()
  }

  if (activity.mySignup) {
    return (
      <>
        <Button variant="outline" size={size} onClick={() => setConfirming(true)} disabled={cancel.pending}>
          {activity.mySignup === 'waitlisted' ? 'Leave waitlist' : 'Cancel sign-up'}
        </Button>
        <AlertDialog open={confirming} onOpenChange={setConfirming}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{activity.mySignup === 'waitlisted' ? 'Leave the waitlist?' : 'Cancel this shift?'}</AlertDialogTitle>
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
                    onChange()
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
    <Button variant={full ? 'outline' : 'default'} size={size} onClick={doJoin} disabled={join.pending}>
      {join.pending ? 'Saving…' : full ? 'Join waitlist' : 'Sign up'}
    </Button>
  )
}

/** The catalog card from the Browse mockup. */
export function ActivityCard({ activity, onChange }: { activity: Activity; onChange: () => void }): React.JSX.Element {
  return (
    <article className="flex flex-col rounded-xl border bg-card p-4 transition-shadow hover:shadow-[0_2px_4px_rgb(0_0_0/0.04),0_12px_28px_-16px_rgb(0_0_0/0.18)]">
      <div className="flex items-center justify-between gap-2">
        <Pill tone="outline">{activity.type}</Pill>
        <span className="text-xs text-muted-foreground">{fmtDay(activity.startAt)}</span>
      </div>
      <h3 className="mt-3 font-semibold">
        <Link to={`/activities/${activity.id}`} className="hover:underline">
          {activity.title}
        </Link>
      </h3>
      <div className="mt-2">
        <WhenWhere activity={activity} />
      </div>
      {activity.skills.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Skills needed">
          {activity.skills.map((s) => (
            <li key={s.id}>
              <Pill>{s.name}</Pill>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto flex items-end gap-4 pt-4">
        <CapacityBar activity={activity} className="flex-1" />
        {activity.mySignup ? <SignupPill status={activity.mySignup} position={activity.myWaitlistPosition} /> : <SignupButton activity={activity} onChange={onChange} />}
      </div>
    </article>
  )
}

/** Big date tile used in shift lists. */
export function DateTile({ stamp }: { stamp: string }): React.JSX.Element {
  const d = new Date(stamp)
  return (
    <div className="grid w-12 shrink-0 place-items-center rounded-lg bg-muted py-1.5 leading-none" aria-hidden>
      <span className="text-[11px] font-semibold text-muted-foreground uppercase">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
      <span className="mt-1 text-lg font-semibold tabular">{d.getDate()}</span>
    </div>
  )
}
