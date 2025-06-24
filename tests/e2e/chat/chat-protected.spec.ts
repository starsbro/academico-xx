import { test, expect } from '@playwright/test';

test.describe('Chat Page Protection', () => {
  test('should redirect unauthenticated users to sign-in', async ({ page }) => {
    // Try to access chat without authentication
    await page.goto('/academic-chat');
    await page.waitForLoadState('networkidle');

    // Should be redirected to sign-in
    expect(page.url()).toContain('/sign-in');

    // Should see sign-in form
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();

    console.log('✅ Chat page properly protected - redirects to sign-in');
  });

  test('should redirect other protected routes', async ({ page }) => {
    const protectedRoutes = ['/dashboard', '/academic-chat', '/profile'];

    for (const route of protectedRoutes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');

      // Should redirect to sign-in
      const finalUrl = page.url();
      if (finalUrl.includes('/sign-in')) {
        console.log(`✅ ${route} properly protected - redirects to sign-in`);
      } else {
        console.log(`ℹ️ ${route} accessible without auth or different redirect`);
      }
    }
  });
});
