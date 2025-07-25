import { test, expect } from '@playwright/test';

test.describe('Debug Page Content', () => {
  test('debug page HTML content', async ({ page }) => {
    await page.goto('/academic-chat');
    await page.waitForLoadState('networkidle');
    
    // Get the page content
    const content = await page.content();
    console.log('Page HTML length:', content.length);
    
    // Check if it contains chat interface elements
    console.log('Contains "Type your request":', content.includes('Type your request'));
    console.log('Contains "Add PDF":', content.includes('Add PDF'));
    console.log('Contains "Send":', content.includes('Send'));
    console.log('Contains sign-in elements:', content.includes('sign-in') || content.includes('Sign'));
    
    // Get the URL to see if we're redirected
    const url = page.url();
    console.log('Current URL:', url);
    
    // Take a screenshot for visual debugging
    await page.screenshot({ path: 'debug-page-content.png', fullPage: true });
    
    // Get the body text
    const bodyText = await page.locator('body').textContent();
    console.log('Body text (first 500 chars):', bodyText?.substring(0, 500));
    
    expect(url).toBeTruthy();
  });
});
