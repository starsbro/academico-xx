#!/bin/bash

echo "🧪 Testing CORS Configuration..."

# Test basic API endpoint
echo "1. Testing basic API endpoint:"
curl -X GET http://localhost:5001/academico-ai/us-central1/api/ \
  -H "Origin: http://localhost:3000" \
  -v

echo -e "\n\n2. Testing CORS preflight:"
curl -X OPTIONS http://localhost:5001/academico-ai/us-central1/api/cors-test \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

echo -e "\n\n3. Testing CORS test endpoint:"
curl -X GET http://localhost:5001/academico-ai/us-central1/api/cors-test \
  -H "Origin: http://localhost:3000" \
  -v
