/** My shifts: everything the volunteer is confirmed or waitlisted for. */
import { Link } from 'react-router'
import { CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState, Loader, PageBody, PageHeader } from '@/components/page'
import { SignupPill } from '@/components/status'
import { DateTile, SignupButton } from '@/components/activity'
import { useQuery } from '@/lib/hooks'
import { fmtDay, fmtRange } from '@/lib/format'

export function MyShifts(): React.JSX.Element {
  const q = useQuery('signups.mine')
  return (
    <>
      <PageHeader
        title="My shifts"
        subtitle="Shifts you’re signed up for or waiting on. You can cancel any time before a shift starts."
        actions={
          <Button asChild>
            <Link to="/activities">Find more</Link>
          </Button>
        }
      />
      <PageBody>
        <Loader query={q} skeleton="table">
          {(list) =>
            list.length === 0 ? (
              <EmptyState
                icon={<CalendarDays />}
                title="You have no upcoming shifts"
                description="Browse activities to find one that fits your schedule."
                action={
                  <Button asChild>
                    <Link to="/activities">Find activities</Link>
                  </Button>
                }
              />
            ) : (
              <ul className="divide-y rounded-xl border bg-card">
                {list.map((a) => (
                  <li key={a.id} className="flex flex-wrap items-center gap-4 p-4">
                    <DateTile stamp={a.startAt} />
                    <div className="min-w-0 flex-1">
                      <Link to={`/activities/${a.id}`} className="font-medium hover:underline">
                        {a.title}
                      </Link>
                      <p className="text-sm text-muted-foreground tabular">
                        {fmtDay(a.startAt)} · {fmtRange(a.startAt, a.endAt)} · {a.location}
                      </p>
                    </div>
                    <SignupPill status={a.mySignup!} position={a.myWaitlistPosition} />
                    <SignupButton activity={a} onChange={q.reload} size="sm" />
                  </li>
                ))}
              </ul>
            )
          }
        </Loader>
      </PageBody>
    </>
  )
}
