/**
 * The app frame after login: a sidebar with the navigation for the user's role,
 * Help, theme switch, and account menu, plus keyboard shortcuts
 * ("/" jumps to the page's search box, "?" opens Help).
 */
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useMatch, useNavigate, useResolvedPath } from 'react-router'
import {
  Award,
  ChartColumn,
  Bell,
  CalendarDays,
  CircleHelp,
  ClipboardCheck,
  Clock,
  FileText,
  Heart,
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
  ChevronsUpDown,
  type LucideIcon
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { useSession, useUser } from '@/lib/session'
import { api } from '@/lib/api'
import { initials } from '@/lib/format'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  badge?: 'unread' | 'pending'
  end?: boolean
}

const VOLUNTEER_NAV: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/activities', label: 'Find activities', icon: Search },
  { to: '/shifts', label: 'My shifts', icon: CalendarDays },
  { to: '/hours', label: 'My hours', icon: Clock },
  { to: '/certificate', label: 'Certificates', icon: Award },
  { to: '/profile', label: 'My profile', icon: User },
  { to: '/notifications', label: 'Notifications', icon: Bell, badge: 'unread' }
]

const ADMIN_NAV: NavItem[] = [
  { to: '/admin', label: 'Impact', icon: ChartColumn, end: true },
  { to: '/admin/activities', label: 'Activities', icon: CalendarDays },
  { to: '/admin/approvals', label: 'Hour approvals', icon: ClipboardCheck, badge: 'pending' },
  { to: '/admin/volunteers', label: 'Volunteers', icon: Users },
  { to: '/admin/reports', label: 'Reports', icon: FileText },
  { to: '/admin/outbox', label: 'Email outbox', icon: Mail },
  { to: '/admin/audit', label: 'Audit log', icon: History },
  { to: '/admin/settings', label: 'Settings', icon: Settings }
]

/** A sidebar link. NavLink adds aria-current="page" on the active one. */
function NavItemLink({ item }: { item: NavItem }): React.JSX.Element {
  const resolved = useResolvedPath(item.to)
  const isActive = !!useMatch({ path: resolved.pathname, end: item.end ?? false })
  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      className="h-9 gap-2.5 text-text-2 hover:bg-black/[0.04] data-[active=true]:font-medium data-[active=true]:shadow-[0_0_0_1px_var(--border),0_1px_2px_rgb(0_0_0/0.04)] dark:hover:bg-white/[0.06] [&>svg]:text-muted-foreground"
    >
      <NavLink to={item.to} end={item.end}>
        <item.icon strokeWidth={1.5} aria-hidden />
        <span>{item.label}</span>
      </NavLink>
    </SidebarMenuButton>
  )
}

/** Badge counts for the nav, refreshed whenever the page changes. */
function useNavCounts(role: 'volunteer' | 'admin'): { unread: number; pending: number } {
  const location = useLocation()
  const [counts, setCounts] = useState({ unread: 0, pending: 0 })
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const bump = (): void => setTick((t) => t + 1)
    window.addEventListener('servehub:counts', bump)
    return () => window.removeEventListener('servehub:counts', bump)
  }, [])
  useEffect(() => {
    let alive = true
    const load =
      role === 'admin'
        ? api('hours.forReview', 'pending').then((h) => ({ unread: 0, pending: h.length }))
        : api('notifications.mine').then((n) => ({ unread: n.filter((x) => !x.readAt).length, pending: 0 }))
    load.then((c) => alive && setCounts(c)).catch(() => undefined)
    return () => {
      alive = false
    }
  }, [role, location.pathname, tick])
  return counts
}

export function AppShell(): React.JSX.Element {
  const user = useUser()
  const { logout, theme, toggleTheme, org } = useSession()
  const navigate = useNavigate()
  const counts = useNavCounts(user.role)
  const nav = user.role === 'admin' ? ADMIN_NAV : VOLUNTEER_NAV
  const { pathname } = useLocation()

  // Messages belong to the page they came from; clear them when the page changes.
  useEffect(() => {
    toast.dismiss()
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

  return (
    <SidebarProvider className="h-svh" style={{ '--sidebar-width': '15rem' } as React.CSSProperties}>
      <Sidebar collapsible="none" className="h-svh border-r" data-print-hide>
        <SidebarHeader className="px-3 pt-4 pb-0">
          <p className="flex h-9 items-center gap-2 px-2 text-[15px] font-medium">
            <span className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground">
              <Heart className="size-3.5" strokeWidth={2} aria-hidden />
            </span>
            ServeHub
          </p>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup role="navigation" aria-label="Main menu" className="px-3">
            <p className="mt-4 mb-2 truncate px-2 text-xs text-text-2" title={org}>
              {user.role === 'admin' ? org : `Volunteer at ${org}`}
            </p>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map((item) => {
                  const count = item.badge ? counts[item.badge] : 0
                  return (
                    <SidebarMenuItem key={item.to}>
                      <NavItemLink item={item} />
                      {count > 0 && (
                        <SidebarMenuBadge className="text-xs font-normal text-text-2 tabular-nums peer-hover/menu-button:text-text-2 peer-data-[active=true]/menu-button:text-text-2">
                          {count > 99 ? '99+' : count}
                          <span className="sr-only">{item.badge === 'pending' ? ' entries waiting' : ' unread'}</span>
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="gap-1 px-3 pb-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <NavItemLink item={{ to: '/help', label: 'Help & questions', icon: CircleHelp }} />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={toggleTheme} className="h-9 gap-2.5 text-text-2 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] [&>svg]:text-muted-foreground">
                {theme === 'dark' ? <Sun strokeWidth={1.5} aria-hidden /> : <Moon strokeWidth={1.5} aria-hidden />}
                <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="mt-1 flex w-full items-center gap-2.5 rounded-lg border-t p-2 pt-3 text-left hover:bg-black/[0.04] dark:hover:bg-white/[0.06]">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-card text-xs font-medium shadow-[0_0_0_1px_var(--border)]" aria-hidden>
                {initials(user.fullName)}
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-sm font-medium">{user.fullName}</span>
                <span className="block truncate text-xs text-text-2">{user.email}</span>
              </span>
              <ChevronsUpDown className="size-4 text-muted-foreground" aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56">
              <DropdownMenuLabel className="font-normal text-muted-foreground">
                Signed in as {user.role === 'admin' ? 'an admin' : 'a volunteer'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user.role === 'volunteer' && (
                <DropdownMenuItem onSelect={() => navigate('/profile')}>
                  <User aria-hidden /> My profile
                </DropdownMenuItem>
              )}
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
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="min-w-0 overflow-y-auto">
        {/* SidebarInset is already the <main> landmark; a second <main> would nest landmarks. */}
        <div id="main" className="min-h-full">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
