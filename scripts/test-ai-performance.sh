#!/bin/bash

# AI Response Performance Verification Script
# Run this script to quickly test if AI response delays are reduced
# Uses local development environment (frontend + Firebase emulators)

echo "🚀 AI Response Performance Verification"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if tests directory exists
if [ ! -d "tests" ]; then
    echo "❌ Error: Tests directory not found"
    exit 1
fi

echo "🔍 Checking local development environment..."
echo ""

# Check if frontend dev server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend dev server is running (http://localhost:3000)"
else
    echo "❌ Frontend dev server is not running!"
    echo "   Please start it with: cd frontend && npm run dev"
    echo ""
    exit 1
fi

# Check if Firebase emulators are running
if curl -s http://localhost:5050 > /dev/null; then
    echo "✅ Local backend server is running (http://localhost:5050)"
elif curl -s http://localhost:5000 > /dev/null; then
    echo "✅ Local backend server is running (http://localhost:5000)"
else
    echo "❌ Local backend server is not running!"
    echo "   Please start it with: cd backend/functions && npx ts-node src/local-server.ts"
    echo ""
    exit 1
fi

echo ""
echo "📋 Running AI Response Performance Tests..."
echo "   Using local frontend (localhost:3000)"
echo "   Using local TypeScript backend server"
echo ""

# Navigate to tests directory
cd tests

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing test dependencies..."
    npm install
fi

# Run the AI response performance tests with local environment
echo "🧪 Running automated AI response performance tests..."
echo ""

npx playwright test performance/performance.spec.ts --config=performance.config.ts --reporter=line

# Check the exit code
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ AI Response Performance Tests PASSED!"
    echo ""
    echo "🎯 Performance Improvements Verified:"
    echo "   • AI responses complete within timeout limits"
    echo "   • Performance logging is working"
    echo "   • Timeout handling is functional"
    echo "   • Multiple requests work efficiently"
    echo ""
    echo "📊 Next Steps:"
    echo "   1. Test manually with real questions"
    echo "   2. Monitor console logs during usage"
    echo "   3. Check response times in browser DevTools"
    echo ""
    echo "📖 For manual testing guide, see:"
    echo "   tests/performance/MANUAL_TESTING_GUIDE.md"
    echo ""
else
    echo ""
    echo "❌ AI Response Performance Tests FAILED!"
    echo ""
    echo "🔍 Troubleshooting Steps:"
    echo "   1. Check if the development server is running"
    echo "   2. Verify backend functions are deployed"
    echo "   3. Check network connectivity"
    echo "   4. Review browser console for errors"
    echo ""
    echo "📖 For detailed troubleshooting, see:"
    echo "   docs/troubleshooting/ai-response-performance.md"
    echo ""
    exit 1
fi

echo "🏁 Performance verification complete!"
echo ""
