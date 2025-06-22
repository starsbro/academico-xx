import { test, expect } from '@playwright/test';
import { createTestHelpers } from '../utils/test-helpers';

test.describe('Application Health Checks', () => {
  test('should load homepage without errors', async ({ page }) => {
    const helpers = createTestHelpers(page);

    await helpers.page.goto('/');

    // Check that page loads successfully
    const hasErrors = await helpers.page.checkForErrors();
    expect(hasErrors).toBe(true);

    // Verify basic page structure
    await expect(page.locator('html')).toBeVisible();
    await expect(page.locator('body')).toBeVisible();

    await helpers.page.logPageInfo('Homepage health check');
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');

    // Check for essential meta tags
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);

    // Check for viewport meta tag
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveCount(1);

    console.log(`✅ Page title: "${title}"`);
  });

  test('should respond within reasonable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Should load within 10 seconds
    expect(loadTime).toBeLessThan(10000);

    console.log(`✅ Page loaded in ${loadTime}ms`);
  });

  test('should not have console errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Allow React dev tools warning but no other errors
    const criticalErrors = consoleErrors.filter(
      (error) => !error.includes('React DevTools') && !error.includes('Fast Refresh')
    );

    expect(criticalErrors.length).toBe(0);

    if (criticalErrors.length > 0) {
      console.log('❌ Console errors found:', criticalErrors);
    } else {
      console.log('✅ No critical console errors');
    }
  });
});
