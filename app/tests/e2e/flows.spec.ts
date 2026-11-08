/**
 * Walks through the main flows for both roles in the real app and saves a
 * screenshot of every screen to tests/e2e/screenshots/ (useful for slides too).
 */
import { expect, test, type Page } from '@playwright/test'
import { launch, shot } from './app'

async function loginAs(page: Page, role: 'Volunteer' | 'Admin'): Promise<void> {
  await page.getByRole('button', { name: role, exact: true }).click()
  await page.getByRole('button', { name: 'Sign in' }).click()
}

async function logout(page: Page): Promise<void> {
  await page.locator('[data-slot="dropdown-menu-trigger"]').click()
  await page.getByRole('menuitem', { name: 'Log out' }).click()
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
}

test('volunteer and admin flows', async () => {
  test.setTimeout(120_000)
  const { app, page } = await launch()
  await page.emulateMedia({ reducedMotion: 'reduce' })

  // Login validation
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByText('Enter a valid email')).toBeVisible()
  await shot(page, '01-login-errors')

  // Volunteer dashboard
  await loginAs(page, 'Volunteer')
  await expect(page.getByRole('heading', { name: 'Hi, Maria' })).toBeVisible()
  await expect(page.getByText('% match').first()).toBeVisible()
  await shot(page, '02-volunteer-dashboard')

  // Browse + filter + waitlist
  await page.getByRole('link', { name: 'Find activities' }).first().click()
  await expect(page.getByText(/Showing \d+/)).toBeVisible()
  await shot(page, '03-browse')
  await page.getByLabel('Search activities').fill('website')
  await expect(page.getByText('Showing 1 activity')).toBeVisible()
  await page.getByRole('button', { name: 'Join waitlist' }).click()
  await expect(page.getByText('#1 on the waitlist')).toBeVisible()
  await page.getByLabel('Search activities').fill('zzzz')
  await expect(page.getByText('No activities match')).toBeVisible()
  await shot(page, '04-browse-empty')

  // Activity detail shows waitlist position
  await page.getByLabel('Search activities').fill('website')
  await page.getByRole('link', { name: 'Website Refresh Sprint' }).click()
  await expect(page.getByText('You’re #1 in line')).toBeVisible()
  await shot(page, '05-activity-detail-waitlist')

  // Log hours: meaning check (more than the shift) then success
  await page.getByRole('link', { name: 'My hours' }).click()
  await page.getByRole('combobox', { name: 'Shift' }).click()
  await page.getByRole('option').first().click()
  await page.getByLabel('Hours worked').fill('9')
  await page.getByRole('button', { name: 'Send for approval' }).click()
  await expect(page.getByText(/so you can log at most 3/)).toBeVisible()
  await shot(page, '06-log-hours-error')
  await page.getByLabel('Hours worked').fill('2.5')
  await page.getByRole('button', { name: 'Send for approval' }).click()
  await expect(page.getByText('Hours sent for approval.')).toBeVisible()
  await shot(page, '07-my-hours')

  // Certificate
  await page.getByRole('link', { name: 'Get my certificate' }).click()
  await page.getByRole('button', { name: 'Create certificate' }).click()
  await expect(page.getByText('Verification code')).toBeVisible()
  await shot(page, '08-certificate')

  // Profile, notifications, help
  await page.getByRole('link', { name: 'My profile' }).click()
  await expect(page.getByRole('heading', { name: 'When you’re free' })).toBeVisible()
  await shot(page, '09-profile')
  await page.getByRole('link', { name: 'Notifications' }).click()
  await expect(page.getByText('You’re on the waitlist: Website Refresh Sprint')).toBeVisible()
  await shot(page, '10-notifications')
  await page.getByRole('link', { name: 'Help & questions' }).click()
  await page.getByLabel('Ask a question').fill('how do i register for an event')
  await page.getByRole('button', { name: 'Ask' }).click()
  await expect(page.getByText('Best answer')).toBeVisible()
  await shot(page, '11-help')

  // Volunteers can't open admin pages: they're sent home
  await page.evaluate(() => (window.location.hash = '#/admin/approvals'))
  await expect(page.getByRole('heading', { name: 'Hi, Maria' })).toBeVisible()

  // Admin
  await logout(page)
  await loginAs(page, 'Admin')
  await expect(page.getByRole('heading', { name: 'Impact dashboard' })).toBeVisible()
  await shot(page, '12-admin-impact')

  await page.getByRole('link', { name: 'Hour approvals' }).click()
  await expect(page.getByRole('cell', { name: 'Maria Lopez', exact: true })).toBeVisible()
  await shot(page, '13-approvals')
  await page.getByRole('button', { name: 'Reject' }).first().click()
  await page.getByRole('dialog').getByRole('button', { name: 'Reject' }).click()
  await expect(page.getByText(/Give a short reason/)).toBeVisible()
  await shot(page, '14-reject-needs-reason')
  await page.getByRole('button', { name: 'Keep reviewing' }).click()
  await page.getByRole('checkbox', { name: 'Select all' }).click()
  await page.getByRole('button', { name: /Approve \d+ selected/ }).click()
  await expect(page.getByText('All caught up')).toBeVisible()

  await page.getByRole('link', { name: 'Activities' }).click()
  await shot(page, '15-admin-activities')
  await page.getByRole('link', { name: 'New activity' }).click()
  await page.getByRole('button', { name: 'Create activity' }).click()
  await expect(page.getByText('Enter at least 3 characters')).toBeVisible()
  await shot(page, '16-new-activity-errors')

  await page.getByRole('link', { name: 'Volunteers' }).click()
  await page.getByLabel('Search volunteers').fill('spanish')
  await expect(page.getByText('Grace Okafor')).toBeVisible()
  await shot(page, '17-volunteer-search')
  await page.getByRole('link', { name: /Maria Lopez/ }).click()
  await expect(page.getByRole('heading', { name: 'Hour log' })).toBeVisible()
  await shot(page, '18-volunteer-record')

  await page.getByRole('link', { name: 'Reports' }).click()
  await expect(page.getByText('All entries')).toBeVisible()
  await shot(page, '19-reports')
  await page.getByRole('link', { name: 'Email outbox' }).click()
  await shot(page, '20-outbox')
  await page.getByRole('link', { name: 'Audit log' }).click()
  await expect(page.getByText('Approved hours').first()).toBeVisible()
  await shot(page, '21-audit')

  // Dark mode
  await page.getByRole('button', { name: 'Dark mode' }).click()
  await page.getByRole('link', { name: 'Impact' }).click()
  await expect(page.getByRole('heading', { name: 'Impact dashboard' })).toBeVisible()
  await shot(page, '22-admin-impact-dark')

  await app.close()
})
