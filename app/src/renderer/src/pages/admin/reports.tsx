/**
 * Reports: a customizable hours report (date range, activity type, volunteer)
 * with charts, CSV and PDF export, plus certificate verification.
 */
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowLeft, Download, FileSpreadsheet, FileText, ShieldCheck } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { TypeMark } from '@/components/activity'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart'
import { CountUp } from '@/components/count-up'
import { ChartTable, EmptyState, Loader, PageBody, PageHeader, Panel } from '@/components/page'
import { Meter } from '@/components/status'
import { FormField } from '@/components/form'
import { CertificateView } from '@/components/certificate-view'
import { useMutation, useQuery } from '@/lib/hooks'
import { fmtCount, fmtDate, fmtDay, fmtHours, fmtMonth, today } from '@/lib/format'
import { useSession } from '@/lib/session'
import { ACTIVITY_TYPES, type ActivityType, type ReportFilter, type ReportRow } from '@shared/types'

/** "November 2026" groups, in the report's newest-first order, each with its total. */
function byMonth(rows: ReportRow[]): { month: string; rows: ReportRow[]; hours: number }[] {
  const groups = new Map<string, ReportRow[]>()
  for (const r of rows) {
    const month = new Date(`${r.date.slice(0, 7)}-01T00:00`).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    })
    groups.set(month, [...(groups.get(month) ?? []), r])
  }
  return [...groups].map(([month, rs]) => ({
    month,
    rows: rs,
    hours: rs.reduce((t, r) => t + r.hours, 0)
  }))
}

/**
 * Every approved entry as a ledger: grouped by month under its total, each row led by its activity type's mark,
 * so the column of colour shows what kind of work filled each month.
 */
