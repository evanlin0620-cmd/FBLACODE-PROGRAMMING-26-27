/** My hours: log hours for finished shifts, see each entry's status, and get a certificate. */
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { Award, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FieldGroup } from '@/components/ui/field'
import { EmptyState, Loader, PageBody, PageHeader, Panel } from '@/components/page'
import { HourPill } from '@/components/status'
import { FormField, numberValue } from '@/components/form'
import { useMutation, useQuery } from '@/lib/hooks'
import { fmtDate, fmtDay, fmtHours } from '@/lib/format'

function LogHoursForm({ onLogged }: { onLogged: () => void }): React.JSX.Element {
  const shifts = useQuery('hours.loggable')
  const log = useMutation('hours.log', { success: 'Hours sent for approval.' })
  const [activityId, setActivityId] = useState('')
  const [hours, setHours] = useState('')
  const [note, setNote] = useState('')
  const picked = shifts.data?.find((s) => String(s.activityId) === activityId)

  const submit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    const r = await log.run({ activityId: Number(activityId) || 0, hours: numberValue(hours), note })
    if (r) {
      setActivityId('')
      setHours('')
      setNote('')
      shifts.reload()
      onLogged()
    }
  }

  if (shifts.data && shifts.data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No finished shifts are waiting for hours. After a shift you were confirmed for ends, it shows up here.
      </p>
    )
  }

  return (
    <form onSubmit={submit} noValidate>
      <FieldGroup className="gap-4">
        <FormField label="Shift" error={log.fieldErrors.activityId}>
          {(p) => (
            <Select
              value={activityId}
              onValueChange={(v) => {
                setActivityId(v)
                log.clearField('activityId')
              }}
            >
              <SelectTrigger id={p.id} aria-invalid={p['aria-invalid']} aria-describedby={p['aria-describedby']} className="w-full">
                <SelectValue placeholder="Pick a finished shift" />
              </SelectTrigger>
              <SelectContent>
                {shifts.data?.map((s) => (
                  <SelectItem key={s.activityId} value={String(s.activityId)}>
                    {s.title} · {fmtDay(s.startAt)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>
        <FormField
          label="Hours worked"
          error={log.fieldErrors.hours}
          hint={picked ? `This shift was ${picked.maxHours} hours. Use quarter hours, like 2.5.` : 'Use quarter hours, like 2.5.'}
        >
          {(p) => (
            <Input
              {...p}
              type="number"
              inputMode="decimal"
              min={0.25}
              max={picked?.maxHours ?? 24}
              step={0.25}
              className="w-32 tabular"
              value={hours}
              onChange={(e) => {
                setHours(e.target.value)
                log.clearField('hours')
              }}
            />
          )}
        </FormField>
        <FormField label="Note (optional)" error={log.fieldErrors.note}>
          {(p) => <Textarea {...p} rows={2} maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything the coordinator should know" />}
        </FormField>
        <Button type="submit" className="w-fit" disabled={log.pending}>
          {log.pending ? 'Sending…' : 'Send for approval'}
        </Button>
      </FieldGroup>
    </form>
  )
}

export function MyHours(): React.JSX.Element {
  const q = useQuery('hours.mine')
  const approved = q.data?.filter((h) => h.status === 'approved').reduce((s, h) => s + h.hours, 0) ?? 0

  return (
    <>
      <PageHeader
        title="My hours"
        subtitle="Log hours after each shift. They count once an admin approves them."
        actions={
          <Button asChild variant={approved > 0 ? 'default' : 'outline'}>
            <Link to="/certificate">
              <Award aria-hidden /> Get my certificate
            </Link>
          </Button>
        }
      />
      <PageBody>
        <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
          <Panel title="Log hours" description="For shifts you were confirmed for.">
            <LogHoursForm onLogged={q.reload} />
          </Panel>
          <Panel title="History" description={q.data ? `${fmtHours(approved)} approved hours in total` : undefined}>
            <Loader query={q} skeleton="table">
              {(rows) =>
                rows.length === 0 ? (
                  <EmptyState icon={<ClipboardList />} title="No hours logged yet" description="Your logged hours and their status will appear here." />
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
                      {rows.map((h) => (
                        <TableRow key={h.id}>
                          <TableCell className="whitespace-normal">
                            <p className="font-medium">{h.activityTitle}</p>
                            {h.status === 'rejected' && h.reviewNote && <p className="mt-0.5 text-sm text-destructive">Reason: {h.reviewNote}</p>}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{fmtDate(h.date)}</TableCell>
                          <TableCell className="text-right">{fmtHours(h.hours)}</TableCell>
                          <TableCell>
                            <HourPill status={h.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )
              }
            </Loader>
          </Panel>
        </div>
      </PageBody>
    </>
  )
}
