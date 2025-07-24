#!/bin/bash

# Quick Manual AI Performance Test
# Use this to quickly test AI response performance in your browser

echo "🧪 Quick Manual AI Performance Test"
echo "===================================="
echo ""

echo "📋 Instructions for Manual Testing:"
echo ""
echo "1. 🌐 Open your browser and go to: http://localhost:3000/academic-chat"
echo ""
echo "2. 🔐 Sign in with your credentials (if required)"
echo ""
echo "3. ⏱️  Open Browser DevTools:"
echo "   - Press F12 or Cmd+Option+I (Mac)"
echo "   - Go to the Console tab"
echo "   - Go to the Network tab"
echo ""
echo "4. 🧠 Test AI Response Performance:"
echo "   Type these test questions and monitor the response times:"
echo ""
echo "   Simple Question (3-10 seconds expected):"
echo "   \"What is 2 + 2?\""
echo ""
echo "   Medium Question (8-20 seconds expected):"
echo "   \"Explain what React.js is\""
echo ""
echo "   Complex Question (15-45 seconds expected):"
echo "   \"Explain machine learning algorithms in detail\""
echo ""
echo "5. 📊 Monitor Performance:"
echo "   - Watch Console for [CHAT-REQUEST], [CHAT-RESPONSE], [CHAT-COMPLETE] logs"
echo "   - Check Network tab for request timing"
echo "   - Note response times for different question complexities"
echo ""
echo "6. ✅ Expected Results:"
echo "   - No errors in console"
echo "   - Smooth typing and submission"
echo "   - AI responses within reasonable time"
echo "   - Graceful timeout after 2 minutes if needed"
echo ""

echo "🔧 Environment Check:"
echo ""
# Check if services are running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend: http://localhost:3000 is running"
else
    echo "❌ Frontend not running - start with: cd frontend && npm run dev"
fi

if curl -s http://localhost:5050 > /dev/null; then
    echo "✅ Backend: http://localhost:5050 is running"
elif curl -s http://localhost:5000 > /dev/null; then
    echo "✅ Backend: http://localhost:5000 is running"  
else
    echo "❌ Backend not running - start with: cd backend/functions && npx ts-node src/local-server.ts"
fi

echo ""
echo "🚀 Ready for manual testing!"
echo "Open: http://localhost:3000/academic-chat"
