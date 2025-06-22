import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display sign-in page correctly', async ({ page }) => {
    await page.goto('/sign-in');
    await page.waitForLoadState('networkidle');

    // Verify we're on the sign-in page
    expect(page.url()).toContain('/sign-in');

    // Check for sign-in form elements
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('input[placeholder="Enter your email"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Enter your password"]')).toBeVisible();

    console.log('✅ Sign-in form displays correctly');
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/sign-in');
    await page.waitForLoadState('networkidle');

    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"], button:has-text("Sign in")').first();
    await submitButton.click();

    // Should stay on sign-in page (form validation prevents submission)
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/sign-in');

    console.log('✅ Form validation works');
  });

  test('should allow typing in form fields', async ({ page }) => {
    await page.goto('/sign-in');
    await page.waitForLoadState('networkidle');

    // Fill in the form
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'testpassword123');

    // Verify values were entered
    expect(await page.inputValue('#email')).toBe('test@example.com');
    expect(await page.inputValue('#password')).toBe('testpassword123');

    console.log('✅ Form fields accept input');
  });
});
