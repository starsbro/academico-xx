import { test, expect } from '@playwright/test';

test.describe('Debug Accessibility Elements', () => {
  test('debug what elements exist on academic-chat page', async ({ page }) => {
    await page.goto('/academic-chat');
    await page.waitForLoadState('networkidle');
    
    // Debug: Print page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Debug: Find any forms
    const forms = page.locator('form');
    const formCount = await forms.count();
    console.log('Number of forms found:', formCount);
    
    // Debug: Find any buttons
    const allButtons = page.locator('button');
    const buttonCount = await allButtons.count();
    console.log('Number of buttons found:', buttonCount);
    
    // Debug: Find submit buttons specifically
    const submitButtons = page.locator('button[type="submit"]');
    const submitCount = await submitButtons.count();
    console.log('Number of submit buttons found:', submitCount);
    
    // Debug: Find textareas
    const textareas = page.locator('textarea');
    const textareaCount = await textareas.count();
    console.log('Number of textareas found:', textareaCount);
    
    // If we find elements, get their attributes
    if (submitCount > 0) {
      const submitButton = submitButtons.first();
      const title = await submitButton.getAttribute('title');
      const ariaLabel = await submitButton.getAttribute('aria-label');
      console.log('Submit button title:', title);
      console.log('Submit button aria-label:', ariaLabel);
    }
    
    if (textareaCount > 0) {
      const textarea = textareas.first();
      const placeholder = await textarea.getAttribute('placeholder');
      const ariaLabel = await textarea.getAttribute('aria-label');
      console.log('Textarea placeholder:', placeholder);
      console.log('Textarea aria-label:', ariaLabel);
    }
    
    // Try to find upload button
    const uploadButtons = page.locator('button:has-text("Add PDF")');
    const uploadCount = await uploadButtons.count();
    console.log('Number of upload buttons found:', uploadCount);
    
    if (uploadCount > 0) {
      const uploadButton = uploadButtons.first();
      const title = await uploadButton.getAttribute('title');
      const ariaLabel = await uploadButton.getAttribute('aria-label');
      console.log('Upload button title:', title);
      console.log('Upload button aria-label:', ariaLabel);
    }
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'debug-page.png' });
    
    // Basic assertion that page loaded
    expect(title).toBeTruthy();
  });
});
