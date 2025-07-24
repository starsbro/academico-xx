# 🚀 Production Deployment Guide

This guide covers deploying Academico-AI to production using Firebase Hosting and Cloud Functions.

## 📋 **Prerequisites**

Before deploying to production, ensure you have:

- ✅ **Firebase project** configured and ready
- ✅ **GitHub repository** with all code committed
- ✅ **Environment variables** properly configured
- ✅ **All tests passing** in your CI/CD pipeline
- ✅ **Domain name** (optional, for custom domains)

## 🔧 **Pre-Deployment Checklist**

### 1. Environment Configuration

Verify all environment variables are set:

```bash
# Frontend Environment Variables (.env.production)
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=false
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.run.app
```

### 2. Firebase Configuration

Ensure your `firebase.json` is properly configured:

```json
{
  "firestore": {
    "database": "(default)",
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "functions": [
    {
      "source": "backend/functions",
      "codebase": "default",
      "ignore": ["node_modules", ".git", "firebase-debug.log", "*.local"]
    }
  ],
  "hosting": {
    "public": "frontend/out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 3. GitHub Secrets Configuration

Verify all GitHub secrets are properly set in your repository:

```
Repository Settings → Secrets and variables → Actions

Required Secrets:
✅ FIREBASE_SERVICE_ACCOUNT_ACADEMICO_AI
✅ NEXT_PUBLIC_FIREBASE_API_KEY
✅ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID
✅ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
✅ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
✅ NEXT_PUBLIC_FIREBASE_APP_ID
```

## 🚀 **Deployment Methods**

### Method 1: Automatic Deployment (Recommended)

**Automatic deployment happens when you push to the main branch:**

1. **Commit your changes**:

   ```bash
   git add .
   git commit -m "feat: ready for production deployment"
   git push origin main
   ```

2. **Monitor GitHub Actions**:

   - Go to your repository's **Actions** tab
   - Watch the deployment workflow run
   - Verify all steps complete successfully

3. **Verify deployment**:
   - Visit https://your-project.web.app
   - Test key functionality
   - Check browser console for errors

### Method 2: Manual Deployment

If you need to deploy manually:

1. **Login to Firebase**:

   ```bash
   firebase login
   ```

2. **Build the application**:

   ```bash
   # Build frontend
   cd frontend
   npm run build

   # Build backend
   cd ../backend/functions
   npm run build
   ```

3. **Deploy to Firebase**:

   ```bash
   # From project root
   firebase deploy

   # Or deploy specific components
   firebase deploy --only hosting
   firebase deploy --only functions
   ```

## 🔍 **Post-Deployment Verification**

### 1. Frontend Verification

Visit your production site and test:

- ✅ **Homepage loads** correctly
- ✅ **Authentication works** (sign up/sign in)
- ✅ **Academic Chat** functionality
- ✅ **Navigation** between pages
- ✅ **Responsive design** on mobile/desktop

### 2. Backend API Verification

Test your API endpoints:

```bash
# Test main API endpoint
curl https://your-backend-url.run.app/

# Test CORS configuration
curl -H "Origin: https://your-project.web.app" \
     https://your-backend-url.run.app/cors-test

# Test authentication endpoint (requires token)
curl -H "Authorization: Bearer your_token" \
     https://your-backend-url.run.app/api/user/profile
```

### 3. Database Connectivity

Verify Firestore integration:

- ✅ User registration creates database records
- ✅ Chat messages are saved and retrieved
- ✅ Authentication state persists across sessions
- ✅ Real-time updates work correctly

## 🔒 **Security Configuration**

### Firestore Security Rules

Ensure your `firestore.rules` are production-ready:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Chats are user-specific
    match /chats/{chatId} {
      allow read, write: if request.auth != null &&
                           request.auth.uid == resource.data.userId;
    }

    // Messages within chats
    match /chats/{chatId}/messages/{messageId} {
      allow read, write: if request.auth != null &&
                           get(/databases/$(database)/documents/chats/$(chatId)).data.userId == request.auth.uid;
    }
  }
}
```

### Environment Security

