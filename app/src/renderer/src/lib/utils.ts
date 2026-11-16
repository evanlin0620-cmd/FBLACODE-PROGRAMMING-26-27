import type { CSSProperties } from 'react'
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

/**
 * Runs a list refresh inside a browser view transition: rows that leave fade out, the rest
 * slide into the gap, new rows drop in. Only elements given a `viewTransitionName` move;
 * everything else crossfades. Skipped entirely under reduced motion.
 */
export function withViewTransition(update: () => Promise<unknown>): void {
  if (!('startViewTransition' in document) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    void update()
    return
  }
  // The timeout stops a slow or abandoned refresh from freezing the screen on the old snapshot.
  document.startViewTransition(() => Promise.race([update(), new Promise((r) => setTimeout(r, 800))]))
}

/**
 * Props for one container in the once-per-login dashboard entrance. Delays shrink and rise
 * distances differ per container, so the group lands as one wave instead of a metronome.
 */
export function entrance(on: boolean, delay: number, rise: number): { className?: string; style?: CSSProperties } {
  if (!on) return {}
  return { className: 'animate-enter', style: { animationDelay: `${delay}ms`, '--rise': `${rise}px` } as CSSProperties }
}

/** Merges Tailwind class names, letting later classes override earlier ones. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
