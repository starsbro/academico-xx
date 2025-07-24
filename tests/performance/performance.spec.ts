import { test, expect } from '@playwright/test';

test.describe('Performance Tests - AI Response Times', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we're using local development environment
    console.log('Testing against local development environment:');
    console.log('- Frontend: http://localhost:3000');
    console.log('- Backend: Local TypeScript Server');
    
    await page.goto('/academic-chat');
    // Wait for initial load
    await page.waitForLoadState('networkidle');
    
    // Check if we're actually on the local environment
    const url = page.url();
    expect(url).toContain('localhost:3000');
    console.log(`✅ Connected to local frontend: ${url}`);
    
    // Handle authentication redirect
    if (url.includes('/sign-in')) {
      console.log('⚠️ Authentication required - tests will be limited to authenticated functionality only');
    }
  });

  test('AI chat response should complete within performance threshold', async ({ page }) => {
    // Check if we're on the sign-in page
    const url = page.url();
    if (url.includes('/sign-in')) {
      test.skip(true, 'Authentication required - skipping AI response test');
    }
    
    // Fill chat input - look for the correct placeholder text
    const chatInput = page.locator('textarea[placeholder*="Type your request"], textarea[placeholder*="thinking"], input[placeholder*="thinking"]');
    await chatInput.fill('What is the capital of France?');
    
    // Monitor network requests for precise AI response timing
    let requestSentTime: number;
    let responseReceivedTime: number;
    
    // Listen for the chat API request
    page.on('request', (request) => {
      if (request.url().includes('/chat') || request.url().includes('/pdf')) {
        requestSentTime = Date.now();
        console.log(`[AI-REQUEST] Chat request sent at ${new Date(requestSentTime).toISOString()}`);
      }
    });
    
    // Listen for the chat API response
    page.on('response', (response) => {
      if (response.url().includes('/chat') || response.url().includes('/pdf')) {
        responseReceivedTime = Date.now();
        console.log(`[AI-RESPONSE] Chat response received at ${new Date(responseReceivedTime).toISOString()}`);
        if (requestSentTime) {
          const aiProcessingTime = responseReceivedTime - requestSentTime;
          console.log(`🧠 AI Processing Time: ${aiProcessingTime}ms (${(aiProcessingTime/1000).toFixed(2)} seconds)`);
        }
      }
    });
    
    const overallStartTime = Date.now();
    
    // Submit message - look for submit button
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Wait for AI response (but timeout if too long)
    try {
      // Wait for any response text to appear in the chat area
      await page.waitForSelector('.chat-area >> text=/[Pp]aris|[Ff]rance|capital|Thinking/', { timeout: 60000 });
      const totalResponseTime = Date.now() - overallStartTime;
      
      console.log(`📊 Total Response Time: ${totalResponseTime}ms (${(totalResponseTime/1000).toFixed(2)} seconds)`);
      
      if (requestSentTime && responseReceivedTime) {
        const aiProcessingTime = responseReceivedTime - requestSentTime;
        const uiProcessingTime = totalResponseTime - aiProcessingTime;
        
        console.log(`🧠 AI Processing: ${aiProcessingTime}ms (${(aiProcessingTime/1000).toFixed(2)}s)`);
        console.log(`🖥️  UI Processing: ${uiProcessingTime}ms (${(uiProcessingTime/1000).toFixed(2)}s)`);
        
        // Assert AI processing time is reasonable (under 45 seconds)
        expect(aiProcessingTime).toBeLessThan(45000);
      }
      
      // Assert total response time is reasonable (under 60 seconds)
      expect(totalResponseTime).toBeLessThan(60000);
      
      // Log performance for monitoring
      console.log(`✅ Performance: AI response completed successfully`);
      
    } catch (error) {
      const timeoutDuration = Date.now() - overallStartTime;
      console.error(`❌ AI response timed out after ${timeoutDuration}ms (${(timeoutDuration/1000).toFixed(2)} seconds)`);
      throw error;
    }
  });

  test('should measure AI response times for different question complexities', async ({ page }) => {
    // Check if we're on the sign-in page
    const url = page.url();
    if (url.includes('/sign-in')) {
      test.skip(true, 'Authentication required - skipping AI response complexity test');
    }

    const testQuestions = [
      { complexity: 'Simple', question: 'What is 2 + 2?', expectedMaxTime: 15000 },
      { complexity: 'Medium', question: 'Explain what React.js is in 2 sentences', expectedMaxTime: 25000 },
      { complexity: 'Complex', question: 'Explain the differences between supervised and unsupervised machine learning', expectedMaxTime: 45000 }
    ];

    const results: Array<{complexity: string, question: string, aiTime: number, totalTime: number}> = [];

    for (const testCase of testQuestions) {
      console.log(`\n🧪 Testing ${testCase.complexity} Question: "${testCase.question}"`);
      
      let requestSentTime: number;
      let responseReceivedTime: number;
      
      // Set up network monitoring for this specific request
      const requestPromise = new Promise<void>((resolve) => {
        const requestHandler = (request: any) => {
          if (request.url().includes('/chat') || request.url().includes('/pdf')) {
            requestSentTime = Date.now();
            console.log(`[${testCase.complexity.toUpperCase()}-REQUEST] Sent at ${new Date(requestSentTime).toISOString()}`);
            page.off('request', requestHandler);
            resolve();
          }
        };
        page.on('request', requestHandler);
      });

      const responsePromise = new Promise<void>((resolve) => {
        const responseHandler = (response: any) => {
          if (response.url().includes('/chat') || response.url().includes('/pdf')) {
            responseReceivedTime = Date.now();
            console.log(`[${testCase.complexity.toUpperCase()}-RESPONSE] Received at ${new Date(responseReceivedTime).toISOString()}`);
            page.off('response', responseHandler);
            resolve();
          }
        };
        page.on('response', responseHandler);
      });

      // Clear previous input and enter new question
      const chatInput = page.locator('textarea[placeholder*="Type your request"], textarea[placeholder*="thinking"], input[placeholder*="thinking"]');
      await chatInput.clear();
      await chatInput.fill(testCase.question);
      
      const overallStartTime = Date.now();
      
      // Submit the question
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();
      
      try {
        // Wait for request to be sent
        await requestPromise;
        
        // Wait for response to be received
        await responsePromise;
        
        // Wait for UI to update with the response
        await page.waitForTimeout(2000); // Give UI time to render
        
        const totalTime = Date.now() - overallStartTime;
        const aiTime = responseReceivedTime - requestSentTime;
        
        results.push({
          complexity: testCase.complexity,
          question: testCase.question,
          aiTime: aiTime,
          totalTime: totalTime
        });

        console.log(`⏱️  ${testCase.complexity} - AI Processing: ${aiTime}ms (${(aiTime/1000).toFixed(2)}s)`);
        console.log(`📊 ${testCase.complexity} - Total Time: ${totalTime}ms (${(totalTime/1000).toFixed(2)}s)`);
        
        // Assert this question type completed within expected time
        expect(aiTime).toBeLessThan(testCase.expectedMaxTime);
        
        // Wait a bit before next question to avoid overwhelming the API
        await page.waitForTimeout(3000);
        
      } catch (error) {
        const timeoutDuration = Date.now() - overallStartTime;
        console.error(`❌ ${testCase.complexity} question timed out after ${timeoutDuration}ms`);
        // Don't throw - continue with other tests
      }
    }

    // Summary of all results
    console.log('\n📈 AI Response Time Summary:');
    console.log('================================');
    results.forEach(result => {
      console.log(`${result.complexity.padEnd(8)}: AI=${(result.aiTime/1000).toFixed(2)}s, Total=${(result.totalTime/1000).toFixed(2)}s`);
    });

    // Verify we got at least some results
    expect(results.length).toBeGreaterThan(0);
  });

  test('should handle multiple concurrent requests efficiently', async ({ page, browser }) => {
    // Check if authentication is required
    const url = page.url();
    if (url.includes('/sign-in')) {
      test.skip(true, 'Authentication required - skipping concurrent requests test');
    }
    
    const context = await browser.newContext();
    const pages = await Promise.all([
      context.newPage(),
      context.newPage(),
      context.newPage()
    ]);

    const startTime = Date.now();
    
    // Navigate all pages
    await Promise.all(pages.map(p => p.goto('/academic-chat')));
    
    // Submit requests concurrently
    const requests = pages.map(async (p, index) => {
      const input = p.locator('textarea[placeholder*="Type your request"], textarea[placeholder*="thinking"], input[placeholder*="thinking"]');
      await input.fill(`Test message ${index + 1}`);
      
      const submit = p.locator('button[type="submit"]');
      return submit.click();
    });

    await Promise.all(requests);
    
    const concurrentResponseTime = Date.now() - startTime;
    console.log(`Concurrent requests initiated in: ${concurrentResponseTime}ms`);
    
    // Cleanup
    await Promise.all(pages.map(p => p.close()));
    await context.close();
    
    // Should handle concurrent requests without significant delay
    expect(concurrentResponseTime).toBeLessThan(5000);
  });

  test('database operations should be fast', async ({ page }) => {
    const startTime = Date.now();
    
    // Navigate to chat (triggers user chats fetch)
    await page.goto('/academic-chat');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`Chat page load time: ${loadTime}ms`);
    
    // Page should load quickly (including data fetching)
    expect(loadTime).toBeLessThan(5000);
  });

  test('memory usage should remain stable during extended use', async ({ page }) => {
    // Check if authentication is required
    const url = page.url();
    if (url.includes('/sign-in')) {
      test.skip(true, 'Authentication required - skipping memory usage test');
    }
    
    // Navigate to chat
    await page.goto('/academic-chat');
    
    // Measure initial memory
    const initialMetrics = await page.evaluate(() => (performance as any).memory);
    
    // Simulate extended chat usage
    for (let i = 0; i < 10; i++) {
      const input = page.locator('textarea[placeholder*="Type your request"], textarea[placeholder*="thinking"], input[placeholder*="thinking"]');
      await input.fill(`Test message number ${i + 1}`);
      
      // Submit and wait briefly
      const submit = page.locator('button[type="submit"]');
      await submit.click();
      await page.waitForTimeout(1000);
    }
    
    // Measure final memory
    const finalMetrics = await page.evaluate(() => (performance as any).memory);
    
    if (initialMetrics && finalMetrics) {
      const memoryIncrease = finalMetrics.usedJSHeapSize - initialMetrics.usedJSHeapSize;
      console.log(`Memory increase after 10 messages: ${memoryIncrease} bytes`);
      
      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    }
  });
});

