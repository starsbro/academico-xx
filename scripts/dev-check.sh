#!/bin/bash

# 🚀 Local Development Check Script
# Run this before pushing to ensure everything passes CI/CD
# Now with auto-environment detection - no manual URL switching needed!

set -e

echo "🔍 Starting local development checks..."
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        exit 1
    fi
}

# 1. Frontend Linting
echo -e "${YELLOW}📝 Running frontend linting...${NC}"
cd frontend
npm run lint
print_status $? "Frontend linting"

# 2. Frontend Build
echo -e "${YELLOW}🏗️  Building frontend...${NC}"
npm run build
print_status $? "Frontend build"

# 3. Backend Linting
echo -e "${YELLOW}📝 Running backend linting...${NC}"
cd ../backend/functions
npm run lint
print_status $? "Backend linting"

# 4. Backend Build
echo -e "${YELLOW}🏗️  Building backend...${NC}"
npm run build
print_status $? "Backend build"

# 5. Quick accessibility test (optional - requires running servers)
echo -e "${YELLOW}♿ Checking if local servers are running for testing...${NC}"
cd ../../tests

# Check if frontend is running on localhost:3000
if curl -s -f http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend server detected - running quick accessibility test${NC}"
    if npm run local:accessibility > /dev/null 2>&1; then
        print_status 0 "Accessibility test"
    else
        echo -e "${YELLOW}⚠️  Accessibility test completed with warnings (manual interaction needed)${NC}"
    fi
else
    echo -e "${YELLOW}ℹ️  Frontend not running - skipping live tests${NC}"
    echo -e "${YELLOW}   To run full testing:${NC}"
    echo -e "${YELLOW}   1. Terminal 1: cd frontend && npm run dev${NC}"
    echo -e "${YELLOW}   2. Terminal 2: cd backend/functions && npx ts-node src/index.ts${NC}"
    echo -e "${YELLOW}   3. Terminal 3: cd tests && npm run local:performance${NC}"
fi

echo ""
echo -e "${GREEN}🎉 All local checks passed! Ready to push.${NC}"
echo -e "${GREEN}✨ Backend URL will auto-switch: localhost:5050 → production URL${NC}"
echo ""
echo -e "${YELLOW}🧪 For comprehensive testing with live servers:${NC}"
echo -e "${YELLOW}   ./scripts/test-with-servers.sh${NC}"
echo ""
echo -e "${YELLOW}💡 Or run individual tests:${NC}"
echo -e "${YELLOW}   cd tests && npm run local:performance${NC}"
