import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Last element focused outside any dialog: the one to return to when a dialog closes.
// (Reading activeElement at open time fails: an autoFocus field inside the dialog wins the race,
// and Radix then skips its open-focus hook entirely.)
let lastFocusOutsideDialog: HTMLElement | null = null
document.addEventListener('focusin', (e) => {
  const el = e.target as HTMLElement
  if (!el.closest('[role="dialog"],[role="alertdialog"]')) lastFocusOutsideDialog = el
})

/**
 * Radix only restores focus to a <*Trigger>. Dialogs opened from React state have none,
 * so without this, closing one drops keyboard users on the page body.
 */
export function returnFocusOnClose(onCloseAutoFocus?: (e: Event) => void): (e: Event) => void {
  return (e) => {
    onCloseAutoFocus?.(e)
    const el = lastFocusOutsideDialog
    if (e.defaultPrevented || !el || el === document.body || !el.isConnected) return
    e.preventDefault()
    el.focus()
  }
}

/** Merges Tailwind class names, letting later classes override earlier ones. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
