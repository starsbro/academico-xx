# 📚 Academico-AI Documentation

Welcome to the comprehensive documentation for Academico-AI, an AI-powered academic platform built with Next.js, Firebase, and modern web technologies.

## 🎯 **Quick Navigation**

### 🚀 **New to Academico-AI?**

- [**Quick Start Guide**](getting-started/quick-start.md) - Get up and running in 5 minutes
- [**Student Guide**](user-guides/student-guide.md) - How to use the platform as a student
- [**Teacher Guide**](user-guides/teacher-guide.md) - Classroom management and features

### 💻 **For Developers**

- [**Development Workflow**](developer/DETAILED_DEVELOPMENT_WORKFLOW.md) - Complete development guide
- [**Local Development**](developer/LOCAL_DEVELOPMENT_GUIDE.md) - Set up local development environment
- [**Local Testing**](developer/LOCAL_TESTING_GUIDE.md) - Local testing strategies
- [**Architecture Overview**](developer/architecture.md) - Technical system design
- [**API Reference**](api/endpoints.md) - Complete API documentation
- [**Frontend Guide**](developer/frontend-guide.md) - Frontend development guide
- [**Contributing Guide**](developer/contributing.md) - How to contribute to the project

### ⚙️ **Setup & Configuration**

- [**Environment Setup**](setup/LOCAL_ENVIRONMENT_SETUP.md) - Complete environment configuration
- [**Auto Environment Detection**](setup/ENVIRONMENT_AUTO_DETECTION.md) - Automatic environment switching
- [**Firebase Setup**](setup/FIREBASE_TEST_ACCOUNT_SETUP.md) - Firebase configuration
- [**GitHub Secrets**](setup/github-secrets.md) - CI/CD secrets configuration

### ✨ **Features & Functionality**

- [**Academic Chat**](features/academic-chat.md) - AI-powered tutoring system
- [**Authentication**](features/authentication.md) - User management and security
- [**AI Features**](features/ai-features.md) - Machine learning capabilities

## 📁 **Documentation Structure**

### 🚀 Getting Started (`getting-started/`)

- [Quick Start](./getting-started/quick-start.md) - 5-minute setup guide
- [Installation Guide](./getting-started/installation.md) - Detailed installation steps
- [Development Setup](./getting-started/development-setup.md) - Developer environment configuration

### 👥 User Guides (`user-guides/`)

- [Student Guide](./user-guides/student-guide.md) - Complete student tutorial
- [Teacher Guide](./user-guides/teacher-guide.md) - Classroom management features
- [Admin Guide](./user-guides/admin-guide.md) - System administration

### 💻 Developer Documentation (`developer/`)

- [Architecture Overview](./developer/architecture.md) - System design and technology stack
- [Glossary](./GLOSSARY.md) - Technical terms and definitions
- [Frontend Guide](./developer/frontend-guide.md) - React/Next.js development
- [Backend Guide](./developer/backend-guide.md) - Firebase Functions and API development
- [Contributing Guide](./developer/contributing.md) - How to contribute code

### ✨ Features (`features/`)

- [Academic Chat](./features/academic-chat.md) - AI tutoring system
- [Authentication System](./features/authentication.md) - User management
- [AI Features](./features/ai-features.md) - Machine learning capabilities
- [User Management](./features/user-management.md) - Profiles and permissions

### 📡 API Documentation (`api/`)

- [API Endpoints](./api/endpoints.md) - Complete REST API reference
- [Authentication API](./api/authentication-api.md) - Auth endpoints
- [Chat API](./api/chat-api.md) - Chat and messaging endpoints

### 🚀 Deployment (`deployment/`)

- [Production Deployment](./deployment/production-deploy.md) - Deploy to Firebase
- [Environment Configuration](./deployment/environment-config.md) - Environment setup
- [Monitoring & Analytics](./deployment/monitoring.md) - Production monitoring

### 🔧 Setup Guides (`setup/`)

