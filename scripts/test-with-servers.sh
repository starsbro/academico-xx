#!/bin/bash

# 🚀 Local Full Testing Script
# Starts all servers and runs comprehensive local tests

echo "🔄 Starting Local Full Testing Environment"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Check if servers are already running
frontend_running=false
backend_running=false

echo -e "${BLUE}🔍 Checking if servers are already running...${NC}"

if curl -s -f http://localhost:3000 > /dev/null 2>&1; then
    frontend_running=true
    echo -e "${GREEN}✅ Frontend already running on localhost:3000${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend not running on localhost:3000${NC}"
fi

if curl -s -f http://localhost:5050/health > /dev/null 2>&1; then
    backend_running=true
    echo -e "${GREEN}✅ Backend already running on localhost:5050${NC}"
else
    echo -e "${YELLOW}⚠️  Backend not running on localhost:5050${NC}"
fi

# If servers aren't running, provide instructions
if [ "$frontend_running" = false ] || [ "$backend_running" = false ]; then
    echo ""
    echo -e "${YELLOW}📋 To run full local testing, you need both servers running:${NC}"
    echo ""
    
    if [ "$frontend_running" = false ]; then
        echo -e "${YELLOW}🖥️  Terminal 1 - Start Frontend:${NC}"
        echo -e "${BLUE}   cd frontend && npm run dev${NC}"
        echo ""
    fi
    
    if [ "$backend_running" = false ]; then
        echo -e "${YELLOW}🔧 Terminal 2 - Start Backend:${NC}"
        echo -e "${BLUE}   cd backend/functions && npx ts-node src/index.ts${NC}"
        echo ""
    fi
    
    echo -e "${YELLOW}🧪 Terminal 3 - Run Tests (after servers start):${NC}"
    echo -e "${BLUE}   ./scripts/test-with-servers.sh${NC}"
    echo ""
    echo -e "${RED}⚠️  Exiting - please start the required servers first${NC}"
    exit 1
fi

# Both servers are running, proceed with tests
echo ""
echo -e "${GREEN}🎉 Both servers detected! Running comprehensive tests...${NC}"
echo ""

cd tests

# 1. Quick Smoke Test
echo -e "${YELLOW}🔥 Running smoke test...${NC}"
npm run local:smoke
print_status $? "Smoke test"

# 2. Accessibility Test
echo -e "${YELLOW}♿ Running accessibility test...${NC}"
npm run local:accessibility
print_status $? "Accessibility test"

# 3. Performance Test
echo -e "${YELLOW}⚡ Running performance test...${NC}"
npm run local:performance
print_status $? "Performance test"

echo ""
echo -e "${GREEN}🎉 All local tests completed successfully!${NC}"
echo -e "${GREEN}✨ Your app is working perfectly with:${NC}"
echo -e "${GREEN}   🏠 Development: http://localhost:5050${NC}"
echo -e "${GREEN}   ☁️  Production: https://api-bcsebzkoea-uc.a.run.app${NC}"
echo ""
echo -e "${YELLOW}💡 Ready to deploy! Run: ./scripts/dev-check.sh && git push${NC}"
