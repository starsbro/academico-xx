#!/bin/bash

# Firebase Authentication Setup Script for Tests
# This script helps configure Firebase authentication for your tests

echo "🔥 Firebase Authentication Setup for Testing"
echo "============================================="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
else
    echo "✅ Firebase CLI found"
fi

# Check if project has firebase.json
if [ ! -f "firebase.json" ]; then
    echo "⚠️ firebase.json not found. Initializing Firebase..."
    firebase init emulators
else
    echo "✅ firebase.json found"
fi

# Create test environment file
echo "📝 Creating test environment file..."
cat > tests/.env.test << EOL
# Firebase Test Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=demo-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=demo-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=demo-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=demo-app-id

# Test Users
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=testpassword123

# Test Environment
NODE_ENV=test
PLAYWRIGHT_TEST=true
REACT_APP_FIREBASE_USE_EMULATOR=true
REACT_APP_FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
EOL

# Update firebase.json for emulators
echo "🔧 Configuring Firebase emulators..."
cat > firebase.json << EOL
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
EOL

# Create test helper scripts
echo "📄 Creating test helper scripts..."

# Create package.json scripts
echo "Adding test scripts to package.json..."
npm pkg set scripts.test:auth:emulator="firebase emulators:start --only auth & sleep 5 && npm run test:e2e -- tests/e2e/auth/"
npm pkg set scripts.test:auth:real="PLAYWRIGHT_TEST=true npm run test:e2e -- tests/e2e/auth/auth-real-firebase.test.ts"
npm pkg set scripts.test:auth:all="npm run test:e2e -- tests/e2e/auth/"

# Create emulator data directory
mkdir -p emulator-data

echo "✅ Firebase Authentication setup complete!"
echo ""
echo "🚀 Next steps:"
echo "1. For Emulator Testing:"
echo "   npm run test:auth:emulator"
echo ""
echo "2. For Real Firebase Testing:"
echo "   - Set up a Firebase project at https://console.firebase.google.com"
echo "   - Replace demo values in tests/.env.test with real config"
echo "   - Create test users in Firebase Auth"
echo "   - Run: npm run test:auth:real"
echo ""
echo "3. Test current setup:"
echo "   npm run test:auth:all"
echo ""
echo "📚 Documentation:"
echo "   - Emulator setup: tests/setup/firebase-emulator-setup.md"
echo "   - Real Firebase: tests/setup/real-firebase-setup.md"
