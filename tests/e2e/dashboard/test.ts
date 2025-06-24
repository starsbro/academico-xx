import { test, expect } from '@playwright/test';
import { AuthHelpers } from '../utils/auth-helpers';
import { TEST_USERS } from '../utils/test-data';

test.describe('Dashboard Navigation', () => {
  let authHelpers: AuthHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    // Note: This assumes you have a test user set up in your Firebase Auth
    // await authHelpers.signIn(TEST_USERS.valid.email, TEST_USERS.valid.password);
  });

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
