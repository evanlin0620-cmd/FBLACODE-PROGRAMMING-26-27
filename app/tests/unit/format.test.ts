import { describe, expect, it } from 'vitest'
import { cellCounts, fmtCount, spotsLabel } from '../../src/renderer/src/lib/format'

describe('spotsLabel', () => {
  it('counts open spots with separators', () => {
    expect(spotsLabel({ confirmed: 2, capacity: 1500, waitlisted: 0 })).toBe('1,498 of 1,500 spots left')
  })
  it('says "Last spot" when one is left', () => {
    expect(spotsLabel({ confirmed: 0, capacity: 1, waitlisted: 0 })).toBe('Last spot')
  })
  it('shows the waitlist once full', () => {
    expect(spotsLabel({ confirmed: 1, capacity: 1, waitlisted: 1284 })).toBe('Full · 1,284 on waitlist')
    expect(spotsLabel({ confirmed: 3, capacity: 3, waitlisted: 0 })).toBe('Full · waitlist open')
  })
  it('formats counts', () => expect(fmtCount(1284)).toBe('1,284'))
})

describe('cellCounts', () => {
  it('draws one cell per hour and never fills a cell early', () => {
    expect(cellCounts(10, 2.5, 40)).toEqual({ cells: 40, approved: 10, pending: 2 })
    expect(cellCounts(9.5, 0, 40)).toEqual({ cells: 40, approved: 9, pending: 0 })
  })
  it('scales big goals and caps at the goal', () => {
    expect(cellCounts(100, 0, 200)).toEqual({ cells: 60, approved: 30, pending: 0 })
    expect(cellCounts(50, 5, 40)).toEqual({ cells: 40, approved: 40, pending: 0 })
  })
})
