# Firebase Auth Emulator Setup for Testing

## 🚀 **Quick Setup**

### 1. **Install Firebase Tools**

```bash
npm install -g firebase-tools
# or in your project
npm install --save-dev firebase-tools
```

### 2. **Initialize Firebase Emulator**

```bash
# In your project root
firebase init emulators

# Select:
# - Authentication Emulator
# - Firestore Emulator (if needed)
```

### 3. **Configure Emulator Ports**

Add to `firebase.json`:

```json
{
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "ui": {
      "enabled": true,
      "port": 4000
    }
  }
}
```

### 4. **Start Emulator**

```bash
# Start all emulators
firebase emulators:start

# Start only auth emulator
firebase emulators:start --only auth
```

## 🧪 **Configure Tests for Emulator**

### 1. **Update Firebase Config for Tests**

Create `tests/setup/firebase-test-config.ts`:

```typescript
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  apiKey: "demo-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Connect to emulator in test environment
if (process.env.NODE_ENV === "test" || process.env.PLAYWRIGHT_TEST) {
  connectAuthEmulator(auth, "http://localhost:9099");
}

export { auth };
```

### 2. **Create Test Users in Emulator**

```typescript
// tests/setup/create-test-users.ts
import { auth } from "./firebase-test-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const TEST_USERS = {
  validUser: {
    email: "test@example.com",
    password: "testpassword123",
  },
  adminUser: {
    email: "admin@example.com",
    password: "adminpassword123",
  },
};

export async function createTestUsers() {
  try {
    // Create test users
    await createUserWithEmailAndPassword(
      auth,
      TEST_USERS.validUser.email,
      TEST_USERS.validUser.password
    );
    await createUserWithEmailAndPassword(
      auth,
      TEST_USERS.adminUser.email,
      TEST_USERS.adminUser.password
    );
    console.log("✅ Test users created successfully");
  } catch (error) {
    console.log("ℹ️ Test users might already exist");
  }
}

export async function signInTestUser(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}
```

## 🎯 **Updated Test Setup**

### 1. **Global Test Setup**

Create `tests/global-setup.ts`:

```typescript
import { chromium, FullConfig } from "@playwright/test";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function globalSetup(config: FullConfig) {
  // Start Firebase emulator
  console.log("🔥 Starting Firebase Auth Emulator...");

  try {
    // Check if emulator is already running
    await execAsync("curl -f http://localhost:9099");
    console.log("✅ Firebase Auth Emulator already running");
  } catch {
    // Start emulator in background
    exec(
      "firebase emulators:start --only auth --import=./emulator-data --export-on-exit=./emulator-data"
    );

    // Wait for emulator to start
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log("✅ Firebase Auth Emulator started");
  }

  // Create a browser instance to setup test users
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Setup test users via emulator
  await page.goto("http://localhost:4000/auth"); // Firebase Emulator UI
  // You can programmatically create users here or use the UI

  await browser.close();
}

export default globalSetup;
```

### 2. **Update Playwright Config**

```typescript
// tests/config/playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  globalSetup: require.resolve("../global-setup"),

  use: {
    baseURL: "http://localhost:3000",
  },

  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },
  ],
});
```

## 📝 **Environment Variables**

Create `.env.test`:

```bash
# Firebase Emulator
REACT_APP_FIREBASE_USE_EMULATOR=true
REACT_APP_FIREBASE_AUTH_EMULATOR_HOST=localhost:9099

# Test environment
NODE_ENV=test
PLAYWRIGHT_TEST=true
```

## 🔧 **Commands**

```bash
# Start emulator and run tests
npm run test:auth:emulator

# Run tests with emulator
PLAYWRIGHT_TEST=true npm run test:e2e
```
