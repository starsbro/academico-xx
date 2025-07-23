#!/bin/bash
echo "🔥 Testing Firebase Authentication Setup..."

# Get the absolute path of the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"

echo "Project root: $PROJECT_ROOT"

# Ensure we're in the right directory
cd "$PROJECT_ROOT"

# Check if we're in the project root
if [ ! -f "package.json" ]; then
    echo "❌ Not in project root directory"
    exit 1
fi

echo "Starting frontend..."

# Kill any existing processes on ports 3000 and 3001
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Start frontend in background
cd "$PROJECT_ROOT/frontend" && npm run dev &
FRONTEND_PID=$!

# Wait a moment for the process to start
sleep 3

# Try to detect which port the frontend is using
FRONTEND_URL=""
if curl -s http://localhost:3000 >/dev/null 2>&1; then
    FRONTEND_URL="http://localhost:3000"
    echo "✅ Frontend running on port 3000"
elif curl -s http://localhost:3001 >/dev/null 2>&1; then
    FRONTEND_URL="http://localhost:3001"
    echo "✅ Frontend running on port 3001"
else
    echo "⏳ Waiting for frontend to start..."
    # Wait for either port to be ready
    npx wait-on http://localhost:3000,http://localhost:3001 --timeout 30000
    
    if curl -s http://localhost:3000 >/dev/null 2>&1; then
        FRONTEND_URL="http://localhost:3000"
    elif curl -s http://localhost:3001 >/dev/null 2>&1; then
        FRONTEND_URL="http://localhost:3001"
    fi
fi

if [ -z "$FRONTEND_URL" ]; then
    echo "❌ Frontend failed to start on either port 3000 or 3001"
    kill $FRONTEND_PID 2>/dev/null
    exit 1
fi

echo "✅ Frontend ready at $FRONTEND_URL, running authentication tests..."

# Go back to project root
cd "$PROJECT_ROOT"

# Load test environment variables
if [ -f "$PROJECT_ROOT/tests/.env.test" ]; then
    set -a  # automatically export all variables
    source "$PROJECT_ROOT/tests/.env.test"
    set +a  # stop automatically exporting
    echo "✅ Loaded test environment variables"
    echo "   - Using test user: $TEST_USER_EMAIL"
    echo "   - Firebase project: $NEXT_PUBLIC_FIREBASE_PROJECT_ID"
else
    echo "❌ tests/.env.test not found"
    echo "   Current directory: $(pwd)"
    echo "   Looking for: $PROJECT_ROOT/tests/.env.test"
    kill $FRONTEND_PID
    exit 1
fi

# Set the frontend URL for tests
export FRONTEND_BASE_URL=$FRONTEND_URL

# Run the authentication tests
npm run test:e2e -- tests/e2e/auth/auth-real-firebase.test.ts --headed
TEST_RESULT=$?

echo "Stopping frontend..."
kill $FRONTEND_PID

if [ $TEST_RESULT -eq 0 ]; then
    echo "✅ Firebase authentication tests passed!"
else
    echo "❌ Firebase authentication tests failed."
fi

exit $TEST_RESULT
