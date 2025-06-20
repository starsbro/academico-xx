# GitHub Actions Workflows

This directory contains GitHub Actions workflows for CI/CD automation.

## Workflows Overview

### 1. `ci.yml` - Continuous Integration
**Triggers:** Push to `main`, `dev`, `develop` branches, and PRs to these branches
**Purpose:** Runs tests, linting, and builds for both frontend and backend

**Jobs:**
- **Frontend CI**: Lints, tests, and builds the Next.js frontend
- **Backend CI**: Lints and builds the Firebase Functions backend

### 2. `deploy.yml` - Main Deployment Workflow
**Triggers:** Push to `main`, `develop` branches, and PRs to `main`
**Purpose:** Comprehensive CI/CD pipeline with deployment

**Jobs:**
- **Test**: Runs linting and tests for both frontend and backend
- **Build Frontend**: Builds the frontend and uploads artifacts
- **Deploy**: Deploys to Firebase (only on main branch pushes)
- **Preview**: Creates preview deployments for PRs

### 3. `test.yml` - Test & Quality Checks
**Triggers:** Push and PRs to main branches
**Purpose:** Focused on testing and code quality

**Jobs:**
- **Frontend Tests**: ESLint, Prettier, TypeScript, Jest tests
- **Backend Tests**: ESLint, TypeScript compilation
- **Security Audit**: npm audit for both projects

### 4. `firebase-hosting-merge.yml` - Firebase Auto-Deploy
**Triggers:** Push to `main` branch
**Purpose:** Auto-generated Firebase hosting deployment

### 5. `firebase-hosting-pull-request.yml` - Firebase Preview
**Triggers:** Pull requests
**Purpose:** Creates preview deployments for PRs

### 6. `release.yml` - Release Management
**Triggers:** Git tags matching `v*` pattern
**Purpose:** Creates releases and deploys tagged versions

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
Push to main → ci.yml → deploy.yml → Firebase Live
     ↓
Pull Request → test.yml → firebase-hosting-pull-request.yml → Firebase Preview
     ↓
Git Tag → release.yml → Firebase Production + GitHub Release
```

## Troubleshooting

### Common Issues

1. **Build Failures**: Check that all dependencies are correctly listed in package.json
2. **Environment Variables**: Ensure all Firebase secrets are properly configured
3. **Path Issues**: Verify that working-directory paths match your project structure
4. **Firebase Permissions**: Ensure the service account has the necessary permissions

### Debugging

- Check the Actions tab in your GitHub repository for detailed logs
- Verify that your Firebase project is properly configured
- Test builds locally before pushing to ensure they work in CI

## Customization

You can customize these workflows by:

1. **Adding more test commands** in the test jobs
2. **Modifying trigger conditions** (branches, paths)
3. **Adding additional deployment targets** (staging, development)
4. **Including more quality checks** (code coverage, security scans)
5. **Adding notification steps** (Slack, email, etc.)
