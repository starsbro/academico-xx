#!/bin/bash

# Deployment Info Checker
# This script shows the current deployment information

echo "🔍 Current Deployment Information"
echo "=================================="

# Check if we have deployment info in .env.local
if [ -f ".env.local" ]; then
    echo "📋 Environment Configuration:"
    echo "   $(grep NEXT_PUBLIC_ENV .env.local 2>/dev/null || echo 'Environment: unknown')"
    echo "   $(grep NEXT_PUBLIC_BACKEND_URL .env.local 2>/dev/null || echo 'Backend URL: not set')"
    echo ""
    
    # Show build information if available
    if grep -q "NEXT_PUBLIC_BUILD_BRANCH" .env.local 2>/dev/null; then
        echo "🚀 Last Build Information:"
        echo "   $(grep NEXT_PUBLIC_BUILD_BRANCH .env.local)"
        echo "   $(grep NEXT_PUBLIC_BUILD_COMMIT .env.local)"
        echo "   $(grep NEXT_PUBLIC_BUILD_TIMESTAMP .env.local)"
        echo "   $(grep NEXT_PUBLIC_BUILD_USER .env.local)"
        echo ""
    else
        echo "⚠️  No build tracking information found"
        echo "   Use 'npm run setup:production:enhanced' for tracked builds"
        echo ""
    fi
else
    echo "❌ No .env.local file found"
    echo ""
fi

# Check deployment log if it exists
if [ -f "deployment.log" ]; then
    echo "📝 Recent Deployments:"
    tail -5 deployment.log
    echo ""
else
    echo "📝 No deployment log found"
    echo ""
fi

# Show current git status
echo "📊 Current Git Status:"
echo "   Branch: $(git rev-parse --abbrev-ref HEAD)"
echo "   Commit: $(git rev-parse --short HEAD)"
echo "   Status: $(git status --porcelain | wc -l | tr -d ' ') uncommitted changes"
echo ""

# Show available commands
echo "🛠️  Available Commands:"
echo "   npm run check:deployment     - Show this information"
echo "   npm run setup:local          - Setup for local development"
echo "   npm run setup:production     - Setup for production (basic)"
echo "   npm run setup:production:enhanced - Setup with deployment tracking"
echo "   npm run deploy:enhanced      - Build and deploy with tracking"
