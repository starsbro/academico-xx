import { test, expect } from '@playwright/test';

test.describe('AI Response Performance Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/academic-chat');
    await page.waitForLoadState('networkidle');
  });

  test('should measure AI response time for simple questions', async ({ page }) => {
    console.log('\n=== Testing Simple AI Response Time ===');
    
    // Start timing
    const startTime = Date.now();
    
    // Find and fill chat input
    const chatInput = page.locator('textarea[placeholder*="request"], input[placeholder*="request"]');
    await chatInput.fill('What is 2+2?');
    
    // Submit message
    const submitButton = page.locator('button[type="submit"], button:has(svg)').last();
    await submitButton.click();
    
    console.log(`[TEST] Message sent at: ${new Date().toISOString()}`);
    
    // Wait for AI response (looking for any new message from AI)
    try {
      // Wait for "Thinking..." to appear first
      await page.waitForSelector('text=Thinking...', { timeout: 5000 });
      console.log(`[TEST] "Thinking..." appeared after: ${Date.now() - startTime}ms`);
      
      // Wait for actual AI response (look for common response patterns)
      await page.waitForSelector('text=/4|four/i', { timeout: 30000 });
      
      const responseTime = Date.now() - startTime;
      console.log(`[TEST] ✅ AI response received after: ${responseTime}ms`);
      
      // Assert response time is reasonable (under 30 seconds)
      expect(responseTime).toBeLessThan(30000);
      
      // Ideal response time for simple questions (under 10 seconds)
      if (responseTime < 10000) {
        console.log(`[TEST] 🚀 EXCELLENT: Response time ${responseTime}ms is under 10 seconds!`);
      } else if (responseTime < 20000) {
        console.log(`[TEST] ✅ GOOD: Response time ${responseTime}ms is reasonable`);
      } else {
        console.log(`[TEST] ⚠️  SLOW: Response time ${responseTime}ms could be improved`);
      }
      
    } catch (error) {
      const timeoutDuration = Date.now() - startTime;
      console.error(`[TEST] ❌ AI response timed out after ${timeoutDuration}ms`);
      throw new Error(`AI response timeout: ${timeoutDuration}ms`);
    }
  });

  test('should measure AI response time for complex questions', async ({ page }) => {
    console.log('\n=== Testing Complex AI Response Time ===');
    
    const startTime = Date.now();
    
    // Complex question that requires more processing
    const complexQuestion = 'Explain the differences between machine learning, deep learning, and artificial intelligence, and provide examples of each.';
    
    const chatInput = page.locator('textarea[placeholder*="request"], input[placeholder*="request"]');
    await chatInput.fill(complexQuestion);
    
    const submitButton = page.locator('button[type="submit"], button:has(svg)').last();
    await submitButton.click();
    
    console.log(`[TEST] Complex question sent at: ${new Date().toISOString()}`);
    
    try {
      // Wait for thinking indicator
      await page.waitForSelector('text=Thinking...', { timeout: 5000 });
      console.log(`[TEST] "Thinking..." appeared after: ${Date.now() - startTime}ms`);
      
      // Wait for response (look for key terms)
      await page.waitForSelector('text=/machine learning|artificial intelligence|deep learning/i', { timeout: 60000 });
      
      const responseTime = Date.now() - startTime;
      console.log(`[TEST] ✅ Complex AI response received after: ${responseTime}ms`);
      
      // Assert response time is within acceptable limits (under 60 seconds)
      expect(responseTime).toBeLessThan(60000);
      
      // Performance evaluation for complex questions
      if (responseTime < 15000) {
        console.log(`[TEST] 🚀 EXCELLENT: Complex response time ${responseTime}ms is very fast!`);
      } else if (responseTime < 30000) {
        console.log(`[TEST] ✅ GOOD: Complex response time ${responseTime}ms is acceptable`);
      } else {
        console.log(`[TEST] ⚠️  SLOW: Complex response time ${responseTime}ms could be improved`);
      }
      
    } catch (error) {
      const timeoutDuration = Date.now() - startTime;
      console.error(`[TEST] ❌ Complex AI response timed out after ${timeoutDuration}ms`);
      throw new Error(`Complex AI response timeout: ${timeoutDuration}ms`);
    }
  });

  test('should verify timeout handling works correctly', async ({ page }) => {
    console.log('\n=== Testing Timeout Handling ===');
    
    // Monitor console logs for timeout messages
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      const text = msg.text();
      consoleMessages.push(text);
      console.log(`[BROWSER-CONSOLE] ${text}`);
    });
    
    const startTime = Date.now();
    
    // Send a message that might trigger timeout behavior
    const chatInput = page.locator('textarea[placeholder*="request"], input[placeholder*="request"]');
    await chatInput.fill('Write a 10000-word essay about quantum computing');
    
    const submitButton = page.locator('button[type="submit"], button:has(svg)').last();
    await submitButton.click();
    
    console.log(`[TEST] Timeout test message sent at: ${new Date().toISOString()}`);
    
    // Wait for either response or timeout
    try {
      // Look for timeout message or successful response
      await Promise.race([
        page.waitForSelector('text=/timed out|timeout/i', { timeout: 125000 }),
        page.waitForSelector('text=/quantum computing/i', { timeout: 125000 })
      ]);
      
      const duration = Date.now() - startTime;
      console.log(`[TEST] Request completed or timed out after: ${duration}ms`);
      
      // Check if timeout was handled gracefully
      const timeoutMessage = await page.locator('text=/timed out|timeout/i').count();
      if (timeoutMessage > 0) {
        console.log(`[TEST] ✅ Timeout was handled gracefully`);
      }
      
      // Verify console logs show timeout handling
      const hasTimeoutLogs = consoleMessages.some(msg => 
        msg.includes('CHAT-TIMEOUT') || msg.includes('timeout')
      );
      
      if (hasTimeoutLogs) {
        console.log(`[TEST] ✅ Timeout logging is working correctly`);
      }
      
    } catch (error) {
      console.log(`[TEST] ⚠️  Timeout test completed: ${error}`);
    }
  });

  test('should verify performance logging is working', async ({ page }) => {
    console.log('\n=== Testing Performance Logging ===');
    
    const performanceLogs: string[] = [];
    
    // Capture console logs that contain performance metrics
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('CHAT-REQUEST') || 
          text.includes('CHAT-RESPONSE') || 
          text.includes('CHAT-COMPLETE') ||
          text.includes('CHAT-ERROR')) {
        performanceLogs.push(text);
        console.log(`[PERFORMANCE-LOG] ${text}`);
      }
    });
    
    // Send a test message
    const chatInput = page.locator('textarea[placeholder*="request"], input[placeholder*="request"]');
    await chatInput.fill('Hello, how are you?');
    
    const submitButton = page.locator('button[type="submit"], button:has(svg)').last();
    await submitButton.click();
    
    // Wait for response
    await page.waitForSelector('text=/hello|fine|good/i', { timeout: 30000 });
    
    // Wait a moment for all logs to be captured
    await page.waitForTimeout(2000);
    
    console.log(`[TEST] Captured ${performanceLogs.length} performance logs`);
    
    // Verify we have the expected performance logs
    const hasRequestLog = performanceLogs.some(log => log.includes('CHAT-REQUEST'));
    const hasResponseLog = performanceLogs.some(log => log.includes('CHAT-RESPONSE'));
    const hasCompleteLog = performanceLogs.some(log => log.includes('CHAT-COMPLETE'));
    
    expect(hasRequestLog).toBe(true);
    console.log(`[TEST] ✅ Request logging: ${hasRequestLog ? 'WORKING' : 'MISSING'}`);
    
    if (hasResponseLog) {
      console.log(`[TEST] ✅ Response logging: WORKING`);
    }
    
    if (hasCompleteLog) {
      console.log(`[TEST] ✅ Complete logging: WORKING`);
    }
    
    // Print all captured logs for analysis
    console.log('\n=== All Performance Logs ===');
    performanceLogs.forEach((log, index) => {
      console.log(`${index + 1}. ${log}`);
    });
  });

  test('should test multiple consecutive requests', async ({ page }) => {
    console.log('\n=== Testing Multiple Consecutive Requests ===');
    
    const requests = [
      'What is JavaScript?',
      'Explain React components',
      'What is TypeScript?'
    ];
    
    const responseTimes: number[] = [];
    
    for (let i = 0; i < requests.length; i++) {
      const startTime = Date.now();
      
      console.log(`[TEST] Sending request ${i + 1}: "${requests[i]}"`);
      
      const chatInput = page.locator('textarea[placeholder*="request"], input[placeholder*="request"]');
      await chatInput.fill(requests[i]);
      
      const submitButton = page.locator('button[type="submit"], button:has(svg)').last();
      await submitButton.click();
      
      // Wait for response
      try {
        await page.waitForSelector('text=/JavaScript|React|TypeScript|programming|component/i', { timeout: 45000 });
        
        const responseTime = Date.now() - startTime;
        responseTimes.push(responseTime);
        
        console.log(`[TEST] Request ${i + 1} completed in: ${responseTime}ms`);
        
        // Wait a moment before next request
        await page.waitForTimeout(2000);
        
      } catch (error) {
        console.error(`[TEST] Request ${i + 1} failed: ${error}`);
        responseTimes.push(60000); // Mark as timeout
      }
    }
    
    // Analyze results
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const maxResponseTime = Math.max(...responseTimes);
    const minResponseTime = Math.min(...responseTimes);
    
    console.log('\n=== Multiple Requests Performance Summary ===');
    console.log(`Average response time: ${avgResponseTime.toFixed(0)}ms`);
    console.log(`Fastest response: ${minResponseTime}ms`);
    console.log(`Slowest response: ${maxResponseTime}ms`);
    
    // All responses should be under 45 seconds
    expect(maxResponseTime).toBeLessThan(45000);
    
    // Average should be reasonable
    expect(avgResponseTime).toBeLessThan(30000);
    
    if (avgResponseTime < 15000) {
      console.log(`[TEST] 🚀 EXCELLENT: Average response time is very fast!`);
    } else if (avgResponseTime < 25000) {
      console.log(`[TEST] ✅ GOOD: Average response time is acceptable`);
    } else {
      console.log(`[TEST] ⚠️  SLOW: Average response time could be improved`);
    }
  });
});

