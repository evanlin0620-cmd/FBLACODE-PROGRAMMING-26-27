/**
 * Unslopped admin impact. What needs the coordinator comes first; the chart answers "how are we doing" second.
 * Interactive: approve or send back hour logs in place (approved hours land in this month's bar), chart bar tooltips.
 */
import { useState } from 'react'
import { ChevronDown, ClipboardCheck, UserSearch } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { IMPACT as I } from './data'
import { Card, Shell } from './shell'
import { SpotsRow } from './slots'

type Entry = (typeof I.waiting)[number]

function Stat({ label, value, note }: { label: string; value: string; note: string }): React.JSX.Element {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <p className="text-sm text-[var(--text-2)]">{label}</p>
      <p className="mt-2 text-[32px] leading-none font-medium tracking-[-0.02em] tabular-nums">{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{note}</p>
    </div>
  )
}

/** Bars in neutral steps; only the month in progress takes the accent, because it's the one still changing. */
function MonthChart({ months }: { months: { label: string; hours: number }[] }): React.JSX.Element {
  // Round up to a multiple of 4 with headroom for the value label, so approvals during the visit never overflow.
  const max = Math.ceil((Math.max(...months.map((m) => m.hours)) + 1.5) / 4) * 4
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max)
  return (
    <figure>
      <div className="relative h-[220px] pl-8">
        {ticks.map((t) => (
          <div key={t} className="absolute right-0 left-8 border-t border-dashed border-black/[0.07]" style={{ bottom: `${(t / max) * 100}%` }}>
            <span className="absolute -top-2 -left-8 w-6 text-right text-[11px] text-muted-foreground tabular-nums">{t}</span>
          </div>
        ))}
        <div className="relative flex h-full items-end gap-6 px-2">
          {months.map((m, i) => {
            const current = i === months.length - 1
            return (
              <Tooltip key={m.label}>
                <TooltipTrigger asChild>
                  {/* Focusable so keyboard users get the same detail as hover. */}
                  <button type="button" className="group flex h-full flex-1 flex-col justify-end rounded-t-md" aria-label={`${m.label}: ${m.hours} approved hours${current ? ' so far' : ''}`}>
                    <span className={`mb-1.5 text-center text-xs tabular-nums ${current ? 'font-medium text-primary' : 'text-muted-foreground'}`}>{m.hours}</span>
                    <span
                      className={`block rounded-t-md transition-colors duration-150 ${current ? 'bg-primary' : 'bg-[#d4d4d4] group-hover:bg-[#bdbdbd]'}`}
                      style={{ height: `${(m.hours / max) * 100}%` }}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {m.hours} hours approved in {m.label}
                  {current ? ', month still in progress' : ''}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </div>
      <div className="mt-2 flex gap-6 pr-2 pl-10" aria-hidden>
        {months.map((m, i) => (
          <span key={m.label} className="flex-1 text-center text-xs text-muted-foreground">
            {m.label}
            {i === months.length - 1 && ' so far'}
          </span>
        ))}
      </div>
    </figure>
  )
}

function SendBack({ entry, onDone }: { entry: Entry | null; onDone: (sent: boolean) => void }): React.JSX.Element {
  const [reason, setReason] = useState('')
  const [error, setError] = useState(false)
  return (
    <Dialog
      open={entry !== null}
      onOpenChange={(o) => {
        if (!o) {
          onDone(false)
          setReason('')
          setError(false)
        }
      }}
    >
      <DialogContent className="unslop sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Send these hours back?</DialogTitle>
          <DialogDescription>
            {entry?.name} sees your reason and can log the hours again. {entry?.hours} hours, {entry?.title}.
          </DialogDescription>
        </DialogHeader>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            if (reason.trim().length < 5) return setError(true) // same rule as reviewHoursSchema
            onDone(true)
            setReason('')
          }}
        >
          <Label htmlFor="sb-reason">Reason</Label>
          <Textarea
            id="sb-reason"
            className="mt-2"
            rows={3}
            autoFocus
            value={reason}
            placeholder="The sign-in sheet shows 2 hours, not 4"
            aria-invalid={error || undefined}
            aria-describedby={error ? 'sb-error' : undefined}
            onChange={(e) => {
              setReason(e.target.value)
              setError(false)
            }}
          />
          {error && (
            <p id="sb-error" className="mt-2 text-sm text-destructive">
              Give a short reason (5+ characters) so the volunteer knows what to fix
            </p>
          )}
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onDone(false)}>
              Keep reviewing
            </Button>
            <Button type="submit" variant="destructive">
              Send back
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function UnslopImpact(): React.JSX.Element {
  const [waiting, setWaiting] = useState<Entry[]>(I.waiting)
  const [open, setOpen] = useState(false)
  const [sendingBack, setSendingBack] = useState<Entry | null>(null)
  const [added, setAdded] = useState(0) // hours approved during this visit
  const months = I.months.map((m, i) => (i === I.months.length - 1 ? { ...m, hours: m.hours + added } : m))
  const total6 = months.reduce((t, m) => t + m.hours, 0)
  const topMax = I.top[0]!.hours

  const approve = (e: Entry): void => {
    setWaiting((w) => w.filter((x) => x.id !== e.id))
    setAdded((a) => a + e.hours)
    toast(`Approved ${e.hours} hours for ${e.name}`, {
      description: 'They’ve been notified.',
      action: {
        label: 'Undo',
        onClick: () => {
          setWaiting((w) => [...w, e].sort((a, b) => a.id - b.id))
          setAdded((a) => a - e.hours)
        }
      }
    })
  }

  return (
    <Shell
      role="admin"
      user={['Dana Whitfield', 'admin@servehub.test']}
      title="Impact"
      meta="November 2026"
      counts={{ 'Hour approvals': waiting.length }}
      actions={<Button>Create report</Button>}
    >
      <section aria-labelledby="needs" className="rounded-2xl border bg-card">
        <h2 id="needs" className="px-6 pt-5 text-[15px] font-medium">
          Needs you
        </h2>
        <ul className="mt-3 divide-y border-t">
          <li>
            <div className="flex items-center gap-4 px-6 py-3">
              <ClipboardCheck className="size-[18px] shrink-0 text-muted-foreground" strokeWidth={1.5} aria-hidden />
              <p className="min-w-0 flex-1 text-sm">
                {waiting.length === 0 ? (
                  <span className="text-[var(--text-2)]">No hour logs waiting. You’re caught up.</span>
                ) : (
                  <>
                    <span className="font-medium tabular-nums">
                      {waiting.length} hour {waiting.length === 1 ? 'log' : 'logs'}
                    </span>{' '}
                    <span className="text-[var(--text-2)]">waiting for approval</span>
                  </>
                )}
              </p>
              {waiting.length > 0 && (
                <Button variant="outline" size="sm" aria-expanded={open} aria-controls="waiting-list" onClick={() => setOpen((o) => !o)}>
                  {open ? 'Hide' : 'Review'}
                  <ChevronDown className={`transition-transform duration-200 ease-snappy ${open ? 'rotate-180' : ''}`} strokeWidth={1.5} aria-hidden />
                </Button>
              )}
            </div>
            {open && waiting.length > 0 && (
              <ul id="waiting-list" className="mx-6 mb-4 divide-y rounded-xl border bg-[var(--background)]">
                {waiting.map((e) => (
                  <li key={e.id} className="flex items-center gap-4 px-4 py-3 transition-[opacity,translate] duration-200 ease-snappy starting:-translate-y-1 starting:opacity-0">
                    <span className="min-w-0 flex-1 text-sm">
                      <span className="block font-medium">
                        {e.name} <span className="font-normal text-muted-foreground">· {e.title}</span>
                      </span>
                      <span className="block text-muted-foreground">
                        {e.day}
                        {e.note && ` · “${e.note}”`}
                      </span>
                    </span>
                    <span className="w-14 text-right text-sm font-medium tabular-nums">{e.hours} h</span>
                    <Button variant="ghost" size="sm" onClick={() => setSendingBack(e)} aria-label={`Send back ${e.name}’s hours`}>
                      Send back
                    </Button>
                    <Button size="sm" onClick={() => approve(e)} aria-label={`Approve ${e.hours} hours for ${e.name}`}>
                      Approve
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </li>
          {I.gaps.map((g) => (
            <li key={g.title} className="flex items-center gap-4 px-6 py-3">
              <UserSearch className="size-[18px] shrink-0 text-muted-foreground" strokeWidth={1.5} aria-hidden />
              <p className="min-w-0 flex-1 text-sm">
                <span className="font-medium">{g.title}</span> <span className="text-[var(--text-2)]">on {g.day} has no one confirmed who is {g.needs}</span>
              </p>
              <Button variant="outline" size="sm">
                Find volunteers
              </Button>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat label="Approved hours" value={String(I.approvedHours + added)} note="All time, approved only" />
        <Stat label="Volunteers" value={String(I.volunteers)} note="With a ServeHub account" />
        <Stat label="Upcoming activities" value={String(I.upcoming)} note="Open and scheduled" />
        <Stat label="Waiting for approval" value={String(waiting.length)} note="Hour logs to review" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card title="Approved hours by month" aside={<span className="text-sm text-muted-foreground tabular-nums">{total6} hours in 6 months</span>}>
          <MonthChart months={months} />
        </Card>
        <Card title="Top activities" aside={<span className="text-sm text-muted-foreground">Hours</span>}>
          <ol className="space-y-3">
            {I.top.map((t) => (
              <li key={t.title}>
                <div className="flex justify-between gap-3 text-sm">
                  <span className="truncate">{t.title}</span>
                  <span className="text-[var(--text-2)] tabular-nums">{t.hours}</span>
                </div>
                <div className="mt-1.5 h-1 rounded-full bg-track">
                  <div className="h-full rounded-full bg-[#a3a3a3]" style={{ width: `${(t.hours / topMax) * 100}%` }} />
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <Card title="Shifts that need people" className="mt-4" aside={<span className="text-sm text-muted-foreground">Fewest people first</span>}>
        <ul className="divide-y">
          {[...I.short]
            .sort((a, b) => a.confirmed / a.capacity - b.confirmed / b.capacity)
            .map((s) => (
              <li key={s.title} className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3 first:pt-0 last:pb-0">
                <span className="min-w-0 flex-1 text-sm">
                  <span className="font-medium">{s.title}</span> <span className="text-muted-foreground">· {s.day}</span>
                </span>
                <SpotsRow confirmed={s.confirmed} capacity={s.capacity} />
              </li>
            ))}
        </ul>
      </Card>

      <SendBack
        entry={sendingBack}
        onDone={(sent) => {
          if (sent && sendingBack) {
            setWaiting((w) => w.filter((x) => x.id !== sendingBack.id))
            toast(`Sent back to ${sendingBack.name}`, { description: 'They can see your reason and log the hours again.' })
          }
          setSendingBack(null)
        }}
      />
    </Shell>
  )
}
