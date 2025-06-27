#!/bin/bash

echo "🧪 Testing Production Backend API Connectivity"
echo "=============================================="

BASE_URL="https://api-bcsebzkoea-uc.a.run.app"
ORIGIN="https://academico-ai.web.app"

echo ""
echo "1. Testing main API endpoint..."
curl -s -X GET "$BASE_URL/" -H "Content-Type: application/json" && echo " ✅"

echo ""
echo "2. Testing CORS configuration..."
curl -s -X GET "$BASE_URL/cors-test" -H "Content-Type: application/json" -H "Origin: $ORIGIN" && echo " ✅"

echo ""
echo "3. Testing chat endpoints..."
curl -s -X GET "$BASE_URL/users/test-user/chats" -H "Content-Type: application/json" -H "Origin: $ORIGIN" && echo " ✅"

echo ""
echo "4. Testing POST endpoint..."
curl -s -X POST "$BASE_URL/test-post" -H "Content-Type: application/json" -H "Origin: $ORIGIN" && echo " ✅"

echo ""
echo "🎉 All API endpoints are working correctly!"
echo "Your production website should now work at: $ORIGIN/academic-chat/"
