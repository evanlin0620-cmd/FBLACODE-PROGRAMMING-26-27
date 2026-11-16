/** The demo seed as it appears in the Current screenshots, so both sides of the comparison show the same facts. */
import { createContext, useContext } from 'react'
import type { Factor } from '@shared/types'

/**
 * ServeHub serves any nonprofit; the org name is the one per-install value on these screens.
 * Riverside is the demo seed; the others are made-up examples to show the layout holds.
 */
export const ORGS = ['Riverside Community Partners', 'Hope Street Food Bank', 'Northside Animal Rescue & Adoption Center'] as const
export const OrgContext = createContext<string>(ORGS[0])
export const useOrg = (): string => useContext(OrgContext)

export const VOLUNTEER = {
  name: 'Maria Lopez',
  email: 'maria@servehub.test',
  approved: 10,
  goal: 40,
  upcoming: [
    { month: 'Nov', day: 21, title: 'Thanksgiving Meal Prep', when: 'Sat 9:00 AM – 1:00 PM', place: 'St. Mark’s Kitchen, 18 Elm Ave' },
    { month: 'Nov', day: 27, title: 'Senior Center Lunch Service', when: 'Fri 11:00 AM – 1:00 PM', place: 'Oak Grove Senior Center' },
    { month: 'Dec', day: 12, title: 'Free Health Screening Day', when: 'Sat 9:00 AM – 2:00 PM', place: 'Riverside Clinic Parking Lot' }
  ]
}

/** Past shifts Maria can still log hours for; `length` is the cap the app enforces. */
export const LOGGABLE = [
  { title: 'Fall Fundraiser Gala Setup', when: 'Sat, Nov 8', length: 4 },
  { title: 'Saturday Food Pantry Sort', when: 'Sat, Nov 1', length: 3 }
]

export interface Rec {
  title: string
  type: string
  when: string
  place: string
  score: number
  confirmed: number
  capacity: number
  factors: Factor[]
}

export const FEATURED: Rec = {
  title: 'Creek Cleanup',
  type: 'Environmental',
  when: 'Sat, Dec 5 · 8:00 AM – 12:00 PM',
  place: 'Willow Creek Trailhead',
  score: 80,
  confirmed: 2,
  capacity: 20,
  factors: [
    { label: 'Skills', points: 50, max: 50, note: 'No special skills needed' },
    { label: 'Availability', points: 30, max: 30, note: 'Fits your Saturday availability' },
    { label: 'Interest', points: 0, max: 20, note: 'Environmental isn’t one of your interests' }
  ]
}

export const RUNNER_UP: Rec = {
  title: 'Winter Coat Drive',
  type: 'Event Support',
  when: 'Sat, Nov 28 · 10:00 AM – 3:00 PM',
  place: 'Riverside Community Hall',
  score: 24,
  confirmed: 2,
  capacity: 15,
  factors: [
    { label: 'Skills', points: 0, max: 50, note: 'Needs skills you haven’t listed' },
    { label: 'Availability', points: 24, max: 30, note: 'Partly fits your Saturday availability' },
    { label: 'Interest', points: 0, max: 20, note: 'Event Support isn’t one of your interests' }
  ]
}

export const IMPACT = {
  approvedHours: 38.5,
  volunteers: 8,
  upcoming: 8,
  toApprove: 2,
  months: [
    { label: 'Jun', hours: 8.5 },
    { label: 'Jul', hours: 3.5 },
    { label: 'Aug', hours: 7.5 },
    { label: 'Sep', hours: 2 },
    { label: 'Oct', hours: 7.5 },
    { label: 'Nov', hours: 9.5 }
  ],
  top: [
    { title: 'Free Health Screening Day', hours: 9.5 },
    { title: 'Saturday Food Pantry Sort', hours: 8.5 },
    { title: 'Creek Cleanup', hours: 7.5 },
    { title: 'Fall Fundraiser Gala Setup', hours: 7.5 },
    { title: 'Homework Help Hour', hours: 3.5 }
  ],
  gaps: [{ title: 'Winter Coat Drive', day: 'Sat, Nov 28', needs: 'a licensed driver' }],
  waiting: [
    { id: 1, name: 'Maria Lopez', title: 'Fall Fundraiser Gala Setup', day: 'Sat, Nov 8', hours: 4, note: 'Stayed to stack chairs after' },
    { id: 2, name: 'James Carter', title: 'Saturday Food Pantry Sort', day: 'Sat, Nov 1', hours: 2.5, note: '' }
  ],
  short: [
    { title: 'Winter Coat Drive', day: 'Sat, Nov 28', confirmed: 2, capacity: 15 },
    { title: 'Creek Cleanup', day: 'Sat, Dec 5', confirmed: 2, capacity: 20 },
    { title: 'Senior Center Lunch Service', day: 'Fri, Nov 27', confirmed: 4, capacity: 6 }
  ]
}
