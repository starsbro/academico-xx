# Real Firebase Authentication Setup

## 🔧 **Frontend Firebase Configuration**

### 1. **Update Frontend Firebase Config**

In `frontend/src/lib/firebase.ts`:

```typescript
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set authentication persistence
setPersistence(auth, browserLocalPersistence);

export { auth };
```

### 2. **Environment Variables**

Create `frontend/.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. **Authentication Context with Persistence**

Create `frontend/src/contexts/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "../lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set persistence
    setPersistence(auth, browserLocalPersistence);

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      // Store user data in localStorage for tests
      if (user) {
        localStorage.setItem(
          "firebase:authUser:test",
          JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified,
          })
        );
      } else {
        localStorage.removeItem("firebase:authUser:test");
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    localStorage.removeItem("firebase:authUser:test");
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

### 4. **Protected Route Component**

Create `frontend/src/components/ProtectedRoute.tsx`:

```typescript
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
```

## 🧪 **Test Configuration for Real Auth**

### 1. **Create Test Environment Variables**

Create `tests/.env.test`:

```bash
# Real Firebase Test Project
NEXT_PUBLIC_FIREBASE_API_KEY=your_test_project_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_test_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_test_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_test_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_test_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_test_app_id

# Test User Credentials
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=testpassword123
```

### 2. **Test Helper Functions**

Create `tests/utils/auth-helpers.ts`:

```typescript
import { Page } from "@playwright/test";

export async function signInUser(page: Page, email: string, password: string) {
  await page.goto("http://localhost:3000/sign-in");
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.click('button[type="submit"]');
  await page.waitForLoadState("networkidle");
}

export async function signOutUser(page: Page) {
  // Look for sign out button
  const signOutSelectors = [
    'button:has-text("Sign out")',
    'button:has-text("Logout")',
    '[data-testid="sign-out"]',
  ];

  for (const selector of signOutSelectors) {
    const element = page.locator(selector);
    if ((await element.count()) > 0) {
      await element.click();
      await page.waitForLoadState("networkidle");
      break;
    }
  }
}

export async function waitForAuth(page: Page) {
  // Wait for authentication state to be resolved
  await page.waitForFunction(
    () => {
      return window.localStorage.getItem("firebase:authUser:test") !== null;
    },
    { timeout: 10000 }
  );
}

export async function clearAuth(page: Page) {
  await page.evaluate(() => {
    localStorage.removeItem("firebase:authUser:test");
    sessionStorage.clear();
  });
}
```

### 3. **Create Test Users Script**

Create `tests/scripts/create-test-users.js`:

```javascript
const admin = require("firebase-admin");

// Initialize Firebase Admin
const serviceAccount = require("./path-to-service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  authDomain: "your-project.firebaseapp.com",
});

async function createTestUsers() {
  try {
    // Create test user
    const userRecord = await admin.auth().createUser({
      email: "test@example.com",
      password: "testpassword123",
      displayName: "Test User",
      emailVerified: true,
    });

    console.log("✅ Test user created:", userRecord.uid);

    // Create admin user
    const adminRecord = await admin.auth().createUser({
      email: "admin@example.com",
      password: "adminpassword123",
      displayName: "Admin User",
      emailVerified: true,
    });

    // Set custom claims for admin
    await admin.auth().setCustomUserClaims(adminRecord.uid, { admin: true });

    console.log("✅ Admin user created:", adminRecord.uid);
  } catch (error) {
    console.error("Error creating test users:", error);
  }
}

createTestUsers();
```

## 🎯 **Update Tests for Real Authentication**

### 1. **Updated Authentication Test**

```typescript
test("should handle real authentication and persistence", async ({ page }) => {
  const testEmail = process.env.TEST_USER_EMAIL || "test@example.com";
  const testPassword = process.env.TEST_USER_PASSWORD || "testpassword123";

  // Sign in with real credentials
  await signInUser(page, testEmail, testPassword);

  // Verify successful sign-in
  await page.waitForURL("**/academic-chat");
  expect(page.url()).toContain("/academic-chat");

  // Test persistence across page reload
  await page.reload();
  await page.waitForLoadState("networkidle");

  // Should still be authenticated
  expect(page.url()).toContain("/academic-chat");

  // Verify auth state in localStorage
  const authData = await page.evaluate(() => {
    return localStorage.getItem("firebase:authUser:test");
  });

  expect(authData).toBeTruthy();

  const user = JSON.parse(authData);
  expect(user.email).toBe(testEmail);
  expect(user.emailVerified).toBe(true);

  console.log("✅ Real authentication and persistence working");
});
```

## 🚀 **Quick Setup Commands**

```bash
# 1. Install dependencies
npm install firebase

# 2. Setup environment variables
cp tests/.env.test.example tests/.env.test
# Edit with your Firebase config

# 3. Create test users
node tests/scripts/create-test-users.js

# 4. Run tests with real auth
npm run test:auth:real
```

## 📋 **Package.json Scripts**

Add to your `package.json`:

```json
{
  "scripts": {
    "test:auth:real": "PLAYWRIGHT_TEST=true npm run test:e2e -- tests/e2e/auth/",
    "test:auth:setup": "node tests/scripts/create-test-users.js",
    "test:auth:emulator": "firebase emulators:start --only auth & npm run test:e2e"
  }
}
```
