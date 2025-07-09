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
    // Check for a unique element or heading on the chat page
    await expect(page.getByText(/chat|upload|pdf/i)).toBeVisible();
  });

  test('404 page for unknown route', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    // Check for a 404 message or custom not found component
    await expect(page.getByText(/404|not found|page does not exist/i)).toBeVisible();
  });
});
