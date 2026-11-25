// Turnout brand masters: four tally bars with the fifth stroke cut out as a 30° channel.
// Run `node build/brand/make.mjs` to regenerate the SVG masters; icons are rendered from them.
import { writeFileSync } from 'node:fs'
const f = (n) => +n.toFixed(2)
const t = Math.tan(Math.PI / 6)
function tally(xs, w, half) {
  const h = half / Math.cos(Math.PI / 6), yc = (x) => 132 - t * (x - 128) // a hair below centre, optically level
  return xs.map((x0) => {
    const x1 = x0 + w
    return `M${x0} 36H${x1}V${f(yc(x1) - h)}L${x0} ${f(yc(x0) - h)}ZM${x0} ${f(yc(x0) + h)}L${x1} ${f(yc(x1) + h)}V220H${x0}Z`
  }).join('')
}
export const MARK = tally([36, 88, 140, 192], 32, 12)
export const MARK_SMALL = tally([44, 108, 172], 40, 14) // three bars for 20 px and under
const svg = (d, fill, tile) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><title>Turnout</title>` +
  (tile ? `<rect width="256" height="256" rx="56" fill="${tile}"/><g transform="translate(128 128) scale(0.62) translate(-128 -128)">` : '') +
  `<path fill="${fill}" d="${d}"/>` + (tile ? '</g>' : '') + `</svg>\n`
const dir = new URL('.', import.meta.url)
writeFileSync(new URL('turnout-mark.svg', dir), svg(MARK, '#171717'))
writeFileSync(new URL('turnout-mark-small.svg', dir), svg(MARK_SMALL, '#171717'))
writeFileSync(new URL('turnout-icon.svg', dir), svg(MARK, '#3fbf74', '#111111'))
writeFileSync(new URL('turnout-icon-small.svg', dir), svg(MARK_SMALL, '#3fbf74', '#111111'))
console.log(JSON.stringify({ MARK, MARK_SMALL }))
