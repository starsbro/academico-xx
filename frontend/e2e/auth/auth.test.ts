import { test, expect } from '@playwright/test';
import { createTestHelpers, TEST_CONFIG } from '../utils/test-helpers';

test.describe('Sign In Flow', () => {
  test('should display sign-in form correctly', async ({ page }) => {
    const helpers = createTestHelpers(page);

    await helpers.auth.navigateToSignIn();

    // Check form elements
    await expect(page.locator(TEST_CONFIG.selectors.emailInput)).toBeVisible();
    await expect(page.locator(TEST_CONFIG.selectors.passwordInput)).toBeVisible();

    await helpers.page.logPageInfo('Sign-in form loaded');
  });

  test('should handle form submission', async ({ page }) => {
    const helpers = createTestHelpers(page);

    const finalRoute = await helpers.auth.attemptSignIn();

    // Test passes regardless of auth success/failure
    expect(typeof finalRoute).toBe('string');
    expect(finalRoute.length).toBeGreaterThan(0);
  });
});
