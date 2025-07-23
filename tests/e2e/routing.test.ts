import { test, expect } from '@playwright/test';

// E2E Routing Test: checks that key routes load and display expected content

test.describe('Routing', () => {
  test('Home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/academico|home|chat/i);
    // Optionally check for a visible element unique to your home page
    // await expect(page.getByText('Welcome')).toBeVisible();
  });

  test('Academic Chat page loads', async ({ page }) => {
    await page.goto('/academic-chat');
    await page.waitForLoadState('networkidle');
    
    // Check where we end up - either on chat page or redirected to sign-in
    const currentUrl = page.url();
    const isOnSignIn = currentUrl.includes('/sign-in');
    const isOnChat = currentUrl.includes('/academic-chat');
    
    if (isOnSignIn) {
      // Protected route correctly redirected to sign-in
      console.log('✅ Protected route working - redirected to sign-in');
      await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    } else if (isOnChat) {
      // Somehow authenticated - check for chat content
      console.log('✅ On chat page - checking content');
      await expect(page.getByRole('heading', { name: /welcome to academico ai|academic chat/i })).toBeVisible();
    } else {
      // Fallback - just verify page loads
      await expect(page).toHaveTitle(/academico/i);
    }
  });

  test('404 page for unknown route', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    // Check for a 404 message or custom not found component
    await expect(page.getByText(/404|not found|page does not exist/i)).toBeVisible();
  });
});
