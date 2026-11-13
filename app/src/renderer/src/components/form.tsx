/**
 * Form helpers. Each input has a visible label, its error is announced to screen
 * readers (aria-invalid + aria-describedby), and typing clears the error.
 */
import { useId, type ReactNode } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'

export interface FieldProps {
  label: string
  error?: string
  hint?: ReactNode
  children: (props: { id: string; 'aria-invalid': boolean; 'aria-describedby': string | undefined }) => ReactNode
  labelAction?: ReactNode
}

export function FormField({ label, error, hint, children, labelAction }: FieldProps): React.JSX.Element {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint && !error ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined
  return (
    <Field data-invalid={!!error || undefined}>
      <div className="flex items-baseline justify-between gap-2">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {labelAction}
      </div>
      {children({ id, 'aria-invalid': !!error, 'aria-describedby': describedBy })}
      {hint && !error && <FieldDescription id={hintId}>{hint}</FieldDescription>}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </Field>
  )
}

/** Reads a number input; empty becomes NaN so the backend's "enter a number" message shows. */
export const numberValue = (v: string): number => (v.trim() === '' ? Number.NaN : Number(v))
