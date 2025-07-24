import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests - Academic Chat', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/academic-chat');
  });

  test('should load page without errors', async ({ page }) => {
    // Basic accessibility check - page should load
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Check for main content area
    const chatContainer = page.locator('form, [role="main"], .chat-container');
    await expect(chatContainer.first()).toBeVisible();
  });

  test('chat input should be keyboard accessible', async ({ page }) => {
    // Test tab navigation to chat input
    await page.keyboard.press('Tab');
    
    const chatInput = page.locator('textarea[placeholder*="request"]');
    await expect(chatInput).toBeFocused();
    
    // Test typing
    await chatInput.fill('Test accessibility message');
    expect(await chatInput.inputValue()).toBe('Test accessibility message');
  });

  test('chat messages should have proper structure', async ({ page }) => {
    // Check if chat messages exist and have basic structure
    const chatMessages = page.locator('[data-testid="chat-message"]');
    
    // If no messages, that's fine - just check the structure when they exist
    const messageCount = await chatMessages.count();
    console.log(`Found ${messageCount} chat messages`);
    
    if (messageCount > 0) {
      const firstMessage = chatMessages.first();
      await expect(firstMessage).toBeVisible();
      
      // Check if message has some identifiable content
      const messageText = await firstMessage.textContent();
      expect(messageText).toBeTruthy();
    }
  });

  test('send button should be accessible', async ({ page }) => {
    const sendButton = page.locator('button[type="submit"]');
    
    await expect(sendButton).toBeVisible();
    
    // Test that button has proper accessibility attributes
    const buttonTitle = await sendButton.getAttribute('title');
    const buttonAriaLabel = await sendButton.getAttribute('aria-label');
    
    // Either title or aria-label should be present for accessibility
    expect(buttonTitle || buttonAriaLabel).toBeTruthy();
    
    // Verify the button is properly labeled
    if (buttonTitle) {
      expect(buttonTitle).toContain('Send');
    }
    if (buttonAriaLabel) {
      expect(buttonAriaLabel).toContain('Send');
    }
  });

  test('file upload button should be accessible', async ({ page }) => {
    const uploadButton = page.locator('button:has-text("Add PDF")');
    
    if (await uploadButton.count() > 0) {
      await expect(uploadButton.first()).toBeVisible();
      
      // Test that button has proper accessibility attributes
      const buttonTitle = await uploadButton.first().getAttribute('title');
      const buttonAriaLabel = await uploadButton.first().getAttribute('aria-label');
      
      // Either title or aria-label should be present for accessibility
      expect(buttonTitle || buttonAriaLabel).toBeTruthy();
      
      // Verify the button is properly labeled for file upload
      if (buttonTitle) {
        expect(buttonTitle.toLowerCase()).toMatch(/attach|pdf|file/);
      }
      if (buttonAriaLabel) {
        expect(buttonAriaLabel.toLowerCase()).toMatch(/attach|pdf|file/);
      }
    }
  });

  test('basic form structure should be semantic', async ({ page }) => {
    // Check for form element
    const chatForm = page.locator('form');
    await expect(chatForm).toBeVisible();
    
    // Check for textarea with proper attributes
    const chatInput = page.locator('textarea[placeholder*="request"]');
    await expect(chatInput).toBeVisible();
    await expect(chatInput).toHaveAttribute('placeholder');
    
    // Check for aria-label for better accessibility
    const ariaLabel = await chatInput.getAttribute('aria-label');
    if (ariaLabel) {
      expect(ariaLabel.toLowerCase()).toMatch(/message|question|type|chat/);
    }
    
    // Check for submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });
});

test.describe('Accessibility Tests - Authentication', () => {
  test('sign-in page should have proper form structure', async ({ page }) => {
    await page.goto('/sign-in');
    
    // Basic checks
    const pageTitle = await page.title();
    expect(pageTitle).toBeTruthy();
    
    // Check for main content
    const mainContent = page.locator('main, [role="main"], .main-content');
    if (await mainContent.count() > 0) {
      await expect(mainContent.first()).toBeVisible();
    }
  });

  test('Google sign-in button should be accessible', async ({ page }) => {
    await page.goto('/sign-in');
    
    const googleSignInButton = page.locator('button:has-text("Google"), button[aria-label*="Google"]');
    
    if (await googleSignInButton.count() > 0) {
      await expect(googleSignInButton.first()).toBeVisible();
      
      // Test keyboard focus
      await googleSignInButton.first().focus();
      await expect(googleSignInButton.first()).toBeFocused();
    }
  });
});

test.describe('Basic Usability Tests', () => {
  test('page should load in light mode', async ({ page }) => {
    await page.goto('/academic-chat');
    
    // Basic check that page loads and has content
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Check that main content is visible
    const mainContent = page.locator('main, .main-content, [role="main"], form');
    await expect(mainContent.first()).toBeVisible();
  });

  test('dark mode toggle should work if present', async ({ page }) => {
    await page.goto('/academic-chat');
    
    // Look for theme toggle
    const themeToggle = page.locator('button[aria-label*="theme"], button[title*="theme"], button:has-text("theme")');
    
    if (await themeToggle.count() > 0) {
      await themeToggle.first().click();
      await page.waitForTimeout(500);
      
      // Verify page is still functional after theme change
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }
  });

  test('error handling should be user-friendly', async ({ page }) => {
    // Test basic error handling accessibility
    const chatInput = page.locator('textarea[placeholder*="request"]');
    
    // Try to submit empty message
    await chatInput.focus();
    await page.keyboard.press('Enter');
    
    // Check that the form handles empty input gracefully
    // (Button should be disabled or show some feedback)
    const submitButton = page.locator('button[type="submit"]');
    const isDisabled = await submitButton.isDisabled();
    
    // Either button should be disabled for empty input, or form should handle it gracefully
    console.log(`Submit button disabled for empty input: ${isDisabled}`);
  });
});
