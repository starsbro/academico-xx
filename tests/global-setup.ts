import { chromium } from '@playwright/test';

/**
 * Global setup for Playwright tests
 * Ensures the frontend server is responding before running tests
 */
async function globalSetup() {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
  
  console.log(`🔧 Global Setup: Verifying server at ${baseURL}`);
  
  // Launch a browser to test connectivity
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Try to navigate to the base URL with retries
    let retries = 5;
    let lastError;
    
    while (retries > 0) {
      try {
        console.log(`📡 Attempting to connect to ${baseURL} (${retries} retries left)`);
        await page.goto(baseURL, { 
          waitUntil: 'networkidle',
          timeout: 30000 
        });
        console.log('✅ Server is responding!');
        break;
      } catch (error) {
        lastError = error;
        retries--;
        if (retries > 0) {
          console.log(`❌ Connection failed, retrying in 5 seconds... (${error instanceof Error ? error.message : error})`);
          await page.waitForTimeout(5000);
        }
      }
    }
    
    if (retries === 0) {
      console.error('❌ Failed to connect to server after multiple attempts');
      console.error('Last error:', lastError && typeof lastError === 'object' && 'message' in lastError ? lastError.message : lastError);
      throw new Error(`Server at ${baseURL} is not responding`);
    }
    
  } finally {
    await browser.close();
  }
  
  console.log('🎉 Global Setup completed successfully');
}

export default globalSetup;
