#!/bin/bash

echo "🔍 Environment Detection Test"
echo "============================="

echo ""
echo "Testing how the app detects local vs production environment:"
echo ""

# Check current environment
if [[ "$1" == "local" ]]; then
    echo "🏠 Testing LOCAL environment detection:"
    echo "   • URL: http://localhost:3000"
    echo "   • NODE_ENV: development"
    echo "   • Expected delay: 300ms"
    echo "   • Log prefix: LOCAL mode"
elif [[ "$1" == "production" ]]; then
    echo "🌐 Testing PRODUCTION environment detection:"
    echo "   • URL: https://academico-ai.web.app"
    echo "   • NODE_ENV: production"
    echo "   • Expected delay: 600ms (fast) / 800ms (slow)"
    echo "   • Log prefix: PRODUCTION mode"
else
    echo "Usage: $0 [local|production]"
    echo ""
    echo "🏠 LOCAL environment:"
    echo "   • http://localhost:3000"
    echo "   • 300ms sync delay"
    echo "   • Log: 'LOCAL mode: Waiting 300ms'"
    echo ""
    echo "🌐 PRODUCTION environment:"
    echo "   • https://academico-ai.web.app"
    echo "   • 600ms base sync delay"
    echo "   • Log: 'PRODUCTION mode: Waiting 600ms'"
    echo ""
    echo "🧪 Test both environments after deployment to verify the fix!"
fi
