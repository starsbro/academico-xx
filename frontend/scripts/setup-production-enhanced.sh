#!/bin/bash

# Enhanced Production Build Script with Deployment Tracking
# This script sets up the environment for production builds and tracks deployment metadata

echo "🌐 Setting up PRODUCTION BUILD environment with deployment tracking..."

# Get current git information
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
CURRENT_COMMIT=$(git rev-parse --short HEAD)
CURRENT_COMMIT_FULL=$(git rev-parse HEAD)
BUILD_TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
BUILD_USER=$(whoami)

echo "📊 Deployment Information:"
echo "   - Branch: $CURRENT_BRANCH"
echo "   - Commit: $CURRENT_COMMIT ($CURRENT_COMMIT_FULL)"
echo "   - Build Time: $BUILD_TIMESTAMP"
echo "   - Build User: $BUILD_USER"
echo ""

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  WARNING: Working directory has uncommitted changes!"
    echo "   Consider committing changes before production deployment."
    echo ""
fi

# Backup current .env.local if it exists
if [ -f ".env.local" ]; then
    cp .env.local .env.local.backup
    echo "📦 Backed up current .env.local to .env.local.backup"
fi

# Copy production environment to .env.local
cp .env.production .env.local

# Add deployment tracking variables to .env.local
echo "" >> .env.local
echo "# Deployment Tracking (Auto-generated)" >> .env.local
echo "NEXT_PUBLIC_BUILD_BRANCH=$CURRENT_BRANCH" >> .env.local
echo "NEXT_PUBLIC_BUILD_COMMIT=$CURRENT_COMMIT" >> .env.local
echo "NEXT_PUBLIC_BUILD_COMMIT_FULL=$CURRENT_COMMIT_FULL" >> .env.local
echo "NEXT_PUBLIC_BUILD_TIMESTAMP=$BUILD_TIMESTAMP" >> .env.local
echo "NEXT_PUBLIC_BUILD_USER=$BUILD_USER" >> .env.local

echo "✅ Copied .env.production to .env.local with deployment tracking"

# Create deployment log entry
DEPLOY_LOG="deployment.log"
echo "[$BUILD_TIMESTAMP] Branch: $CURRENT_BRANCH | Commit: $CURRENT_COMMIT | User: $BUILD_USER" >> $DEPLOY_LOG

echo "🏗️ Production build environment configured!"
echo "📋 Current settings:"
echo "   - Backend URL: https://api-bcsebzkoea-uc.a.run.app"
echo "   - Firebase Emulators: DISABLED"
echo "   - Environment: production"
echo "   - Branch: $CURRENT_BRANCH"
echo "   - Commit: $CURRENT_COMMIT"
echo ""
echo "🔨 Build for production with:"
echo "   npm run build"
echo ""
echo "🚀 Deploy with:"
echo "   npm run deploy"
echo ""
echo "📝 Deployment logged to: $DEPLOY_LOG"
