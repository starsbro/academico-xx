import { PlaywrightTestConfig } from '@playwright/test';

// Test configuration specifically for authentication testing
export const authTestConfig: PlaywrightTestConfig = {
  testDir: '../auth',
  timeout: 60000,
  expect: {
    timeout: 15000,
  },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Set up test context
    extraHTTPHeaders: {
      'test-mode': 'true',
    },
  },
  globalSetup: require.resolve('./auth-global-setup.ts'),
  globalTeardown: require.resolve('./auth-global-teardown.ts'),
  projects: [
    {
      name: 'chromium-auth',
      use: { 
        ...require('@playwright/test').devices['Desktop Chrome'],
        // Mock Firebase Auth for testing
        storageState: {
          cookies: [],
          origins: [{
            origin: 'http://localhost:3000',
            localStorage: [{
              name: 'firebase:host:localhost',
              value: 'http://localhost:9099'
            }]
          }]
        }
      },
    },
  ],
};

export default authTestConfig;
