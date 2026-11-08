/**
 * Launches the built app with its own throwaway data folder, so tests always
 * start from fresh demo data and never touch a real database.
 */
import { _electron as electron, type ElectronApplication, type Page } from '@playwright/test'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export async function launch(): Promise<{ app: ElectronApplication; page: Page }> {
  const dataDir = mkdtempSync(join(tmpdir(), 'servehub-e2e-'))
  const app = await electron.launch({
    args: [join(__dirname, '../../out/main/index.js')],
    env: { ...process.env, SERVEHUB_DATA_DIR: dataDir }
  })
  const page = await app.firstWindow()
  await page.setViewportSize({ width: 1280, height: 800 })
  return { app, page }
}

export const shot = (page: Page, name: string): Promise<Buffer> =>
  page.screenshot({ path: join(__dirname, 'screenshots', `${name}.png`) })