function EntryLedger({ rows }: { rows: ReportRow[] }): React.JSX.Element {
  return (
    <div className="space-y-6">
      {byMonth(rows).map((m) => (
        <section key={m.month} aria-label={`${m.month}, ${fmtHours(m.hours)} hours`}>
          <header className="flex items-baseline justify-between border-b pb-2">
            <h3 className="text-sm font-medium">{m.month}</h3>
            <p className="text-xs text-muted-foreground tabular-nums">
              {fmtCount(m.rows.length)} {m.rows.length === 1 ? 'entry' : 'entries'} ·{' '}
              <span className="text-text-2">{fmtHours(m.hours)} h</span>
            </p>
          </header>
          <ul>
            {m.rows.map((r, i) => (
              <li
                key={i}
                className="grid grid-cols-[28px_minmax(0,1fr)_96px_56px] items-center gap-3 rounded-lg px-2 py-2.5 transition-colors duration-150 hover:bg-foreground/[0.04] print:break-inside-avoid"
              >
                <TypeMark type={r.activityType} />
                <div className="min-w-0">
                  <p className="truncate text-sm">{r.activityTitle}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {r.volunteerName} · {r.activityType}
                  </p>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {fmtDay(r.date)}
                </span>
                <span className="text-right text-sm font-medium tabular-nums">
                  {fmtHours(r.hours)}
                  <span className="ml-0.5 font-normal text-muted-foreground" aria-hidden>
                    h
                  </span>
                  <span className="sr-only"> hours</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

const chartConfig = { hours: { label: 'Hours', color: 'var(--chart-1)' } } satisfies ChartConfig

function VerifyCertificate(): React.JSX.Element {
  const [code, setCode] = useState('')
  const verify = useMutation('certificates.verify')
  const navigate = useNavigate()
  const submit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    const c = await verify.run(code)
    if (c) navigate(`/admin/certificates/${c.code}`)
  }
  return (
    <Panel
      title="Verify a certificate"
      description="Enter the code printed on a certificate to confirm it’s real."
    >
      <form onSubmit={submit} noValidate className="flex items-start gap-2">
        <div className="flex-1">
          <FormField label="Code" error={verify.fieldErrors._}>
            {(p) => (
              <Input
                {...p}
                className="font-mono uppercase"
                placeholder="ABCD-1234"
                maxLength={9}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  verify.clearField('_')
                }}
              />
            )}
          </FormField>
        </div>
        <Button type="submit" variant="outline" className="mt-[22px]" disabled={verify.pending}>
          <ShieldCheck aria-hidden /> Verify
        </Button>
      </form>
    </Panel>
  )
}

export function Reports(): React.JSX.Element {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState(today())
  const [type, setType] = useState('any')
  const [volunteer, setVolunteer] = useState('any')
  const volunteers = useQuery('volunteers.search', {})
  const filter: ReportFilter = {
    from: from || undefined,
    to: to || undefined,
    type: type === 'any' ? undefined : (type as ActivityType),
    volunteerId: volunteer === 'any' ? undefined : Number(volunteer)
  }
  const { org } = useSession()
  const report = useQuery('reports.hours', filter)
  const csv = useMutation('reports.exportCsv')
  const pdf = useMutation('reports.savePdf')
  const rangeError = report.error?.fields?.to

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Pick the filters, then export the results. Only approved hours are counted."
        actions={
          <>
            <Button
              variant="outline"
              disabled={!report.data || csv.pending}
              onClick={async () => {
                const r = await csv.run(filter)
                if (r?.saved) toast.success('CSV saved.', { description: r.path })
              }}
            >
              <FileSpreadsheet aria-hidden /> Export CSV
            </Button>
            <Button
              disabled={!report.data || pdf.pending}
              onClick={async () => {
                const r = await pdf.run({ suggestedName: `hours-report-${today()}` })
                if (r?.saved) toast.success('PDF saved.', { description: r.path })
              }}
            >
              <Download aria-hidden /> Save as PDF
            </Button>
          </>
        }
      />
      <PageBody className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_340px]" data-print-hide>
          <Panel title="Filters">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="From">
                {(p) => (
                  <Input
                    {...p}
                    type="date"
                    value={from}
                    max={to || undefined}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                )}
              </FormField>
              <FormField label="To" error={rangeError}>
                {(p) => (
                  <Input {...p} type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                )}
              </FormField>
              <FormField label="Activity type">
                {(p) => (
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger id={p.id} className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">All types</SelectItem>
                      {ACTIVITY_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormField>
              <FormField label="Volunteer">
                {(p) => (
                  <Select value={volunteer} onValueChange={setVolunteer}>
                    <SelectTrigger id={p.id} className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">All volunteers</SelectItem>
                      {volunteers.data?.map((v) => (
                        <SelectItem key={v.userId} value={String(v.userId)}>
                          {v.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormField>
            </div>
          </Panel>
          <VerifyCertificate />
        </div>

        {rangeError ? null : (
          <Loader query={report} skeleton="table">
            {(r) => (
              <div className="space-y-5">
                <div className="hidden print:block">
                  <h1 className="text-2xl font-semibold">Volunteer hours report</h1>
                  <p className="text-sm text-zinc-600">
                    {org} · {r.filter.from ? fmtDate(r.filter.from) : 'All time'} to{' '}
                    {r.filter.to ? fmtDate(r.filter.to) : 'today'}
                    {r.filter.type ? ` · ${r.filter.type}` : ''}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {/* Figures count up on arrival and tween to the new totals when a filter changes. */}
                  {(
                    [
                      ['Approved hours', r.totalHours, fmtHours],
                      ['Volunteers', r.volunteerCount, fmtCount],
                      ['Entries', r.rows.length, fmtCount]
                    ] as const
                  ).map(([label, value, format], i) => (
                    <div key={label} className="rounded-2xl border bg-card p-5">
                      <p className="text-sm text-text-2">{label}</p>
                      <p className="mt-2 text-[32px] leading-none font-medium tracking-[-0.02em] tabular-nums">
                        <CountUp value={value} format={format} intro delay={i * 40} />
                      </p>
                    </div>
                  ))}
                </div>

                {r.rows.length === 0 ? (
                  <EmptyState
                    icon={<FileText />}
                    title="No approved hours match these filters"
                    description="Widen the date range or clear a filter."
                  />
                ) : (
                  <>
                    <div className="grid gap-5 lg:grid-cols-2">
                      <Panel title="Hours by month">
                        <ChartTable
                          caption="Approved hours by month"
                          unit="hours"
                          rows={r.byMonth.map((m) => ({
                            label: `${fmtMonth(m.month)} ${m.month.slice(0, 4)}`,
                            value: m.hours
                          }))}
                        />
                        <ChartContainer
                          config={chartConfig}
                          className="aspect-auto h-[220px] w-full"
                          aria-hidden
                        >
                          <BarChart
                            data={r.byMonth.map((m) => ({
                              label: `${fmtMonth(m.month)} ’${m.month.slice(2, 4)}`,
                              hours: m.hours
                            }))}
                            margin={{ top: 20 }}
                            accessibilityLayer={false}
                          >
                            <CartesianGrid vertical={false} />
                            <XAxis
                              dataKey="label"
                              tickLine={false}
                              axisLine={false}
                              tickMargin={8}
                            />
                            <ChartTooltip
                              cursor={false}
                              content={<ChartTooltipContent hideIndicator />}
                            />
                            <Bar
                              dataKey="hours"
                              fill="var(--color-hours)"
                              radius={5}
                              isAnimationActive={false}
                            >
                              <LabelList
                                dataKey="hours"
                                position="top"
                                className="fill-foreground"
                                fontSize={12}
                              />
                            </Bar>
                          </BarChart>
                        </ChartContainer>
                      </Panel>
                      <Panel title="Hours by activity type">
                        <ul className="space-y-3">
                          {r.byType.map((t, i) => (
                            <li key={t.type}>
                              <div className="mb-1 flex justify-between text-sm">
                                <span>{t.type}</span>
                                <span className="text-muted-foreground tabular">
                                  {fmtHours(t.hours)} h ·{' '}
                                  {Math.round((t.hours / r.totalHours) * 100)}%
                                </span>
                              </div>
                              <Meter
                                value={t.hours}
                                max={r.totalHours}
                                label={`${t.type} share of hours`}
                                introDelay={120 + i * 50}
                              />
                            </li>
                          ))}
                        </ul>
                      </Panel>
                    </div>

                    <Panel
                      title="All entries"
                      description={`${fmtCount(r.rows.length)} approved entries · ${fmtHours(r.totalHours)} hours`}
                    >
                      <EntryLedger rows={r.rows} />
                    </Panel>
                  </>
                )}
              </div>
            )}
          </Loader>
        )}
      </PageBody>
    </>
  )
}

/** A verified certificate, printable as a PDF. */
export function VerifiedCertificate(): React.JSX.Element {
  const code = useParams().code ?? ''
  const q = useQuery('certificates.verify', code)
  const pdf = useMutation('reports.savePdf')
  return (
    <>
      <PageHeader
        title="Certificate is valid"
        subtitle={`Code ${code} matches our records.`}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/admin/reports">
                <ArrowLeft aria-hidden /> Reports
              </Link>
            </Button>
            <Button
              disabled={!q.data || pdf.pending}
              onClick={async () => {
                const r = await pdf.run({ suggestedName: `certificate-${code}` })
                if (r?.saved) toast.success('Certificate saved as a PDF.')
              }}
            >
              <Download aria-hidden /> Save as PDF
            </Button>
          </>
        }
      />
      <PageBody>
        <Loader query={q} skeleton="form">
          {(c) => <CertificateView cert={c} />}
        </Loader>
      </PageBody>
    </>
  )
}
