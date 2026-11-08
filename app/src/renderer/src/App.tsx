/**
 * Routes and guards. Volunteers and admins get separate route trees, and each
 * tree checks the role before rendering (the backend checks again on every call).
 * An error boundary turns any unexpected UI error into a friendly page.
 */
import { Component, type ReactNode } from 'react'
import { createHashRouter, Navigate, Outlet, RouterProvider, useRouteError } from 'react-router'
import { AlertTriangle } from 'lucide-react'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { AppShell } from '@/components/app-shell'
import { SessionProvider, useSession } from '@/lib/session'
import { LoginPage, SignupPage } from '@/pages/auth'
import { VolunteerDashboard } from '@/pages/volunteer/dashboard'
import { BrowseActivities } from '@/pages/volunteer/browse'
import { ActivityDetail } from '@/pages/volunteer/activity-detail'
import { MyShifts } from '@/pages/volunteer/shifts'
import { MyHours } from '@/pages/volunteer/hours'
import { CertificatePage } from '@/pages/volunteer/certificate'
import { ProfilePage } from '@/pages/volunteer/profile'
import { NotificationsPage } from '@/pages/notifications'
import { HelpPage } from '@/pages/help'
import { ImpactDashboard } from '@/pages/admin/impact'
import { AdminActivities, ManageActivity, NewActivity } from '@/pages/admin/activities'
import { Approvals } from '@/pages/admin/approvals'
import { VolunteerDirectory, VolunteerRecord } from '@/pages/admin/volunteers'
import { Reports, VerifiedCertificate } from '@/pages/admin/reports'
import { AuditLog, Outbox, Settings } from '@/pages/admin/system'
import type { Role } from '@shared/types'

function home(role: Role | undefined): string {
  return role === 'admin' ? '/admin' : role === 'volunteer' ? '/dashboard' : '/login'
}

/** Only logged-out visitors see login/sign-up. */
function PublicOnly(): React.JSX.Element {
  const { user } = useSession()
  return user ? <Navigate to={home(user.role)} replace /> : <Outlet />
}

/** Logged-in users with an allowed role see the app shell; everyone else is redirected. */
function RequireRole({ roles }: { roles: Role[] }): React.JSX.Element {
  const { user } = useSession()
  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) return <Navigate to={home(user.role)} replace />
  return <Outlet />
}

function Home(): React.JSX.Element {
  const { user } = useSession()
  return <Navigate to={home(user?.role)} replace />
}

function FriendlyError({ message, onReset }: { message?: string; onReset: () => void }): React.JSX.Element {
  return (
    <main className="grid min-h-svh place-items-center p-8">
      <div role="alert" className="max-w-md text-center">
        <AlertTriangle className="mx-auto size-10 text-warning" aria-hidden />
        <h1 className="mt-4 text-2xl font-semibold">Something went wrong on this screen</h1>
        <p className="mt-2 text-muted-foreground">Your data is safe. Go back to your home page and try again.</p>
        {message && <p className="mt-4 rounded-md bg-muted p-3 text-left font-mono text-xs text-muted-foreground">{message}</p>}
        <Button className="mt-6" onClick={onReset}>
          Back to home
        </Button>
      </div>
    </main>
  )
}

function RouteError(): React.JSX.Element {
  const error = useRouteError() as Error | undefined
  return (
    <FriendlyError
      message={error?.message}
      onReset={() => {
        window.location.hash = '#/'
      }}
    />
  )
}

/** Catches errors outside the router (for example in the session provider). */
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error): { error: Error } {
    return { error }
  }
  render(): ReactNode {
    if (this.state.error) {
      return (
        <FriendlyError
          message={this.state.error.message}
          onReset={() => {
            window.location.hash = '#/'
            this.setState({ error: null })
          }}
        />
      )
    }
    return this.props.children
  }
}

const router = createHashRouter([
  {
    errorElement: <RouteError />,
    children: [
      { path: '/', element: <Home /> },
      {
        element: <PublicOnly />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/signup', element: <SignupPage /> }
        ]
      },
      {
        element: <RequireRole roles={['volunteer', 'admin']} />,
        children: [
          {
            element: <AppShell />,
            errorElement: <RouteError />,
            children: [
              { path: '/help', element: <HelpPage /> },
              { path: '/notifications', element: <NotificationsPage /> },
              {
                element: <RequireRole roles={['volunteer']} />,
                children: [
                  { path: '/dashboard', element: <VolunteerDashboard /> },
                  { path: '/activities', element: <BrowseActivities /> },
                  { path: '/activities/:id', element: <ActivityDetail /> },
                  { path: '/shifts', element: <MyShifts /> },
                  { path: '/hours', element: <MyHours /> },
                  { path: '/certificate', element: <CertificatePage /> },
                  { path: '/profile', element: <ProfilePage /> }
                ]
              },
              {
                element: <RequireRole roles={['admin']} />,
                children: [
                  { path: '/admin', element: <ImpactDashboard /> },
                  { path: '/admin/activities', element: <AdminActivities /> },
                  { path: '/admin/activities/new', element: <NewActivity /> },
                  { path: '/admin/activities/:id', element: <ManageActivity /> },
                  { path: '/admin/approvals', element: <Approvals /> },
                  { path: '/admin/volunteers', element: <VolunteerDirectory /> },
                  { path: '/admin/volunteers/:id', element: <VolunteerRecord /> },
                  { path: '/admin/reports', element: <Reports /> },
                  { path: '/admin/certificates/:code', element: <VerifiedCertificate /> },
                  { path: '/admin/outbox', element: <Outbox /> },
                  { path: '/admin/audit', element: <AuditLog /> },
                  { path: '/admin/settings', element: <Settings /> }
                ]
              }
            ]
          }
        ]
      },
      { path: '*', element: <Home /> }
    ]
  }
])

function ThemedToaster(): React.JSX.Element {
  const { theme } = useSession()
  return <Toaster theme={theme} position="bottom-right" richColors closeButton />
}

export default function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <SessionProvider>
        <TooltipProvider>
          <RouterProvider router={router} />
          <ThemedToaster />
        </TooltipProvider>
      </SessionProvider>
    </ErrorBoundary>
  )
}
