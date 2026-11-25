/**
 * The app frame after login: a graphite sidebar with the everyday pages, the next few shifts
 * (each marked with its activity-type dot), and the account menu at the bottom. Keyboard shortcuts:
 * "/" jumps to the page's search box, "?" opens Help.
 */
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import {
  Award,
  Bell,
  CalendarDays,
  ChartColumn,
  ChevronsUpDown,
  CircleHelp,
  ClipboardCheck,
  Clock,
  FileText,
  History,
  Home,
  LogOut,
  Mail,
  Moon,
  Search,
  Settings,
  Sun,
  User,
  Users,
  type LucideIcon
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { useSession, useUser } from '@/lib/session'
import { api } from '@/lib/api'
import { fmtDay, initials, today } from '@/lib/format'
import { TYPE_STYLE } from '@/lib/activity-style'
import { cn } from '@/lib/utils'
import { BrandMark } from '@/components/brand-mark'
import type { Activity } from '@shared/types'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

/** Everyday pages, in the sidebar. */
const NAV: Record<'volunteer' | 'admin', NavItem[]> = {
  volunteer: [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/activities', label: 'Find activities', icon: Search },
    { to: '/shifts', label: 'My shifts', icon: CalendarDays },
    { to: '/hours', label: 'My hours', icon: Clock },
    { to: '/certificate', label: 'Certificates', icon: Award },
    { to: '/notifications', label: 'Notifications', icon: Bell }
  ],
  admin: [
    { to: '/admin', label: 'Impact', icon: ChartColumn, end: true },
    { to: '/admin/activities', label: 'Activities', icon: CalendarDays },
    { to: '/admin/approvals', label: 'Hour approvals', icon: ClipboardCheck },
    { to: '/admin/volunteers', label: 'Volunteers', icon: Users },
    { to: '/admin/reports', label: 'Reports', icon: FileText }
  ]
}

/** Occasional pages: in the account menu. */
const MENU: Record<'volunteer' | 'admin', NavItem[]> = {
  volunteer: [{ to: '/profile', label: 'My profile', icon: User }],
  admin: [
    { to: '/admin/outbox', label: 'Email outbox', icon: Mail },
    { to: '/admin/audit', label: 'Audit log', icon: History },
    { to: '/admin/settings', label: 'Settings', icon: Settings }
  ]
}

interface SidebarData {
  unread: number
  pending: number
  /** The volunteer's own next shifts, or for a coordinator the next open shifts. */
  soon: Activity[]
}

/** Counts and the "coming up" list, refreshed whenever the page changes or a screen asks (refreshNavCounts). */
function useSidebarData(role: 'volunteer' | 'admin'): SidebarData {
  const location = useLocation()
  const [data, setData] = useState<SidebarData>({ unread: 0, pending: 0, soon: [] })
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const bump = (): void => setTick((t) => t + 1)
    window.addEventListener('servehub:counts', bump)
    return () => window.removeEventListener('servehub:counts', bump)
  }, [])
  useEffect(() => {
    let alive = true
    const load: Promise<SidebarData> =
      role === 'admin'
        ? Promise.all([api('hours.forReview', 'pending'), api('activities.list', { from: today() })]).then(([h, a]) => ({
            unread: 0,
            pending: h.length,
            soon: a.filter((x) => x.status === 'open').slice(0, 4)
          }))
        : Promise.all([api('notifications.mine'), api('signups.mine')]).then(([n, mine]) => ({
            unread: n.filter((x) => !x.readAt).length,
            pending: 0,
            soon: mine.slice(0, 4)
          }))
    load.then((d) => alive && setData(d)).catch(() => undefined)
    return () => {
      alive = false
    }
  }, [role, location.pathname, tick])
  return data
}

const count = (n: number): string => (n > 99 ? '99+' : String(n))

/** One sidebar row. Hover is a colour change only; the current page gets one surface step and a hairline. */
const row =
  'flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-sm text-text-2 transition-colors duration-150 hover:bg-foreground/[0.04] hover:text-foreground aria-[current=page]:bg-sidebar-accent aria-[current=page]:text-foreground aria-[current=page]:shadow-[inset_0_0_0_1px_var(--border)]'

function Section({ label, children }: { label: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="mt-6 first:mt-0">
      <p className="mb-2 px-2.5 text-xs text-muted-foreground">{label}</p>
      {children}
    </div>
  )
}

