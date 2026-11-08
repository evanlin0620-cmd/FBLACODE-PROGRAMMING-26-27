/**
 * Demo data for one made-up nonprofit, so the app looks real the moment it opens.
 * Dates are placed relative to "now", so there are always past shifts (with hours)
 * and upcoming shifts (to sign up for), whatever day you run it.
 *
 * Demo accounts (test values only, also listed in README.md):
 *   admin@servehub.test     / ServeHub2026
 *   maria@servehub.test     / Volunteer2026   (and the other volunteers below, same password)
 */
import { run, tx, type Db } from './index'
import { hashPassword } from '../services/auth'
import { prettyStamp, toStamp } from '@shared/time'

export const DEMO_ADMIN = { email: 'admin@servehub.test', password: 'ServeHub2026' }
export const DEMO_VOLUNTEER = { email: 'maria@servehub.test', password: 'Volunteer2026' }

const SKILLS = [
  'Spanish translator',
  'Web designer',
  'First aid / CPR',
  'Tutoring math',
  'Tutoring reading',
  'Cooking',
  'Heavy lifting',
  'Photography',
  'Driving (licensed)',
  'Event setup',
  'Animal handling',
  'Social media'
]

const VOLUNTEERS: { name: string; email: string; skills: string[]; interests: string[]; availability: [number, string, string][]; goal: number }[] = [
  { name: 'Maria Lopez', email: 'maria@servehub.test', skills: ['Spanish translator', 'Cooking', 'First aid / CPR'], interests: ['Food Bank', 'Health', 'Senior Care'], availability: [[6, '08:00', '14:00'], [3, '16:00', '20:00']], goal: 40 },
  { name: 'Jordan Kim', email: 'jordan@servehub.test', skills: ['Web designer', 'Photography', 'Social media'], interests: ['Fundraising', 'Event Support'], availability: [[6, '10:00', '18:00'], [0, '12:00', '17:00']], goal: 25 },
  { name: 'Aisha Patel', email: 'aisha@servehub.test', skills: ['Tutoring math', 'Tutoring reading'], interests: ['Tutoring'], availability: [[1, '15:00', '18:00'], [3, '15:00', '18:00']], goal: 30 },
  { name: 'Ethan Brooks', email: 'ethan@servehub.test', skills: ['Heavy lifting', 'Driving (licensed)', 'Event setup'], interests: ['Food Bank', 'Environmental'], availability: [[6, '07:00', '15:00'], [5, '17:00', '21:00']], goal: 50 },
  { name: 'Sofia Nguyen', email: 'sofia@servehub.test', skills: ['Animal handling', 'Photography'], interests: ['Animal Care', 'Environmental'], availability: [[0, '09:00', '15:00']], goal: 20 },
  { name: 'Liam Carter', email: 'liam@servehub.test', skills: ['First aid / CPR', 'Driving (licensed)'], interests: ['Senior Care', 'Health'], availability: [[2, '09:00', '13:00'], [4, '09:00', '13:00']], goal: 20 },
  { name: 'Grace Okafor', email: 'grace@servehub.test', skills: ['Spanish translator', 'Tutoring reading', 'Social media'], interests: ['Tutoring', 'Fundraising'], availability: [[1, '16:00', '19:00'], [6, '09:00', '12:00']], goal: 30 },
  { name: 'Noah Rivera', email: 'noah@servehub.test', skills: ['Cooking', 'Event setup'], interests: ['Food Bank', 'Event Support'], availability: [[5, '16:00', '21:00'], [6, '09:00', '17:00']], goal: 15 }
]

