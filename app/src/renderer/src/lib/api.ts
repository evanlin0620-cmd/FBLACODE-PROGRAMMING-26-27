/**
 * The UI's way to talk to the backend. Every call is typed by the shared
 * ApiMap, so a typo in a name or a wrong input shape is a compile error.
 */
import type { ApiMap, ApiName } from '@shared/api'
import type { Result } from '@shared/types'
import { applyDataMode } from '@/dev/worst-case'

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly fields: Record<string, string> = {}
  ) {
    super(message)
  }
}

/** Calls the backend. Resolves with the data, or throws ApiError with a friendly message. */
export async function api<K extends ApiName>(
  name: K,
  ...input: ApiMap[K]['in'] extends void ? [] : [ApiMap[K]['in']]
): Promise<ApiMap[K]['out']> {
  let result: Result<ApiMap[K]['out']>
  // The bridge only exists inside the Electron window, not at localhost:5173 in a browser.
  if (!window.api) throw new ApiError('INTERNAL', 'ServeHub runs in its own desktop window. Close this browser tab and use the window that npm run dev opened.')
  try {
    result = (await window.api.call(name, input[0])) as Result<ApiMap[K]['out']>
  } catch {
    throw new ApiError('INTERNAL', 'The app couldn’t reach its database. Try closing and reopening ServeHub.')
  }
  if (!result.ok) throw new ApiError(result.error.code, result.error.message, result.error.fields)
  // Opt-in stress test (VITE_STRESS_TEST=1, then ?data=worst or ?data=empty); without the flag this branch is dropped from the build.
  if (import.meta.env.VITE_STRESS_TEST === '1') return applyDataMode(name, result.data)
  return result.data
}
