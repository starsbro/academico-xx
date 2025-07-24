#!/bin/bash

# Simple AI Response Time Test
# Tests actual AI response time in the browser

echo "⏱️  Simple AI Response Time Test"
echo "==============================="
echo ""

# Check environment
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Frontend not running - start with: cd frontend && npm run dev"
    exit 1
fi

if ! curl -s http://localhost:5050 > /dev/null && ! curl -s http://localhost:5000 > /dev/null; then
    echo "❌ Backend not running - start with: cd backend/functions && npx ts-node src/local-server.ts"
    exit 1
fi

echo "✅ Environment ready - running AI response time test..."
echo ""

# Run a focused test with visible browser for real-time monitoring
cd tests

echo "🧪 Running AI response time test with visible browser..."
echo "   You'll see the browser open and test AI responses"
echo "   Watch the console output for timing details"
echo ""

npx playwright test performance/performance.spec.ts \
  --config=performance.config.ts \
  --headed \
  --grep="AI chat response should complete within performance threshold" \
  --reporter=line

echo ""
echo "🔍 For more detailed testing:"
echo "   1. Manual testing: ./scripts/monitor-ai-response-time.sh"
echo "   2. Multiple question types: cd tests && npm run test:performance:local:headed"
echo "   3. Browser DevTools: Network tab shows request timing breakdown"
