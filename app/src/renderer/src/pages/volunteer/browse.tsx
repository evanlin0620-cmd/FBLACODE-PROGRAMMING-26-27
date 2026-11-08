/** Find activities: search plus date, skill, and type filters over the catalog. */
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Search, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader, PageBody, PageHeader, EmptyState } from '@/components/page'
import { ActivityCard } from '@/components/activity'
import { useQuery } from '@/lib/hooks'
import { today } from '@/lib/format'
import { ACTIVITY_TYPES, type ActivityType } from '@shared/types'

const DATE_OPTIONS = {
  any: 'Any time',
  week: 'Next 7 days',
  month: 'Next 30 days'
} as const

function addDays(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function BrowseActivities(): React.JSX.Element {
  const [q, setQ] = useState('')
  const [when, setWhen] = useState<keyof typeof DATE_OPTIONS>('any')
  const [skill, setSkill] = useState('any')
  const [type, setType] = useState('any')
  const [sort, setSort] = useState<'soonest' | 'spots'>('soonest')
  const skills = useQuery('skills.list')

  const filter = {
    q: q.trim() || undefined,
    from: when === 'any' ? undefined : today(),
    to: when === 'week' ? addDays(7) : when === 'month' ? addDays(30) : undefined,
    skillId: skill === 'any' ? undefined : Number(skill),
    type: type === 'any' ? undefined : (type as ActivityType)
  }
  const list = useQuery('activities.list', filter)
  const filtered = q || when !== 'any' || skill !== 'any' || type !== 'any'

  const sorted = useMemo(() => {
    const items = [...(list.data ?? [])]
    if (sort === 'spots') items.sort((a, b) => b.capacity - b.confirmed - (a.capacity - a.confirmed))
    return items
  }, [list.data, sort])

  const clear = (): void => {
    setQ('')
    setWhen('any')
    setSkill('any')
    setType('any')
  }

  return (
    <>
      <PageHeader
        title="Find activities"
        subtitle="Pick a shift that fits your time and skills."
        actions={
          <Button variant="outline" asChild>
            <Link to="/shifts">My shifts</Link>
          </Button>
        }
      />
      <PageBody>
        <div className="flex flex-wrap items-center gap-2" role="search">
          <div className="relative min-w-[260px] flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              data-page-search
              aria-label="Search activities"
              placeholder="Search by name, place, or description  ( / )"
              className="h-9 pl-9"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <Select value={when} onValueChange={(v) => setWhen(v as keyof typeof DATE_OPTIONS)}>
            <SelectTrigger aria-label="Date" className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DATE_OPTIONS).map(([k, label]) => (
                <SelectItem key={k} value={k}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={skill} onValueChange={setSkill}>
            <SelectTrigger aria-label="Skill needed" className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Skill: Any</SelectItem>
              {skills.data?.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger aria-label="Activity type" className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Type: Any</SelectItem>
              {ACTIVITY_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filtered && (
            <Button variant="ghost" onClick={clear}>
              Clear filters
            </Button>
          )}
        </div>

        <div className="mt-5 mb-3 flex items-center justify-between text-sm text-muted-foreground">
          <p aria-live="polite">{list.data ? `Showing ${list.data.length} ${list.data.length === 1 ? 'activity' : 'activities'}` : ' '}</p>
          <label className="flex items-center gap-2">
            Sort
            <Select value={sort} onValueChange={(v) => setSort(v as 'soonest' | 'spots')}>
              <SelectTrigger className="h-8 w-[150px]" aria-label="Sort activities">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="soonest">Soonest first</SelectItem>
                <SelectItem value="spots">Most spots left</SelectItem>
              </SelectContent>
            </Select>
          </label>
        </div>

        <Loader query={list}>
          {() =>
            sorted.length === 0 ? (
              <EmptyState
                icon={<SearchX />}
                title={filtered ? 'No activities match' : 'No upcoming activities'}
                description={filtered ? 'Try a different search or clear the filters.' : 'Check back soon. New shifts are added every week.'}
                action={filtered ? <Button onClick={clear}>Clear filters</Button> : undefined}
              />
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4">
                {sorted.map((a) => (
                  <ActivityCard key={a.id} activity={a} onChange={list.reload} />
                ))}
              </div>
            )
          }
        </Loader>
      </PageBody>
    </>
  )
}
