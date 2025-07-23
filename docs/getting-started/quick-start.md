# 🚀 Getting Started with Academico-AI

Welcome to Academico-AI! This guide will help you get up and running quickly.

## 📋 **Prerequisites**

Before you begin, ensure you have:

- **Node.js 20+** installed
- **npm** or **yarn** package manager
- **Git** for version control
- **Firebase account** (for authentication and backend)
- **Modern web browser** (Chrome, Firefox, Safari)

## ⚡ **Quick Start (5 minutes)**

### 1. Clone the Repository

```bash
git clone https://github.com/starsbro/academico-ai.git
cd academico-ai
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm install
```

### 3. Start Development Environment

```bash
# Start Firebase emulators and services
npm run dev
```

This starts:

- 🔥 Firebase emulators (Auth, Firestore, Functions)
- 🖥️ Frontend development server
- 📡 Backend API server

### 4. Open the Application

Visit **http://localhost:3000** in your browser.

You should see the Academico-AI homepage!

## 🎯 **First Steps**

### Create Your First Account

1. Click **"Sign Up"** on the homepage
2. Enter your email and password
3. Verify your account (in development, this is automatic)
4. You're ready to explore!

### Explore Key Features

- **🏠 Homepage**: Overview and navigation
- **💬 Academic Chat**: AI-powered academic discussions
- **👤 Profile**: Manage your account settings
- **📊 Dashboard**: Track your progress and activities

## 🔧 **Development Setup**

For developers who want to contribute or customize the app:

### Environment Configuration

1. **Copy environment template**:

   ```bash
   cp frontend/.env.example frontend/.env.local
   ```

2. **Add your Firebase configuration**:
   ```bash
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   # ... other Firebase config
   ```

### Available Commands

```bash
# Development
npm run dev                    # Start all services
npm run dev:reset             # Start with clean emulator data

# Frontend only
cd frontend && npm run dev     # Start frontend only

# Testing
npm run test                   # Run all tests
npm run test:e2e              # Run E2E tests
npm run test:unit             # Run unit tests

# Building
npm run build                 # Build for production
npm run validate              # Lint and type check
```

## 🎨 **Project Structure Overview**

```
academico-ai/
├── frontend/              # Next.js React application
│   ├── src/
│   │   ├── app/          # Next.js 13+ App Router
│   │   ├── components/   # Reusable UI components
│   │   ├── contexts/     # React contexts (Auth, etc.)
│   │   └── lib/          # Utilities and configurations
├── backend/               # Firebase Cloud Functions
│   └── functions/        # API endpoints and server logic
├── tests/                 # Comprehensive test suite
├── docs/                  # Documentation (you're here!)
└── scripts/              # Development and deployment scripts
```

## 🆘 **Need Help?**

### Quick Solutions

- **Port already in use**: Kill the process using port 3000 or use a different port
- **Firebase connection issues**: Check your internet connection and Firebase config
- **Login problems**: Make sure Firebase Auth is enabled in your project

### Documentation Links

- 📚 [User Guides](../user-guides/) - How to use features
- 💻 [Developer Guide](../developer/) - Technical details
- 🔧 [Troubleshooting](../troubleshooting/) - Common issues and solutions
- 🚀 [Deployment Guide](../deployment/) - Production deployment

### Get Support

- 📧 **Issues**: Create an issue on GitHub
- 💬 **Discussions**: Join our GitHub Discussions
- 📖 **Documentation**: Browse the docs folder

---

**Next Steps**:

- 👥 [User Guide](../user-guides/student-guide.md) - Learn how to use the platform
- 💻 [Developer Guide](../developer/architecture.md) - Understand the technical architecture
- ✨ [Features](../features/) - Explore all available features
