/**
 * Who is logged in, the organization's name, plus light/dark theme. Both are app-wide, so they live in
 * React context. The session itself is owned by the main process; this only
 * mirrors it so screens can render the right navigation.
 */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { ORGANIZATION, type SessionUser } from '@shared/types'
import { api } from './api'

interface SessionValue {
  user: SessionUser | null
  setUser: (u: SessionUser | null) => void
  logout: () => Promise<void>
  org: string
  setOrg: (name: string) => void
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const SessionContext = createContext<SessionValue | null>(null)

function readTheme(): 'light' | 'dark' {
  try {
    // Graphite is the default; light only when someone chose it. A new key, because the old one was
    // auto-saved as 'light' on every launch back when light was the default.
    return localStorage.getItem('servehub-theme-v2') === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export function SessionProvider({ children }: { children: ReactNode }): React.JSX.Element | null {
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined)
  const [theme, setTheme] = useState<'light' | 'dark'>(readTheme)
  const [org, setOrg] = useState(ORGANIZATION)

  useEffect(() => {
    // Render only once both are known, so the demo name never flashes on a renamed install.
    Promise.all([api('auth.me').catch(() => null), api('org.get').catch(() => ORGANIZATION)]).then(([u, o]) => {
      setOrg(o)
      setUser(u)
    })
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem('servehub-theme-v2', theme)
    } catch {
      /* storage can be blocked; the theme just won't be remembered */
    }
  }, [theme])

  const logout = useCallback(async () => {
    await api('auth.logout')
    setUser(null)
  }, [])

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  if (user === undefined) return null // first instant while the session loads
  return <SessionContext.Provider value={{ user, setUser, logout, theme, toggleTheme, org, setOrg }}>{children}</SessionContext.Provider>
}

export function useSession(): SessionValue {
  const value = useContext(SessionContext)
  if (!value) throw new Error('useSession must be used inside SessionProvider')
  return value
}

/** For screens that only render after login. */
export function useUser(): SessionUser {
  const { user } = useSession()
  if (!user) throw new Error('Expected a logged-in user')
  return user
}
