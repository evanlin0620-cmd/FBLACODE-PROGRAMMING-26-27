/** One activity in full: description, skills, capacity, and the sign-up controls. */
import { Link, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Loader, PageBody, PageHeader, Panel } from '@/components/page'
import { CapacityBar, Pill, SignupPill } from '@/components/status'
import { SignupButton, WhenWhere } from '@/components/activity'
import { useQuery } from '@/lib/hooks'

export function ActivityDetail(): React.JSX.Element {
  const id = Number(useParams().id)
  const q = useQuery('activities.get', id)
  return (
    <>
      <PageHeader
        title={q.data?.title ?? 'Activity'}
        subtitle={q.data ? `${q.data.type}` : undefined}
        actions={
          <Button variant="outline" asChild>
            <Link to="/activities">
              <ArrowLeft aria-hidden /> All activities
            </Link>
          </Button>
        }
      />
      <PageBody>
        <Loader query={q} skeleton="form">
          {(a) => (
            <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
              <Panel title="About this shift">
                <p className="max-w-[65ch] leading-relaxed">{a.description}</p>
                {a.skills.length > 0 && (
                  <>
                    <h3 className="mt-6 text-sm font-semibold">Skills that help</h3>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {a.skills.map((s) => (
                        <li key={s.id}>
                          <Pill>{s.name}</Pill>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </Panel>
              <Panel title="When and where">
                <WhenWhere activity={a} withDate />
                <CapacityBar activity={a} className="mt-5" />
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {a.mySignup && <SignupPill status={a.mySignup} position={a.myWaitlistPosition} />}
                  <SignupButton activity={a} onChange={q.reload} />
                </div>
                {a.mySignup === 'waitlisted' && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    You’re #{a.myWaitlistPosition} in line. If someone cancels, you move up automatically and we’ll notify you.
                  </p>
                )}
              </Panel>
            </div>
          )}
        </Loader>
      </PageBody>
    </>
  )
}
