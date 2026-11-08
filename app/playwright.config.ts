import { defineConfig } from '@playwright/test'

// End-to-end tests launch the built Electron app (run `npm run test:e2e`).
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  workers: 1,
  reporter: 'list'
})
