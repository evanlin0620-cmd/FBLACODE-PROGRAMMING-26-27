import { expect, test } from '@playwright/test'
import { launch } from './app'

type Bridge = { api: { call: (name: string, input?: unknown) => Promise<unknown> } }

test('app boots to the login screen and the API enforces validation and roles', async () => {
  const { app, page } = await launch()
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()

  const bad = await page.evaluate(() => (window as unknown as Bridge).api.call('auth.login', { email: 'bad', password: '' }))
  expect(bad).toMatchObject({ ok: false, error: { code: 'VALIDATION' } })

  // A volunteer calling an admin action straight through the bridge is refused by the backend.
  await page.evaluate(() => (window as unknown as Bridge).api.call('auth.login', { email: 'maria@servehub.test', password: 'Volunteer2026' }))
  const forbidden = await page.evaluate(() => (window as unknown as Bridge).api.call('hours.forReview', 'pending'))
  expect(forbidden).toMatchObject({ ok: false, error: { code: 'FORBIDDEN' } })
  await app.close()
})
