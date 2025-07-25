import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Setting up authentication test environment...');
  
  // Start Firebase emulator if needed
  console.log('📡 Starting Firebase Auth Emulator on port 9099...');
  
  // Create a browser instance for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Navigate to your app
    await page.goto('http://localhost:3000');
    
    // Set up test environment flags
    await page.evaluate(() => {
      window.localStorage.setItem('test-mode', 'true');
      window.localStorage.setItem('firebase:host:localhost', 'http://localhost:9099');
    });
    
    console.log('✅ Test environment configured');
    
  } catch (error) {
    console.error('❌ Failed to set up test environment:', error);
  } finally {
    await browser.close();
  }
}

export default globalSetup;
