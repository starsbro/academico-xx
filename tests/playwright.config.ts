import { defineConfig, devices } from '@playwright/test';

/**
 * Simplified Playwright configuration for easier CI/CD execution
 * Full config available at ./config/playwright.config.ts
 */
export default defineConfig({
  testDir: './e2e',
  
  // Global setup to verify server connectivity
  globalSetup: require.resolve('./global-setup.ts'),
  
  // Global settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Increase test timeout for Firebase operations
  timeout: 60000, // 60 seconds for individual tests
  expect: {
    timeout: 10000, // 10 seconds for assertions
  },
  
  // Comprehensive reporting with error handling  
  reporter: process.stdout.isTTY ? [
    ['html', { outputFolder: './playwright-report', open: 'never' }],
    ['json', { outputFile: './test-results/playwright-results.json' }],
    ['junit', { outputFile: './test-results/playwright-results.xml' }],
    ['list'] // Use list reporter for local development with TTY
  ] : [
    ['json', { outputFile: './test-results/playwright-results.json' }],
    ['junit', { outputFile: './test-results/playwright-results.xml' }],
    ['null'] // Null reporter for piped output to completely avoid EPIPE errors
  ],
  
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: !!process.env.CI,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15000,
    navigationTimeout: 60000,
    // Add retry logic for navigation
    extraHTTPHeaders: {
      // Add user agent to help with debugging
      'User-Agent': 'Playwright-E2E-Test'
    }
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

  // Development server for local testing - disabled for now to avoid conflicts
  // webServer: process.env.CI ? undefined : {
  //   command: 'cd ../frontend && npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});
