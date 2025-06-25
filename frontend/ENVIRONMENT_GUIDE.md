# Environment Configuration Guide

This guide explains how to properly switch between local development and production environments.

## 🏗️ Environment Files Structure

```
frontend/
├── .env.development      # Local development with emulators
├── .env.production      # Production configuration
├── .env.local          # Currently active (auto-managed)
└── scripts/
    ├── setup-local-dev.sh    # Switch to local development
    └── setup-production.sh   # Switch to production build
```

## 🔄 Environment Switching

### For Local Development (with Firebase Emulators)

```bash
# Method 1: Use npm script
npm run setup:local

# Method 2: Run script directly
bash scripts/setup-local-dev.sh

# Method 3: Use combined dev command
npm run dev:local
```

**This will configure:**
- ✅ Backend URL: `http://127.0.0.1:5001/academico-ai/us-central1/api`
- ✅ Firebase Emulators: ENABLED
- ✅ Environment: development

### For Production Build/Deployment

```bash
# Method 1: Use npm script
npm run setup:production

# Method 2: Run script directly
bash scripts/setup-production.sh

# Method 3: Use combined build command
npm run build:production
```

**This will configure:**
- ✅ Backend URL: `https://api-bcsebzkoea-uc.a.run.app`
- ✅ Firebase Emulators: DISABLED
- ✅ Environment: production

## 🚀 Common Workflows

### Local Development Workflow

```bash
# 1. Setup local environment
npm run setup:local

# 2. Start Firebase emulators (in separate terminal)
firebase emulators:start

# 3. Start development server
npm run dev
```

### Production Deployment Workflow (Basic)

```bash
# 1. Setup production environment and build
npm run build:production

# 2. Deploy to Firebase Hosting
firebase deploy --only hosting

# Or use the combined deploy command
npm run deploy
```

### Production Deployment Workflow (Enhanced with Tracking)

```bash
# 1. Setup production environment with deployment tracking
npm run setup:production:enhanced

# 2. Build and deploy with tracking
npm run deploy:enhanced

# Or do it step by step
npm run build:production:enhanced
firebase deploy --only hosting
```

### Check Current Deployment Information

```bash
# Check what's currently deployed and configured
npm run check:deployment
```

## � Deployment Tracking

### Enhanced Deployment Information

When using the enhanced setup (`npm run setup:production:enhanced`), the following information is automatically tracked:

- **Branch**: Which git branch the deployment was built from
- **Commit**: The exact git commit hash (short and full)
- **Build Timestamp**: When the build was created
- **Build User**: Who created the build
- **Deployment Log**: A log file tracking all deployments

### In-App Deployment Info

The `DeploymentInfo` component can be added to your app to show deployment information:

```tsx
import { DeploymentInfo } from '@/components/DeploymentInfo/DeploymentInfo';

// Add to your layout or any page
<DeploymentInfo />
```

This component:
- Shows build information in development mode
- Can be enabled in production with `NEXT_PUBLIC_SHOW_DEPLOYMENT_INFO=true`
- Provides a clickable info button in the bottom-right corner
- Links to the GitHub commit for easy reference

### Checking Deployment Information

```bash
# Check current deployment configuration and history
npm run check:deployment

# View deployment log
cat deployment.log

# Check environment variables
cat .env.local | grep NEXT_PUBLIC_BUILD
```

## 🔒 Important Notes

1. **`.env.local` is auto-managed** - Don't edit it manually, use the scripts
2. **Backups are created** - Scripts automatically backup your current `.env.local`
3. **CI/CD uses `.env.local`** - GitHub Actions will use the committed `.env.local` for production builds
4. **Emulator status matters** - Make sure Firebase emulators are running for local development

## 🛠️ Troubleshooting

### "Connection Refused" Error on Production Site

This means the production build is trying to connect to local emulators. Fix it:

```bash
npm run setup:production
npm run deploy
```

### Local Development Can't Connect to Backend

This means you're using production config locally. Fix it:

```bash
npm run setup:local
firebase emulators:start  # Make sure emulators are running
```

### Check Current Configuration

```bash
# View current backend URL
grep NEXT_PUBLIC_BACKEND_URL .env.local

# View emulator setting
grep NEXT_PUBLIC_USE_FIREBASE_EMULATORS .env.local
```
