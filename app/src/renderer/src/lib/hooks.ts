/**
 * Small React hooks for loading data and submitting forms through the API.
 * They keep loading, error, and field-error state in one place so every
 * screen handles them the same way.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useLocation } from 'react-router'
import { toast } from 'sonner'
import type { ApiMap, ApiName } from '@shared/api'
import { api, ApiError } from './api'

type Args<K extends ApiName> = ApiMap[K]['in'] extends void ? [] : [ApiMap[K]['in']]

export interface Query<T> {
  data: T | undefined
  error: ApiError | null
  loading: boolean
  /** Loads again. Resolves once the new data is on screen, so a view transition can wrap it. */
  reload: () => Promise<void>
}

/** Loads data when the screen opens, and again whenever `input` changes. */
export function useQuery<K extends ApiName>(name: K, ...args: Args<K>): Query<ApiMap[K]['out']> {
  const [data, setData] = useState<ApiMap[K]['out']>()
  const [error, setError] = useState<ApiError | null>(null)
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)
  const waiting = useRef<(() => void)[]>([])
  const key = JSON.stringify(args[0] ?? null)

  useEffect(() => {
    let alive = true // ignore answers that arrive after the input changed
    setLoading(true)
    api(name, ...(JSON.parse(key) === null ? [] : [JSON.parse(key)]) as Args<K>)
      // flushSync commits to the DOM right away, so the reload promise below resolves after the screen updated.
      .then(
        (d) => {
          if (!alive) return
          flushSync(() => {
            setData(d)
            setError(null)
            setLoading(false)
          })
        },
        (e: ApiError) => {
          if (alive) flushSync(() => {
            setError(e)
            setLoading(false)
          })
        }
      )
      .finally(() => alive && waiting.current.splice(0).forEach((done) => done()))
    return () => {
      alive = false
    }
  }, [name, key, tick])

  const reload = useCallback(
    () =>
      new Promise<void>((done) => {
        waiting.current.push(done)
        setTick((t) => t + 1)
      }),
    []
  )
  return { data, error, loading, reload }
}

/** True when this page was opened straight from signing in (the login screen sets it). */
export function useWelcome(): boolean {
  const welcome = (useLocation().state as { welcome?: boolean } | null)?.welcome === true
  useEffect(() => {
    // Wipe the flag from this history entry so pressing Back later doesn't replay the entrance.
    // shortcut: writes React Router's internal `usr` slot directly; switch to navigate(replace) if the router changes it.
    if (welcome) window.history.replaceState({ ...window.history.state, usr: null }, '')
  }, [welcome])
  return welcome
}

export interface Mutation<I, O> {
  run: (input: I) => Promise<O | undefined>
  pending: boolean
  fieldErrors: Record<string, string>
  clearField: (name: string) => void
}

/**
 * Sends a change to the backend. Field errors come back for the form to show
 * under each input; other errors show as a toast. Returns undefined on failure.
 */
export function useMutation<K extends ApiName>(name: K, opts: { success?: string } = {}): Mutation<ApiMap[K]['in'], ApiMap[K]['out']> {
  const [pending, setPending] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const busy = useRef(false)

  const run = useCallback(
    async (input: ApiMap[K]['in']) => {
      if (busy.current) return undefined // ignore double clicks
      busy.current = true
      setPending(true)
      try {
        const out = await api(name, ...([input] as unknown as Args<K>))
        setFieldErrors({})
        if (opts.success) toast.success(opts.success)
        return out
      } catch (e) {
        const err = e as ApiError
        const fields = err.fields ?? {}
        setFieldErrors(fields)
        // Field errors already show under each input, so only other problems get a toast.
        if (Object.keys(fields).length === 0) toast.error(err.message)
        return undefined
      } finally {
        busy.current = false
        setPending(false)
      }
    },
    [name, opts.success]
  )

  const clearField = useCallback((field: string) => {
    setFieldErrors((f) => {
      if (!(field in f)) return f
      const next = { ...f }
      delete next[field]
      return next
    })
  }, [])

  return { run, pending, fieldErrors, clearField }
}
