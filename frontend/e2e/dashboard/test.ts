import { test, expect } from '@playwright/test';

test.describe('Dashboard Navigation', () => {
  // Note: Authentication helpers available when needed in the future
  // Example usage:
  // const helpers = createTestHelpers(page);
  // await helpers.auth.attemptSignIn();

  test('should display dashboard correctly when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');

    // Should redirect to signin if not authenticated
    await expect(page).toHaveURL('/auth/signin');
  });

  test('should display main navigation elements', async ({ page }) => {
    await page.goto('/');

    // Check navigation elements
    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Academic Chat')).toBeVisible();
  });

  test('should navigate between pages', async ({ page }) => {
    await page.goto('/');

    // Navigate to Academic Chat
    await page.click('text=Academic Chat');
    await expect(page).toHaveURL('/academic-chat');

    // Navigate back to Home
    await page.click('text=Home');
    await expect(page).toHaveURL('/');
  });
});
