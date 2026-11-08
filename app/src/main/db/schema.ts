/**
 * The SQLite schema. CHECK constraints repeat the most important rules
 * (no negative hours, end after start) so bad data can't get in even if
 * a bug skips the service-layer checks.
 */
export const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('volunteer', 'admin')),
  full_name     TEXT NOT NULL,
  created_at    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS volunteer_profiles (
  user_id   INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  phone     TEXT NOT NULL DEFAULT '',
  bio       TEXT NOT NULL DEFAULT '',
  interests TEXT NOT NULL DEFAULT '[]', -- JSON array of activity types
  hour_goal INTEGER NOT NULL DEFAULT 20 CHECK (hour_goal BETWEEN 1 AND 1000)
);

CREATE TABLE IF NOT EXISTS skills (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE COLLATE NOCASE
);

CREATE TABLE IF NOT EXISTS volunteer_skills (
  user_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, skill_id)
);

CREATE TABLE IF NOT EXISTS availability (
  id         INTEGER PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  weekday    INTEGER NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  start_time TEXT NOT NULL,
  end_time   TEXT NOT NULL CHECK (end_time > start_time)
);

CREATE TABLE IF NOT EXISTS activities (
  id          INTEGER PRIMARY KEY,
  title       TEXT NOT NULL,
  type        TEXT NOT NULL,
  description TEXT NOT NULL,
  location    TEXT NOT NULL,
  start_at    TEXT NOT NULL,
  end_at      TEXT NOT NULL CHECK (end_at > start_at),
  capacity    INTEGER NOT NULL CHECK (capacity > 0),
  status      TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'cancelled')),
  created_by  INTEGER REFERENCES users(id),
  created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS activity_skills (
  activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  skill_id    INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (activity_id, skill_id)
);

-- One row per volunteer per activity. Waitlist order is queued_at, then id.
CREATE TABLE IF NOT EXISTS signups (
  id          INTEGER PRIMARY KEY,
  activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status      TEXT NOT NULL CHECK (status IN ('confirmed', 'waitlisted', 'cancelled')),
  queued_at   TEXT NOT NULL,
  UNIQUE (activity_id, user_id)
);
CREATE INDEX IF NOT EXISTS signups_by_activity ON signups (activity_id, status);

CREATE TABLE IF NOT EXISTS hour_logs (
  id          INTEGER PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_id INTEGER NOT NULL REFERENCES activities(id),
  hours       REAL NOT NULL CHECK (hours > 0 AND hours <= 24),
  note        TEXT NOT NULL DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  review_note TEXT NOT NULL DEFAULT '',
  reviewed_by INTEGER REFERENCES users(id),
  reviewed_at TEXT,
  created_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS hour_logs_by_status ON hour_logs (status);

-- The simulated email outbox. Every "email" the app would send is a row here.
CREATE TABLE IF NOT EXISTS notifications (
  id         INTEGER PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,
  subject    TEXT NOT NULL,
  body       TEXT NOT NULL,
  created_at TEXT NOT NULL,
  read_at    TEXT
);

CREATE TABLE IF NOT EXISTS certificates (
  code        TEXT PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_hours REAL NOT NULL,
  issued_at   TEXT NOT NULL,
  issued_by   INTEGER REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS audit_log (
  id        INTEGER PRIMARY KEY,
  actor_id  INTEGER REFERENCES users(id),
  action    TEXT NOT NULL,
  entity    TEXT NOT NULL,
  entity_id INTEGER,
  detail    TEXT NOT NULL DEFAULT '',
  at        TEXT NOT NULL
);
`
