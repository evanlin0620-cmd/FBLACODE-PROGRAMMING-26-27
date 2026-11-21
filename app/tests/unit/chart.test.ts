import { describe, expect, it } from 'vitest'
import { smoothPath } from '../../src/renderer/src/lib/chart'

const numbers = (d: string): number[] => (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number)

describe('smoothPath', () => {
  it('starts at the first point and ends at the last', () => {
    const d = smoothPath([[0, 100], [50, 20], [100, 60]], 100)
    expect(d.startsWith('M0,100')).toBe(true)
    expect(d.endsWith('100,60')).toBe(true)
  })
  it('never bends below the baseline after a drop to zero', () => {
    // A spike then zeros: unclamped control points would dip under y = 100 (below zero hours).
    const d = smoothPath([[0, 100], [50, 0], [100, 100], [150, 100]], 100)
    const ys = numbers(d).filter((_, i) => i % 2 === 1)
    expect(Math.max(...ys)).toBeLessThanOrEqual(100)
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(0)
  })
  it('handles one point and none', () => {
    expect(smoothPath([[5, 5]], 10)).toBe('M5,5')
    expect(smoothPath([], 10)).toBe('')
  })
})