- [CI/CD Status](./setup/ci-cd-status.md) - Current CI/CD pipeline status
- [Firebase Migration](./setup/firebase-migration.md) - Guide for Firebase setup and migration
- [GitHub Secrets](./setup/github-secrets.md) - How to configure GitHub repository secrets
- [Pre-CI/CD Setup](./setup/pre-ci-cd-setup.md) - Prerequisites before setting up CI/CD

### Authentication Setup & Testing

This documentation covers the comprehensive authentication testing implementation for the academico-ai project.

#### 🔧 **Setup Documentation**

- [**Firebase Test Account Setup**](setup/FIREBASE_TEST_ACCOUNT_SETUP.md) - Step-by-step guide for setting up Firebase test accounts
- [**GitHub Secrets Firebase Setup**](setup/GITHUB_SECRETS_FIREBASE_SETUP.md) - Configuration guide for CI/CD authentication testing

### 🔧 Troubleshooting (`troubleshooting/`)

- [**Authentication Persistence Solution**](troubleshooting/AUTHENTICATION_PERSISTENCE_SOLUTION.md) - How to solve authentication persistence issues in testing
- [CORS Fixes](./troubleshooting/cors-fixes.md) - Solutions for CORS-related issues
- [E2E Test Fixes](./troubleshooting/e2e-test-fixes.md) - Common E2E testing problems and solutions
- [Firebase Emulator UI Crash](./troubleshooting/firebase-emulator-ui-crash.md) - Fix for Firebase Emulator UI crashes
- [Frontend Test Fixes](./troubleshooting/frontend-test-fixes.md) - Frontend testing issue resolutions
- [Production Backend Fixes](./troubleshooting/production-backend-fixes.md) - Backend production environment fixes

### 🏗️ Architecture (`architecture/`)

- [Testing Decisions](./architecture/testing-decisions.md) - Testing architecture and technology decisions
- [Test Migration Plan](./architecture/test-migration-plan.md) - Plan for migrating to unified test structure

## 🔍 **Quick Reference**

### Essential Commands

```bash
# Development
npm run dev                 # Start all services
npm run test               # Run all tests
npm run build              # Build for production

# Testing
npm run test:e2e           # End-to-end tests
npm run test:unit          # Unit tests
npm run test:integration   # Integration tests

# Deployment
firebase deploy            # Deploy to production
```

### Key URLs

- **Production**: https://your-project.web.app
- **API Base**: https://your-backend-url.run.app
- **GitHub Repo**: https://github.com/starsbro/academico-ai

### Getting Help

- 🐛 **Bug Reports**: [Create an issue](https://github.com/starsbro/academico-ai/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/starsbro/academico-ai/discussions)
- 📧 **Support**: Contact through GitHub issues

## 🎯 **Common Tasks**

### For Students

1. [Create your account](user-guides/student-guide.md#creating-your-account)
2. [Start your first chat](features/academic-chat.md#starting-your-first-conversation)
3. [Get homework help](user-guides/student-guide.md#using-academic-chat)

### For Developers

1. [Set up development environment](getting-started/quick-start.md#development-setup)
2. [Understand the architecture](developer/architecture.md)
3. [Run tests](troubleshooting/e2e-test-fixes.md)
4. [Deploy to production](deployment/production-deploy.md)

### For Teachers

1. [Set up your classroom](user-guides/teacher-guide.md)
2. [Monitor student progress](features/user-management.md)
3. [Configure AI settings](features/ai-features.md)

## 📚 **Additional Resources**

### External Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### Community

- [GitHub Repository](https://github.com/starsbro/academico-ai)
- [GitHub Discussions](https://github.com/starsbro/academico-ai/discussions)
- [Issue Tracker](https://github.com/starsbro/academico-ai/issues)

---

## 📝 **Documentation Guidelines**

This documentation follows these principles:

- **User-focused**: Written from the user's perspective
- **Task-oriented**: Organized around what users want to accomplish
- **Clear examples**: Real code snippets and practical examples
- **Up-to-date**: Regularly updated with code changes
- **Comprehensive**: Covers all features and use cases

**Last Updated**: January 22, 2025  
**Version**: 1.0.0

---

_For project overview and quick start instructions, see the main [README.md](../README.md) in the root folder._
