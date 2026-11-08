/**
 * Opens the SQLite database using Node's built-in node:sqlite module,
 * so the app needs no native database package.
 */
import { DatabaseSync } from 'node:sqlite'
import { SCHEMA } from './schema'

export type Db = DatabaseSync

/** Opens (or creates) the database file and makes sure all tables exist. Pass ':memory:' in tests. */
export function openDb(file: string): Db {
  const db = new DatabaseSync(file)
  db.exec('PRAGMA foreign_keys = ON;')
  if (file !== ':memory:') db.exec('PRAGMA journal_mode = WAL;')
  db.exec(SCHEMA)
  return db
}

/**
 * Runs fn inside one transaction. If anything throws, every change is undone.
 * BEGIN IMMEDIATE takes the write lock up front, so two sign-ups can't both
 * read "1 slot left" and both take it.
 */
export function tx<T>(db: Db, fn: () => T): T {
  db.exec('BEGIN IMMEDIATE')
  try {
    const result = fn()
    db.exec('COMMIT')
    return result
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }
}

/** Shorthand: one row or undefined. */
export function one<T>(db: Db, sql: string, ...params: (string | number | null)[]): T | undefined {
  return db.prepare(sql).get(...params) as T | undefined
}

/** Shorthand: all rows. */
export function all<T>(db: Db, sql: string, ...params: (string | number | null)[]): T[] {
  return db.prepare(sql).all(...params) as T[]
}

/** Shorthand: run a write and return the new row id. */
export function run(db: Db, sql: string, ...params: (string | number | null)[]): number {
  return Number(db.prepare(sql).run(...params).lastInsertRowid)
}
