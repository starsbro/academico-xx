import { defineConfig, devices } from '@playwright/test';

/**
 * Performance test configuration for local development environment
 * Tests AI response times using local frontend and local TypeScript backend server
 */
export default defineConfig({
  testDir: './performance',
  
  // Performance tests should run sequentially to avoid interference
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0, // No retries for performance tests
  workers: 1, // Single worker for consistent performance measurements
  
  // Extended timeouts for AI response testing
  timeout: 180000, // 3 minutes for individual tests (AI can take time)
  expect: {
    timeout: 30000, // 30 seconds for assertions
  },
  
  reporter: [
    ['line'], // Simple line reporter for performance tests
    ['json', { outputFile: './test-results/performance-results.json' }]
  ],
  
  use: {
    // Use local development environment
    baseURL: 'http://localhost:3000', // Frontend dev server
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: false, // Show browser for performance testing
    viewport: { width: 1280, height: 720 },
    actionTimeout: 30000, // 30 seconds for actions
    navigationTimeout: 120000, // 2 minutes for navigation
    // Add custom headers for performance testing
    extraHTTPHeaders: {
      'User-Agent': 'Playwright-Performance-Test'
    }
  },

  projects: [
    {
      name: 'performance-chrome',
      use: { 
        ...devices['Desktop Chrome'],
        // Chrome DevTools for performance monitoring
        launchOptions: {
          args: ['--enable-logging', '--v=1']
        }
      },
    }
  ],

  // Note: Start servers manually before running tests:
  // Terminal 1: cd backend/functions && npx ts-node src/local-server.ts  
  // Terminal 2: cd frontend && npm run dev
  // Terminal 3: Run tests from project root: ./scripts/test-ai-performance.sh
});