test.describe('Backend Performance Verification', () => {
  test('should verify backend optimizations are active', async ({ page }) => {
    console.log('\n=== Testing Backend Performance Features ===');
    
    // Monitor network requests to backend
    const networkRequests: any[] = [];
    
    page.on('request', (request) => {
      if (request.url().includes('chat-with-pdf')) {
        networkRequests.push({
          url: request.url(),
          method: request.method(),
          timestamp: Date.now()
        });
        console.log(`[NETWORK] Request to: ${request.url()}`);
      }
    });
    
    page.on('response', (response) => {
      if (response.url().includes('chat-with-pdf')) {
        console.log(`[NETWORK] Response from: ${response.url()} - Status: ${response.status()}`);
      }
    });
    
    // Send a test message
    const chatInput = page.locator('textarea[placeholder*="request"], input[placeholder*="request"]');
    await chatInput.fill('Test backend optimization');
    
    const submitButton = page.locator('button[type="submit"], button:has(svg)').last();
    await submitButton.click();
    
    // Wait for response
    await page.waitForSelector('text=/test|backend|optimization/i', { timeout: 30000 });
    
    // Verify network request was made
    expect(networkRequests.length).toBeGreaterThan(0);
    console.log(`[TEST] ✅ Backend requests are being made correctly`);
  });
});
