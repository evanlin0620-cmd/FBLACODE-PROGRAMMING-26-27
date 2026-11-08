/**
 * Page layout pieces shared by every screen: the header with title and actions,
 * the scrollable body, and the loading / error / empty states.
 */
import type { ReactNode } from 'react'
import { AlertTriangle, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { cn } from '@/lib/utils'
import type { ApiError } from '@/lib/api'

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: ReactNode; actions?: ReactNode }): React.JSX.Element {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b px-8 pt-6 pb-5" data-print-hide>
      <div className="min-w-0">
        <h1 className="text-[1.75rem] leading-tight font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  )
}

export function PageBody({ children, className }: { children: ReactNode; className?: string }): React.JSX.Element {
  return <div className={cn('mx-auto w-full max-w-[1200px] px-8 py-6', className)}>{children}</div>
}

/** Shows a skeleton while loading, a retry panel on error, otherwise the children. */
export function Loader<T>({
  query,
  children,
  skeleton = 'cards'
}: {
  query: { data: T | undefined; error: ApiError | null; loading: boolean; reload: () => void }
  children: (data: T) => ReactNode
  skeleton?: 'cards' | 'table' | 'form'
}): React.JSX.Element {
  if (query.error && query.data === undefined) return <ErrorPanel message={query.error.message} onRetry={query.reload} />
  if (query.data === undefined) return <LoadingSkeleton kind={skeleton} />
  return <>{children(query.data)}</>
}

export function LoadingSkeleton({ kind }: { kind: 'cards' | 'table' | 'form' }): React.JSX.Element {
  return (
    <div role="status" aria-label="Loading" className="space-y-4">
      {kind === 'cards' && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      )}
      {kind === 'table' && [0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-11 rounded-md" />)}
      {kind === 'form' && [0, 1, 2].map((i) => <Skeleton key={i} className="h-16 max-w-xl rounded-md" />)}
    </div>
  )
}

export function ErrorPanel({ message, onRetry }: { message: string; onRetry?: () => void }): React.JSX.Element {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-5">
      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden />
      <div className="flex-1">
        <p className="font-medium">We couldn’t load this page.</p>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RotateCw aria-hidden /> Try again
        </Button>
      )}
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className
}: {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
  className?: string
}): React.JSX.Element {
  return (
    <Empty className={cn('rounded-xl border border-dashed py-10', className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </Empty>
  )
}

/** The numbers behind a chart, for screen readers. The SVG chart itself is aria-hidden. */
export function ChartTable({ caption, unit, rows }: { caption: string; unit: string; rows: { label: string; value: number }[] }): React.JSX.Element {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label}>
            <th scope="row">{r.label}</th>
            <td>
              {r.value} {unit}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/** A titled white panel. Used for dashboard sections; never nested. */
export function Panel({
  title,
  description,
  action,
  children,
  className
}: {
  title?: string
  description?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
}): React.JSX.Element {
  return (
    <section className={cn('rounded-xl border bg-card p-5', className)}>
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-base font-semibold">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
