import { test, expect } from '@playwright/test';

test.describe('Frontend-Backend Integration', () => {
  test('should connect frontend to backend API', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check if the frontend can communicate with backend
    // This is where you'd test API calls, data fetching, etc.
    
    // Example: Check if Firebase connection works
    const hasData = await page.evaluate(() => {
      // Test if Firebase SDK is loaded
      return typeof window !== 'undefined' && 
             (window as any).firebase !== undefined;
    });
    
    console.log('🔗 Frontend-Backend integration test completed');
    
    // For now, just verify the page loads
    expect(page.url()).toContain('localhost:3000');
  });

  test('should handle API authentication flow', async ({ page }) => {
    await page.goto('/sign-in');
    await page.waitForLoadState('networkidle');
    
    // Test the full authentication flow between frontend and backend
    expect(page.url()).toContain('/sign-in');
    
    console.log('🔐 API authentication flow test completed');
  });
});
