# 🧪 Manual Testing Guide: AI Response Performance (Local Development)

## 🔧 **Prerequisites: Start Local Development Environment**

### **Step 1: Start Backend (Firebase Emulators)**

```bash
# From project root
npm run dev
# Wait for: "✔  All emulators ready!"
```

### **Step 2: Start Frontend**

```bash
# In a new terminal, from project root
cd frontend
npm run dev
# Wait for: "Local:   http://localhost:3000"
```

### **Step 3: Verify Environment**

- Frontend: http://localhost:3000
- Firebase Auth Emulator: http://localhost:9099
- Firestore Emulator: http://localhost:8080

## 🚀 **Quick Automated Test (Recommended)**

### **First: Ensure Local Environment is Running**

```bash
# Terminal 1: Start backend emulators
npm run dev

# Terminal 2: Start frontend
cd frontend && npm run dev
```

### **Then: Run the Performance Test Script**

```bash
# From project root directory
./scripts/test-ai-performance.sh
```

This script will:

- ✅ Check that local servers are running
- ✅ Run automated performance tests against localhost
- ✅ Measure actual AI response times using local backend
- ✅ Verify timeout handling works with local environment
- ✅ Check performance logging with Firebase emulators
- ✅ Test multiple consecutive requests on local setup

---

## Automated Performance Testing

### **Run Performance Tests Against Local Environment:**

```bash
cd tests

# Test with local frontend + Firebase emulators
npm run test:performance:local:headed

# Or run specific performance test
npx playwright test performance/performance.spec.ts --config=performance.config.ts --headed
```

### **Run All Tests with Performance Monitoring:**

```bash
# Run complete test suite (make sure local environment is running)
npm test

# Run with coverage
npm run test:coverage
```

---

## Performance Benchmarks

### **Before Optimization (What we fixed):**

- ❌ Simple questions: 30-60+ seconds
- ❌ Complex questions: Often timeout (120s+)
- ❌ No timeout handling
- ❌ No performance monitoring
- ❌ Sequential database operations

### **After Optimization (Current target):**

- ✅ Simple questions: 2-15 seconds
- ✅ Complex questions: 10-45 seconds
- ✅ Timeout at 120 seconds with user feedback
- ✅ Comprehensive performance logging
- ✅ Parallel database operations

---

## Console Log Reference

### **Frontend Performance Logs**

```javascript
// Request initiated
[CHAT-REQUEST] Starting chat request at 2025-07-23T10:30:15.123Z

// Response received from backend
[CHAT-RESPONSE] Received response after 12543ms

// Complete operation finished
[CHAT-COMPLETE] Full request completed in 12876ms

// Timeout occurred
[CHAT-TIMEOUT] Request timeout after 120 seconds

// Error handling
[CHAT-ERROR] Request failed after 45000ms: Error message
```

### **Backend Performance Logs (Firebase Console)**

```javascript
// AI processing started
[AI-REQUEST] Starting Gemini API call for prompt length: 145

// AI processing completed
[AI-SUCCESS] Gemini API call completed in 8234ms

// Chat processing
[CHAT-START] Processing general chat for user abc123
[CHAT-COMPLETE] General chat processed in 8567ms
```

---

## Performance Testing Checklist

### **Quick Manual Test (2 minutes)**

- [ ] Send "Hello" - should respond in 2-10 seconds
- [ ] Send "What is AI?" - should respond in 5-20 seconds
- [ ] Check console for performance logs
- [ ] No timeout errors should occur

### **Comprehensive Manual Test (10 minutes)**

- [ ] Test 5 simple questions (under 15s each)
- [ ] Test 3 complex questions (under 45s each)
- [ ] Test one very long prompt (should timeout gracefully at 120s)
- [ ] Verify error messages are user-friendly
- [ ] Check all console logs are present

### **Automated Test Suite**

- [ ] Run: `npm run test:performance`
- [ ] All tests should pass
- [ ] Review performance metrics in output
- [ ] Check for any timeout failures

---

## Troubleshooting Performance Issues

### **If responses are still slow (>30s for simple questions):**

1. **Check Backend Logs:**

   ```bash
   # Check Firebase Functions logs
   firebase functions:log --only api
   ```

2. **Check Network Tab:**

   - Look for slow API requests to `/chat-with-pdf`
   - Check if requests are actually reaching the backend

3. **Check Gemini API Status:**

   - Visit Google Cloud Console
   - Check API quotas and rate limits
   - Verify API key is working

4. **Common Issues:**
   - Gemini API rate limiting
   - Cold start delays in Cloud Functions
   - Network connectivity issues
   - Database connection problems

### **Performance Warning Signs:**

- Console errors about timeouts
- "Thinking..." appears but never gets response
- Network requests taking >60 seconds
- Multiple failed requests in a row

---

## Expected Performance Metrics

### **Response Time Targets:**

| Question Type        | Target Time   | Warning Time | Timeout     |
| -------------------- | ------------- | ------------ | ----------- |
| Simple (1-10 words)  | 2-8 seconds   | 15 seconds   | 120 seconds |
| Medium (11-50 words) | 5-15 seconds  | 25 seconds   | 120 seconds |
| Complex (50+ words)  | 10-30 seconds | 45 seconds   | 120 seconds |
| PDF Analysis         | 15-60 seconds | 90 seconds   | 300 seconds |

### **Success Criteria:**

- ✅ 90% of simple questions under 15 seconds
- ✅ 90% of complex questions under 45 seconds
- ✅ No timeouts for normal-length questions
- ✅ Graceful timeout handling with user feedback
- ✅ Performance logs visible in console

---

## Real-World Testing Scenarios

### **Scenario 1: Student Homework Help**

```
Questions to test:
1. "Help me with algebra homework"
2. "Explain photosynthesis"
3. "What are the causes of World War 1?"

Expected: All responses under 20 seconds
```

### **Scenario 2: Research Assistant**

```
Questions to test:
1. "Compare renewable energy sources"
2. "Explain quantum computing principles"
3. "Analyze the economic impact of AI"

Expected: All responses under 35 seconds
```

### **Scenario 3: Code Help**

```
Questions to test:
1. "How do I write a for loop in Python?"
2. "Explain React hooks"
3. "What is the difference between let and const in JavaScript?"

Expected: All responses under 15 seconds
```

---

## Performance Monitoring Commands

### **Quick Performance Check:**

```bash
# Test simple AI response
curl -X POST http://localhost:3000/api/chat-with-pdf \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}' \
  -w "Total time: %{time_total}s\n"
```

### **Load Testing (Advanced):**

```bash
# Install load testing tool
npm install -g artillery

# Run load test (if you have artillery config)
artillery run load-test-config.yml
```

---

**Test Results Expected:**

- ✅ **90%+ improvement** in response times
- ✅ **Reliable timeout handling**
- ✅ **Clear performance feedback** to users
- ✅ **No more indefinite waiting**

**Time to complete this test: 10-15 minutes**  
**Recommended frequency: After any backend changes**
