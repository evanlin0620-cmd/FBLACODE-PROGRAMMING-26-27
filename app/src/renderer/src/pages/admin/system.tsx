/** Admin email outbox, audit log, and settings (add an admin, reset demo data). */
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { History, MailX, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Pill } from '@/components/status'
import { FormField } from '@/components/form'
import { useMutation, useQuery } from '@/lib/hooks'
import { useSession } from '@/lib/session'
import { fmtWhen } from '@/lib/format'
import { cn } from '@/lib/utils'

const TYPE_LABELS: Record<string, string> = {
  welcome: 'Welcome',
  signup_confirmed: 'Sign-up',
  signup_waitlisted: 'Waitlist',
  signup_cancelled: 'Cancelled',
  waitlist_promoted: 'Moved up',
  hours_approved: 'Approved',
  hours_rejected: 'Not approved',
  activity_changed: 'Changed',
  activity_cancelled: 'Cancelled'
}

export function Outbox(): React.JSX.Element {
  const [q, setQ] = useState('')
  const list = useQuery('notifications.outbox', q.trim())
  const [openId, setOpenId] = useState<number | null>(null)
  const open = list.data?.find((n) => n.id === openId) ?? list.data?.[0]

  return (
    <>
      <PageHeader title="Email outbox" subtitle="Every email ServeHub has sent, shown exactly as the volunteer receives it. Nothing leaves this computer." />
      <PageBody>
        <div className="relative mb-4 w-[320px]" role="search">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input data-page-search aria-label="Search emails" className="pl-9" placeholder="Search by recipient or subject" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Loader query={list} skeleton="table">
          {(rows) =>
            rows.length === 0 ? (
              <EmptyState icon={<MailX />} title="No emails found" description="Emails appear here when volunteers sign up or hours are reviewed." />
            ) : (
              <div className="grid min-h-[480px] overflow-hidden rounded-xl border bg-card lg:grid-cols-[380px_1fr]">
                <ul className="max-h-[640px] divide-y overflow-y-auto border-r" aria-label="Emails">
                  {rows.map((n) => (
                    <li key={n.id}>
                      <button
                        type="button"
                        aria-current={open?.id === n.id}
                        onClick={() => setOpenId(n.id)}
                        className={cn('w-full px-4 py-3 text-left hover:bg-muted/60', open?.id === n.id && 'bg-accent hover:bg-accent')}
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-medium">{n.recipientEmail}</span>
                          <Pill className="h-5">{TYPE_LABELS[n.type] ?? n.type}</Pill>
                        </span>
                        <span className="mt-0.5 block truncate text-sm">{n.subject}</span>
                        <span className="block text-xs text-muted-foreground">{fmtWhen(n.createdAt)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                {open && (
                  <article className="p-6" aria-label="Email preview">
                    <dl className="grid grid-cols-[64px_1fr] gap-y-1 border-b pb-4 text-sm">
                      <dt className="text-muted-foreground">From</dt>
                      <dd>ServeHub &lt;no-reply@servehub.test&gt;</dd>
                      <dt className="text-muted-foreground">To</dt>
                      <dd>{open.recipientEmail}</dd>
                      <dt className="text-muted-foreground">Sent</dt>
                      <dd>{fmtWhen(open.createdAt)}</dd>
                    </dl>
                    <h2 className="mt-4 text-lg font-semibold">{open.subject}</h2>
                    <p className="mt-3 max-w-[65ch] leading-relaxed whitespace-pre-line">{open.body}</p>
                  </article>
                )}
              </div>
            )
          }
        </Loader>
      </PageBody>
    </>
  )
}

const ACTION_LABELS: Record<string, string> = {
  approve_hours: 'Approved hours',
  reject_hours: 'Rejected hours',
  create: 'Created activity',
  update: 'Edited activity',
  cancel: 'Cancelled activity',
  delete: 'Deleted activity',
  issue_certificate: 'Issued certificate',
  create_admin: 'Added admin',
  signup: 'Signed up',
  seed: 'Loaded demo data'
}

export function AuditLog(): React.JSX.Element {
  const list = useQuery('audit.list')
  return (
    <>
      <PageHeader title="Audit log" subtitle="Who changed what, and when. Entries can’t be edited." />
      <PageBody>
        <Loader query={list} skeleton="table">
          {(rows) =>
            rows.length === 0 ? (
              <EmptyState icon={<History />} title="No activity yet" description="Changes made in ServeHub will be recorded here." />
            ) : (
              <div className="rounded-xl border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-4">When</TableHead>
                      <TableHead>Who</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead className="pr-4">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="pl-4 text-muted-foreground">{fmtWhen(r.at)}</TableCell>
                        <TableCell className="font-medium">{r.actorName}</TableCell>
                        <TableCell>{ACTION_LABELS[r.action] ?? r.action.replaceAll('_', ' ')}</TableCell>
                        <TableCell className="pr-4 whitespace-normal text-muted-foreground">{r.detail}</TableCell>
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

export function Settings(): React.JSX.Element {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const create = useMutation('auth.createAdmin', { success: 'Admin account created.' })
  const reset = useMutation('demo.reset')
  const { setUser } = useSession()
  const navigate = useNavigate()

  const submit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    if (await create.run(form)) setForm({ fullName: '', email: '', password: '' })
  }
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [k]: e.target.value })
    create.clearField(k)
  }

  return (
    <>
      <PageHeader title="Settings" />
      <PageBody className="grid max-w-[1000px] gap-5 lg:grid-cols-2">
        <Panel title="Add an admin" description="Admins can manage activities, approve hours, and see every volunteer.">
          <form onSubmit={submit} noValidate>
            <FieldGroup className="gap-4">
              <FormField label="Full name" error={create.fieldErrors.fullName}>
                {(p) => <Input {...p} value={form.fullName} onChange={set('fullName')} />}
              </FormField>
              <FormField label="Email" error={create.fieldErrors.email}>
                {(p) => <Input {...p} type="email" value={form.email} onChange={set('email')} />}
              </FormField>
              <FormField label="Temporary password" error={create.fieldErrors.password} hint="At least 8 characters, with a letter and a number.">
                {(p) => <Input {...p} type="password" autoComplete="new-password" value={form.password} onChange={set('password')} />}
              </FormField>
              <Button type="submit" className="w-fit" disabled={create.pending}>
                Add admin
              </Button>
            </FieldGroup>
          </form>
        </Panel>
        <Panel title="Demo data" description="Put back the sample nonprofit, volunteers, and activities. Use this before a presentation.">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Reset demo data</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset all data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This deletes every account, activity, and hour log, then loads the demo data again. You’ll be logged out.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep my data</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-white hover:bg-destructive/90"
                  onClick={async () => {
                    if ((await reset.run(undefined)) !== undefined) {
                      toast.success('Demo data restored. Log in again to continue.')
                      setUser(null)
                      navigate('/login')
                    }
                  }}
                >
                  Reset everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Panel>
      </PageBody>
    </>
  )
}
