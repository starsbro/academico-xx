#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting comprehensive validation...${NC}"

# Function to run a command and check its status
run_step() {
    local step_name="$1"
    local command="$2"
    
    echo -e "${YELLOW}📋 Running: $step_name${NC}"
    
    if eval $command; then
        echo -e "${GREEN}✅ $step_name - PASSED${NC}"
        return 0
    else
        echo -e "${RED}❌ $step_name - FAILED${NC}"
        return 1
    fi
}

# Initialize error counter
errors=0

# Step 1: Lint Frontend (if exists)
if [ -d "frontend" ]; then
    if ! run_step "Frontend Linting" "npm run lint:frontend"; then
        ((errors++))
    fi
else
    echo -e "${YELLOW}⚠️  Frontend directory not found, skipping frontend lint${NC}"
fi

# Step 2: Lint Backend (if exists)
if [ -d "backend/functions" ]; then
    if ! run_step "Backend Linting" "npm run lint:backend"; then
        ((errors++))
    fi
else
    echo -e "${YELLOW}⚠️  Backend functions directory not found, skipping backend lint${NC}"
fi

# Step 3: Build Frontend (if exists)
if [ -d "frontend" ]; then
    if ! run_step "Frontend Build" "npm run build:frontend"; then
        ((errors++))
    fi
else
    echo -e "${YELLOW}⚠️  Frontend directory not found, skipping frontend build${NC}"
fi

# Step 4: Build Backend (if exists)  
if [ -d "backend/functions" ]; then
    if ! run_step "Backend Build" "npm run build:functions"; then
        ((errors++))
    fi
else
    echo -e "${YELLOW}⚠️  Backend functions directory not found, skipping backend build${NC}"
fi

# Step 5: Run Unit Tests (if configured)
if npm run | grep -q "test:unit"; then
    if ! run_step "Unit Tests" "npm run test:unit"; then
        ((errors++))
    fi
else
    echo -e "${YELLOW}⚠️  Unit tests not configured, skipping${NC}"
fi

# Summary
echo ""
echo "=================================="
if [ $errors -eq 0 ]; then
    echo -e "${GREEN}🎉 All validation steps passed! Ready for CI/CD.${NC}"
    echo -e "${GREEN}✅ All available components validated successfully${NC}"
    exit 0
else
    echo -e "${RED}❌ $errors validation step(s) failed!${NC}"
    echo -e "${RED}Please fix the issues before proceeding to CI/CD.${NC}"
    exit 1
fi
