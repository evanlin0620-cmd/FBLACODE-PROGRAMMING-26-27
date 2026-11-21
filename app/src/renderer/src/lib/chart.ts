/** Geometry for the hand-drawn SVG charts. */

/** A smooth path through the points (Catmull-Rom as cubic Béziers), kept inside the plot so it never dips below zero. */
export function smoothPath(pts: [number, number][], height: number): string {
  if (pts.length === 0) return ''
  const clamp = (y: number): number => Math.min(height, Math.max(0, y))
  let d = `M${pts[0]![0]},${pts[0]![1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]!
    const p1 = pts[i]!
    const p2 = pts[i + 1]!
    const p3 = pts[i + 2] ?? p2
    const c1: [number, number] = [p1[0] + (p2[0] - p0[0]) / 6, clamp(p1[1] + (p2[1] - p0[1]) / 6)]
    const c2: [number, number] = [p2[0] - (p3[0] - p1[0]) / 6, clamp(p2[1] - (p3[1] - p1[1]) / 6)]
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`
  }
  return d
}
