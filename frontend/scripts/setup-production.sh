#!/bin/bash

# Production Build Script
# This script sets up the environment for production builds

echo "🌐 Setting up PRODUCTION BUILD environment..."

# Backup current .env.local if it exists
if [ -f ".env.local" ]; then
    cp .env.local .env.local.backup
    echo "📦 Backed up current .env.local to .env.local.backup"
fi

# Copy production environment to .env.local
cp .env.production .env.local
echo "✅ Copied .env.production to .env.local"

echo "🏗️ Production build environment configured!"
echo "📋 Current settings:"
echo "   - Backend URL: https://api-bcsebzkoea-uc.a.run.app"
echo "   - Firebase Emulators: DISABLED"
echo "   - Environment: production"
echo ""
echo "🔨 Build for production with:"
echo "   npm run build"
echo ""
echo "🚀 Deploy with:"
echo "   npm run deploy"
