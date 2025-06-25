# Testing Checklist for Deployment Tracking Features

## 🧪 Pre-Commit Testing Workflow

### Phase 1: Local Development Testing

**Setup:**
```bash
npm run setup:local
firebase emulators:start --only functions,auth,firestore,hosting
npm run dev
```

**Test Cases:**

#### ✅ 1. DeploymentInfo Component (Development Mode)
- [ ] Visit http://localhost:3001
- [ ] Look for "ℹ️ Build Info" button in bottom-right corner
- [ ] Click the button to open deployment info panel
- [ ] Verify it shows:
  - Environment: development
  - No branch/commit info (expected in dev mode)
- [ ] Close the panel by clicking "✕"

#### ✅ 2. Environment Configuration
- [ ] Check current environment: `npm run check:deployment`
- [ ] Verify output shows:
  - Environment: development
  - Backend URL: http://127.0.0.1:5001/...
  - No build tracking info (expected)

#### ✅ 3. Navigation & Core Features
- [ ] Test navigation between pages (Home, Dashboard, Academic Chat)
- [ ] Verify no console errors in browser dev tools
- [ ] Test basic functionality of existing features

### Phase 2: Production Build Testing

**Setup:**
```bash
npm run setup:production:enhanced
npm run build
npm run start
```

**Test Cases:**

#### ✅ 4. Enhanced Production Setup
- [ ] Run `npm run setup:production:enhanced`
- [ ] Verify it shows build information:
  - Branch: chat-ai
  - Commit: [current commit]
  - Build timestamp
  - Build user
- [ ] Check `deployment.log` file was created
- [ ] Verify `.env.local` contains build tracking variables

#### ✅ 5. Production Build Info
- [ ] After building, visit http://localhost:3000
- [ ] DeploymentInfo component should NOT show (production mode)
- [ ] Add `NEXT_PUBLIC_SHOW_DEPLOYMENT_INFO=true` to .env.local to test
- [ ] Restart server and verify deployment info shows with:
  - Environment: production
  - Branch: chat-ai
  - Commit hash
  - Build timestamp
  - GitHub link works

#### ✅ 6. Environment Scripts Testing
- [ ] Test `npm run check:deployment` shows full info
- [ ] Test switching between environments:
  - `npm run setup:local` → check environment
  - `npm run setup:production:enhanced` → check environment
- [ ] Verify backup files are created (.env.local.backup)

### Phase 3: Integration Testing

#### ✅ 7. Firebase Integration
- [ ] Test with emulators running
- [ ] Verify backend API calls work (if applicable)
- [ ] Test authentication flow (if applicable)
- [ ] Check console for any Firebase connection issues

#### ✅ 8. Build Process
- [ ] Clean build: `rm -rf .next` then `npm run build`
- [ ] Verify no build errors
- [ ] Check build output includes tracking variables
- [ ] Test static export works

## 🔧 Commands Reference

```bash
# Environment Management
npm run setup:local                    # Switch to local dev
npm run setup:production:enhanced      # Switch to production with tracking
npm run check:deployment               # Check current config

# Development
npm run dev                           # Start dev server
firebase emulators:start              # Start Firebase emulators

# Production Testing
npm run build:production:enhanced     # Build with tracking
npm run start                        # Start production server locally

# Deployment
npm run deploy:enhanced              # Deploy with tracking
```

## 🐛 Common Issues & Solutions

### Issue: "Build Info" button not showing
- **Solution**: Check environment mode, add `NEXT_PUBLIC_SHOW_DEPLOYMENT_INFO=true` for production

### Issue: Port conflicts
- **Solution**: Kill existing processes: `pkill -f "firebase emulators"`

### Issue: Environment not switching
- **Solution**: Check `.env.local` content, run setup scripts again

### Issue: Build tracking info missing
- **Solution**: Use `npm run setup:production:enhanced` instead of basic setup

## ✅ Ready to Commit When:
- [ ] All local development tests pass
- [ ] All production build tests pass
- [ ] No console errors or warnings
- [ ] Environment switching works correctly
- [ ] Deployment tracking shows correct information
- [ ] Documentation is clear and complete
