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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import { EmptyState, Loader, PageBody, PageHeader, Panel } from '@/components/page'
import { Meter } from '@/components/status'
import { FormField } from '@/components/form'
import { CertificateView } from '@/components/certificate-view'
import { useMutation, useQuery } from '@/lib/hooks'
import { fmtDate, fmtHours, fmtMonth, today } from '@/lib/format'
import { ORG_NAME } from '@/lib/org'
import { ACTIVITY_TYPES, type ActivityType, type ReportFilter } from '@shared/types'

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
    <Panel title="Verify a certificate" description="Enter the code printed on a certificate to confirm it’s real.">
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
                {(p) => <Input {...p} type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} />}
              </FormField>
              <FormField label="To" error={rangeError}>
                {(p) => <Input {...p} type="date" value={to} onChange={(e) => setTo(e.target.value)} />}
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
                    {ORG_NAME} · {r.filter.from ? fmtDate(r.filter.from) : 'All time'} to {r.filter.to ? fmtDate(r.filter.to) : 'today'}
                    {r.filter.type ? ` · ${r.filter.type}` : ''}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    ['Approved hours', fmtHours(r.totalHours)],
                    ['Volunteers', String(r.volunteerCount)],
                    ['Entries', String(r.rows.length)]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border bg-card p-5">
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <p className="mt-1 text-3xl font-semibold tabular">{value}</p>
                    </div>
                  ))}
                </div>

                {r.rows.length === 0 ? (
                  <EmptyState icon={<FileText />} title="No approved hours match these filters" description="Widen the date range or clear a filter." />
                ) : (
                  <>
                    <div className="grid gap-5 lg:grid-cols-2">
                      <Panel title="Hours by month">
                        <ChartContainer config={chartConfig} className="aspect-auto h-[220px] w-full">
                          <BarChart data={r.byMonth.map((m) => ({ label: `${fmtMonth(m.month)} ’${m.month.slice(2, 4)}`, hours: m.hours }))} margin={{ top: 20 }} accessibilityLayer>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                            <Bar dataKey="hours" fill="var(--color-hours)" radius={5} isAnimationActive={false}>
                              <LabelList dataKey="hours" position="top" className="fill-foreground" fontSize={12} />
                            </Bar>
                          </BarChart>
                        </ChartContainer>
                      </Panel>
                      <Panel title="Hours by activity type">
                        <ul className="space-y-3">
                          {r.byType.map((t) => (
                            <li key={t.type}>
                              <div className="mb-1 flex justify-between text-sm">
                                <span>{t.type}</span>
                                <span className="text-muted-foreground tabular">
                                  {fmtHours(t.hours)} h · {Math.round((t.hours / r.totalHours) * 100)}%
                                </span>
                              </div>
                              <Meter value={t.hours} max={r.totalHours} label={`${t.type} share of hours`} />
                            </li>
                          ))}
                        </ul>
                      </Panel>
                    </div>

                    <Panel title="All entries" description={`${r.rows.length} approved entries`}>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Volunteer</TableHead>
                            <TableHead>Activity</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Hours</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {r.rows.map((row, i) => (
                            <TableRow key={i}>
                              <TableCell className="font-medium">{row.volunteerName}</TableCell>
                              <TableCell>{row.activityTitle}</TableCell>
                              <TableCell className="text-muted-foreground">{row.activityType}</TableCell>
                              <TableCell className="text-muted-foreground">{fmtDate(row.date)}</TableCell>
                              <TableCell className="text-right">{fmtHours(row.hours)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
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
