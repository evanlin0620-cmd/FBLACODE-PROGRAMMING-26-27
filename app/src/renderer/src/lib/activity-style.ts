import { BookOpen, Dog, HandHeart, HeartPulse, Leaf, PartyPopper, PiggyBank, Utensils, type LucideIcon } from 'lucide-react'
import type { ActivityType } from '@shared/types'

/**
 * Each activity type has one colour and one mark, so a shift is recognisable from the corner of a card.
 * Every tint keeps white text at 4.5:1 or better; the bands look the same in light and dark.
 */
export const TYPE_STYLE: Record<ActivityType, { tint: string; Icon: LucideIcon }> = {
  'Food Bank': { tint: '#b4532a', Icon: Utensils },
  Tutoring: { tint: '#4a55b8', Icon: BookOpen },
  Environmental: { tint: '#2f7d4f', Icon: Leaf },
  'Animal Care': { tint: '#8a5a14', Icon: Dog },
  'Senior Care': { tint: '#8a4f9e', Icon: HandHeart },
  Fundraising: { tint: '#a8364f', Icon: PiggyBank },
  'Event Support': { tint: '#3d6680', Icon: PartyPopper },
  Health: { tint: '#12737c', Icon: HeartPulse }
}

/** The band's background: the tint, darkening toward the bottom corner. */
export const typeGradient = (type: ActivityType): string => {
  const { tint } = TYPE_STYLE[type]
  return `linear-gradient(160deg, ${tint}, color-mix(in srgb, ${tint} 65%, black))`
}