/** day offset from today, start hour, length in hours */
const ACTIVITIES: { title: string; type: string; description: string; location: string; day: number; hour: number; length: number; capacity: number; skills: string[] }[] = [
  { title: 'Saturday Food Pantry Sort', type: 'Food Bank', description: 'Sort donated food, check dates, and pack family boxes for the week.', location: 'Riverside Food Pantry, 220 Mill St', day: -150, hour: 9, length: 3, capacity: 12, skills: ['Heavy lifting'] },
  { title: 'Homework Help Hour', type: 'Tutoring', description: 'Help elementary students with math and reading homework after school.', location: 'Eastside Library, Room B', day: -122, hour: 15, length: 2, capacity: 6, skills: ['Tutoring math', 'Tutoring reading'] },
  { title: 'Creek Cleanup', type: 'Environmental', description: 'Pick up litter along Willow Creek trail. Gloves and bags provided.', location: 'Willow Creek Trailhead', day: -96, hour: 8, length: 4, capacity: 20, skills: [] },
  { title: 'Senior Center Lunch Service', type: 'Senior Care', description: 'Serve lunch and chat with residents. Spanish speakers especially welcome.', location: 'Oak Grove Senior Center', day: -68, hour: 11, length: 2, capacity: 8, skills: ['Spanish translator'] },
  { title: 'Shelter Dog Walking', type: 'Animal Care', description: 'Walk and socialize dogs waiting for adoption.', location: 'Paws & Hope Shelter', day: -44, hour: 10, length: 3, capacity: 6, skills: ['Animal handling'] },
  { title: 'Fall Fundraiser Gala Setup', type: 'Event Support', description: 'Set up tables, decorations, and the check-in desk for the gala.', location: 'Riverside Community Hall', day: -24, hour: 14, length: 4, capacity: 10, skills: ['Event setup', 'Heavy lifting'] },
  { title: 'Free Health Screening Day', type: 'Health', description: 'Help with check-in and translation at a free blood pressure screening.', location: 'Riverside Clinic Parking Lot', day: -12, hour: 9, length: 5, capacity: 8, skills: ['Spanish translator', 'First aid / CPR'] },
  { title: 'Saturday Food Pantry Sort', type: 'Food Bank', description: 'Sort donated food, check dates, and pack family boxes for the week.', location: 'Riverside Food Pantry, 220 Mill St', day: -5, hour: 9, length: 3, capacity: 12, skills: ['Heavy lifting'] },
  { title: 'Homework Help Hour', type: 'Tutoring', description: 'Help elementary students with math and reading homework after school.', location: 'Eastside Library, Room B', day: 3, hour: 15, length: 2, capacity: 6, skills: ['Tutoring math', 'Tutoring reading'] },
  { title: 'Thanksgiving Meal Prep', type: 'Food Bank', description: 'Cook and pack holiday meals for 200 local families.', location: 'St. Mark’s Kitchen, 18 Elm Ave', day: 6, hour: 9, length: 4, capacity: 3, skills: ['Cooking'] },
  { title: 'Website Refresh Sprint', type: 'Fundraising', description: 'Update our donation page and photo gallery so more people give online.', location: 'Remote / Riverside Office', day: 8, hour: 13, length: 3, capacity: 2, skills: ['Web designer', 'Photography'] },
  { title: 'Shelter Dog Walking', type: 'Animal Care', description: 'Walk and socialize dogs waiting for adoption.', location: 'Paws & Hope Shelter', day: 9, hour: 10, length: 3, capacity: 6, skills: ['Animal handling'] },
  { title: 'Senior Center Lunch Service', type: 'Senior Care', description: 'Serve lunch and chat with residents. Spanish speakers especially welcome.', location: 'Oak Grove Senior Center', day: 12, hour: 11, length: 2, capacity: 8, skills: ['Spanish translator'] },
  { title: 'Winter Coat Drive', type: 'Event Support', description: 'Collect, sort, and hand out donated winter coats.', location: 'Riverside Community Hall', day: 13, hour: 10, length: 5, capacity: 15, skills: ['Event setup', 'Driving (licensed)'] },
  { title: 'Creek Cleanup', type: 'Environmental', description: 'Pick up litter along Willow Creek trail. Gloves and bags provided.', location: 'Willow Creek Trailhead', day: 20, hour: 8, length: 4, capacity: 20, skills: [] },
  { title: 'Free Health Screening Day', type: 'Health', description: 'Help with check-in and translation at a free blood pressure screening.', location: 'Riverside Clinic Parking Lot', day: 27, hour: 9, length: 5, capacity: 8, skills: ['Spanish translator', 'First aid / CPR'] }
]

