# Local Testing Guide

## Quick Local Tests (Not in CI/CD)

### 1. Run Accessibility Tests Locally

```bash
# Test accessibility improvements
npm run test:accessibility:local

# Test with headed browser (visual)
npm run test:accessibility:headed
```

### 2. Test Performance Optimizations

```bash
# Test our 50ms delay optimization
npm run test:performance:local

# Visual performance testing
npm run test:performance:headed
```

### 3. Quick Smoke Tests

```bash
# Basic functionality check
npm run test:smoke:local
```

## Authentication Testing

Since our app requires authentication, you can:

1. **Manual Testing**: Open http://localhost:3000/academic-chat in browser
2. **Sign in manually** and test accessibility improvements
3. **Visual verification** of 50ms delay optimization

## Local Test Benefits

- ✅ **Fast feedback** during development
- ✅ **Visual debugging** with headed browser
- ✅ **No CI/CD overhead**
- ✅ **Perfect for accessibility testing**
- ✅ **Great for performance optimization testing**

## Files Modified

- `PdfChatUpload.tsx` - Added accessibility attributes
- `page.tsx` - Reduced delays (300ms→50ms locally)
- Tests are ready but excluded from CI/CD