export function AppShell(): React.JSX.Element {
  const user = useUser()
  const { logout, theme, toggleTheme, org } = useSession()
  const navigate = useNavigate()
  const side = useSidebarData(user.role)
  const { pathname } = useLocation()

  // Messages belong to the page they came from; clear them when the page changes.
  // Not on arrival, so the "Welcome" toast from sign-up survives the landing.
  const arrived = useRef(false)
  useEffect(() => {
    if (arrived.current) toast.dismiss()
    arrived.current = true
  }, [pathname])

  // Keyboard shortcuts. Ignored while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      const t = e.target as HTMLElement
      if (t.closest('input, textarea, select, [contenteditable="true"]') || e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key === '/') {
        const search = document.querySelector<HTMLInputElement>('[data-page-search]')
        if (search) {
          e.preventDefault()
          search.focus()
        }
      } else if (e.key === '?') {
        e.preventDefault()
        navigate('/help')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  const badgeFor = (to: string): number => (to === '/admin/approvals' ? side.pending : to === '/notifications' ? side.unread : 0)
  const detailPath = (a: Activity): string => (user.role === 'admin' ? `/admin/activities/${a.id}` : `/activities/${a.id}`)

  return (
    <div className="flex h-svh" data-app-frame>
      <aside className="flex w-60 shrink-0 flex-col border-r bg-sidebar" data-print-hide>
        <div className="flex h-14 shrink-0 items-center gap-2.5 px-5">
          <BrandMark size={24} />
          <span className="min-w-0">
            <span className="block text-[15px] leading-tight font-medium">Turnout</span>
            <span className="block truncate text-xs leading-tight text-muted-foreground" title={org}>
              {org}
            </span>
          </span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
          <nav aria-label="Main menu">
            <Section label="Menu">
              <ul className="space-y-0.5">
                {NAV[user.role].map((item) => {
                  const badge = badgeFor(item.to)
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end={item.end}
                        className={row}
                        aria-label={item.to === '/notifications' && badge ? `Notifications, ${count(badge)} unread` : undefined}
                      >
                        <item.icon className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        {badge > 0 && (
                          <span className="font-mono text-xs text-muted-foreground tabular-nums">
                            {count(badge)}
                            {item.to === '/admin/approvals' && <span className="sr-only"> entries waiting</span>}
                          </span>
                        )}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </Section>
          </nav>

          {side.soon.length > 0 && (
            <Section label={user.role === 'admin' ? 'Open shifts' : 'Coming up'}>
              <ul className="space-y-0.5">
                {side.soon.map((a) => (
                  <li key={a.id}>
                    <Link to={detailPath(a)} className={cn(row, 'gap-3')} title={`${a.title}, ${a.type}`}>
                      {/* The signature: every shift carries its activity-type dot. */}
                      <span className="size-2 shrink-0 rounded-full" style={{ background: TYPE_STYLE[a.type].tint }} aria-hidden />
                      <span className="min-w-0 flex-1 truncate">{a.title}</span>
                      <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">{fmtDay(a.startAt).replace(/^\w+, /, '')}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        <div className="shrink-0 space-y-0.5 border-t p-3">
          <NavLink to="/help" className={row}>
            <CircleHelp className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
            <span className="flex-1">Help &amp; questions</span>
            <kbd className="rounded border bg-background px-1 font-mono text-[11px] leading-4 text-muted-foreground">?</kbd>
          </NavLink>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors duration-150 hover:bg-foreground/[0.04] data-[state=open]:bg-foreground/[0.04]"
              aria-label={`Account menu for ${user.fullName}`}
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent text-[11px] font-medium" aria-hidden>
                {initials(user.fullName)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm leading-tight">{user.fullName}</span>
                <span className="block text-xs leading-tight text-muted-foreground">{user.role === 'admin' ? 'Coordinator' : 'Volunteer'}</span>
              </span>
              <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.5} aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]">
              <DropdownMenuLabel className="font-normal">
                <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {MENU[user.role].map((item) => (
                <DropdownMenuItem key={item.to} onSelect={() => navigate(item.to)} className={cn(pathname.startsWith(item.to) && 'font-medium')}>
                  <item.icon aria-hidden /> {item.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onSelect={toggleTheme}>
                {theme === 'dark' ? <Sun aria-hidden /> : <Moon aria-hidden />} {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={async () => {
                  await logout()
                  navigate('/login')
                }}
              >
                <LogOut aria-hidden /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <main id="main" className="min-w-0 flex-1 overflow-y-auto">
        {/* Keyed by page so each page change gets the short fade-and-rise; reduced motion turns it off. */}
        <div key={pathname} className="animate-page">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
