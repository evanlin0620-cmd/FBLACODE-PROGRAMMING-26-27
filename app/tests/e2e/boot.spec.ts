import { expect, test } from '@playwright/test'
import { launch } from './app'

type Bridge = { api: { call: (name: string, input?: unknown) => Promise<unknown> } }

test('app boots to the login screen and the API enforces validation and roles', async () => {
  const { app, page } = await launch()
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()

  const bad = await page.evaluate(() => (window as unknown as Bridge).api.call('auth.login', { email: 'bad', password: '' }))
  expect(bad).toMatchObject({ ok: false, error: { code: 'VALIDATION' } })

  // A volunteer calling an admin action straight through the bridge is refused by the backend.
  await page.evaluate(() => (window as unknown as Bridge).api.call('auth.login', { email: 'maria@servehub.test', password: 'Volunteer2026' }))
  const forbidden = await page.evaluate(() => (window as unknown as Bridge).api.call('hours.forReview', 'pending'))
  expect(forbidden).toMatchObject({ ok: false, error: { code: 'FORBIDDEN' } })
  await app.close()
})

test('sign-up deals shifts by the answers and holds the chosen spot', async () => {
  const { app, page } = await launch()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.getByRole('link', { name: 'Create an account' }).click()
  await page.getByRole('button', { name: 'Tutoring' }).click()
  await page.getByRole('button', { name: 'Wednesday' }).click()
  // The deck re-sorts: the best fit comes to the top and the button names it.
  await expect(page.getByText(/^Best fit so far: .+, \d+% match\.$/)).toBeVisible()
  const pick = (await page.getByText(/^Best fit so far/).innerText()).match(/: (.+), \d+%/)![1]!
  await expect(page.getByRole('button', { name: `Create account and join ${pick}` })).toBeVisible()
  await page.getByLabel('Full name').fill('Test Person')
  await page.getByLabel('Email').fill('test.person@example.com')
  await page.getByLabel('Password', { exact: true }).fill('abcdefg1')
  await page.getByLabel('Confirm password').fill('abcdefg1')
  await page.getByRole('button', { name: /^Create account/ }).click()
  await expect(page.getByRole('heading', { level: 1, name: /^\w+ \d{4}$/ })).toBeVisible()
  await expect(page.getByText(new RegExp(`Account created. You’re (signed up for|#\\d+ on the waitlist for) ${pick}`))).toBeVisible()
  await page.screenshot({ path: 'tests/e2e/screenshots/00-signup-landed.png' })
  await app.close()
})
