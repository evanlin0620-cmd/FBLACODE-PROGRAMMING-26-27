/** Hour approvals: review logged hours one by one or in bulk. Rejections need a reason. */
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ClipboardCheck, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EmptyState, Loader, PageBody, PageHeader } from '@/components/page'
import { HourPill } from '@/components/status'
import { FormField } from '@/components/form'
import { useMutation, useQuery } from '@/lib/hooks'
import { fmtDate, fmtHours, initials } from '@/lib/format'
import type { HourStatus } from '@shared/types'

export function Approvals(): React.JSX.Element {
  const [tab, setTab] = useState<HourStatus>('pending')
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<number[]>([])
  const [rejecting, setRejecting] = useState<number[] | null>(null)
  const [reason, setReason] = useState('')
  const list = useQuery('hours.forReview', tab)
  const review = useMutation('hours.review')

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase()
    return (list.data ?? []).filter((h) => !term || h.volunteerName.toLowerCase().includes(term) || h.activityTitle.toLowerCase().includes(term))
  }, [list.data, q])
  const allChecked = rows.length > 0 && rows.every((r) => selected.includes(r.id))

  const decide = async (ids: number[], decision: 'approved' | 'rejected', note = ''): Promise<boolean> => {
    const r = await review.run({ ids, decision, note })
    if (!r) return false
    setSelected((s) => s.filter((id) => !ids.includes(id)))
    list.reload()
    return true
  }

  return (
    <>
      <PageHeader
        title="Hour approvals"
        subtitle="Check each entry, then approve it or send it back with a reason. Volunteers are notified right away."
      />
      <PageBody>
        {/* The table sits in a TabsContent so each tab's aria-controls points at a real panel. */}
        <Tabs
          value={tab}
          onValueChange={(v) => {
            setTab(v as HourStatus)
            setSelected([])
          }}
          className="gap-0"
        >
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <TabsList>
            <TabsTrigger value="pending">Waiting</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Not approved</TabsTrigger>
          </TabsList>
          <div className="relative w-[280px]">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input data-page-search aria-label="Search by volunteer or activity" className="pl-9" placeholder="Search volunteer or activity" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          {tab === 'pending' && selected.length > 0 && (
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{selected.length} selected</span>
              <Button variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/5" onClick={() => setRejecting(selected)}>
                Reject selected
              </Button>
              <Button onClick={() => decide(selected, 'approved')} disabled={review.pending}>
                Approve {selected.length} selected
              </Button>
            </div>
          )}
        </div>

        <TabsContent value={tab}>
        <Loader query={list} skeleton="table">
          {() =>
            rows.length === 0 ? (
              <EmptyState
                icon={<ClipboardCheck />}
                title={tab === 'pending' ? 'All caught up' : 'Nothing here yet'}
                description={tab === 'pending' ? 'New hour logs will appear here for review.' : 'Reviewed entries will be listed here.'}
              />
            ) : (
              <div className="rounded-xl border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {tab === 'pending' && (
                        <TableHead className="w-10 pl-4">
                          <Checkbox
                            aria-label="Select all"
                            checked={allChecked}
                            onCheckedChange={(c) => setSelected(c ? rows.map((r) => r.id) : [])}
                          />
                        </TableHead>
                      )}
                      <TableHead className={tab === 'pending' ? '' : 'pl-4'}>Volunteer</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Hours</TableHead>
                      <TableHead>Status</TableHead>
                      {tab === 'pending' && <TableHead className="pr-4 text-right">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((h) => (
                      <TableRow key={h.id} data-state={selected.includes(h.id) ? 'selected' : undefined}>
                        {tab === 'pending' && (
                          <TableCell className="pl-4">
                            <Checkbox
                              aria-label={`Select ${h.volunteerName}, ${h.activityTitle}`}
                              checked={selected.includes(h.id)}
                              onCheckedChange={(c) => setSelected(c ? [...selected, h.id] : selected.filter((x) => x !== h.id))}
                            />
                          </TableCell>
                        )}
                        <TableCell className={tab === 'pending' ? '' : 'pl-4'}>
                          <Link to={`/admin/volunteers/${h.userId}`} className="flex items-center gap-2.5 font-medium hover:underline">
                            <span className="grid size-7 place-items-center rounded-full bg-accent text-[11px] font-semibold text-accent-foreground" aria-hidden>
                              {initials(h.volunteerName)}
                            </span>
                            {h.volunteerName}
                          </Link>
                        </TableCell>
                        <TableCell className="whitespace-normal">
                          {h.activityTitle}
                          {h.note && <p className="text-xs text-muted-foreground">“{h.note}”</p>}
                          {h.status === 'rejected' && h.reviewNote && <p className="text-xs text-destructive">Reason: {h.reviewNote}</p>}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{fmtDate(h.date)}</TableCell>
                        <TableCell className="text-right font-medium">{fmtHours(h.hours)}</TableCell>
                        <TableCell>
                          <HourPill status={h.status} />
                        </TableCell>
                        {tab === 'pending' && (
                          <TableCell className="pr-4 text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => setRejecting([h.id])} aria-label={`Reject ${h.volunteerName}, ${h.activityTitle}`}>
                                Reject
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => decide([h.id], 'approved')}
                                disabled={review.pending}
                                aria-label={`Approve ${h.volunteerName}, ${h.activityTitle}`}
                              >
                                Approve
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          }
        </Loader>
        </TabsContent>
        </Tabs>
      </PageBody>

      <Dialog
        open={rejecting !== null}
        onOpenChange={(o) => {
          if (!o) {
            setRejecting(null)
            setReason('')
            review.clearField('note')
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send {rejecting && rejecting.length > 1 ? `${rejecting.length} entries` : 'this entry'} back?</DialogTitle>
            <DialogDescription>The volunteer sees your reason and can log the hours again.</DialogDescription>
          </DialogHeader>
          <FormField label="Reason" error={review.fieldErrors.note}>
            {(p) => (
              <Textarea
                {...p}
                autoFocus
                rows={3}
                value={reason}
                placeholder="e.g. The sign-in sheet shows 2 hours, not 3."
                onChange={(e) => {
                  setReason(e.target.value)
                  review.clearField('note')
                }}
              />
            )}
          </FormField>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejecting(null)}>
              Keep reviewing
            </Button>
            <Button
              variant="destructive"
              disabled={review.pending}
              onClick={async () => {
                if (rejecting && (await decide(rejecting, 'rejected', reason))) {
                  setRejecting(null)
                  setReason('')
                }
              }}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
