import { test } from '@playwright/test';

test.describe('Chat Interface Debug', () => {
  test('debug chat page loading', async ({ page }) => {
    // Enable console logging to see what's happening
    page.on('console', (msg) => console.log(`🔍 Console: ${msg.text()}`));
    page.on('pageerror', (error) => console.log(`❌ Page Error: ${error.message}`));

    await page.goto('/academic-chat');
    await page.waitForLoadState('networkidle');

    // Take a screenshot to see what we're working with
    await page.screenshot({ path: 'debug-chat-page.png', fullPage: true });

    // Debug: What's actually on the page?
    // const pageContent = await page.content();
    console.log('📄 Page title:', await page.title());
    console.log('🔗 Current URL:', page.url());

    // Check for common chat elements
    const inputElements = await page.locator('input, textarea').count();
    const buttonElements = await page.locator('button').count();
    const chatElements = await page.locator('[class*="chat"], [id*="chat"], [data-testid*="chat"]').count();

    console.log(`📊 Found ${inputElements} inputs, ${buttonElements} buttons, ${chatElements} chat elements`);

    // List all inputs and their attributes
    const inputs = page.locator('input, textarea');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const placeholder = await input.getAttribute('placeholder');
      const type = await input.getAttribute('type');
      const id = await input.getAttribute('id');
      const className = await input.getAttribute('class');

      console.log(`🔍 Input ${i}: type="${type}", placeholder="${placeholder}", id="${id}", class="${className}"`);
    }
  });

  test('check if page redirects or requires auth', async ({ page }) => {
    await page.goto('/academic-chat');
    await page.waitForLoadState('networkidle');

    const finalUrl = page.url();
    console.log('🔗 Final URL after navigation:', finalUrl);

    // Check if we got redirected to login
    if (finalUrl.includes('signin') || finalUrl.includes('login') || finalUrl.includes('auth')) {
      console.log('🔐 Redirected to authentication - chat requires login');
    }

    // Check for error messages
    const errorText = await page.locator('text=/error|Error|not found|404|unauthorized/i').count();
    if (errorText > 0) {
      console.log('❌ Found error messages on page');
    }
  });
});
