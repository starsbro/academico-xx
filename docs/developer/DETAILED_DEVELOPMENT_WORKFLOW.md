# 🚀 Comprehensive Development Workflow for Academico-AI

## 📋 **Project Overview**

**Frontend**: Next.js 15 with TypeScript, TailwindCSS  
**Backend**: Firebase Functions with TypeScript  
**Testing**: Playwright for E2E, Local-first approach  
**Deployment**: Firebase Hosting + Cloud Functions  
**Environment**: Auto-detection (localhost ↔ production)

---

## 🔄 **Complete Development Workflow**

### **🌅 Starting Your Development Session**

```bash
# 1. Navigate to project
cd /Users/xingxingxiao/Documents/GitHub/academico-ai

# 2. Pull latest changes
git pull origin main

# 3. Check current branch
git status
# If on chat-ai branch: git checkout main && git pull

# 4. Start development servers
```

#### **Option A: Frontend Only Development**

```bash
# Terminal 1: Frontend (auto-connects to production backend)
cd frontend
npm run dev
# ✅ Runs on http://localhost:3000
# ✅ Auto-uses https://your-backend-url.run.app for backend
```

#### **Option B: Full Local Development**

```bash
# Terminal 1: Frontend
cd frontend
npm run dev
# ✅ Runs on http://localhost:3000

# Terminal 2: Backend
cd backend/functions
npx ts-node src/index.ts
# ✅ Runs on http://localhost:5050
# ✅ Frontend auto-switches to localhost:5050
```

---

## 💻 **Daily Development Cycle**

### **1. Feature Development**

```bash
# Create feature branch (optional)
git checkout -b feature/your-feature-name

# Code your changes...
# ✅ Environment URLs switch automatically
# ✅ No .env.local editing needed!

# Real-time testing while coding:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:5050 (if running locally)
# - Production backend: https://your-backend-url.run.app (fallback)
```

### **2. Pre-Push Validation (ESSENTIAL)**

```bash
# Run before EVERY push - takes 30 seconds
./scripts/dev-check.sh

# What it checks:
# ✅ Frontend linting (ESLint)
# ✅ Frontend build (Next.js production build)
# ✅ Backend linting (TypeScript ESLint)
# ✅ Backend build (TypeScript compilation)
# ✅ Server detection (if running locally)
```

### **3. Commit and Push**

```bash
# If dev-check passed:
git add .
git commit -m "feat: your descriptive commit message"
git push origin feature/your-feature-name
# OR
git push origin main
```

### **4. Optional: Comprehensive Testing**

```bash
# Only when developing complex features
# Requires both servers running

# Start servers if not running:
cd frontend && npm run dev                        # Terminal 1
cd backend/functions && npx ts-node src/index.ts  # Terminal 2

# Run comprehensive tests:
./scripts/test-with-servers.sh                    # Terminal 3

# Individual tests (30s-2min each):
cd tests
npm run local:accessibility    # UI/UX validation
npm run local:performance     # Response time testing
npm run local:smoke          # Basic functionality
npm run local:debug         # Visual debugging
```

---

## 🛠️ **Development Scenarios**

### **Scenario 1: UI/Frontend Changes**

```bash
# 1. Start frontend only
cd frontend && npm run dev

# 2. Make your UI changes
# - Components in src/components/
# - Pages in src/app/
# - Styles with TailwindCSS

# 3. Test accessibility
cd tests && npm run local:accessibility

# 4. Validate before push
./scripts/dev-check.sh

# 5. Deploy
git add . && git commit -m "ui: improve chat interface" && git push
```

### **Scenario 2: Backend API Changes**

```bash
# 1. Start both servers for testing
cd frontend && npm run dev                        # Terminal 1
cd backend/functions && npx ts-node src/index.ts  # Terminal 2

# 2. Make backend changes
# - Routes in backend/functions/src/routes/
# - Models in backend/functions/src/models/

# 3. Test API with frontend
# Frontend automatically uses localhost:5050

# 4. Test performance
cd tests && npm run local:performance

# 5. Validate before push
./scripts/dev-check.sh

# 6. Deploy
git add . && git commit -m "api: optimize chat response" && git push
```

### **Scenario 3: Full-Stack Feature**

```bash
# 1. Start all servers
cd frontend && npm run dev                        # Terminal 1
cd backend/functions && npx ts-node src/index.ts  # Terminal 2

# 2. Develop iteratively
# - Add backend endpoint
# - Test with frontend
# - Add frontend UI
# - Test integration

# 3. Comprehensive testing
./scripts/test-with-servers.sh                    # Terminal 3

# 4. Pre-push validation
./scripts/dev-check.sh

# 5. Deploy
git add . && git commit -m "feat: add PDF upload with AI analysis" && git push
```

### **Scenario 4: Bug Fixes**

```bash
# 1. Reproduce the bug
# Start minimal setup needed

# 2. Fix the bug
# Make targeted changes

# 3. Quick validation
./scripts/dev-check.sh

# 4. Optional: Test affected area
cd tests
npm run local:accessibility   # For UI bugs
npm run local:performance     # For performance bugs

# 5. Deploy fix
git add . && git commit -m "fix: resolve chat message ordering" && git push
```

