/**
 * App entry point (the Electron main process).
 * Opens the database, loads demo data on first run, registers the API,
 * and creates a locked-down window for the UI.
 */
import { app, BrowserWindow, dialog, shell } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { openDb } from './db'
import { seedDemo } from './db/seed'
import { registerIpc } from './ipc'

// Tests point this at a temp folder so they never touch real data.
if (process.env.SERVEHUB_DATA_DIR) app.setPath('userData', process.env.SERVEHUB_DATA_DIR)

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    show: false,
    autoHideMenuBar: true,
    title: 'ServeHub',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true, // the UI can't reach into the preload script
      nodeIntegration: false, // the UI can't use Node (files, processes)
      sandbox: true
    }
  })

  mainWindow.on('ready-to-show', () => mainWindow.show())

  // Links to websites open in the real browser, never inside the app.
  mainWindow.webContents.setWindowOpenHandler((details) => {
    if (details.url.startsWith('https://')) shell.openExternal(details.url)
    return { action: 'deny' }
  })
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!isAppUrl(url)) event.preventDefault()
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

/** True for the app's own pages (the dev server in development, the bundled file in production). */
function isAppUrl(url: string): boolean {
  const devUrl = process.env['ELECTRON_RENDERER_URL']
  if (is.dev && devUrl && url.startsWith(devUrl)) return true
  return url.startsWith('file://')
}

process.on('uncaughtException', (err) => {
  console.error('Unexpected error:', err)
})

app.whenReady().then(() => {
  electronApp.setAppUserModelId('org.servehub.app')
  app.on('browser-window-created', (_, window) => optimizer.watchWindowShortcuts(window))

  try {
    const db = openDb(join(app.getPath('userData'), 'servehub.db'))
    const isEmpty = !(db.prepare('SELECT 1 FROM users LIMIT 1').get() as unknown)
    if (isEmpty) seedDemo(db)
    registerIpc(db, isAppUrl)
  } catch (err) {
    dialog.showErrorBox('ServeHub could not start', `The database could not be opened.\n\n${String(err)}`)
    app.quit()
    return
  }

  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
