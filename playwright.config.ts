import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 0,
  reporter: 'html',
  use: { baseURL: 'http://localhost:3050', trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Phase 3a: the site is a running server now, not a static export. Run
    // `next build` first (CI does this in the prior step; locally run `npm run
    // build`), then Playwright starts `next start` against the .next/ build.
    command: 'npx next start -p 3050',
    url: 'http://localhost:3050',
    timeout: 120_000,
    reuseExistingServer: true,
  },
});
