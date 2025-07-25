# GitHub Actions Workflows

This directory contains GitHub Actions workflows for CI/CD automation.

## Workflows Overview

### 1. `ci.yml` - Continuous Integration

**Triggers:** Push to `main`, `dev`, `develop` branches, and PRs to these branches
**Purpose:** Runs linting and builds for both frontend and backend (tests moved to local development)

**Jobs:**

- **Frontend CI**: Lints and builds the Next.js frontend
- **Backend CI**: Lints and builds the Firebase Functions backend

### 2. `deploy.yml` - Main Deployment Workflow

**Triggers:** Push to `main`, `develop` branches, and PRs to `main`
**Purpose:** Comprehensive CI/CD pipeline with deployment

**Jobs:**

- **Lint & Build**: Runs linting and builds for both frontend and backend
- **Build Frontend**: Builds the frontend and uploads artifacts
- **Deploy**: Deploys to Firebase (only on main branch pushes)
- **Preview**: Creates preview deployments for PRs

### 3. `test.yml` - Test & Quality Checks (DISABLED)

**Status:** ⚠️ **DISABLED - Use Local Testing Instead**
**Purpose:** Previously ran comprehensive test suite, now replaced with local testing approach

**Local Testing Alternative:**

```bash
# Run tests locally instead of CI/CD
cd tests
npm run local:accessibility    # 30s - accessibility validation
npm run local:performance     # 2min - performance testing
npm run local:smoke          # 30s - basic functionality
```

### 4. `e2e-tests.yml` - E2E Tests (DISABLED)

**Status:** ⚠️ **DISABLED - Use Local Testing Instead**
**Purpose:** Previously ran E2E tests across browsers, now replaced with local development testing

### 5. `firebase-hosting-merge.yml` - Firebase Auto-Deploy

**Triggers:** Push to `main` branch
**Purpose:** Auto-generated Firebase hosting deployment

### 6. `firebase-hosting-pull-request.yml` - Firebase Preview

**Triggers:** Pull requests
**Purpose:** Creates preview deployments for PRs

### 7. `release.yml` - Release Management

**Triggers:** Git tags matching `v*` pattern
**Purpose:** Creates releases and deploys tagged versions

## Local Development Approach

We prioritize **local development** for faster feedback and reduced CI/CD dependency:

### 🚀 **Why Local Development?**

- **Fast feedback**: Immediate linting/build results vs waiting for CI/CD
- **Visual debugging**: See tests run in real browser, catch build errors instantly
- **No deployment blocking**: Fix issues before pushing to CI/CD
- **Real environment**: Test actual localhost setup with immediate iteration
- **Cost effective**: Reduce CI/CD pipeline usage and minutes

### 🧪 **Local Development Commands**

```bash
# Setup (one-time)
cd tests
npm install
npm run install:browsers:chromium

# Option 1: Quick pre-push check (automated)
./scripts/dev-check.sh      # Runs lint + build + quick accessibility test

# Option 2: Manual step-by-step
# 1. Linting & Building
cd frontend
npm run lint              # ESLint check
npm run build            # Build validation
cd ../backend/functions
npm run lint              # Backend linting
npm run build            # Backend build

# 2. Testing
cd ../../tests
npm run local:accessibility    # Validate ARIA labels, titles (30s)
npm run local:performance     # Test 50ms delays, message ordering (2min)
npm run local:smoke          # Basic functionality check (30s)
npm run local:debug         # Debug mode with dev tools
```

### 📁 **Local Development Coverage**

- **Code Quality**: ESLint linting for frontend and backend
- **Build Validation**: Frontend build (Next.js) and backend build (TypeScript)
- **Accessibility**: Send button titles, ARIA labels, keyboard navigation
- **Performance**: 50ms local delays vs 300ms production, message ordering
- **Authentication**: Protected route testing with manual sign-in
- **UI Components**: Chat interface, PDF upload, dark/light modes

## Required GitHub Secrets

You need to add these secrets to your GitHub repository:

### Firebase Configuration

- `FIREBASE_SERVICE_ACCOUNT_ACADEMICO_AI`: Firebase service account JSON
- `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase Web API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase Auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Firebase Project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Firebase Storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebase Messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Firebase App ID

### How to Add Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret with the appropriate value

## Usage Examples

### Automatic Deployment

```bash
# Push to main branch triggers deployment
git push origin main
```

### Preview Deployment

```bash
# Create a PR to main branch to get a preview deployment
git checkout -b feature/new-feature
git push origin feature/new-feature
# Create PR on GitHub
```

### Create a Release

```bash
# Tag a commit to create a release
git tag v1.0.0
git push origin v1.0.0
```

## Workflow Dependencies

```
Local Development → lint + build + test locally → Push clean code
     ↓
Push to main → ci.yml (final validation) → deploy.yml → Firebase Live
     ↓
Pull Request → ci.yml (final validation) → firebase-hosting-pull-request.yml → Firebase Preview
     ↓
Git Tag → release.yml → Firebase Production + GitHub Release
```

## Troubleshooting

### Common Issues

1. **Build Failures**: Check that all dependencies are correctly listed in package.json
2. **Environment Variables**: Ensure all Firebase secrets are properly configured
3. **Path Issues**: Verify that working-directory paths match your project structure
4. **Firebase Permissions**: Ensure the service account has the necessary permissions
5. **Local Testing**: For test failures, run local tests with `npm run local:debug` for visual inspection

### Debugging

- Check the Actions tab in your GitHub repository for detailed logs
- Verify that your Firebase project is properly configured
- Test builds locally before pushing to ensure they work in CI
- **For test debugging**: Use local testing commands with headed browser mode

## Customization

You can customize these workflows by:

1. **Adding more lint rules** in the CI jobs
2. **Modifying trigger conditions** (branches, paths)
3. **Adding additional deployment targets** (staging, development)
4. **Including more quality checks** (code coverage, security scans)
5. **Adding notification steps** (Slack, email, etc.)
6. **Expanding local testing**: Add more test scenarios in `tests/` directory

## Local vs CI/CD Development Strategy

### 🏠 **What Runs Locally (Primary Development)**

- Code linting (ESLint) - `npm run lint`
- TypeScript compilation - `npm run build`
- Build validation - Frontend & backend builds
- Accessibility testing - ARIA labels, keyboard navigation
- Performance testing - Message ordering, delay optimization
- E2E functionality testing - Chat interface, authentication
- Visual regression testing - UI component validation

### ☁️ **What Runs in CI/CD (Validation & Deployment)**

- Final lint check (safety net)
- Final build validation (deployment readiness)
- Deployment to Firebase
- Artifact generation and storage

**Philosophy**: Developers catch and fix issues locally before pushing. CI/CD serves as final validation and deployment mechanism, not primary quality gate.