- ✅ **No secrets in code**: All sensitive data in environment variables
- ✅ **HTTPS only**: All traffic encrypted
- ✅ **CORS configured**: Only allow requests from your domain
- ✅ **Authentication required**: All API endpoints protected

## 📊 **Performance Optimization**

### Frontend Optimization

1. **Build Analysis**:

   ```bash
   cd frontend
   npm run build
   npx @next/bundle-analyzer
   ```

2. **Image Optimization**:

   - Use Next.js Image component
   - Optimize images before upload
   - Implement lazy loading

3. **Code Splitting**:
   - Ensure dynamic imports are used
   - Lazy load non-critical components
   - Minimize initial bundle size

### Backend Optimization

1. **Function Performance**:

   - Monitor cold start times
   - Optimize database queries
   - Implement caching where appropriate

2. **Database Indexing**:
   ```bash
   # Deploy Firestore indexes
   firebase deploy --only firestore:indexes
   ```

## 🔍 **Monitoring & Analytics**

### Firebase Analytics Setup

1. **Enable Analytics** in Firebase Console
2. **Configure custom events** for user interactions
3. **Set up conversion tracking** for key actions
4. **Monitor performance metrics** regularly

### Error Monitoring

1. **Enable Crashlytics** for error tracking
2. **Set up alerting** for critical errors
3. **Monitor function logs** for backend issues
4. **Track performance metrics** over time

## 🚨 **Troubleshooting Common Issues**

### Deployment Failures

**Issue**: Build fails in GitHub Actions

```bash
# Check logs for specific errors
# Common fixes:
- Verify all environment variables are set
- Check for TypeScript errors
- Ensure tests are passing
- Verify Firebase configuration
```

**Issue**: Functions deployment fails

```bash
# Check function logs
firebase functions:log

# Common fixes:
- Update Node.js version in functions
- Check for dependency conflicts
- Verify service account permissions
```

### Runtime Issues

**Issue**: Frontend shows blank page

- Check browser console for JavaScript errors
- Verify environment variables are loaded
- Check network requests for failed API calls

**Issue**: Authentication not working

- Verify Firebase configuration
- Check Firestore security rules
- Ensure environment variables match Firebase project

**Issue**: API calls failing

- Check CORS configuration
- Verify backend URL in environment variables
- Test API endpoints directly

## 🔄 **Rollback Procedures**

### If Deployment Issues Occur

1. **Immediate Rollback**:

   ```bash
   # Rollback to previous version
   firebase hosting:clone source-site-id:channel-id target-site-id:live
   ```

2. **Fix and Redeploy**:

   ```bash
   # Fix issues locally
   # Test thoroughly
   # Deploy again when ready
   firebase deploy
   ```

3. **Emergency Procedures**:
   - Keep previous working versions tagged in Git
   - Have rollback scripts ready
   - Monitor error rates after deployment

## 📈 **Production Monitoring**

### Key Metrics to Track

1. **Performance Metrics**:

   - Page load times
   - First contentful paint
   - Core Web Vitals scores
   - API response times

2. **User Metrics**:

   - Daily/monthly active users
   - Session duration
   - Feature usage rates
   - Conversion rates

3. **Error Metrics**:
   - Error rates by feature
   - Failed authentication attempts
   - API error rates
   - Database query failures

### Alerts and Notifications

Set up alerts for:

- Error rates exceeding thresholds
- Performance degradation
- High latency API calls
- Authentication failures

## 🔧 **Maintenance Tasks**

### Regular Maintenance

1. **Weekly**:

   - Review error logs
   - Check performance metrics
   - Update dependencies (if needed)
   - Monitor user feedback

2. **Monthly**:

   - Review security logs
   - Update documentation
   - Analyze user behavior data
   - Plan feature improvements

3. **Quarterly**:
   - Security audit
   - Performance optimization review
   - Infrastructure cost analysis
   - Backup and disaster recovery testing

---

**Related Documentation**:

- 🔧 [Environment Configuration](environment-config.md)
- 📊 [Monitoring Setup](monitoring.md)
- 🔒 [Security Best Practices](../troubleshooting/production-backend-fixes.md)
- 🚀 [CI/CD Pipeline](../setup/ci-cd-status.md)
