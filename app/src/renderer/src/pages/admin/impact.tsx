/** Admin home: community impact at a glance, plus what needs attention. */
import { Link } from 'react-router'
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis } from 'recharts'
import { Button } from '@/components/ui/button'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import { ChartTable, Loader, PageBody, PageHeader, Panel } from '@/components/page'
import { Meter, Pill } from '@/components/status'
import { useQuery } from '@/lib/hooks'
import { fmtDay, fmtHours, fmtMonth } from '@/lib/format'
import { ORG_NAME } from '@/lib/org'

const chartConfig = { hours: { label: 'Approved hours', color: 'var(--chart-1)' } } satisfies ChartConfig

function Stat({ label, value, note, tone }: { label: string; value: string; note: string; tone?: 'amber' }): React.JSX.Element {
  return (
    <div className="rounded-xl border bg-card p-5">
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
  return (
    <>
      <PageHeader
        title="Impact dashboard"
        subtitle={ORG_NAME}
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
                  <Stat label="Approved hours" value={fmtHours(s.totalApprovedHours)} note="All time, approved only" />
                  <Stat label="Volunteers" value={String(s.volunteerCount)} note="With a ServeHub account" />
                  <Stat label="Upcoming activities" value={String(s.upcomingActivities)} note="Open and scheduled" />
                  <Link to="/admin/approvals" className="rounded-xl outline-offset-2">
                    <Stat
                      label="To approve"
                      value={`${s.pendingApprovals} ${s.pendingApprovals === 1 ? 'entry' : 'entries'}`}
                      note="Hour logs waiting for you"
                      tone={s.pendingApprovals > 0 ? 'amber' : undefined}
                    />
                  </Link>
                </div>

                <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
                  <Panel
                    className="flex flex-col"
                    title="Approved hours by month"
                    description={`Last 6 months · ${fmtHours(sixMonthTotal)} hours total · the current month is lighter because it isn’t over yet`}
                  >
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
                        <p className="text-sm text-muted-foreground">Every upcoming shift has the skills it needs.</p>
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
