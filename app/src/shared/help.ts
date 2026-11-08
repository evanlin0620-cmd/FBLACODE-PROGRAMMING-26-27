/**
 * The Help assistant: answers typed questions from an offline list of FAQs.
 *
 * How it matches: the question is split into words, common filler words are
 * dropped, and each word is mapped to a base form with a small synonym list
 * ("signup", "register", "join" all count as "signup"). Each FAQ gets points for
 * every word it shares with the question, with extra points for matches in its
 * keyword list. The best-scoring answers come back first. No internet needed.
 */
import type { Role } from './types'

export interface Faq {
  id: string
  question: string
  answer: string
  keywords: string[]
  roles: Role[]
  /** Page the answer talks about, so the UI can offer a "Go there" button. */
  link?: string
}

export const FAQS: Faq[] = [
  {
    id: 'signup-shift',
    question: 'How do I sign up for a shift?',
    answer: 'Open Find activities, pick an activity, and click Sign up. If it’s full, you can join the waitlist instead.',
    keywords: ['signup', 'shift', 'activity', 'event', 'browse'],
    roles: ['volunteer'],
    link: '/activities'
  },
  {
    id: 'waitlist',
    question: 'How does the waitlist work?',
    answer:
      'When a shift is full you can join its waitlist. If someone cancels, the first person in line is moved in automatically and gets a notification. Your place in line shows on the activity.',
    keywords: ['waitlist', 'full', 'line', 'spot', 'position'],
    roles: ['volunteer', 'admin']
  },
  {
    id: 'cancel-shift',
    question: 'How do I cancel a shift?',
    answer: 'Open the activity from My shifts or Find activities and click Cancel sign-up. You can cancel any time before the shift starts.',
    keywords: ['cancel', 'drop', 'remove', 'leave', 'shift'],
    roles: ['volunteer'],
    link: '/dashboard'
  },
  {
    id: 'log-hours',
    question: 'How do I log my volunteer hours?',
    answer:
      'Go to Log Hours after your shift ends, pick the shift, and enter how many hours you worked (in quarter hours, like 2.5). An admin reviews them before they count.',
    keywords: ['log', 'hours', 'record', 'track', 'time'],
    roles: ['volunteer'],
    link: '/hours'
  },
  {
    id: 'hours-pending',
    question: 'Why don’t my hours show up in my total?',
    answer:
      'Only approved hours count. New entries say Pending until an admin reviews them. If an entry was rejected, the reason is shown on My Hours and you can log it again.',
    keywords: ['hours', 'total', 'pending', 'missing', 'approved', 'rejected', 'count'],
    roles: ['volunteer'],
    link: '/hours'
  },
  {
    id: 'certificate',
    question: 'How do I get a community service certificate?',
    answer:
      'Open My Hours and click Download certificate. It lists every approved shift and has a code your school or employer can ask us to verify.',
    keywords: ['certificate', 'report', 'proof', 'school', 'download', 'pdf'],
    roles: ['volunteer'],
    link: '/hours'
  },
  {
    id: 'profile',
    question: 'How do I add my skills and availability?',
    answer:
      'Open My Profile. Pick your skills, choose the activity types you care about, and add the days and times you’re free. Better details mean better recommendations.',
    keywords: ['profile', 'skills', 'availability', 'interests', 'free', 'schedule'],
    roles: ['volunteer'],
    link: '/profile'
  },
  {
    id: 'recommendations',
    question: 'How are activities recommended to me?',
    answer:
      'Each upcoming activity gets a match score out of 100: up to 50 points for skills you have, 30 for fitting your availability, and 20 if it’s a type you’re interested in. Full shifts drop lower.',
    keywords: ['recommend', 'match', 'score', 'suggest', 'percent'],
    roles: ['volunteer']
  },
  {
    id: 'double-booking',
    question: 'Why can’t I sign up for two shifts at once?',
    answer: 'You can’t hold two shifts that overlap in time. Cancel the other shift first if you’d rather do this one.',
    keywords: ['overlap', 'double', 'conflict', 'same', 'time', 'signup'],
    roles: ['volunteer']
  },
  {
    id: 'notifications',
    question: 'Where are my emails and notifications?',
    answer:
      'Open Notifications. Every confirmation, waitlist update, and approval appears there. The app simulates email, so nothing leaves your computer.',
    keywords: ['email', 'notification', 'message', 'inbox', 'confirmation'],
    roles: ['volunteer', 'admin'],
    link: '/notifications'
  },
  {
    id: 'password',
    question: 'What makes a valid password?',
    answer: 'Use at least 8 characters with at least one letter and one number.',
    keywords: ['password', 'login', 'account', 'signin'],
    roles: ['volunteer', 'admin']
  },
  {
    id: 'admin-create-activity',
    question: 'How do I create or edit an activity?',
    answer:
      'Open Activities and click New activity. Fill in the name, type, time, location, number of slots, and any skills needed. Click an activity’s row to edit, cancel, or delete it.',
    keywords: ['create', 'new', 'edit', 'activity', 'event', 'update', 'add'],
    roles: ['admin'],
    link: '/admin/activities'
  },
  {
    id: 'admin-delete',
    question: 'Why can’t I delete an activity?',
    answer: 'Once volunteers log hours for an activity, deleting it would erase their service records. Cancel it instead. Everyone signed up is notified either way.',
    keywords: ['delete', 'remove', 'cancel', 'activity'],
    roles: ['admin']
  },
  {
    id: 'admin-approve',
    question: 'How do I approve or reject hours?',
    answer:
      'Open Hour Approvals. Check the entries and click Approve, or click Reject and give a reason. The volunteer is notified right away.',
    keywords: ['approve', 'reject', 'hours', 'review', 'pending', 'queue'],
    roles: ['admin'],
    link: '/admin/approvals'
  },
  {
    id: 'admin-find-volunteer',
    question: 'How do I find a volunteer with a certain skill?',
    answer: 'Open Volunteers and type a name, email, or skill (like "Spanish"), or pick a skill from the filter.',
    keywords: ['find', 'search', 'volunteer', 'skill', 'directory', 'translator'],
    roles: ['admin'],
    link: '/admin/volunteers'
  },
  {
    id: 'admin-report',
    question: 'How do I make a report?',
    answer: 'Open Reports. Filter by date range, activity type, or volunteer, then export the results as CSV or PDF.',
    keywords: ['report', 'export', 'csv', 'pdf', 'summary', 'analysis'],
    roles: ['admin'],
    link: '/admin/reports'
  },
  {
    id: 'admin-verify',
    question: 'How do I check that a certificate is real?',
    answer: 'Open Reports and enter the code printed on the certificate (like ABCD-1234) under Verify a certificate.',
    keywords: ['verify', 'certificate', 'code', 'real', 'check'],
    roles: ['admin'],
    link: '/admin/reports'
  }
]

