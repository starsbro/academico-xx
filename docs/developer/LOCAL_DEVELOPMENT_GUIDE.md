# 🚀 Local Development Workflow Guide

## Quick Reference

### 🔧 **Pre-Push Validation (Essential)**

```bash
./scripts/dev-check.sh    # Lint + Build validation (30 seconds)
```

This ensures your code will pass CI/CD. **Run this before every push!**

### 🧪 **Full Local Testing (Optional)**

```bash
./scripts/test-with-servers.sh    # Comprehensive testing (5 minutes)
```

This runs performance, accessibility, and E2E tests with live servers.

---

## Development Workflows

### 📅 **Daily Development**

```bash
# Start development
cd frontend && npm run dev    # Terminal 1
# Auto-connects to localhost:5050 backend

# Code your changes...

# Before pushing
./scripts/dev-check.sh        # Quick validation
git add . && git commit -m "Your changes" && git push
```

### 🎯 **Feature Development with Testing**

```bash
# 1. Start all servers
cd frontend && npm run dev                           # Terminal 1
cd backend/functions && npx ts-node src/index.ts     # Terminal 2

# 2. Code your feature...

# 3. Test your changes
./scripts/test-with-servers.sh                       # Terminal 3

# 4. Pre-push validation
./scripts/dev-check.sh

# 5. Deploy
git push origin main
```

### 🐛 **Bug Fix Workflow**

```bash
# Quick fix validation
./scripts/dev-check.sh        # Ensures fix doesn't break build

# Optional: Test specific area
cd tests
npm run local:accessibility   # For UI fixes
npm run local:performance     # For performance fixes
npm run local:smoke          # For general fixes
```

---

## When to Use Each Script

| Script                           | When to Use           | Duration | Purpose                 |
| -------------------------------- | --------------------- | -------- | ----------------------- |
| `./scripts/dev-check.sh`         | **Before every push** | 30s      | Lint + Build validation |
| `./scripts/test-with-servers.sh` | Feature development   | 5min     | Full testing suite      |
| `cd tests && npm run local:*`    | Specific testing      | 30s-2min | Targeted tests          |

---

## Error Handling

### ❌ **If dev-check.sh fails:**

- Fix linting errors shown in output
- Fix build errors in frontend/backend
- Re-run until it passes

### ❌ **If test-with-servers.sh fails:**

- Check if both servers are running:
  - Frontend: http://localhost:3000
  - Backend: http://localhost:5050
- Follow the script's server startup instructions

### ❌ **If specific tests fail:**

- Check server status
- Run with `--headed` for visual debugging:
  ```bash
  cd tests
  npm run local:performance -- --headed
  ```

---

## Benefits

✅ **Fast Feedback**: Know if your code works before pushing  
✅ **No CI/CD Failures**: Catch issues locally  
✅ **Confidence**: Deploy with certainty  
✅ **Team Friendly**: Consistent workflow for everyone

---

## Pro Tips

💡 **Alias for convenience:**

```bash
# Add to your ~/.zshrc or ~/.bashrc
alias check="./scripts/dev-check.sh"
alias test-local="./scripts/test-with-servers.sh"
```

💡 **VS Code integration:** Add these as VS Code tasks in `.vscode/tasks.json`

💡 **Git hooks:** Consider adding `./scripts/dev-check.sh` as a pre-push git hook

---

🎯 **Remember**: `./scripts/dev-check.sh` before every push ensures your deployments always succeed!