---

## 🔧 **Key File Locations**

### **Frontend Structure**

```
frontend/
├── src/
│   ├── app/                    # Next.js 13+ app router
│   │   ├── academic-chat/      # Main chat page
│   │   ├── sign-in/           # Authentication
│   │   └── sign-up/
│   ├── components/            # Reusable components
│   │   ├── Chat/              # Chat-related components
│   │   ├── Auth/              # Authentication components
│   │   └── ThemeToggle/       # UI components
│   ├── lib/
│   │   └── env-config.ts      # 🆕 Auto environment detection
│   ├── services/              # API services
│   ├── hooks/                 # React hooks
│   ├── types/                 # TypeScript types
│   └── utils/                 # Utility functions
├── .env.local                 # 🆕 Simplified (no manual URL switching)
└── package.json               # 🆕 Cleaned up scripts
```

### **Backend Structure**

```
backend/functions/
├── src/
│   ├── routes/
│   │   └── pdfChat.ts         # Main chat API
│   ├── models/
│   │   └── message-model.ts   # Data models
│   └── index.ts               # Server entry point
├── package.json
└── tsconfig.json
```

### **Testing Structure**

```
tests/
├── e2e/                       # End-to-end tests
├── performance/               # Performance tests
├── accessibility/             # Accessibility tests
├── package.json               # 🆕 Local testing scripts
└── README-LOCAL.md            # Local testing guide
```

---

## 📊 **Environment Detection Details**

### **Automatic URL Switching**

```typescript
// src/lib/env-config.ts handles this automatically:

Development (localhost:3000):
→ Backend: http://localhost:5050 (if running)
→ Fallback: https://your-backend-url.run.app

Production (deployed):
→ Backend: https://your-backend-url.run.app

Build time (npm run build):
→ Backend: https://your-backend-url.run.app
```

### **Environment Verification**

```bash
# Check current environment config
cd frontend
npm run dev

# Browser console shows:
# 🔧 Environment Config: {
#   current: 'development',
#   backendUrl: 'http://localhost:5050',
#   isDevelopment: true
# }
```

---

## 🚨 **Troubleshooting Guide**

### **❌ dev-check.sh Fails**

```bash
# 1. Check specific error:
./scripts/dev-check.sh

# 2. Common fixes:
npm run lint --fix              # Fix linting errors
npm run build                   # Check build errors
cd backend/functions && npm run lint --fix

# 3. Re-run until passes
./scripts/dev-check.sh
```

### **❌ Local Testing Fails**

```bash
# 1. Verify servers are running:
curl http://localhost:3000      # Frontend
curl http://localhost:5050      # Backend

# 2. Start missing servers:
cd frontend && npm run dev
cd backend/functions && npx ts-node src/index.ts

# 3. Run tests with debugging:
cd tests
npm run local:performance -- --headed
```

### **❌ Environment Detection Issues**

```bash
# 1. Check current detection:
cd frontend
node -e "const { ENV_CONFIG } = require('./src/lib/env-config.ts'); console.log(ENV_CONFIG);"

# 2. Clear Next.js cache:
rm -rf .next
npm run build

# 3. Check browser console for environment logs
```

---

## 🎯 **Daily Checklist**

### **🌅 Start of Day**

- [ ] `git pull origin main`
- [ ] Start development servers
- [ ] Check current branch/status

### **💻 During Development**

- [ ] Make incremental commits
- [ ] Test changes in browser
- [ ] Use auto environment detection
- [ ] No manual .env.local editing

### **🚀 Before Push**

- [ ] `./scripts/dev-check.sh` (ESSENTIAL)
- [ ] All tests pass
- [ ] Commit with descriptive message
- [ ] Push to appropriate branch

### **🧪 For Major Features**

- [ ] Start both frontend and backend
- [ ] `./scripts/test-with-servers.sh`
- [ ] All comprehensive tests pass
- [ ] Deploy with confidence

---

## ⚡ **Quick Commands Reference**

```bash
# Essential (daily use)
./scripts/dev-check.sh           # Pre-push validation
cd frontend && npm run dev       # Start frontend
cd backend/functions && npx ts-node src/index.ts  # Start backend

# Testing (feature development)
./scripts/test-with-servers.sh   # Full testing suite
cd tests && npm run local:accessibility  # Quick accessibility
cd tests && npm run local:performance    # Performance testing

# Git workflow
git status                       # Check current state
git add . && git commit -m "..."  # Commit changes
git push origin main             # Deploy to production

# Build validation
cd frontend && npm run build     # Test production build
cd backend/functions && npm run build  # Test backend build

# Environment checking
curl http://localhost:3000       # Check frontend
curl http://localhost:5050       # Check backend
```

---

## 🎉 **Success Metrics**

You'll know your workflow is working when:

✅ **Never manually edit .env.local for deployments**  
✅ **dev-check.sh passes before every push**  
✅ **CI/CD pipelines rarely fail**  
✅ **Environment switching is automatic**  
✅ **Testing is optional but comprehensive when needed**  
✅ **Deployments are one-command: `git push`**

---

🚀 **Your optimized development workflow is ready! No more manual environment switching, fast local validation, and confident deployments every time.**
