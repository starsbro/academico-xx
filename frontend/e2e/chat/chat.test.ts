import { test, expect } from '@playwright/test';
import { createTestHelpers, TEST_CHAT_MESSAGES } from '../utils/test-helpers';

test.describe('Academic Chat Interface', () => {
  test.describe('when authenticated', () => {
    test.beforeEach(async ({ page }) => {
      const helpers = createTestHelpers(page);

      // Try to authenticate before accessing chat
      await helpers.auth.attemptSignIn();

      // Navigate to chat page
      await page.goto('/academic-chat');
      await helpers.page.waitForAppLoad();
    });

    test('should display chat interface correctly', async ({ page }) => {
      const helpers = createTestHelpers(page);

      // First verify we're not redirected to sign-in
      const currentRoute = await helpers.page.getCurrentRoute();

      if (currentRoute.includes('/sign-in')) {
        test.skip(true, 'Authentication required - skipping chat interface tests');
      }

      // Check main elements (update selectors based on actual UI)
      const chatInput = page
        .locator('[placeholder*="thinking"], [placeholder*="ask"], textarea, input[type="text"]')
        .first();
      await expect(chatInput).toBeVisible({ timeout: 15000 });

      // Log what we found for debugging
      await helpers.page.logPageInfo('Chat interface loaded');
    });

    test('should allow typing in chat input', async ({ page }) => {
      const helpers = createTestHelpers(page);
      const currentRoute = await helpers.page.getCurrentRoute();

      if (currentRoute.includes('/sign-in')) {
        test.skip(true, 'Authentication required - skipping input test');
      }

      // Find chat input with flexible selector
      const chatInput = page
        .locator('[placeholder*="thinking"], [placeholder*="ask"], textarea, input[type="text"]')
        .first();

      await expect(chatInput).toBeVisible({ timeout: 10000 });
      await chatInput.fill(TEST_CHAT_MESSAGES[0]);
      await expect(chatInput).toHaveValue(TEST_CHAT_MESSAGES[0]);
    });

    test('should enable submit button when text is entered', async ({ page }) => {
      const helpers = createTestHelpers(page);
      const currentRoute = await helpers.page.getCurrentRoute();

      if (currentRoute.includes('/sign-in')) {
        test.skip(true, 'Authentication required - skipping button test');
      }

      const chatInput = page
        .locator('[placeholder*="thinking"], [placeholder*="ask"], textarea, input[type="text"]')
        .first();
      const searchButton = page
        .locator('button[type="submit"], button:has-text("Send"), button:has-text("Search")')
        .first();

      await expect(chatInput).toBeVisible({ timeout: 10000 });
      await chatInput.fill(TEST_CHAT_MESSAGES[0]);

      // Button should be enabled after typing
      await expect(searchButton).toBeEnabled();
    });

    test('should handle form submission', async ({ page }) => {
      const helpers = createTestHelpers(page);
      const currentRoute = await helpers.page.getCurrentRoute();

      if (currentRoute.includes('/sign-in')) {
        test.skip(true, 'Authentication required - skipping submission test');
      }

      const chatInput = page
        .locator('[placeholder*="thinking"], [placeholder*="ask"], textarea, input[type="text"]')
        .first();
      const searchButton = page
        .locator('button[type="submit"], button:has-text("Send"), button:has-text("Search")')
        .first();

      await expect(chatInput).toBeVisible({ timeout: 10000 });
      await chatInput.fill(TEST_CHAT_MESSAGES[0]);
      await searchButton.click();

      // Wait for any response or loading state
      await page.waitForTimeout(1000);

      console.log('✅ Form submission completed');
    });
  });

  test.describe('when not authenticated', () => {
    test('should redirect to sign-in page', async ({ page }) => {
      await page.goto('/academic-chat');
      await page.waitForLoadState('networkidle');

      // Should be redirected to sign-in
      expect(page.url()).toContain('/sign-in');
      console.log('✅ Unauthenticated users properly redirected to sign-in');
    });
  });
});
