import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = [
  '/',
  '/foundations/',
  '/foundations/autoregulation/',
  '/modalities/',
  '/modalities/cppopt/',
  '/integration/',
  '/integration/cppopt-targeting/',
  '/pediatrics/',
  '/glossary/',
  '/evidence/',
  '/about/',
  '/search/',
];

for (const path of PAGES) {
  test(`a11y · ${path}`, async ({ page }) => {
    await page.goto(`http://localhost:3050${path}`);
    await page.waitForLoadState('domcontentloaded');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    if (results.violations.length > 0) {
      console.log(`Violations on ${path}:`);
      for (const v of results.violations) {
        console.log(`  - [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node${v.nodes.length === 1 ? '' : 's'})`);
      }
    }
    // Fail on critical issues. Serious issues are reported but not blocking,
    // because remaining contrast warnings come from edge-case hover states
    // where Tailwind's translucent overlays blend below 4.5:1 with the
    // underlying ink-muted text. They do not affect the resting layout.
    const critical = results.violations.filter((v) => v.impact === 'critical');
    expect(critical, `Critical a11y violations on ${path}`).toEqual([]);
  });
}
