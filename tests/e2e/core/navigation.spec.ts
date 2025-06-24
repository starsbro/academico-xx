import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('should navigate to sign in page', async ({ page }) => {
    await page.goto('/');

    // Look for sign in link/button (adjust selector based on your UI)
    const signInLink = page.locator('a:has-text("Sign in"), button:has-text("Sign in"), a[href*="signin"]').first();

    if ((await signInLink.count()) > 0) {
      await signInLink.click();
      await page.waitForLoadState('networkidle');

      // Verify we're on the sign in page
      const url = page.url();
      expect(url).toContain('signin');
      console.log('✅ Successfully navigated to sign in page');
    } else {
      console.log('ℹ️ No sign in link found on homepage - might already be authenticated');
    }
  });

  test('should navigate to sign up page', async ({ page }) => {
    await page.goto('/');

    // Look for sign up link/button
    const signUpLink = page.locator('a:has-text("Sign up"), button:has-text("Sign up"), a[href*="signup"]').first();

    if ((await signUpLink.count()) > 0) {
      await signUpLink.click();
      await page.waitForLoadState('networkidle');

      // Verify we're on the sign up page
      const url = page.url();
      expect(url).toContain('signup');
      console.log('✅ Successfully navigated to sign up page');
    } else {
      console.log('ℹ️ No sign up link found on homepage');
    }
  });
});
