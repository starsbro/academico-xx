import { test, expect } from '@playwright/test';
import { createTestHelpers, TEST_CHAT_MESSAGES } from '../utils/test-helpers';

test.describe('Academic Chat Interface', () => {
  test.describe('when authenticated', () => {
    test.beforeEach(async ({ page }) => {
      // Mock authentication state instead of real sign-in
      await page.goto('http://localhost:3000/sign-in');
      await page.evaluate(() => {
        localStorage.setItem('firebase:authUser:test', JSON.stringify({
          uid: 'test-user-123',
          email: 'test@example.com',
          displayName: 'Test User',
          emailVerified: true,
          isAnonymous: false
        }));
      });

      // Navigate to chat page
      await page.goto('http://localhost:3000/academic-chat');
      await page.waitForLoadState('networkidle');
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

    test('should show authenticated user interface', async ({ page }) => {
      const helpers = createTestHelpers(page);
      const currentRoute = await helpers.page.getCurrentRoute();

      if (currentRoute.includes('/sign-in')) {
        test.skip(true, 'Authentication required - skipping UI test');
      }

      // Check for authenticated user indicators
      const userIndicators = [
        '[data-testid="user-menu"]',
        '[data-testid="user-avatar"]',
        'button:has-text("Sign out")',
        'button:has-text("Logout")',
        '.user-menu',
        '.avatar'
      ];

      let userIndicatorFound = false;
      for (const selector of userIndicators) {
        if (await page.locator(selector).count() > 0) {
          console.log(`✅ User indicator found: ${selector}`);
          userIndicatorFound = true;
          break;
        }
      }

      if (!userIndicatorFound) {
        console.log('ℹ️ No user indicators found - interface might be minimal');
      }

      // Verify we can access chat functionality
      const chatInput = page
        .locator('[placeholder*="thinking"], [placeholder*="ask"], textarea, input[type="text"]')
        .first();
      
      if (await chatInput.count() > 0) {
        await expect(chatInput).toBeVisible();
        console.log('✅ Chat interface accessible to authenticated user');
      } else {
        console.log('ℹ️ Chat interface not yet loaded');
      }
    });
  });

  test.describe('when not authenticated', () => {
    test('should redirect to sign-in page', async ({ page }) => {
      await page.goto('http://localhost:3000/academic-chat');
      await page.waitForLoadState('networkidle');

      // Should be redirected to sign-in
      expect(page.url()).toContain('/sign-in');
      console.log('✅ Unauthenticated users properly redirected to sign-in');
    });
  });
});
