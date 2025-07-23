# 🔐 GitHub Secrets Setup for Firebase Authentication Testing

## 📋 **Required GitHub Secrets**

You need to add these secrets to your GitHub repository for CI/CD to work with real Firebase authentication.

### 🔧 **How to Add Secrets**

1. **Go to your GitHub repository**
2. **Settings** → **Secrets and variables** → **Actions**
3. **Click "New repository secret"**
4. **Add each secret below**

### 🔥 **Firebase Configuration Secrets**

Get these from your Firebase Console → Project Settings → General → Your apps → Web app:

```bash
# Firebase Test Project Configuration
FIREBASE_TEST_API_KEY=your_firebase_api_key_here
FIREBASE_TEST_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_TEST_PROJECT_ID=your-project-id
FIREBASE_TEST_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_TEST_MESSAGING_SENDER_ID=123456789
FIREBASE_TEST_APP_ID=1:123456789:web:abcdef123456
```

### 👤 **Test User Credentials**

Create these users in Firebase Console → Authentication → Users:

```bash
# Test User Account (create in Firebase Auth)
TEST_USER_EMAIL=test@academico-ai.com
TEST_USER_PASSWORD=TestPassword123!
```

## 🚀 **Quick Setup Script**

Run this locally to test your Firebase config:

```bash
# 1. Create local test environment
cat > .env.test.local << EOL
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here

TEST_USER_EMAIL=test@academico-ai.com
TEST_USER_PASSWORD=TestPassword123!
EOL

# 2. Test locally
source .env.test.local
npm run test:e2e -- tests/e2e/auth/auth-real-firebase.test.ts
```

## 📝 **GitHub Secrets Checklist**

### ✅ **Firebase Configuration** (6 secrets)

- [ ] `FIREBASE_TEST_API_KEY`
- [ ] `FIREBASE_TEST_AUTH_DOMAIN`
- [ ] `FIREBASE_TEST_PROJECT_ID`
- [ ] `FIREBASE_TEST_STORAGE_BUCKET`
- [ ] `FIREBASE_TEST_MESSAGING_SENDER_ID`
- [ ] `FIREBASE_TEST_APP_ID`

### ✅ **Test Credentials** (2 secrets)

- [ ] `TEST_USER_EMAIL`
- [ ] `TEST_USER_PASSWORD`

## 🔍 **How to Get Firebase Config**

### **Method 1: Firebase Console**

1. Go to Firebase Console → Your Project
2. Click ⚙️ (Settings) → Project settings
3. Scroll to "Your apps" section
4. If no web app, click "Add app" → Web
5. Copy the `firebaseConfig` object values

### **Method 2: Firebase CLI**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and list projects
firebase login
firebase projects:list

# Get config for specific project
firebase apps:sdkconfig web --project your-project-id
```

## 🧪 **Test Users Setup**

### **Create in Firebase Console:**

1. **Go to Authentication → Users**
2. **Add User:**
   - Email: `test@academico-ai.com`
   - Password: `TestPassword123!`
   - ✅ Mark as verified
3. **Add Admin User:**
   - Email: `admin@academico-ai.com`
   - Password: `AdminPassword123!`
   - ✅ Mark as verified

### **Or use Firebase Admin SDK:**

```javascript
// create-test-users.js
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("./serviceAccountKey.json"),
});

async function createTestUsers() {
  try {
    await admin.auth().createUser({
      email: "test@academico-ai.com",
      password: "TestPassword123!",
      emailVerified: true,
      displayName: "Test User",
    });
    console.log("✅ Test user created");
  } catch (error) {
    console.log("User might already exist:", error.message);
  }
}

createTestUsers();
```

## 🔒 **Security Best Practices**

### ✅ **Do:**

- Use a **separate Firebase project** for testing
- Use **strong passwords** for test accounts
- **Regularly rotate** test credentials
- **Limit Firebase project** to test data only

### ❌ **Don't:**

- Use production Firebase project for tests
- Commit credentials to git
- Use weak test passwords
- Share test credentials publicly

## 🎯 **Verify Setup**

### **Local Test:**

```bash
# Test with your config
npm run test:e2e -- tests/e2e/auth/auth-real-firebase.test.ts --headed
```

### **Expected Results:**

```
✅ Successfully accessed protected route
✅ Authentication persisted across page reload
✅ Auth data persisted - User: test@academico-ai.com
✅ Sign out successful
```

### **CI/CD Test:**

Push to your repository and check the Actions tab for:

```
✅ Run E2E Authentication Tests
✅ Firebase authentication working in CI
```

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **"API key invalid"**

   - Double-check `FIREBASE_TEST_API_KEY` secret
   - Ensure no extra spaces in the secret value

2. **"User not found"**

   - Verify test user exists in Firebase Auth
   - Check `TEST_USER_EMAIL` matches exactly

3. **"Tests timing out"**
   - Ensure frontend is running on port 3000
   - Check Firebase project has Auth enabled

## 📞 **Need Help?**

If you encounter issues:

1. Check GitHub Actions logs
2. Test locally with `.env.test.local` first
3. Verify Firebase Console shows the test users
4. Ensure all 8 secrets are added to GitHub
