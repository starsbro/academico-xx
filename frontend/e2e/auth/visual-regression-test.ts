import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('should match homepage screenshot', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('should match signin page screenshot', async ({ page }) => {
    await page.goto('/auth/signin');
    await expect(page).toHaveScreenshot('signin-page.png');
  });

  test('should match signup page screenshot', async ({ page }) => {
    await page.goto('/auth/signup');
    await expect(page).toHaveScreenshot('signup-page.png');
  });

  test('should match academic chat page screenshot', async ({ page }) => {
    await page.goto('/academic-chat');
    await expect(page).toHaveScreenshot('academic-chat-page.png');
  });
});
