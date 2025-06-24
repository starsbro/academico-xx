import { test, expect } from '@playwright/test';

test('simple smoke test', async ({ page }) => {
  await page.goto('/');
  const title = await page.title();
  expect(title).toBeDefined();
  console.log('✅ Smoke test passed!');
});
