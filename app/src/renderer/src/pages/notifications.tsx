/** The volunteer's inbox of simulated emails: confirmations, waitlist moves, approvals. */
import { useState } from 'react'
import { BellOff, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState, Loader, PageBody, PageHeader } from '@/components/page'
import { useMutation, useQuery } from '@/lib/hooks'
import { fmtWhen } from '@/lib/format'
import { cn } from '@/lib/utils'

export function NotificationsPage(): React.JSX.Element {
  const q = useQuery('notifications.mine')
  const mark = useMutation('notifications.markRead')
  const [open, setOpen] = useState<number | null>(null)
  const unread = q.data?.filter((n) => !n.readAt).length ?? 0

  const openOne = async (id: number, read: boolean): Promise<void> => {
    setOpen(open === id ? null : id)
    if (!read) {
      await mark.run([id])
      q.reload()
    }
  }

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle="Every email ServeHub would send you. It all stays on this computer."
        actions={
          unread > 0 && (
            <Button
              variant="outline"
              onClick={async () => {
                await mark.run([])
                q.reload()
              }}
            >
              <CheckCheck aria-hidden /> Mark all read
            </Button>
          )
        }
      />
      <PageBody className="max-w-[900px]">
        <Loader query={q} skeleton="table">
          {(list) =>
            list.length === 0 ? (
              <EmptyState icon={<BellOff />} title="No notifications" description="Sign up for a shift and your confirmation will show up here." />
            ) : (
              <ul className="divide-y rounded-xl border bg-card">
                {list.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      aria-expanded={open === n.id}
                      onClick={() => openOne(n.id, !!n.readAt)}
                      className="flex w-full items-start gap-3 p-4 text-left hover:bg-muted/50"
                    >
                      <span
                        className={cn('mt-1.5 size-2 shrink-0 rounded-full', n.readAt ? 'bg-transparent' : 'bg-primary')}
                        aria-label={n.readAt ? undefined : 'Unread'}
                      />
                      <span className="min-w-0 flex-1">
                        <span className={cn('block', !n.readAt && 'font-semibold')}>{n.subject}</span>
                        {open === n.id ? (
                          <span className="mt-2 block text-sm whitespace-pre-line text-muted-foreground">{n.body}</span>
                        ) : (
                          <span className="block truncate text-sm text-muted-foreground">{n.body.replace(/\n+/g, ' ')}</span>
                        )}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">{fmtWhen(n.createdAt)}</span>
                    </button>
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
