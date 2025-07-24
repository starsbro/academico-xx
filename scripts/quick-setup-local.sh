#!/bin/bash

# Quick Setup Script for Local Development Performance Testing
# Use this when you need to test AI response performance with PDF uploads

echo "🚀 Local Development Setup for AI Performance Testing with PDF Support"
echo "======================================================================"
echo ""

echo "📋 Setup Instructions:"
echo ""
echo "🔥 Terminal 1 - Start Local TypeScript Backend (with PDF upload support):"
echo "   cd backend/functions"
echo "   npx ts-node src/local-server.ts"
echo ""
echo "🌐 Terminal 2 - Start Frontend Development Server:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "🧪 Terminal 3 - Run Performance Tests:"
echo "   ./scripts/test-ai-performance.sh"
echo ""

echo "📊 Alternative Test Commands:"
echo ""
echo "   # Run automated performance tests with visible browser:"
echo "   cd tests && npm run test:performance:local:headed"
echo ""
echo "   # Run specific AI response performance tests:"
echo "   cd tests && npm run test:performance:ai:headed"
echo ""
echo "   # Debug performance tests step-by-step:"
echo "   cd tests && npx playwright test performance/performance.spec.ts --config=performance.config.ts --headed --debug"
echo ""

echo "🔍 Environment Verification:"
echo ""
echo "   # Check frontend is running:"
echo "   curl -s http://localhost:3000 | grep -q 'Academico' && echo '✅ Frontend OK' || echo '❌ Frontend not running'"
echo ""
echo "   # Check local backend is running:"
echo "   curl -s http://localhost:5050 > /dev/null && echo '✅ Backend OK' || echo '❌ Backend not running'"
echo ""

echo "📚 Documentation:"
echo "   - Full setup guide: LOCAL_ENVIRONMENT_SETUP.md"
echo "   - Manual testing: tests/performance/MANUAL_TESTING_GUIDE.md"
echo ""

echo "🎯 Why Local TypeScript Server?"
echo "   - Direct access to Firebase Storage for PDF uploads"
echo "   - Faster development cycle (no compilation needed)"
echo "   - Better debugging with source maps"
echo "   - Hot reload for backend changes"
echo ""

echo "Ready to test AI response performance improvements! 🚀"
