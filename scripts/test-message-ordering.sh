#!/bin/bash

# Test Message Ordering Fix
# Verifies that user messages appear before AI responses

echo "🔄 Testing Message Ordering Fix"
echo "==============================="
echo ""

# Check environment
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Frontend not running - start with: cd frontend && npm run dev"
    exit 1
fi

if ! curl -s http://localhost:5050 > /dev/null; then
    echo "❌ Backend not running - start with: cd backend/functions && npx ts-node src/local-server.ts"
    exit 1
fi

echo "✅ Environment ready - testing message ordering..."
echo ""

echo "📋 Manual Test Instructions:"
echo ""
echo "1. 🌐 Open: http://localhost:3000/academic-chat"
echo "2. 🔐 Sign in if required"
echo "3. 💬 Send a test message like: 'Tell me a short joke'"
echo "4. ⏳ Wait for the AI response"
echo "5. ✅ Verify the message order is correct:"
echo ""
echo "   Expected Order:"
echo "   ┌─────────────────────────────────┐"
echo "   │ 👤 User: \"Tell me a short joke\" │"
echo "   ├─────────────────────────────────┤" 
echo "   │ 🤖 AI: \"Why did the...\"        │"
echo "   └─────────────────────────────────┘"
echo ""
echo "   ❌ Incorrect order (FIXED):"
echo "   ┌─────────────────────────────────┐"
echo "   │ 🤖 AI: \"Why did the...\"        │"
echo "   ├─────────────────────────────────┤"
echo "   │ 👤 User: \"Tell me a short joke\" │"
echo "   └─────────────────────────────────┘"
echo ""

echo "🔍 What to Look For:"
echo "   • User message appears ABOVE AI response"
echo "   • No duplicate messages"
echo "   • Timestamps are in correct chronological order"
echo "   • Scroll position stays at bottom after response"
echo ""

echo "📊 Console Logs to Monitor:"
echo "   • [CHAT-REQUEST] - When request starts"
echo "   • [CHAT-RESPONSE] - When AI responds"  
echo "   • [CHAT-COMPLETE] - When UI updates complete"
echo ""

echo "🐛 If Issue Persists:"
echo "   1. Clear browser cache and refresh"
echo "   2. Check browser DevTools Console for errors"
echo "   3. Verify both servers are running on correct ports"
echo ""

echo "🚀 Open: http://localhost:3000/academic-chat"
echo "Ready to test message ordering fix!"
