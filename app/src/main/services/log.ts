/**
 * Two small write helpers used by every other service:
 * notify() puts a simulated email in the outbox, and audit() records
 * who changed what, so admins can trace any approval or edit.
 */
import { all, run, type Db } from '../db'
import type { AuditEntry, Notification } from '@shared/types'
import { type Ctx, requireAdmin, requireUser } from './context'
import { idsSchema } from '@shared/schemas'
import { parse } from './context'

export function notify(db: Db, now: string, userId: number, type: string, subject: string, body: string): void {
  run(
    db,
    'INSERT INTO notifications (user_id, type, subject, body, created_at) VALUES (?, ?, ?, ?, ?)',
    userId,
    type,
    subject,
    body,
    now
  )
}

export function audit(
  db: Db,
  now: string,
  actorId: number | null,
  action: string,
  entity: string,
  entityId: number | null,
  detail = ''
): void {
  run(
    db,
    'INSERT INTO audit_log (actor_id, action, entity, entity_id, detail, at) VALUES (?, ?, ?, ?, ?, ?)',
    actorId,
    action,
    entity,
    entityId,
    detail,
    now
  )
}

interface NotificationRow {
  id: number
  user_id: number
  email: string
  type: string
  subject: string
  body: string
  created_at: string
  read_at: string | null
}

const toNotification = (r: NotificationRow): Notification => ({
  id: r.id,
  userId: r.user_id,
  recipientEmail: r.email,
  type: r.type,
  subject: r.subject,
  body: r.body,
  createdAt: r.created_at,
  readAt: r.read_at
})

const NOTIFICATION_SELECT = `
  SELECT n.id, n.user_id, u.email, n.type, n.subject, n.body, n.created_at, n.read_at
  FROM notifications n JOIN users u ON u.id = n.user_id`

/** The logged-in user's inbox, newest first. */
export function myNotifications(ctx: Ctx): Notification[] {
  const user = requireUser(ctx)
  return all<NotificationRow>(ctx.db, `${NOTIFICATION_SELECT} WHERE n.user_id = ? ORDER BY n.id DESC`, user.id).map(
    toNotification
  )
}

/** Marks some (or, with an empty list, all) of the user's own notifications as read. */
export function markRead(ctx: Ctx, ids: unknown): void {
  const user = requireUser(ctx)
  const list = parse(idsSchema, ids)
  if (list.length === 0) {
    run(ctx.db, 'UPDATE notifications SET read_at = ? WHERE user_id = ? AND read_at IS NULL', ctx.now(), user.id)
    return
  }
  for (const id of list) {
    // The user_id check stops anyone from marking someone else's messages.
    run(ctx.db, 'UPDATE notifications SET read_at = ? WHERE id = ? AND user_id = ? AND read_at IS NULL', ctx.now(), id, user.id)
  }
}

/** Admin view of every simulated email the system has "sent". */
export function outbox(ctx: Ctx, q?: unknown): Notification[] {
  requireAdmin(ctx)
  const search = typeof q === 'string' && q.trim() ? `%${q.trim()}%` : '%'
  return all<NotificationRow>(
    ctx.db,
    `${NOTIFICATION_SELECT} WHERE u.email LIKE ? OR n.subject LIKE ? ORDER BY n.id DESC LIMIT 500`,
    search,
    search
  ).map(toNotification)
}

export function listAudit(ctx: Ctx): AuditEntry[] {
  requireAdmin(ctx)
  return all<{ id: number; name: string | null; action: string; entity: string; entity_id: number | null; detail: string; at: string }>(
    ctx.db,
    `SELECT a.id, u.full_name AS name, a.action, a.entity, a.entity_id, a.detail, a.at
     FROM audit_log a LEFT JOIN users u ON u.id = a.actor_id ORDER BY a.id DESC LIMIT 500`
  ).map((r) => ({
    id: r.id,
    actorName: r.name ?? 'System',
    action: r.action,
    entity: r.entity,
    entityId: r.entity_id,
    detail: r.detail,
    at: r.at
  }))
}
