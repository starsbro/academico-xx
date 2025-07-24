#!/bin/bash

echo "🔧 Comprehensive Message Ordering Fix Test"
echo "=========================================="

# Check if servers are running
check_servers() {
    echo "🔍 Checking if required servers are running..."
    
    # Check frontend server (port 3000)
    if ! curl -s http://localhost:3000 > /dev/null; then
        echo "❌ Frontend server not running on localhost:3000"
        echo "   Run: cd frontend && npm run dev"
        return 1
    fi
    
    # Check backend server (port 5050)
    if ! curl -s http://localhost:5050 > /dev/null; then
        echo "❌ Backend server not running on localhost:5050"
        echo "   Run: cd backend && npx ts-node src/local-server.ts"
        return 1
    fi
    
    echo "✅ Both servers are running"
    return 0
}

# Display the changes made
show_changes() {
    echo ""
    echo "🛠️  Changes Made to Fix Message Ordering:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. 🧹 Added clearOptimisticMessages() function to useChat hook"
    echo "   - Removes all messages with IDs starting with 'local-'"
    echo "   - Prevents duplication of optimistic messages"
    echo ""
    echo "2. 📋 Enhanced chat submission flow:"
    echo "   - Clear any existing optimistic state first"
    echo "   - Add user message optimistically"
    echo "   - Show AI thinking indicator"
    echo "   - Clear optimistic messages before fetching server data"
    echo ""
    echo "3. 🔄 Added message sorting in fetchMessagesForChat:"
    echo "   - Sort by timestamp to ensure chronological order"
    echo "   - User messages always appear before AI responses"
    echo ""
    echo "4. 🚨 Improved error handling:"
    echo "   - Clear optimistic messages on errors"
    echo "   - Prevent message duplication in error scenarios"
}

# Display testing instructions
show_test_instructions() {
    echo ""
    echo "🧪 Manual Testing Instructions:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. 🌐 Open: http://localhost:3000/academic-chat"
    echo "2. 🔐 Sign in if required"
    echo "3. 💬 Send test messages one by one:"
    echo "   • 'Tell me a short joke'"
    echo "   • 'What is 2+2?'"
    echo "   • 'Explain photosynthesis briefly'"
    echo ""
    echo "4. ✅ For each message, verify:"
    echo "   • User message appears ABOVE AI response"
    echo "   • No duplicate messages"
    echo "   • Proper timestamps"
    echo "   • Smooth scrolling to latest message"
    echo ""
    echo "📊 Expected Message Flow:"
    echo "┌─────────────────────────────────────┐"
    echo "│ 👤 User: 'Tell me a short joke'    │"
    echo "├─────────────────────────────────────┤"
    echo "│ 🤖 AI: 'Why did the chicken...'    │"
    echo "├─────────────────────────────────────┤"
    echo "│ 👤 User: 'What is 2+2?'            │"
    echo "├─────────────────────────────────────┤"
    echo "│ 🤖 AI: '2+2 equals 4'              │"
    echo "└─────────────────────────────────────┘"
    echo ""
    echo "❌ Incorrect (Fixed):"
    echo "┌─────────────────────────────────────┐"
    echo "│ 🤖 AI: 'Why did the chicken...'    │"
    echo "├─────────────────────────────────────┤"
    echo "│ 👤 User: 'Tell me a short joke'    │ ← Wrong!"
    echo "└─────────────────────────────────────┘"
}

# Display browser DevTools monitoring info
show_debugging_info() {
    echo ""
    echo "🔍 Browser DevTools Monitoring:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Open Browser Console (F12) and watch for:"
    echo ""
    echo "✅ Expected Console Logs:"
    echo "   [CHAT-REQUEST] Starting chat request at..."
    echo "   [CHAT-RESPONSE] Received response after...ms"
    echo "   [CHAT-COMPLETE] Full request completed in...ms"
    echo ""
    echo "🐛 If Issues Persist:"
    echo "   1. Clear browser cache (Ctrl+Shift+Del)"
    echo "   2. Hard refresh (Ctrl+F5)"
    echo "   3. Check for JavaScript errors in Console"
    echo "   4. Verify authentication state"
    echo ""
    echo "📱 Mobile Testing:"
    echo "   • Test on responsive view (toggle device toolbar)"
    echo "   • Verify sidebar behavior on mobile"
    echo "   • Check touch interactions"
}

# Main execution
main() {
    if ! check_servers; then
        echo ""
        echo "🚨 Please start the required servers first!"
        exit 1
    fi
    
    show_changes
    show_test_instructions
    show_debugging_info
    
    echo ""
    echo "🚀 Ready to Test!"
    echo "Open: http://localhost:3000/academic-chat"
    echo ""
    echo "💡 Pro Tip: Send a few messages and observe the ordering."
    echo "   The fix ensures user messages always appear chronologically before AI responses."
}

main
