/** Volunteer directory (search by name or skill) and each volunteer's record. */
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowLeft, Award, Search, UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EmptyState, Loader, PageBody, PageHeader, Panel } from '@/components/page'
import { HourPill, Meter, Pill, SignupPill } from '@/components/status'
import { CertificateView } from '@/components/certificate-view'
import { useMutation, useQuery } from '@/lib/hooks'
import { fmtDate, fmtDay, fmtHours, fmtRange, initials } from '@/lib/format'
import { WEEKDAYS, type Certificate } from '@shared/types'

export function VolunteerDirectory(): React.JSX.Element {
  const [q, setQ] = useState('')
  const [skill, setSkill] = useState('any')
  const skills = useQuery('skills.list')
  const list = useQuery('volunteers.search', { q: q.trim() || undefined, skillId: skill === 'any' ? undefined : Number(skill) })
  const navigate = useNavigate()

  return (
    <>
      <PageHeader title="Volunteers" subtitle="Find people by name, email, or skill, like “Spanish” or “Web designer”." />
      <PageBody>
        <div className="mb-4 flex flex-wrap gap-2" role="search">
          <div className="relative w-[320px]">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input data-page-search aria-label="Search volunteers" className="pl-9" placeholder="Name, email, or skill" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select value={skill} onValueChange={setSkill}>
            <SelectTrigger aria-label="Filter by skill" className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any skill</SelectItem>
              {skills.data?.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Loader query={list} skeleton="table">
          {(rows) =>
            rows.length === 0 ? (
              <EmptyState icon={<UserX />} title="No volunteers match" description="Try another name or skill." />
            ) : (
              <div className="rounded-xl border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-4">Volunteer</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead className="text-right">Approved hours</TableHead>
                      <TableHead className="pr-4 text-right">Upcoming shifts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((v) => (
                      <TableRow key={v.userId} className="cursor-pointer" onClick={() => navigate(`/admin/volunteers/${v.userId}`)}>
                        <TableCell className="pl-4">
                          <Link to={`/admin/volunteers/${v.userId}`} className="flex items-center gap-2.5 hover:underline" onClick={(e) => e.stopPropagation()}>
                            <span className="grid size-8 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground" aria-hidden>
                              {initials(v.fullName)}
                            </span>
                            <span>
                              <span className="block font-medium">{v.fullName}</span>
                              <span className="block text-xs text-muted-foreground">{v.email}</span>
                            </span>
                          </Link>
                        </TableCell>
                        <TableCell className="whitespace-normal">
                          <div className="flex flex-wrap gap-1">
                            {v.skills.length === 0 ? <span className="text-sm text-muted-foreground">None listed</span> : v.skills.map((s) => <Pill key={s}>{s}</Pill>)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">{fmtHours(v.approvedHours)}</TableCell>
                        <TableCell className="pr-4 text-right">{v.upcomingShifts}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          }
        </Loader>
      </PageBody>
    </>
  )
}

export function VolunteerRecord(): React.JSX.Element {
  const id = Number(useParams().id)
  const q = useQuery('volunteers.get', id)
  const issue = useMutation('certificates.issue')
  const [cert, setCert] = useState<Certificate | null>(null)

  return (
    <>
      <PageHeader
        title={q.data?.profile.fullName ?? 'Volunteer'}
        subtitle={q.data?.profile.email}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/admin/volunteers">
                <ArrowLeft aria-hidden /> All volunteers
              </Link>
            </Button>
            <Button
              disabled={issue.pending}
              onClick={async () => {
                const c = await issue.run(id)
                if (c) setCert(c)
              }}
            >
              <Award aria-hidden /> Issue certificate
            </Button>
          </>
        }
      />
      <PageBody>
        <Loader query={q} skeleton="form">
          {({ profile, hours, signups, approvedHours }) => (
            <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
              <div className="space-y-5">
                <Panel title="Hours">
                  <p className="flex items-baseline gap-2">
                    <span className="text-3xl font-semibold tabular">{fmtHours(approvedHours)}</span>
                    <span className="text-sm text-muted-foreground">of {profile.hourGoal} hour goal</span>
                  </p>
                  <div className="mt-3">
                    <Meter value={approvedHours} max={profile.hourGoal} label="Approved hours toward goal" />
                  </div>
                </Panel>
                <Panel title="Profile">
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Phone</dt>
                      <dd>{profile.phone || 'Not given'}</dd>
                    </div>
                    {profile.bio && (
                      <div>
                        <dt className="text-muted-foreground">Bio</dt>
                        <dd>{profile.bio}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="mb-1 text-muted-foreground">Skills</dt>
                      <dd className="flex flex-wrap gap-1">{profile.skills.length ? profile.skills.map((s) => <Pill key={s.id}>{s.name}</Pill>) : 'None listed'}</dd>
                    </div>
                    <div>
                      <dt className="mb-1 text-muted-foreground">Interests</dt>
                      <dd className="flex flex-wrap gap-1">{profile.interests.length ? profile.interests.map((s) => <Pill key={s} tone="outline">{s}</Pill>) : 'None listed'}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Usually free</dt>
                      <dd>
                        {profile.availability.length
                          ? profile.availability.map((b, i) => (
                              <span key={i} className="block tabular">
                                {WEEKDAYS[b.weekday]} {fmtRange(`2000-01-01T${b.start}`, `2000-01-01T${b.end}`)}
                              </span>
                            ))
                          : 'Not given'}
                      </dd>
                    </div>
                  </dl>
                </Panel>
              </div>
              <div className="space-y-5">
                <Panel title="Shifts">
                  {signups.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No shifts yet.</p>
                  ) : (
                    <ul className="divide-y">
                      {signups.map(({ activity, status }) => (
                        <li key={activity.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                          <Link to={`/admin/activities/${activity.id}`} className="font-medium hover:underline">
                            {activity.title}
                          </Link>
                          <span className="flex items-center gap-3 text-muted-foreground">
                            {fmtDay(activity.startAt)}
                            <SignupPill status={status} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </Panel>
                <Panel title="Hour log">
                  {hours.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No hours logged yet.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Activity</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Hours</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {hours.map((h) => (
                          <TableRow key={h.id}>
                            <TableCell>{h.activityTitle}</TableCell>
                            <TableCell className="text-muted-foreground">{fmtDate(h.date)}</TableCell>
                            <TableCell className="text-right">{fmtHours(h.hours)}</TableCell>
                            <TableCell>
                              <HourPill status={h.status} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </Panel>
              </div>
            </div>
          )}
        </Loader>
      </PageBody>

      <Dialog open={cert !== null} onOpenChange={(o) => !o && setCert(null)}>
        <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-[820px]">
          <DialogHeader>
            <DialogTitle>Certificate issued</DialogTitle>
          </DialogHeader>
          {cert && <CertificateView cert={cert} />}
          <DialogFooter className="items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">To save a PDF later, enter the code in Reports under Verify a certificate.</p>
            <Button onClick={() => setCert(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
