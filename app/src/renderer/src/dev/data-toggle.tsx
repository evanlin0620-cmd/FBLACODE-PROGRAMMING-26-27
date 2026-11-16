/**
 * The Demo data / Worst case / Empty switch for stress-testing screens. Plain chrome, not part of the design.
 * Hidden unless started with the flag, so it never shows in a demo: PowerShell `$env:VITE_STRESS_TEST='1'; npm run dev`.
 */
import { dataMode, type DataMode } from './worst-case'

const MODES: [DataMode, string][] = [
  ['demo', 'Demo data'],
  ['worst', 'Worst case'],
  ['empty', 'Empty']
]

export function DataToggle(): React.JSX.Element {
  const mode = dataMode()
  const pick = (m: DataMode): void => {
    const url = new URL(location.href)
    if (m === 'demo') url.searchParams.delete('data')
    else url.searchParams.set('data', m)
    location.assign(url) // reloads; the mode lives in the URL so a reload keeps it
  }
  return (
    <div role="group" aria-label="Test data" data-print-hide className="fixed bottom-3 left-1/2 z-[100] flex -translate-x-1/2 gap-0.5 rounded-full bg-zinc-200 p-0.5 font-[system-ui] text-xs text-zinc-700 shadow">
      {MODES.map(([m, label]) => (
        <button key={m} type="button" aria-pressed={mode === m} onClick={() => pick(m)} className={mode === m ? 'rounded-full bg-white px-3 py-1 text-zinc-950 shadow-sm' : 'rounded-full px-3 py-1'}>
          {label}
        </button>
      ))}
    </div>
  )
}
