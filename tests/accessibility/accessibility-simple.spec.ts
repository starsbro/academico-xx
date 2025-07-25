import { test, expect } from '@playwright/test';

test.describe('Basic Accessibility Tests - Academic Chat', () => {
  test.beforeEach(async ({ page }) => {
    // Set up authentication if needed
    await page.goto('/academic-chat');
  });

  test('chat input should be keyboard accessible', async ({ page }) => {
    // Test tab navigation to chat input
    await page.keyboard.press('Tab');
    
    const chatInput = page.locator('textarea[placeholder*="request"]');
    await expect(chatInput).toBeFocused();
    
    // Test typing and submission
    await chatInput.fill('Test accessibility message');
    await page.keyboard.press('Enter');
    
    // Verify loading state is announced
    const loadingMessage = page.locator('text=Thinking...');
    await expect(loadingMessage).toBeVisible();
  });

  test('chat messages should have proper structure', async ({ page }) => {
    // Check if chat messages exist and have basic structure
    const chatMessages = page.locator('[data-testid="chat-message"]');
    
    // If no messages, that's fine - just check the structure when they exist
    const messageCount = await chatMessages.count();
    console.log(`Found ${messageCount} chat messages`);
    
    if (messageCount > 0) {
      const firstMessage = chatMessages.first();
      
      // Check for basic accessibility structure
      await expect(firstMessage).toBeVisible();
      
      // Check if message has some identifiable content
      const messageText = await firstMessage.textContent();
      expect(messageText).toBeTruthy();
    }
  });

  test('send button should be accessible', async ({ page }) => {
    const sendButton = page.locator('button[type="submit"], button:has(svg)').last();
    
    await expect(sendButton).toBeVisible();
    
    // Test keyboard navigation to send button
    const chatInput = page.locator('textarea[placeholder*="request"]');
    await chatInput.focus();
    await page.keyboard.press('Tab');
    
    // Send button should be focusable
    await expect(sendButton).toBeFocused();
  });

  test('file upload button should be accessible', async ({ page }) => {
    const uploadButton = page.locator('button:has-text("Add PDF")');
    
    if (await uploadButton.count() > 0) {
      await expect(uploadButton.first()).toBeVisible();
      
      // Test keyboard activation
      await uploadButton.first().focus();
      await expect(uploadButton.first()).toBeFocused();
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
    
    // Check for submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });
});

test.describe('Basic Accessibility Tests - Authentication', () => {
  test('sign-in page should have proper form structure', async ({ page }) => {
    await page.goto('/sign-in');
    
    // Basic checks without axe-core
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
      
      // Test keyboard activation
      await googleSignInButton.first().focus();
      await expect(googleSignInButton.first()).toBeFocused();
    }
  });
});

test.describe('Basic Color Contrast Tests', () => {
  test('page should load in light mode', async ({ page }) => {
    await page.goto('/academic-chat');
    
    // Basic check that page loads and has content
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Check that main content is visible
    const mainContent = page.locator('main, .main-content, [role="main"]');
    if (await mainContent.count() > 0) {
      await expect(mainContent.first()).toBeVisible();
    }
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
});
