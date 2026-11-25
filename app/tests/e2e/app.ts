/**
 * Launches the built app with its own throwaway data folder, so tests never touch a real database.
 * A fresh install opens on first-run setup; most tests start from the example organization instead.
 */
import { _electron as electron, type ElectronApplication, type Page } from '@playwright/test'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export async function launch({ example = true } = {}): Promise<{ app: ElectronApplication; page: Page }> {
  const dataDir = mkdtempSync(join(tmpdir(), 'servehub-e2e-'))
  const app = await electron.launch({
    args: [join(__dirname, '../../out/main/index.js')],
    env: { ...process.env, SERVEHUB_DATA_DIR: dataDir }
  })
  const page = await app.firstWindow()
  await page.setViewportSize({ width: 1280, height: 800 })
  if (example) {
    await page.evaluate(() => (window as unknown as { api: { call: (n: string) => Promise<unknown> } }).api.call('setup.example'))
    await page.reload()
    await page.getByRole('heading', { name: 'Sign in' }).waitFor()
  }
  return { app, page }
}

export const shot = (page: Page, name: string): Promise<Buffer> =>
  page.screenshot({ path: join(__dirname, 'screenshots', `${name}.png`) })
