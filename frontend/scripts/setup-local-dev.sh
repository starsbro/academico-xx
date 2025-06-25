#!/bin/bash

# Local Development Script
# This script sets up the environment for local development with emulators

echo "🚀 Setting up LOCAL DEVELOPMENT environment..."

# Backup current .env.local if it exists
if [ -f ".env.local" ]; then
    cp .env.local .env.local.backup
    echo "📦 Backed up current .env.local to .env.local.backup"
fi

# Copy development environment to .env.local
cp .env.development .env.local
echo "✅ Copied .env.development to .env.local"

echo "🔧 Local development environment configured!"
echo "📋 Current settings:"
echo "   - Backend URL: http://127.0.0.1:5001/academico-ai/us-central1/api"
echo "   - Firebase Emulators: ENABLED"
echo "   - Environment: development"
echo ""
echo "💡 Don't forget to start your Firebase emulators with:"
echo "   firebase emulators:start"
echo ""
echo "🏃 Start development server with:"
echo "   npm run dev"
