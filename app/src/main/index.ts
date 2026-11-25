/**
 * App entry point (the Electron main process).
 * Opens the database, loads demo data on first run, registers the API,
 * and creates a locked-down window for the UI.
 */
import { app, BrowserWindow, dialog, shell } from 'electron'
import { join } from 'path'
import { pathToFileURL } from 'url'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { openDb } from './db'
import { migrateLegacyInstall } from './services/settings'
import { registerIpc } from './ipc'

// Tests point this at a temp folder so they never touch real data.
// The app was called ServeHub; keep its data folder so renaming never strands an install's database.
app.setPath('userData', process.env.SERVEHUB_DATA_DIR || join(app.getPath('appData'), 'ServeHub'))

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#111111', // graphite canvas, so the window never flashes white before the first paint
    title: 'Turnout',
    icon,
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
  // Only the bundled page itself, not any file:// page: a stray local HTML file must not get the API.
  // Decoded and lower-cased so drive-letter case or percent-encoding (spaces, accents in the install path) can't lock the app out.
  // A malformed %-sequence makes decodeURI throw; treat that as "not ours" so will-navigate still blocks it.
  try {
    return norm(url.split(/[?#]/)[0]!) === APP_PAGE
  } catch {
    return false
  }
}
const norm = (u: string): string => decodeURI(u).toLowerCase()
const APP_PAGE = norm(pathToFileURL(join(__dirname, '../renderer/index.html')).href)

process.on('uncaughtException', (err) => {
  console.error('Unexpected error:', err)
})

app.whenReady().then(() => {
  electronApp.setAppUserModelId('org.servehub.app')
  app.on('browser-window-created', (_, window) => optimizer.watchWindowShortcuts(window))

  try {
    const db = openDb(join(app.getPath('userData'), 'servehub.db'))
    // A fresh install starts empty and opens on first-run setup; older installs were demo-seeded.
    migrateLegacyInstall(db)
    registerIpc(db, isAppUrl)
  } catch (err) {
    dialog.showErrorBox('Turnout could not start', `The database could not be opened.\n\n${String(err)}`)
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
