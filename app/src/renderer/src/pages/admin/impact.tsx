/** Admin home: community impact at a glance, plus what needs attention. */
import { Link } from 'react-router'
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis } from 'recharts'
import { Button } from '@/components/ui/button'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import { ChartColumn } from 'lucide-react'
import { ChartTable, EmptyState, Loader, PageBody, PageHeader, Panel } from '@/components/page'
import { Meter, Pill } from '@/components/status'
import { useQuery, useWelcome } from '@/lib/hooks'
import { fmtCount, fmtDay, fmtHours, fmtMonth } from '@/lib/format'
import { cn, entrance } from '@/lib/utils'
import { ORGANIZATION } from '@shared/types'

const chartConfig = { hours: { label: 'Approved hours', color: 'var(--chart-1)' } } satisfies ChartConfig

function Stat({
  label,
  value,
  note,
  tone,
  intro
}: {
  label: string
  value: string
  note: string
  tone?: 'amber'
  intro?: ReturnType<typeof entrance>
}): React.JSX.Element {
  return (
    <div className={cn('h-full rounded-xl border bg-card p-5', intro?.className)} style={intro?.style}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        {tone === 'amber' && <Pill tone="amber">Needs review</Pill>}
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight tabular">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  )
}

export function ImpactDashboard(): React.JSX.Element {
  const q = useQuery('dashboard.impact')
  const w = useWelcome()
  const panels = entrance(w, 120, 6) // chart and side panels arrive together, carried by their row
  return (
    <>
      <PageHeader
        title="Impact dashboard"
        subtitle={ORGANIZATION}
        actions={
          <Button asChild>
            <Link to="/admin/reports">Create report</Link>
          </Button>
        }
      />
      <PageBody>
        <Loader query={q}>
          {(s) => {
            const topMax = Math.max(1, ...s.topActivities.map((t) => t.hours))
            const sixMonthTotal = s.hoursByMonth.reduce((t, m) => t + m.hours, 0)
            return (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                  {/* Once per login, left to right in reading order; gaps shrink (40, 30, 20ms) so it lands as one wave. */}
                  <Stat label="Approved hours" value={fmtHours(s.totalApprovedHours)} note="All time, approved only" intro={entrance(w, 0, 10)} />
                  <Stat label="Volunteers" value={fmtCount(s.volunteerCount)} note="With a ServeHub account" intro={entrance(w, 40, 8)} />
                  <Stat label="Upcoming activities" value={fmtCount(s.upcomingActivities)} note="Open and scheduled" intro={entrance(w, 70, 8)} />
                  <Link to="/admin/approvals" className="rounded-xl outline-offset-2">
                    <Stat
                      label="To approve"
                      value={`${fmtCount(s.pendingApprovals)} ${s.pendingApprovals === 1 ? 'entry' : 'entries'}`}
                      note="Hour logs waiting for you"
                      tone={s.pendingApprovals > 0 ? 'amber' : undefined}
                      intro={entrance(w, 90, 8)}
                    />
                  </Link>
                </div>

                <div className={cn('grid gap-5 lg:grid-cols-[1fr_340px]', panels.className)} style={panels.style}>
                  <Panel
                    className="flex flex-col"
                    title="Approved hours by month"
                    description={
                      sixMonthTotal === 0
                        ? 'Last 6 months'
                        : `Last 6 months · ${fmtHours(sixMonthTotal)} hours total · the current month is lighter because it isn’t over yet`
                    }
                  >
                    {sixMonthTotal === 0 ? (
                      <EmptyState
                        className="flex-1"
                        icon={<ChartColumn />}
                        title="No approved hours yet"
                        description="Once you approve logged hours, they show up here by month."
                      />
                    ) : (
                    <>
                    <ChartTable caption="Approved hours by month" unit="hours" rows={s.hoursByMonth.map((m) => ({ label: fmtMonth(m.month), value: m.hours }))} />
                    <ChartContainer config={chartConfig} className="aspect-auto min-h-[300px] w-full flex-1" aria-hidden>
                      <BarChart
                        data={s.hoursByMonth.map((m, i) => ({
                          ...m,
                          label: i === s.hoursByMonth.length - 1 ? `${fmtMonth(m.month)} (so far)` : fmtMonth(m.month)
                        }))}
                        margin={{ top: 24 }}
                        accessibilityLayer={false}
                      >
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                        <Bar dataKey="hours" fill="var(--color-hours)" radius={6}>
                          {s.hoursByMonth.map((m, i) => (
                            <Cell key={m.month} fillOpacity={i === s.hoursByMonth.length - 1 ? 0.45 : 1} />
                          ))}
                          <LabelList dataKey="hours" position="top" className="fill-foreground" fontSize={12} />
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                    </>
                    )}
                  </Panel>

                  <div className="space-y-5">
                    <Panel title="Top activities" description="By approved hours">
                      {s.topActivities.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No approved hours yet.</p>
                      ) : (
                        <ul className="space-y-3">
                          {s.topActivities.map((t) => (
                            <li key={t.title}>
                              <div className="mb-1 flex justify-between gap-2 text-sm">
                                <span className="truncate">{t.title}</span>
                                <span className="text-muted-foreground tabular">{fmtHours(t.hours)} h</span>
                              </div>
                              <Meter value={t.hours} max={topMax} label={`${t.title}: ${t.hours} hours`} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </Panel>

                    <Panel title="Skill gaps" description="Upcoming shifts where no confirmed volunteer has a needed skill">
                      {s.skillGaps.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          {s.upcomingActivities === 0 ? 'No upcoming shifts to check yet.' : 'Every upcoming shift has the skills it needs.'}
                        </p>
                      ) : (
                        <ul className="space-y-3">
                          {s.skillGaps.slice(0, 4).map((g) => (
                            <li key={g.activityId} className="text-sm">
                              <Link to={`/admin/activities/${g.activityId}`} className="font-medium hover:underline">
                                {g.activityTitle}
                              </Link>
                              <span className="text-muted-foreground"> · {fmtDay(g.startAt)}</span>
                              <p className="mt-0.5 text-warning">Needs: {g.missingSkills.join(', ')}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </Panel>
                  </div>
                </div>
              </div>
            )
          }}
        </Loader>
      </PageBody>
    </>
  )
}