/** Empties every table, then fills them with the demo nonprofit. */
export function seedDemo(db: Db, now: Date = new Date()): void {
  const stamp = (day: number, hour: number): string => {
    const d = new Date(now)
    d.setDate(d.getDate() + day)
    d.setHours(hour, 0, 0, 0)
    return toStamp(d)
  }
  const nowStamp = toStamp(now)

  tx(db, () => {
    for (const t of ['audit_log', 'certificates', 'notifications', 'hour_logs', 'signups', 'activity_skills', 'activities', 'availability', 'volunteer_skills', 'volunteer_profiles', 'skills', 'users']) {
      db.exec(`DELETE FROM ${t}`)
    }

    const skillId = new Map<string, number>()
    for (const s of SKILLS) skillId.set(s, run(db, 'INSERT INTO skills (name) VALUES (?)', s))

    // Hashing is slow on purpose, so hash the shared demo password once.
    const volunteerHash = hashPassword(DEMO_VOLUNTEER.password)
    const adminId = run(
      db,
      "INSERT INTO users (email, password_hash, role, full_name, created_at) VALUES (?, ?, 'admin', 'Dana Whitfield', ?)",
      DEMO_ADMIN.email,
      hashPassword(DEMO_ADMIN.password),
      stamp(-210, 9)
    )

    const volunteerIds: number[] = []
    for (const v of VOLUNTEERS) {
      const id = run(db, "INSERT INTO users (email, password_hash, role, full_name, created_at) VALUES (?, ?, 'volunteer', ?, ?)", v.email, volunteerHash, v.name, stamp(-200, 9))
      run(db, 'INSERT INTO volunteer_profiles (user_id, interests, hour_goal) VALUES (?, ?, ?)', id, JSON.stringify(v.interests), v.goal)
      for (const s of v.skills) run(db, 'INSERT INTO volunteer_skills (user_id, skill_id) VALUES (?, ?)', id, skillId.get(s)!)
      for (const [weekday, start, end] of v.availability) {
        run(db, 'INSERT INTO availability (user_id, weekday, start_time, end_time) VALUES (?, ?, ?, ?)', id, weekday, start, end)
      }
      volunteerIds.push(id)
    }

    ACTIVITIES.forEach((a, index) => {
      const start = stamp(a.day, a.hour)
      const end = stamp(a.day, a.hour + a.length)
      const id = run(
        db,
        'INSERT INTO activities (title, type, description, location, start_at, end_at, capacity, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        a.title,
        a.type,
        a.description,
        a.location,
        start,
        end,
        a.capacity,
        adminId,
        stamp(Math.min(a.day, 0) - 14, 9)
      )
      for (const s of a.skills) run(db, 'INSERT INTO activity_skills (activity_id, skill_id) VALUES (?, ?)', id, skillId.get(s)!)

      // Volunteers whose interests match sign up. Past shifts get hours with a mix of statuses.
      const people = VOLUNTEERS.map((v, i) => ({ v, id: volunteerIds[i] })).filter(({ v }) => v.interests.includes(a.type))
      people.forEach(({ v, id: userId }, i) => {
        const status = i < a.capacity ? 'confirmed' : 'waitlisted'
        run(db, 'INSERT INTO signups (activity_id, user_id, status, queued_at) VALUES (?, ?, ?, ?)', id, userId, status, stamp(Math.min(a.day, 0) - 7, 10 + i))
        if (a.day < 0 && status === 'confirmed') {
          // Maria hasn't logged her most recent shift yet, so the Log Hours form has something to show.
          if (a.day === -5 && i === 0) return
          // The most recent past shift stays pending, so the approvals queue isn't empty.
          const reviewed = a.day < -7
          const rejected = reviewed && (index + i) % 9 === 4
          const hours = a.length - (i % 2) * 0.5
          run(
            db,
            `INSERT INTO hour_logs (user_id, activity_id, hours, note, status, review_note, reviewed_by, reviewed_at, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            userId,
            id,
            hours,
            i === 0 ? 'Great team today!' : '',
            reviewed ? (rejected ? 'rejected' : 'approved') : 'pending',
            rejected ? 'The sign-in sheet shows you left an hour early. Please log the hours you stayed.' : '',
            reviewed ? adminId : null,
            reviewed ? stamp(a.day + 2, 10) : null,
            stamp(a.day, a.hour + a.length + 1)
          )
          if (reviewed) {
            run(
              db,
              'INSERT INTO notifications (user_id, type, subject, body, created_at, read_at) VALUES (?, ?, ?, ?, ?, ?)',
              userId,
              rejected ? 'hours_rejected' : 'hours_approved',
              rejected ? `Hours need changes: ${a.title}` : `Hours approved: ${a.title}`,
              rejected
                ? `Hi ${v.name},\n\nYour hours for "${a.title}" weren’t approved.\nReason: The sign-in sheet shows you left an hour early.`
                : `Hi ${v.name},\n\nYour ${hours} hours for "${a.title}" were approved. Thank you!`,
              stamp(a.day + 2, 10),
              stamp(a.day + 3, 8)
            )
          }
        } else if (a.day > 0) {
          run(
            db,
            'INSERT INTO notifications (user_id, type, subject, body, created_at) VALUES (?, ?, ?, ?, ?)',
            userId,
            status === 'confirmed' ? 'signup_confirmed' : 'signup_waitlisted',
            status === 'confirmed' ? `You’re signed up: ${a.title}` : `You’re on the waitlist: ${a.title}`,
            `Hi ${v.name},\n\n${status === 'confirmed' ? 'You’re confirmed' : 'You’re on the waitlist'} for "${a.title}" on ${prettyStamp(start)}.`,
            stamp(-7, 10 + i)
          )
        }
      })
    })

    run(db, 'INSERT INTO audit_log (actor_id, action, entity, entity_id, detail, at) VALUES (?, ?, ?, ?, ?, ?)', adminId, 'seed', 'system', null, 'Loaded demo data', nowStamp)
  })
}