const STOP_WORDS = new Set(
  'a an the i my me do does how can what why where when is are to for of on in it and or be get i’m im you your this that with'.split(' ')
)

const SYNONYMS: Record<string, string> = {
  register: 'signup',
  join: 'signup',
  enroll: 'signup',
  sign: 'signup',
  shifts: 'shift',
  events: 'event',
  activities: 'activity',
  hour: 'hours',
  logged: 'log',
  logging: 'log',
  submit: 'log',
  certificates: 'certificate',
  cert: 'certificate',
  emails: 'email',
  notifications: 'notification',
  messages: 'message',
  approval: 'approve',
  approving: 'approve',
  rejecting: 'reject',
  denied: 'rejected',
  waiting: 'waitlist',
  waitlisted: 'waitlist',
  quit: 'cancel',
  unregister: 'cancel',
  skills: 'skills',
  skill: 'skills',
  available: 'availability',
  pw: 'password'
}

export function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/sign[\s-]?up/g, 'signup')
    .replace(/log[\s-]?in/g, 'login')
    .split(/[^a-z0-9’']+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w))
    .map((w) => SYNONYMS[w] ?? w)
}

/** Returns up to `limit` FAQs that best answer the question for this role. */
export function answer(questionText: string, role: Role, limit = 3): Faq[] {
  const words = new Set(normalize(questionText))
  if (words.size === 0) return []
  return FAQS.filter((f) => f.roles.includes(role))
    .map((f) => {
      const faqWords = new Set(normalize(`${f.question} ${f.answer}`))
      let score = 0
      for (const w of words) {
        if (f.keywords.includes(w)) score += 3
        else if (faqWords.has(w)) score += 1
      }
      return { f, score }
    })
    .filter((x) => x.score >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.f)
}