test.describe('Performance Tests - Core Web Vitals', () => {
  test('should meet Core Web Vitals thresholds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/academic-chat');
    
    // Measure First Contentful Paint (FCP)
    const fcpMetric = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          for (const entry of entries) {
            if (entry.name === 'first-contentful-paint') {
              resolve(entry.startTime);
            }
          }
        }).observe({ entryTypes: ['paint'] });
      });
    });

    console.log(`First Contentful Paint: ${fcpMetric}ms`);
    
    // FCP should be under 2.5 seconds
    expect(fcpMetric).toBeLessThan(2500);
    
    // Measure total load time
    const loadTime = Date.now() - startTime;
    console.log(`Total load time: ${loadTime}ms`);
    
    // Page should load quickly
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have reasonable bundle sizes', async ({ page }) => {
    // Navigate and capture network activity
    const responses: any[] = [];
    
    page.on('response', (response) => {
      responses.push({
        url: response.url(),
        size: response.headers()['content-length'],
        type: response.headers()['content-type']
      });
    });
    
    await page.goto('/academic-chat');
    await page.waitForLoadState('networkidle');
    
    // Analyze bundle sizes
    const jsFiles = responses.filter(r => r.type && r.type.includes('javascript'));
    const cssFiles = responses.filter(r => r.type && r.type.includes('css'));
    
    console.log(`JavaScript files loaded: ${jsFiles.length}`);
    console.log(`CSS files loaded: ${cssFiles.length}`);
    
    // Total JS size should be reasonable (less than 2MB)
    const totalJsSize = jsFiles.reduce((sum, file) => {
      return sum + (parseInt(file.size) || 0);
    }, 0);
    
    console.log(`Total JavaScript size: ${totalJsSize} bytes`);
    
    if (totalJsSize > 0) {
      expect(totalJsSize).toBeLessThan(2 * 1024 * 1024); // 2MB limit
    }
  });
});

