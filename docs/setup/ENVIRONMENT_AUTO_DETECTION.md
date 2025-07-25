# 🔄 Auto Environment Detection Solution

## Problem Solved ✅

**Before**: Manual `.env.local` editing every deployment

```bash
# Manual process (error-prone):
# 1. Edit .env.local: change localhost → production URL
# 2. npm run build
# 3. git push
# 4. Remember to change back for local development
```

**After**: Automatic environment detection

```bash
# Automated process:
# 1. Just run: ./scripts/dev-check.sh
# 2. git push
# Backend URL switches automatically based on environment!
```

## 🛠️ How It Works

### 1. Smart Environment Detection

```typescript
// src/lib/env-config.ts
export const getBackendUrl = (): string => {
  // Server-side: Use NODE_ENV
  if (typeof window === "undefined") {
    return process.env.NODE_ENV === "production"
      ? "https://your-backend-url.run.app" // Production
      : "http://localhost:5050"; // Development
  }

  // Client-side: Use hostname detection
  const isLocalhost = window.location.hostname === "localhost";
  return isLocalhost
    ? "http://localhost:5050" // Local development
    : "https://your-backend-url.run.app"; // Production deployment
};
```

### 2. Automatic URL Switching

- **Local Development** (`npm run dev`): `http://localhost:5050`
- **Production Build** (`npm run build` with NODE_ENV=production): `https://your-backend-url.run.app`
- **Deployed Site**: `https://your-backend-url.run.app`

### 3. Updated Code Files

```typescript
// ✅ Updated files now use auto-detection:
// src/services/chatService.ts
// src/hooks/useChat.ts
// src/app/academic-chat/page.tsx

// Before:
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;

// After:
import { getBackendUrl } from "../lib/env-config";
const backendUrl = getBackendUrl();
```

## 🚀 Developer Workflow Now

### Daily Development

```bash
# 1. Start local development
npm run dev                    # Auto-uses: http://localhost:5050

# 2. Test your changes
./scripts/dev-check.sh         # Builds with environment detection

# 3. Push to production
git push origin main           # Auto-deploys with: https://your-backend-url.run.app
```

### No More Manual Steps!

- ❌ ~~Edit .env.local before deployment~~
- ❌ ~~Remember to change URLs back~~
- ❌ ~~Risk pushing wrong environment~~
- ✅ Automatic environment detection
- ✅ One-command deployment workflow
- ✅ Zero configuration needed

## 🧪 Testing the Solution

### Test Environment Detection

```bash
./scripts/test-env-detection.sh
```

### Verify Local Development

```bash
# Terminal 1: Start backend
cd backend/functions && npx ts-node src/index.ts

# Terminal 2: Start frontend
cd frontend && npm run dev

# Should automatically connect to http://localhost:5050
```

### Verify Production Build

```bash
cd frontend
npm run build    # Should auto-configure for production URL
```

## 🔧 Configuration Details

### Environment Variables (.env.local)

```bash
# ✅ Simplified - no more manual URL switching needed
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

NEXT_PUBLIC_USE_FIREBASE_EMULATORS=false

# Backend URLs are now auto-detected based on environment!
# Development: http://localhost:5050
# Production: https://your-backend-url.run.app
```

### Debug Information

The system logs current configuration in development:

```javascript
// Browser console in development shows:
🔧 Environment Config: {
  current: 'development',
  backendUrl: 'http://localhost:5050',
  isDevelopment: true,
  isProduction: false
}
```

## 🎯 Benefits

### 🚀 **Faster Development**

- No manual environment switching
- One-command deployment workflow
- Reduced deployment errors

### 🛡️ **Error Prevention**

- No risk of pushing wrong URLs
- Automatic environment detection
- Consistent configuration across team

### 🧹 **Cleaner Workflow**

- Single source of truth for URLs
- Environment-aware configuration
- No manual .env.local editing

### 👥 **Team Benefits**

- New developers don't need URL switching knowledge
- Consistent behavior across all developer machines
- Zero configuration onboarding

## 🚨 Troubleshooting

### If Backend URL Seems Wrong

```bash
# Check environment detection
cd frontend
node -e "
const { ENV_CONFIG } = require('./src/lib/env-config.ts');
console.log('Current config:', ENV_CONFIG);
"
```

### If Local Development Not Working

1. Ensure backend is running: `cd backend/functions && npx ts-node src/index.ts`
2. Check frontend is on localhost: `npm run dev`
3. Verify browser console shows development config

### If Production Build Issues

1. Run: `NODE_ENV=production npm run build`
2. Check build output for correct URL usage
3. Test with: `./scripts/test-env-detection.sh`

---

🎉 **No more manual environment switching! Your deployment workflow is now fully automated.**
