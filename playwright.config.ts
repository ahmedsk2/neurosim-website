import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 0,
  reporter: 'html',
  use: { baseURL: 'http://localhost:3050', trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npx serve out -p 3050 -L',
    url: 'http://localhost:3050',
    timeout: 120_000,
    reuseExistingServer: true,
  },
});
