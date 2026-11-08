/**
 * Test helpers: a fresh in-memory database per test, a controllable clock,
 * and shortcuts for making users and activities.
 */
import { openDb, run, type Db } from '../../src/main/db'
import type { Ctx } from '../../src/main/services/context'
import { createUser } from '../../src/main/services/auth'
import type { SessionUser } from '../../src/shared/types'

export interface World {
  db: Db
  clock: { now: string }
  as: (user: SessionUser | null) => Ctx
  admin: SessionUser
  volunteer: (name?: string) => SessionUser
  activity: (opts?: Partial<{ title: string; startAt: string; endAt: string; capacity: number; type: string }>) => number
  skill: (name: string) => number
}

let counter = 0

export function makeWorld(now = '2026-11-01T12:00'): World {
  const db = openDb(':memory:')
  const clock = { now }
  const as = (user: SessionUser | null): Ctx => ({ db, user, now: () => clock.now })
  const system = as(null)
  const admin = createUser(system, { fullName: 'Admin Person', email: 'admin@test.test', password: 'Password1' }, 'admin')

  return {
    db,
    clock,
    as,
    admin,
    volunteer: (name = `Volunteer ${++counter}`) =>
      createUser(system, { fullName: name, email: `v${++counter}@test.test`, password: 'Password1' }, 'volunteer'),
    activity: (opts = {}) =>
      run(
        db,
        'INSERT INTO activities (title, type, description, location, start_at, end_at, capacity, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        opts.title ?? 'Food Pantry Sort',
        opts.type ?? 'Food Bank',
        'Helping out in the community.',
        'Community Center',
        opts.startAt ?? '2026-11-10T09:00',
        opts.endAt ?? '2026-11-10T12:00',
        opts.capacity ?? 2,
        now
      ),
    skill: (name) => run(db, 'INSERT INTO skills (name) VALUES (?)', name)
  }
}
