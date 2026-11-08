/** Admin activity list, plus the create/edit page with roster, cancel, and delete. */
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowLeft, CalendarPlus, Plus, Search, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FieldGroup } from '@/components/ui/field'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { EmptyState, Loader, PageBody, PageHeader, Panel } from '@/components/page'
import { CapacityBar, Pill } from '@/components/status'
import { FormField, numberValue } from '@/components/form'
import { useMutation, useQuery } from '@/lib/hooks'
import { fmtDay, fmtRange, nowStamp } from '@/lib/format'
import { ACTIVITY_TYPES, type Activity, type ActivityType, type Skill } from '@shared/types'

export function AdminActivities(): React.JSX.Element {
  const [q, setQ] = useState('')
  const [includePast, setIncludePast] = useState(false)
  const list = useQuery('activities.list', { q: q.trim() || undefined, includePast })
  const navigate = useNavigate()

  return (
    <>
      <PageHeader
        title="Activities"
        subtitle="Create, edit, and cancel service activities. Click a row to manage it."
        actions={
          <Button asChild>
            <Link to="/admin/activities/new">
              <Plus aria-hidden /> New activity
            </Link>
          </Button>
        }
      />
      <PageBody>
        <div className="mb-4 flex flex-wrap items-center gap-3" role="search">
          <div className="relative w-[320px]">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input data-page-search aria-label="Search activities" className="pl-9" placeholder="Search by name or place" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={includePast} onCheckedChange={(c) => setIncludePast(!!c)} /> Show past activities
          </label>
        </div>
        <Loader query={list} skeleton="table">
          {(rows) =>
            rows.length === 0 ? (
              <EmptyState
                icon={q ? <SearchX /> : <CalendarPlus />}
                title={q ? 'No activities match' : 'No upcoming activities'}
                description={q ? 'Try a different search.' : 'Create the first one so volunteers can sign up.'}
                action={
                  !q && (
                    <Button asChild>
                      <Link to="/admin/activities/new">New activity</Link>
                    </Button>
                  )
                }
              />
            ) : (
              <div className="rounded-xl border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-4">Activity</TableHead>
                      <TableHead>When</TableHead>
                      <TableHead className="w-[200px]">Spots</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((a) => (
                      <TableRow key={a.id} className="cursor-pointer" onClick={() => navigate(`/admin/activities/${a.id}`)}>
                        <TableCell className="pl-4">
                          <Link to={`/admin/activities/${a.id}`} className="font-medium hover:underline" onClick={(e) => e.stopPropagation()}>
                            {a.title}
                          </Link>
                          <p className="text-xs text-muted-foreground">{a.type}</p>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {fmtDay(a.startAt)}
                          <br />
                          {fmtRange(a.startAt, a.endAt)}
                        </TableCell>
                        <TableCell>
                          <CapacityBar activity={a} />
                        </TableCell>
                        <TableCell>
                          {a.status === 'cancelled' ? (
                            <Pill tone="red">Cancelled</Pill>
                          ) : a.endAt < nowStamp() ? (
                            <Pill>Finished</Pill>
                          ) : (
                            <Pill tone="green">Open</Pill>
                          )}
                        </TableCell>
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

interface Draft {
  title: string
  type: string
  description: string
  location: string
  date: string
  start: string
  end: string
  capacity: string
  skillIds: number[]
}

const toDraft = (a?: Activity): Draft => ({
  title: a?.title ?? '',
  type: a?.type ?? '',
  description: a?.description ?? '',
  location: a?.location ?? '',
  date: a?.startAt.slice(0, 10) ?? '',
  start: a?.startAt.slice(11) ?? '09:00',
  end: a?.endAt.slice(11) ?? '12:00',
  capacity: a ? String(a.capacity) : '10',
  skillIds: a?.skills.map((s) => s.id) ?? []
})

function ActivityForm({ activity, skills }: { activity?: Activity; skills: Skill[] }): React.JSX.Element {
  const navigate = useNavigate()
  const [d, setD] = useState<Draft>(() => toDraft(activity))
  const create = useMutation('activities.create', { success: 'Activity created.' })
  const update = useMutation('activities.update', { success: 'Changes saved. Signed-up volunteers were notified of any time change.' })
  const m = activity ? update : create
  const e = m.fieldErrors
  const set = <K extends keyof Draft>(k: K, v: Draft[K], field: string = k): void => {
    setD({ ...d, [k]: v })
    m.clearField(field)
  }

  const submit = async (ev: FormEvent): Promise<void> => {
    ev.preventDefault()
    const data = {
      title: d.title,
      type: d.type as ActivityType,
      description: d.description,
      location: d.location,
      startAt: d.date ? `${d.date}T${d.start}` : '',
      endAt: d.date ? `${d.date}T${d.end}` : '',
      capacity: numberValue(d.capacity),
      skillIds: d.skillIds
    }
    const saved = activity ? await update.run({ id: activity.id, data }) : await create.run(data)
    if (saved && !activity) navigate(`/admin/activities/${saved.id}`, { replace: true })
  }

  return (
    <form onSubmit={submit} noValidate>
      <FieldGroup className="gap-4">
        <FormField label="Activity name" error={e.title}>
          {(p) => <Input {...p} value={d.title} onChange={(ev) => set('title', ev.target.value)} placeholder="e.g. Saturday Food Pantry Sort" />}
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Type" error={e.type}>
            {(p) => (
              <Select value={d.type} onValueChange={(v) => set('type', v)}>
                <SelectTrigger id={p.id} aria-invalid={p['aria-invalid']} aria-describedby={p['aria-describedby']} className="w-full">
                  <SelectValue placeholder="Pick a type" />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>
          <FormField label="Volunteer slots" error={e.capacity} hint="When it’s full, new sign-ups join a waitlist.">
            {(p) => <Input {...p} type="number" min={1} max={500} className="tabular" value={d.capacity} onChange={(ev) => set('capacity', ev.target.value)} />}
          </FormField>
        </div>
        <FormField label="Location" error={e.location}>
          {(p) => <Input {...p} value={d.location} onChange={(ev) => set('location', ev.target.value)} placeholder="e.g. Riverside Food Pantry, 220 Mill St" />}
        </FormField>
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Date" error={e.startAt}>
            {(p) => <Input {...p} type="date" value={d.date} onChange={(ev) => set('date', ev.target.value, 'startAt')} />}
          </FormField>
          <FormField label="Start time">
            {(p) => <Input {...p} type="time" value={d.start} onChange={(ev) => set('start', ev.target.value, 'startAt')} />}
          </FormField>
          <FormField label="End time" error={e.endAt}>
            {(p) => <Input {...p} type="time" value={d.end} onChange={(ev) => set('end', ev.target.value, 'endAt')} />}
          </FormField>
        </div>
        <FormField label="Description" error={e.description}>
          {(p) => <Textarea {...p} rows={4} value={d.description} onChange={(ev) => set('description', ev.target.value)} placeholder="What volunteers will do and what to bring" />}
        </FormField>
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Skills that help (optional)</legend>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <label
                key={s.id}
                className="flex h-8 cursor-pointer items-center gap-2 rounded-md border px-2.5 text-sm has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent"
              >
                <Checkbox
                  checked={d.skillIds.includes(s.id)}
                  onCheckedChange={(c) => set('skillIds', c ? [...d.skillIds, s.id] : d.skillIds.filter((x) => x !== s.id))}
                />
                {s.name}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="flex gap-2">
          <Button type="submit" disabled={m.pending}>
            {m.pending ? 'Saving…' : activity ? 'Save changes' : 'Create activity'}
          </Button>
          {!activity && (
            <Button type="button" variant="ghost" onClick={() => navigate('/admin/activities')}>
              Cancel
            </Button>
          )}
        </div>
      </FieldGroup>
    </form>
  )
}

export function NewActivity(): React.JSX.Element {
  const skills = useQuery('skills.list')
  return (
    <>
      <PageHeader title="New activity" subtitle="Volunteers can sign up as soon as you create it." />
      <PageBody className="max-w-[760px]">
        <Loader query={skills} skeleton="form">
          {(s) => (
            <Panel>
              <ActivityForm skills={s} />
            </Panel>
          )}
        </Loader>
      </PageBody>
    </>
  )
}

function DangerZone({ activity, onChanged }: { activity: Activity; onChanged: () => void }): React.JSX.Element {
  const cancel = useMutation('activities.cancel', { success: 'Activity cancelled. Everyone signed up was notified.' })
  const del = useMutation('activities.delete', { success: 'Activity deleted.' })
  const navigate = useNavigate()
  return (
    <Panel title="Cancel or delete" description="Cancelling keeps the history. Deleting removes it completely and isn’t allowed once hours are logged.">
      <div className="flex flex-wrap gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" disabled={activity.status === 'cancelled'}>
              {activity.status === 'cancelled' ? 'Already cancelled' : 'Cancel activity'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel {activity.title}?</AlertDialogTitle>
              <AlertDialogDescription>
                {activity.confirmed + activity.waitlisted} signed-up volunteers will get a cancellation email. The activity stays in your records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep it</AlertDialogCancel>
              <AlertDialogAction onClick={async () => (await cancel.run(activity.id)) && onChanged()}>Cancel activity</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {activity.title}?</AlertDialogTitle>
              <AlertDialogDescription>This removes the activity and its sign-ups for good. It can’t be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep it</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-white hover:bg-[color-mix(in_srgb,var(--destructive)_86%,black)]"
                onClick={async () => {
                  if ((await del.run(activity.id)) !== undefined) navigate('/admin/activities')
                }}
              >
                Delete for good
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Panel>
  )
}

export function ManageActivity(): React.JSX.Element {
  const id = Number(useParams().id)
  const activity = useQuery('activities.get', id)
  const roster = useQuery('activities.roster', id)
  const skills = useQuery('skills.list')
  const both = {
    data: activity.data && skills.data ? { a: activity.data, s: skills.data } : undefined,
    error: activity.error ?? skills.error,
    loading: activity.loading,
    reload: activity.reload
  }
  const reloadAll = (): void => {
    activity.reload()
    roster.reload()
  }
  const past = activity.data ? activity.data.endAt < nowStamp() : false

  return (
    <>
      <PageHeader
        title={activity.data?.title ?? 'Activity'}
        subtitle={activity.data ? `${fmtDay(activity.data.startAt)} · ${fmtRange(activity.data.startAt, activity.data.endAt)}` : undefined}
        actions={
          <Button variant="outline" asChild>
            <Link to="/admin/activities">
              <ArrowLeft aria-hidden /> All activities
            </Link>
          </Button>
        }
      />
      <PageBody>
        <Loader query={both} skeleton="form">
          {({ a, s }) => (
            <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
              <div className="space-y-5">
                <Panel title="Details" description={past ? 'This activity already happened, so it can’t be edited.' : undefined}>
                  {past || a.status === 'cancelled' ? (
                    <dl className="grid grid-cols-[120px_1fr] gap-y-2 text-sm">
                      <dt className="text-muted-foreground">Type</dt>
                      <dd>{a.type}</dd>
                      <dt className="text-muted-foreground">Location</dt>
                      <dd>{a.location}</dd>
                      <dt className="text-muted-foreground">Description</dt>
                      <dd>{a.description}</dd>
                    </dl>
                  ) : (
                    <ActivityForm key={a.id + a.startAt + a.capacity} activity={a} skills={s} />
                  )}
                </Panel>
                {!past && <DangerZone activity={a} onChanged={reloadAll} />}
              </div>
              <Panel title="Roster">
                <CapacityBar activity={a} className="mb-4" />
                <Loader query={roster} skeleton="table">
                  {(r) =>
                    r.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nobody has signed up yet.</p>
                    ) : (
                      <ol className="divide-y">
                        {r.map((p) => (
                          <li key={p.userId} className="flex items-center justify-between gap-3 py-2.5">
                            <div className="min-w-0">
                              <Link to={`/admin/volunteers/${p.userId}`} className="block truncate text-sm font-medium hover:underline">
                                {p.fullName}
                              </Link>
                              <p className="truncate text-xs text-muted-foreground">{p.email}</p>
                            </div>
                            {p.status === 'confirmed' ? <Pill tone="green">Confirmed</Pill> : <Pill tone="amber">Waitlist #{p.position}</Pill>}
                          </li>
                        ))}
                      </ol>
                    )
                  }
                </Loader>
              </Panel>
            </div>
          )}
        </Loader>
      </PageBody>
    </>
  )
}
