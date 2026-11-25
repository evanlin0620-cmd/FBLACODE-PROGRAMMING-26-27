import { cn } from '@/lib/utils'

/** Paths from build/brand/make.mjs: four tally bars with the fifth stroke cut out (the spot a volunteer fills). */
const MARK =
  'M36 36H68V152.78L36 171.26ZM36 198.97L68 180.5V220H36ZM88 36H120V122.76L88 141.24ZM88 168.95L120 150.48V220H88ZM140 36H172V92.74L140 111.22ZM140 138.93L172 120.45V220H140ZM192 36H224V62.72L192 81.19ZM192 108.91L224 90.43V220H192Z'
const MARK_SMALL =
  'M44 36H84V141.24L44 164.33ZM44 196.66L84 173.57V220H44ZM108 36H148V104.29L108 127.38ZM108 159.71L148 136.62V220H108ZM172 36H212V67.34L172 90.43ZM172 122.76L212 99.67V220H172Z'

/** The Turnout mark in the current text colour. At 20 px and under it switches to the three-bar cut so the gaps stay open. */
export function BrandMark({
  size,
  className
}: {
  size: number
  className?: string
}): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 256 256"
      width={size}
      height={size}
      className={cn('shrink-0', className)}
      aria-hidden
    >
      <path fill="currentColor" d={size <= 20 ? MARK_SMALL : MARK} />
    </svg>
  )
}
