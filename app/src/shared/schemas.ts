/**
 * Input rules for every form, written once with zod.
 * The UI runs them for instant feedback, and the backend runs them again
 * because the UI can't be trusted to enforce rules on its own.
 *
 * "Format" checks (is this an email? a number?) live here.
 * "Meaning" checks that need the database (is the shift full? has it ended?)
 * live in the services.
 */
import { z } from 'zod'
import { ACTIVITY_TYPES } from './types'

const STAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/
const DATE = /^\d{4}-\d{2}-\d{2}$/
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/

const name = z.string().trim().min(2, 'Enter at least 2 characters').max(80, 'Keep it under 80 characters')
const email = z.string().trim().toLowerCase().pipe(z.email('Enter a valid email, like name@example.com'))
const password = z
  .string()
  .min(8, 'Use at least 8 characters')
  .max(100, 'Keep it under 100 characters')
  .regex(/[A-Za-z]/, 'Include at least one letter')
  .regex(/\d/, 'Include at least one number')

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password')
})

export const signupSchema = z
  .object({ fullName: name, email, password, confirmPassword: z.string() })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

export const createAdminSchema = z.object({ fullName: name, email, password })

export const availabilitySchema = z
  .object({
    weekday: z.number().int().min(0).max(6),
    start: z.string().regex(TIME, 'Use a time like 09:00'),
    end: z.string().regex(TIME, 'Use a time like 17:00')
  })
  .refine((b) => b.end > b.start, { message: 'End time must be after start time', path: ['end'] })

export const profileSchema = z
  .object({
    fullName: name,
    phone: z
      .string()
      .trim()
      .refine((p) => p === '' || /^\+?[\d\s().-]{7,20}$/.test(p), 'Enter a phone number like (555) 123-4567'),
    bio: z.string().trim().max(500, 'Keep your bio under 500 characters'),
    interests: z.array(z.enum(ACTIVITY_TYPES)).max(ACTIVITY_TYPES.length),
    skillIds: z.array(z.number().int().positive()).max(30, 'Pick up to 30 skills'),
    availability: z.array(availabilitySchema).max(21, 'Add up to 21 time blocks'),
    hourGoal: z.number().int('Use a whole number').min(1, 'Set a goal of at least 1 hour').max(1000, 'Set a goal of 1000 hours or less')
  })
  .superRefine((p, ctx) => {
    // Two blocks on the same day must not overlap, e.g. Sat 9-12 and Sat 11-14.
    p.availability.forEach((a, i) => {
      p.availability.forEach((b, j) => {
        if (j > i && a.weekday === b.weekday && a.start < b.end && b.start < a.end) {
          ctx.addIssue({ code: 'custom', message: 'Two time blocks on the same day overlap', path: ['availability'] })
        }
      })
    })
  })

export const activitySchema = z
  .object({
    title: z.string().trim().min(3, 'Enter at least 3 characters').max(100, 'Keep it under 100 characters'),
    type: z.enum(ACTIVITY_TYPES, 'Pick an activity type'),
    description: z.string().trim().min(10, 'Describe the activity in at least 10 characters').max(2000),
    location: z.string().trim().min(3, 'Enter a location').max(200),
    startAt: z.string().regex(STAMP, 'Pick a start date and time'),
    endAt: z.string().regex(STAMP, 'Pick an end date and time'),
    capacity: z.number().int('Use a whole number').min(1, 'Allow at least 1 volunteer').max(500, 'Allow 500 volunteers or fewer'),
    skillIds: z.array(z.number().int().positive()).max(10, 'Pick up to 10 skills')
  })
  .refine((a) => a.endAt > a.startAt, { message: 'End time must be after the start time', path: ['endAt'] })
  .refine((a) => a.startAt.slice(0, 10) === a.endAt.slice(0, 10), {
    message: 'A shift must start and end on the same day',
    path: ['endAt']
  })

export const activityFilterSchema = z.object({
  q: z.string().trim().max(100).optional(),
  from: z.string().regex(DATE).optional(),
  to: z.string().regex(DATE).optional(),
  type: z.enum(ACTIVITY_TYPES).optional(),
  skillId: z.number().int().positive().optional(),
  includePast: z.boolean().optional()
})

export const logHoursSchema = z.object({
  activityId: z.number().int().positive('Pick the activity you worked'),
  hours: z
    .number('Enter the number of hours')
    .positive('Hours must be more than 0')
    .max(24, 'You cannot log more than 24 hours for one shift')
    .refine((h) => Number.isInteger(h * 4), 'Use quarter hours, like 1.25 or 2.5'),
  note: z.string().trim().max(500, 'Keep the note under 500 characters')
})

export const reviewHoursSchema = z
  .object({
    ids: z.array(z.number().int().positive()).min(1, 'Select at least one entry'),
    decision: z.enum(['approved', 'rejected']),
    note: z.string().trim().max(500)
  })
  .refine((r) => r.decision === 'approved' || r.note.length >= 5, {
    message: 'Give a short reason (5+ characters) so the volunteer knows what to fix',
    path: ['note']
  })

export const volunteerSearchSchema = z.object({
  q: z.string().trim().max(100).optional(),
  skillId: z.number().int().positive().optional()
})

export const reportFilterSchema = z
  .object({
    from: z.string().regex(DATE, 'Pick a start date').optional(),
    to: z.string().regex(DATE, 'Pick an end date').optional(),
    type: z.enum(ACTIVITY_TYPES).optional(),
    volunteerId: z.number().int().positive().optional()
  })
  .refine((f) => !f.from || !f.to || f.from <= f.to, { message: 'The start date must be before the end date', path: ['to'] })

export const idSchema = z.number().int().positive()
export const idsSchema = z.array(z.number().int().positive())
export const certificateCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/, 'Codes look like ABCD-1234')

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type CreateAdminInput = z.infer<typeof createAdminSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type ActivityInput = z.infer<typeof activitySchema>
export type ActivityFilter = z.infer<typeof activityFilterSchema>
export type LogHoursInput = z.infer<typeof logHoursSchema>
export type ReviewHoursInput = z.infer<typeof reviewHoursSchema>
export type VolunteerSearch = z.infer<typeof volunteerSearchSchema>

/** Turns zod issues into { field: message } for showing under form inputs. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_'
    if (!out[key]) out[key] = issue.message
  }
  return out
}
