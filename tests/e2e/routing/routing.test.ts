import { test, expect } from '@playwright/test';
import { AuthHelper } from '../utils/auth-helpers';

// E2E Routing Test: checks that key routes load and display expected content

test.describe('Routing', () => {
  test('Home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/academico|home|chat/i);
    // Optionally check for a visible element unique to your home page
    // await expect(page.getByText('Welcome')).toBeVisible();
  });

  test('Academic Chat page loads (authenticated)', async ({ page }) => {
    const auth = new AuthHelper(page);
    const loggedIn = await auth.requireAuthentication(); // Log in if not already
    console.log('🔑 Authenticated:', loggedIn);
    console.log('🌐 URL after login:', page.url());
    console.log('📝 Page content after login:', await page.content());

    await page.goto('/academic-chat');
    console.log('🌐 URL after goto /academic-chat:', page.url());
    console.log('📝 Page content after goto /academic-chat:', await page.content());
    // Optionally, take a screenshot for debugging
    await page.screenshot({ path: 'debug-academic-chat.png' });

    // Check for a unique element or heading on the chat page
    await expect(page.getByText(/chat|upload|pdf/i)).toBeVisible();
  });

  test('404 page for unknown route', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    // Check for a 404 message or custom not found component
    await expect(page.getByText(/404|not found|page does not exist/i)).toBeVisible();
  });
});
