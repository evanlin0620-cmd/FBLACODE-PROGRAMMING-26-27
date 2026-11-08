/**
 * The IPC router: the only door between the UI and the backend.
 *
 * The UI sends ('api', name, input). This file looks up the handler for that
 * name, runs it with the logged-in session, and always answers with a Result:
 * { ok: true, data } or { ok: false, error }. Expected problems (AppError) become
 * friendly messages; anything unexpected is logged and the UI gets a generic one.
 * Role checks happen inside each service, so this file can't forget one.
 */
import { BrowserWindow, dialog, ipcMain } from 'electron'
import { writeFileSync } from 'node:fs'
import type { ApiMap, ApiName } from '@shared/api'
import { AppError } from '@shared/errors'
import type { Result, SessionUser } from '@shared/types'
import { toStamp } from '@shared/time'
import type { Db } from './db'
import { seedDemo } from './db/seed'
import type { Ctx } from './services/context'
import { requireAdmin } from './services/context'
import * as activities from './services/activities'
import * as auth from './services/auth'
import * as hours from './services/hours'
import * as log from './services/log'
import * as profiles from './services/profiles'
import * as reports from './services/reports'
import * as signups from './services/signups'

type Handlers = { [K in ApiName]: (ctx: Ctx, input: ApiMap[K]['in']) => ApiMap[K]['out'] | Promise<ApiMap[K]['out']> }

/** The one logged-in user for this window. Kept in the main process, where the UI can't edit it. */
let session: SessionUser | null = null

async function saveFile(defaultName: string, filters: Electron.FileFilter[], write: (path: string) => void | Promise<void>) {
  const win = BrowserWindow.getFocusedWindow()
  const result = win
    ? await dialog.showSaveDialog(win, { defaultPath: defaultName, filters })
    : await dialog.showSaveDialog({ defaultPath: defaultName, filters })
  if (result.canceled || !result.filePath) return { saved: false }
  await write(result.filePath)
  return { saved: true, path: result.filePath }
}

const handlers: Handlers = {
  'auth.me': () => session,
  'auth.login': (ctx, input) => (session = auth.login(ctx, input)),
  'auth.signup': (ctx, input) => (session = auth.signup(ctx, input)),
  'auth.logout': () => {
    session = null
    return null
  },
  'auth.createAdmin': (ctx, input) => auth.createAdmin(ctx, input),

  'activities.list': (ctx, f) => activities.listActivities(ctx, f),
  'activities.get': (ctx, id) => activities.getActivity(ctx, id),
  'activities.create': (ctx, data) => activities.createActivity(ctx, data),
  'activities.update': (ctx, { id, data }) => activities.updateActivity(ctx, id, data),
  'activities.cancel': (ctx, id) => activities.cancelActivity(ctx, id),
  'activities.delete': (ctx, id) => {
    activities.deleteActivity(ctx, id)
    return null
  },
  'activities.roster': (ctx, id) => activities.roster(ctx, id),

  'signups.join': (ctx, id) => signups.signUp(ctx, id),
  'signups.cancel': (ctx, id) => {
    signups.cancelSignup(ctx, id)
    return null
  },
  'signups.mine': (ctx) => signups.mySignups(ctx),

  'hours.log': (ctx, input) => hours.logHours(ctx, input),
  'hours.mine': (ctx) => hours.myHours(ctx),
  'hours.loggable': (ctx) => hours.loggableShifts(ctx),
  'hours.forReview': (ctx, status) => hours.hoursForReview(ctx, status),
  'hours.review': (ctx, input) => hours.reviewHours(ctx, input),

  'skills.list': (ctx) => profiles.listSkills(ctx),
  'profile.get': (ctx) => profiles.getMyProfile(ctx),
  'profile.update': (ctx, input) => profiles.updateMyProfile(ctx, input),
  'volunteers.search': (ctx, input) => profiles.searchVolunteers(ctx, input),
  'volunteers.get': (ctx, id) => profiles.getVolunteer(ctx, id),

  'dashboard.volunteer': (ctx) => reports.volunteerDashboard(ctx),
  'dashboard.impact': (ctx) => reports.impactStats(ctx),
  'reports.hours': (ctx, f) => reports.hoursReport(ctx, f),
  'reports.exportCsv': (ctx, f) => {
    const report = reports.hoursReport(ctx, f) // runs the admin check before any dialog opens
    return saveFile(`hours-report-${ctx.now().slice(0, 10)}.csv`, [{ name: 'CSV', extensions: ['csv'] }], (path) =>
      writeFileSync(path, '﻿' + reports.reportToCsv(report), 'utf8')
    )
  },
  'reports.savePdf': (ctx, { suggestedName }) => {
    if (!ctx.user) throw new AppError('UNAUTHORIZED', 'Please log in to continue.')
    const safeName = suggestedName.replace(/[^\w.-]+/g, '-').slice(0, 80) || 'document'
    // Prints whatever the window is showing (a report or a certificate) to a PDF file.
    return saveFile(`${safeName}.pdf`, [{ name: 'PDF', extensions: ['pdf'] }], async (path) => {
      const win = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0]
      const pdf = await win.webContents.printToPDF({ printBackground: true, pageSize: 'Letter' })
      writeFileSync(path, pdf)
    })
  },
  'certificates.issue': (ctx, volunteerId) => reports.issueCertificate(ctx, volunteerId),
  'certificates.verify': (ctx, code) => reports.verifyCertificate(ctx, code),

  'notifications.mine': (ctx) => log.myNotifications(ctx),
  'notifications.markRead': (ctx, ids) => {
    log.markRead(ctx, ids)
    return null
  },
  'notifications.outbox': (ctx, q) => log.outbox(ctx, q),
  'audit.list': (ctx) => log.listAudit(ctx),

  'demo.reset': (ctx) => {
    requireAdmin(ctx)
    seedDemo(ctx.db)
    session = null // everyone's ids changed, so log out
    return null
  }
}

export function registerIpc(db: Db, isTrustedSender: (url: string) => boolean): void {
  ipcMain.handle('api', async (event, name: string, input: unknown): Promise<Result<unknown>> => {
    // Only answer the app's own window, never some other page that got loaded.
    if (!event.senderFrame || !isTrustedSender(event.senderFrame.url)) {
      return { ok: false, error: { code: 'FORBIDDEN', message: 'Request blocked.' } }
    }
    const handler = (handlers as Record<string, (ctx: Ctx, input: unknown) => unknown>)[name]
    if (!handler) return { ok: false, error: { code: 'NOT_FOUND', message: `Unknown action: ${name}` } }

    const ctx: Ctx = { db, user: session, now: () => toStamp(new Date()) }
    try {
      return { ok: true, data: await handler(ctx, input) }
    } catch (err) {
      if (err instanceof AppError) {
        return { ok: false, error: { code: err.code, message: err.message, fields: err.fields } }
      }
      console.error(`[api] ${name} failed:`, err)
      return { ok: false, error: { code: 'INTERNAL', message: 'Something went wrong on our side. Your data is safe. Please try again.' } }
    }
  })
}
