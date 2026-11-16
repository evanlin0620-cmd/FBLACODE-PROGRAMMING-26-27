/**
 * Realistic content for the recommendation prototypes. Scores follow the real rubric in
 * src/main/services/recommendations.ts: skills 50 + availability 30 + interest 20.
 * Maria's assumed profile: skills Spanish translator and Event setup; interests Environmental
 * and Event Support; free Friday 8 AM-1 PM and Saturday 9 AM-2 PM.
 */
import { useState } from 'react'
import { toast } from 'sonner'

export interface Factor {
  label: 'Skills' | 'Availability' | 'Interest'
  points: number
  max: number
  note: string
}

export interface Rec {
  id: number
  title: string
  type: string
  day: string
  time: string
  place: string
  left: number
  capacity: number
  score: number
  factors: Factor[]
}

export const RECS: Rec[] = [
  {
    id: 15,
    title: 'Creek Cleanup',
    type: 'Environmental',
    day: 'Fri, Nov 27',
    time: '8:00 AM – 12:00 PM',
    place: 'Willow Creek Trailhead',
    left: 18,
    capacity: 20,
    score: 100,
    factors: [
      { label: 'Skills', points: 50, max: 50, note: 'No special skills needed' },
      { label: 'Availability', points: 30, max: 30, note: 'Fits your Friday mornings' },
      { label: 'Interest', points: 20, max: 20, note: 'You’re interested in Environmental' }
    ]
  },
  {
    id: 12,
    title: 'Homework Help Hour',
    type: 'Tutoring',
    day: 'Sat, Nov 21',
    time: '10:00 – 11:30 AM',
    place: 'Eastside Library, Room B',
    left: 6,
    capacity: 8,
    score: 80,
    factors: [
      { label: 'Skills', points: 50, max: 50, note: 'Uses your skill: Spanish translator' },
      { label: 'Availability', points: 30, max: 30, note: 'Fits your Saturday availability' },
      { label: 'Interest', points: 0, max: 20, note: 'Tutoring isn’t one of your interests' }
    ]
  },
  {
    id: 14,
    title: 'Winter Coat Drive',
    type: 'Event Support',
    day: 'Fri, Nov 20',
    time: '10:00 AM – 3:00 PM',
    place: 'Riverside Community Hall',
    left: 13,
    capacity: 15,
    score: 63,
    factors: [
      { label: 'Skills', points: 25, max: 50, note: 'Uses 1 of 2 skills: Event setup' },
      { label: 'Availability', points: 18, max: 30, note: '3 of its 5 hours fall in your Friday free time' },
      { label: 'Interest', points: 20, max: 20, note: 'You’re interested in Event Support' }
    ]
  }
]

export const spots = (left: number, capacity: number): string => `${left} of ${capacity} spots left`

/** Local sign-up state so every variant's button really works in the prototype. */
export function useSignup(rec: Rec): { joined: boolean; left: number; join: () => void } {
  const [joined, setJoined] = useState(false)
  return {
    joined,
    left: rec.left - (joined ? 1 : 0),
    join: () => {
      setJoined(true)
      toast.success(`You’re signed up for ${rec.title}.`, { description: 'A confirmation is in your notifications.' })
    }
  }
}
