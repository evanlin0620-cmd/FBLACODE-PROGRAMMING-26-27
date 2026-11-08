/**
 * Who is logged in, plus light/dark theme. Both are app-wide, so they live in
 * React context. The session itself is owned by the main process; this only
 * mirrors it so screens can render the right navigation.
 */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { SessionUser } from '@shared/types'
import { api } from './api'

interface SessionValue {
  user: SessionUser | null
  setUser: (u: SessionUser | null) => void
  logout: () => Promise<void>
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const SessionContext = createContext<SessionValue | null>(null)

function readTheme(): 'light' | 'dark' {
  try {
    return localStorage.getItem('servehub-theme') === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function SessionProvider({ children }: { children: ReactNode }): React.JSX.Element | null {
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined)
  const [theme, setTheme] = useState<'light' | 'dark'>(readTheme)

  useEffect(() => {
    api('auth.me')
      .then(setUser)
      .catch(() => setUser(null))
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem('servehub-theme', theme)
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
  return <SessionContext.Provider value={{ user, setUser, logout, theme, toggleTheme }}>{children}</SessionContext.Provider>
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
