#!/bin/bash

echo "🔥 Real Firebase Authentication Setup"
echo "===================================="

# Check if user wants to proceed
read -p "Do you want to set up real Firebase authentication? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Setup cancelled."
    exit 1
fi

echo "📋 You'll need to:"
echo "1. Create a Firebase project (or use existing)"
echo "2. Enable Email/Password authentication"
echo "3. Create test users"
echo "4. Get Firebase configuration"
echo ""

# Collect Firebase configuration
echo "🔧 Enter your Firebase configuration:"
echo "(Get this from Firebase Console → Project Settings → General → Your apps)"
echo ""

read -p "Firebase API Key: " FIREBASE_API_KEY
read -p "Firebase Auth Domain (e.g., your-project.firebaseapp.com): " FIREBASE_AUTH_DOMAIN
read -p "Firebase Project ID: " FIREBASE_PROJECT_ID
read -p "Firebase Storage Bucket (e.g., your-project.appspot.com): " FIREBASE_STORAGE_BUCKET
read -p "Firebase Messaging Sender ID: " FIREBASE_MESSAGING_SENDER_ID
read -p "Firebase App ID: " FIREBASE_APP_ID

echo ""
echo "👤 Enter test user credentials:"
echo "(Create these users in Firebase Console → Authentication → Users)"
echo ""

read -p "Test User Email: " TEST_USER_EMAIL
read -s -p "Test User Password: " TEST_USER_PASSWORD
echo ""

# Create frontend environment file
echo "📝 Creating frontend/.env.local..."
cat > frontend/.env.local << EOL
# Firebase Configuration for Real Authentication
NEXT_PUBLIC_FIREBASE_API_KEY=${FIREBASE_API_KEY}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${FIREBASE_AUTH_DOMAIN}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${FIREBASE_STORAGE_BUCKET}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${FIREBASE_MESSAGING_SENDER_ID}
NEXT_PUBLIC_FIREBASE_APP_ID=${FIREBASE_APP_ID}

# Development Environment
NODE_ENV=development
EOL

# Create test environment file
echo "📝 Creating tests/.env.test..."
cat > tests/.env.test << EOL
# Firebase Test Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=${FIREBASE_API_KEY}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${FIREBASE_AUTH_DOMAIN}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${FIREBASE_STORAGE_BUCKET}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${FIREBASE_MESSAGING_SENDER_ID}
NEXT_PUBLIC_FIREBASE_APP_ID=${FIREBASE_APP_ID}

# Test User Credentials
TEST_USER_EMAIL=${TEST_USER_EMAIL}
TEST_USER_PASSWORD=${TEST_USER_PASSWORD}

# Test Environment
NODE_ENV=test
PLAYWRIGHT_TEST=true
EOL

# Update package.json scripts
echo "📦 Adding test scripts to package.json..."
npm pkg set scripts.test:auth:real="PLAYWRIGHT_TEST=true npm run test:e2e -- tests/e2e/auth/auth-real-firebase.test.ts"
npm pkg set scripts.test:auth:local="source tests/.env.test && npm run test:auth:real"

# Create a quick test script
echo "🧪 Creating quick test script..."
cat > test-firebase-auth.sh << EOL
#!/bin/bash
echo "🔥 Testing Firebase Authentication Setup..."
echo "Starting frontend..."

# Start frontend in background
cd frontend && npm run dev &
FRONTEND_PID=\$!

# Wait for frontend to be ready
echo "Waiting for frontend to start..."
npx wait-on http://localhost:3000 --timeout 30000

if [ \$? -eq 0 ]; then
    echo "✅ Frontend ready, running authentication tests..."
    cd ..
    source tests/.env.test
    npm run test:e2e -- tests/e2e/auth/auth-real-firebase.test.ts --headed
    TEST_RESULT=\$?
    
    echo "Stopping frontend..."
    kill \$FRONTEND_PID
    
    if [ \$TEST_RESULT -eq 0 ]; then
        echo "✅ Firebase authentication tests passed!"
    else
        echo "❌ Firebase authentication tests failed."
    fi
else
    echo "❌ Frontend failed to start"
    kill \$FRONTEND_PID 2>/dev/null
fi
EOL

chmod +x test-firebase-auth.sh

echo ""
echo "✅ Firebase authentication setup complete!"
echo ""
echo "🎯 Setting up real Firebase authentication for testing..."
echo ""
echo "📚 Documentation:"
echo "   Setup Guide: docs/setup/FIREBASE_TEST_ACCOUNT_SETUP.md"
echo "   GitHub CI/CD: docs/setup/GITHUB_SECRETS_FIREBASE_SETUP.md"
echo "   Troubleshooting: docs/troubleshooting/AUTHENTICATION_PERSISTENCE_SOLUTION.md"
