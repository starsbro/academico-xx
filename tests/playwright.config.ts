import { defineConfig, devices } from '@playwright/test';

/**
 * Simplified Playwright configuration for easier CI/CD execution
 * Full config available at ./config/playwright.config.ts
 */
export default defineConfig({
  testDir: './e2e',
  
  // Global settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Comprehensive reporting
  reporter: [
    ['html', { outputFolder: './test-results/playwright-html-report', open: 'never' }],
    ['json', { outputFile: './test-results/playwright-results.json' }],
    ['junit', { outputFile: './test-results/playwright-results.xml' }],
    ['line'],
    process.env.CI ? ['github'] : ['list']
  ],
  
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: !!process.env.CI,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Development server for local testing
  webServer: process.env.CI ? undefined : {
    command: 'cd ../frontend && npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
