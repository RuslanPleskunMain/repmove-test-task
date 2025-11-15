import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.REPMOVE_BASE_URL ?? 'https://dev-repmove-enterprise.web.app';

export default defineConfig({
  testDir: './tests/specs',
  outputDir: 'test-results',
  fullyParallel: true,
  timeout: 90_000,
  expect: {
    timeout: 20_000
  },
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }]
  ],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    viewport: { width: 1440, height: 900 },
    headless: true
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});

