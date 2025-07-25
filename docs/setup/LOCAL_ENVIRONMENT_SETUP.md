# 🔧 Local Development Environment Setup for Performance Testing

## Quick Start (3 commands)

```bash
# Terminal 1: Start local TypeScript backend server
cd backend/functions && npx ts-node src/local-server.ts

# Terminal 2: Start frontend dev server
cd frontend && npm run dev

# Terminal 3: Run performance tests
./scripts/test-ai-performance.sh
```

---

## Detailed Setup Instructions

### **Option 1: Using Local TypeScript Server (Recommended for PDF uploads)**

#### **Step 1: Start Backend with Local TypeScript Server**

```bash
# From project root
cd backend/functions
npx ts-node src/local-server.ts

# You should see:
# Local Express server running on http://localhost:5050
# Connected to Firebase Storage for PDF uploads
```

#### **Step 2: Start Frontend**

```bash
# In a new terminal
cd frontend
npm run dev

# You should see:
# ▲ Next.js 14.x.x
# - Local:        http://localhost:3000
```

#### **Step 3: Verify Environment**

- Frontend: http://localhost:3000 ✅
- Backend API: http://localhost:5050 ✅
- Firebase Storage: Connected for PDF uploads ✅

---

### **Option 2: Using Firebase Emulators (Alternative - no PDF uploads)**

#### **Step 1: Start Backend with Firebase Emulators**

```bash
# From project root
npm run dev

# You should see:
# ✔  functions: Emulator started at http://localhost:5001
# ✔  auth: Emulator started at http://localhost:9099
# ✔  firestore: Emulator started at http://localhost:8080
# ✔  ui: Emulator UI running at http://localhost:4000
```

#### **Step 2: Start Frontend**

```bash
# In a new terminal
cd frontend
npm run dev

# You should see:
# ▲ Next.js 14.x.x
# - Local:        http://localhost:3000
```

#### **Step 3: Verify Environment**

- Frontend: http://localhost:3000 ✅
- Backend API: http://localhost:5001/academico-ai/us-central1/api ✅
- Firebase Auth: http://localhost:9099 ✅
- Firestore: http://localhost:8080 ✅

---

### **Option 3: Using Compiled Local Server**

#### **Step 1: Build and Start Backend**

```bash
# From project root
cd backend/functions
npm run dev:local

# You should see:
# Local Express server running on http://localhost:5050
```

#### **Step 2: Start Frontend**

```bash
cd frontend
npm run dev
```

---

## Performance Test Commands

### **Quick Performance Check**

```bash
# Automated test with local environment
./scripts/test-ai-performance.sh
```

### **Manual Performance Tests**

```bash
cd tests

# Run performance tests against local environment
npm run test:performance:local:headed

# Run specific AI response test
npm run test:performance:ai:headed

# Run with visible browser for debugging
npx playwright test performance/performance.spec.ts --config=performance.config.ts --headed --debug
```

---

## Environment Verification

### **Check All Services Are Running:**

#### **Frontend (http://localhost:3000)**

```bash
curl -s http://localhost:3000 | grep -q "Academico" && echo "✅ Frontend OK" || echo "❌ Frontend not running"
```

#### **Local TypeScript Backend Server**

```bash
# TypeScript server (primary for PDF uploads)
curl -s http://localhost:5050 > /dev/null && echo "✅ Local TS Backend OK" || echo "❌ Local TS Backend not running"

# Alternative: compiled server
curl -s http://localhost:5000 > /dev/null && echo "✅ Compiled Backend OK" || echo "❌ Compiled Backend not running"
```

#### **Firebase Emulators (if using)**

```bash
# Auth emulator
curl -s http://localhost:9099 > /dev/null && echo "✅ Auth Emulator OK" || echo "❌ Auth Emulator not running"

# Firestore emulator
curl -s http://localhost:8080 > /dev/null && echo "✅ Firestore Emulator OK" || echo "❌ Firestore Emulator not running"
```

---

## Troubleshooting Local Environment

### **Common Issues:**

#### **1. Frontend not starting (port 3000 in use)**

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
cd frontend && npm run dev -- -p 3001
```

#### **2. Local backend server not starting**

```bash
# Check if TypeScript server starts properly
cd backend/functions
npx ts-node src/local-server.ts

# Or try compiled version
npm run dev:local

# Check if ports are in use
lsof -i :5050,5000
```

#### **3. Firebase Storage not accessible**

```bash
# Verify Firebase credentials
echo $GOOGLE_APPLICATION_CREDENTIALS

# Check Firebase project configuration
firebase projects:list
```

#### **4. Performance tests failing**

```bash
# Verify environment variables
echo $NEXT_PUBLIC_BACKEND_URL

# Check if all services respond
curl http://localhost:3000
curl http://localhost:5050
```

---

## Performance Testing Best Practices

### **Before Running Tests:**

1. ✅ Ensure no other apps using ports 3000, 5001, 9099, 8080
2. ✅ Clear browser cache and close other browser windows
3. ✅ Close resource-heavy applications
4. ✅ Use wired internet connection if possible

### **During Testing:**

1. 📊 Monitor console logs for performance metrics
2. 🔍 Watch Network tab in DevTools for request timing
3. 📈 Note response times for different question complexities
4. ⏱️ Test both simple and complex AI questions

### **After Testing:**

1. 📝 Document any performance regressions
2. 🐛 Report issues with timing logs and browser console
3. 📊 Compare results with previous test runs
4. 🔄 Re-run tests to verify consistency

---

## Expected Performance with Local Environment

### **Baseline Performance (Local Development):**

- **Simple questions** (e.g., "What is 2+2?"): 3-10 seconds
- **Medium questions** (e.g., "Explain React"): 8-20 seconds
- **Complex questions** (e.g., "Detailed ML explanation"): 15-45 seconds
- **Timeout threshold**: 120 seconds with user feedback

### **Performance Monitoring:**

- All requests logged with `[CHAT-REQUEST]`, `[CHAT-RESPONSE]`, `[CHAT-COMPLETE]`
- Network requests visible in DevTools
- Firebase emulator logs show function execution times
- Graceful timeout handling after 2 minutes

---

## Quick Environment Health Check

Run this one-liner to verify everything is working:

```bash
./scripts/test-ai-performance.sh 2>&1 | grep -E "(✅|❌|Performance|response time)"
```

Expected output:

````
## Quick Environment Health Check

Run this one-liner to verify everything is working:
```bash
./scripts/test-ai-performance.sh 2>&1 | grep -E "(✅|❌|Performance|response time)"
````

Expected output:

```
✅ Frontend dev server is running (http://localhost:3000)
✅ Local backend server is running (http://localhost:5050)
✅ AI Response Performance Tests PASSED!
🎯 Performance Improvements Verified
```

## Manual Testing Commands

```bash
# Quick setup instructions
./scripts/quick-setup-local.sh

# Manual browser testing guide
./scripts/test-ai-manual.sh

# Automated performance tests (all environments)
./scripts/test-ai-performance.sh

# Performance tests with visible browser (debugging)
cd tests && npm run test:performance:local:headed
```

```

```
