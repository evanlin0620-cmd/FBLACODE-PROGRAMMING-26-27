/**
 * AppError is the one error type the backend throws on purpose.
 * The IPC layer turns it into a friendly { ok: false, error } result,
 * so the UI can show the message instead of crashing.
 */
export type ErrorCode = 'VALIDATION' | 'NOT_FOUND' | 'FORBIDDEN' | 'UNAUTHORIZED' | 'CONFLICT'

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    /** Per-field messages, keyed by form field name, for showing under inputs. */
    public readonly fields?: Record<string, string>
  ) {
    super(message)
    this.name = 'AppError'
  }
}
