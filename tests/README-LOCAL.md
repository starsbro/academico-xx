# Local Testing Guide 🧪

## Quick Start for Local Development

### 1. Setup

```bash
# One-time setup
cd tests
npm install
npm run install:browsers:chromium

# Start your local servers
# Terminal 1: Frontend
cd ../frontend && npm run dev

# Terminal 2: Backend
cd ../backend/functions && npx ts-node src/index.ts
```

### 2. Local Test Commands

```bash
# Quick accessibility check (30s)
npm run local:accessibility

# Performance testing with visual feedback (2min)
npm run local:performance

# Basic smoke test (30s)
npm run local:smoke

# Debug mode with dev tools
npm run local:debug
```

## What These Tests Validate

### ✅ Accessibility (`local:accessibility`)

- ARIA labels on send button: `aria-label="Send message"`
- Textarea accessibility: `aria-label="Type your message or question"`
- Button titles: `title="Send message"`
- Color contrast in dark/light modes
- Keyboard navigation

### ⚡ Performance (`local:performance`)

- AI response timing optimization
- 50ms local environment delays (vs 300ms production)
- Message ordering validation
- UI flash reduction

### 🔍 Debug Mode (`local:debug`)

- Visual inspection of accessibility attributes
- Real-time DOM inspection
- Manual interaction testing
- Screenshot capture on failures

## Authentication Notes

Since the chat interface requires authentication, tests will:

1. Navigate to sign-in page
2. You can manually sign in during headed test
3. Tests continue with authenticated session

## Benefits of Local Testing

- **Fast Feedback**: See results immediately with visual browser
- **Real Environment**: Test actual localhost:3000 + localhost:5050 setup
- **Visual Debugging**: Watch tests run, inspect elements manually
- **No CI/CD Overhead**: Skip deployment, just test your changes
- **Interactive**: Can pause tests and manually interact

## File Coverage

- `/frontend/src/app/academic-chat/page.tsx` - 50ms delays
- `/frontend/src/components/Chat/PdfChatUpload.tsx` - accessibility attributes
- Authentication flow and protected routes

Run these tests whenever you make changes to chat interface or accessibility features!