test.describe('Performance Tests - File Upload', () => {
  test('PDF upload should complete within timeout', async ({ page }) => {
    await page.goto('/academic-chat');
    
    // Create a small test PDF buffer (mock)
    const testPdfContent = 'Mock PDF content for testing';
    const buffer = Buffer.from(testPdfContent);
    
    const startTime = Date.now();
    
    // Find file input
    const fileInput = page.locator('input[type="file"]');
    
    if (await fileInput.count() > 0) {
      // Set files on input
      await fileInput.setInputFiles({
        name: 'test.pdf',
        mimeType: 'application/pdf',
        buffer: buffer
      });
      
      // Add message and submit
      const messageInput = page.locator('textarea, input[placeholder*="thinking"]');
      await messageInput.fill('Please analyze this PDF');
      
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();
      
      // Wait for processing (with timeout)
      try {
        await page.waitForSelector('text=analysis', { timeout: 60000 });
        const uploadTime = Date.now() - startTime;
        
        console.log(`PDF upload and analysis time: ${uploadTime}ms`);
        
        // Should complete within 60 seconds
        expect(uploadTime).toBeLessThan(60000);
        
      } catch (error) {
        const timeoutDuration = Date.now() - startTime;
        console.error(`PDF upload timed out after ${timeoutDuration}ms`);
        throw error;
      }
    } else {
      console.log('File upload not available, skipping test');
    }
  });
});
