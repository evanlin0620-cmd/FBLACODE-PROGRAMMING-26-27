/** Unslopped app frame: a quiet neutral sidebar; the selection is a surface step, not a green wash. */
import { useOrg } from './data'
import { Award, Bell, CalendarDays, ChartColumn, CircleHelp, ClipboardCheck, Clock, FileText, Heart, History, Home, Mail, Search, Settings, User, Users, type LucideIcon } from 'lucide-react'

/** Icon, label, and an optional count with what it counts (read to screen readers, since the number alone says nothing). */
type Item = [LucideIcon, string, [number, string]?]

const NAV: Record<'volunteer' | 'admin', Item[]> = {
  volunteer: [
    [Home, 'Dashboard'],
    [Search, 'Find activities'],
    [CalendarDays, 'My shifts'],
    [Clock, 'My hours'],
    [Award, 'Certificates'],
    [User, 'My profile'],
    [Bell, 'Notifications', [3, 'unread']]
  ],
  admin: [
    [ChartColumn, 'Impact'],
    [CalendarDays, 'Activities'],
    [ClipboardCheck, 'Hour approvals', [2, 'waiting']],
    [Users, 'Volunteers'],
    [FileText, 'Reports'],
    [Mail, 'Email outbox'],
    [History, 'Audit log'],
    [Settings, 'Settings']
  ]
}

export function Shell({
  role,
  user,
  title,
  meta,
  actions,
  counts,
  children
}: {
  counts?: Record<string, number> // live overrides for nav counts, by label
  role: 'volunteer' | 'admin'
  user: [string, string]
  title: string
  meta: string
  actions: React.ReactNode
  children: React.ReactNode
}): React.JSX.Element {
  const org = useOrg()
  return (
    <div className="unslop flex h-svh">
      <aside className="flex w-60 shrink-0 flex-col border-r bg-[#f5f5f5] px-3 pt-4 pb-3" aria-label="App menu (static in this prototype)">
        <p className="flex h-9 items-center gap-2 px-2 text-[15px] font-medium">
          <span className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground">
            <Heart className="size-3.5" strokeWidth={2} aria-hidden />
          </span>
          ServeHub
        </p>
        <p className="mt-6 mb-2 truncate px-2 text-xs text-[var(--text-2)]" title={org}>
          {role === 'volunteer' ? `Volunteer at ${org}` : org}
        </p>
        <nav className="flex flex-col gap-0.5">
          {NAV[role].map(([Icon, label, base], i) => {
            const count = base && ([counts?.[label] ?? base[0], base[1]] as const)
            return (
            <a
              key={label}
              href="#"
              aria-current={i === 0 ? 'page' : undefined}
              className="flex h-9 items-center gap-2.5 rounded-lg px-2 text-sm text-[var(--text-2)] transition-colors hover:bg-black/[0.04] aria-[current]:bg-white aria-[current]:font-medium aria-[current]:text-foreground aria-[current]:shadow-[0_0_0_1px_rgb(23_23_23/0.08),0_1px_2px_rgb(0_0_0/0.04)]"
            >
              <Icon className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.5} aria-hidden />
              {label}
              {count && count[0] > 0 ? (
                <span className="ml-auto text-xs text-[var(--text-2)] tabular-nums">
                  {count[0]}
                  <span className="sr-only"> {count[1]}</span>
                </span>
              ) : null}
            </a>
            )
          })}
        </nav>
        <a href="#" className="mt-auto flex h-9 items-center gap-2.5 rounded-lg px-2 text-sm text-[var(--text-2)] transition-colors hover:bg-black/[0.04]">
          <CircleHelp className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.5} aria-hidden />
          Help and questions
        </a>
        <div className="mt-1 flex items-center gap-2.5 border-t px-2 pt-3">
          <span className="grid size-8 place-items-center rounded-full bg-white text-xs font-medium shadow-[0_0_0_1px_rgb(23_23_23/0.08)]" aria-hidden>
            {user[0]
              .split(' ')
              .map((p) => p[0])
              .join('')}
          </span>
          <span className="min-w-0 text-sm leading-tight">
            <span className="block truncate font-medium">{user[0]}</span>
            <span className="block truncate text-xs text-[var(--text-2)]">{user[1]}</span>
          </span>
        </div>
      </aside>
      <main className="min-w-0 flex-1 overflow-y-auto pb-24">
        <header className="flex h-16 items-center justify-between gap-6 border-b px-8">
          <div className="flex min-w-0 items-baseline gap-3">
            <h1 className="text-xl font-medium">{title}</h1>
            <p className="truncate text-sm text-muted-foreground">{meta}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        </header>
        <div className="mx-auto max-w-[1200px] px-8 py-8">{children}</div>
      </main>
    </div>
  )
}

/** A card: white surface, hairline, one padding everywhere. */
export function Card({
  title,
  aside,
  className = '',
  style,
  children
}: {
  title?: string
  aside?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <section className={`rounded-2xl border bg-card p-6 ${className}`} style={style}>
      {title && (
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 className="text-[15px] font-medium">{title}</h2>
          {aside}
        </div>
      )}
      {children}
    </section>
  )
}
