# GitHub Secrets Setup Instructions

## 🔐 Adding Secrets to GitHub Repository

Follow these steps to add the required secrets to your GitHub repository:

### Step 1: Navigate to GitHub Secrets Settings

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/academico-ai`
2. Click on **Settings** (in the repository menu)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### Step 2: Add Each Secret

Add these **7 secrets** one by one:

#### 1. FIREBASE_SERVICE_ACCOUNT_ACADEMICO_AI
- **Name**: `FIREBASE_SERVICE_ACCOUNT_ACADEMICO_AI`
- **Value**: Copy the entire JSON content from the output above (between the ┌─── and └─── lines)

#### 2. NEXT_PUBLIC_FIREBASE_API_KEY
- **Name**: `NEXT_PUBLIC_FIREBASE_API_KEY`
- **Value**: `AIzaSyB-CddbN7VvC9jen8PfL1vym4Hm2FwTy90`

#### 3. NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- **Name**: `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- **Value**: `academico-ai.firebaseapp.com`

#### 4. NEXT_PUBLIC_FIREBASE_PROJECT_ID
- **Name**: `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- **Value**: `academico-ai`

#### 5. NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- **Name**: `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- **Value**: `academico-ai.firebasestorage.app`

#### 6. NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- **Name**: `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- **Value**: `520745038762`

#### 7. NEXT_PUBLIC_FIREBASE_APP_ID
- **Name**: `NEXT_PUBLIC_FIREBASE_APP_ID`
- **Value**: `1:520745038762:web:79bc67d1ea7296cda831d3`

### Step 3: Verify Secrets

After adding all secrets, you should see 7 secrets in your repository settings:

✅ FIREBASE_SERVICE_ACCOUNT_ACADEMICO_AI  
✅ NEXT_PUBLIC_FIREBASE_API_KEY  
✅ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN  
✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID  
✅ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET  
✅ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID  
✅ NEXT_PUBLIC_FIREBASE_APP_ID  

## 🧹 Clean Up

After copying the service account JSON to GitHub, delete the local key file:

```bash
rm github-actions-key.json
```

## 🚀 Test Your CI/CD Pipeline

Once all secrets are added, test your pipeline:

### Option 1: Push to Main Branch
```bash
git add .
git commit -m "feat: setup CI/CD pipeline"
git push origin main
```

### Option 2: Create a Pull Request
```bash
git checkout -b test-cicd
git add .
git commit -m "test: CI/CD pipeline setup"
git push origin test-cicd
# Then create a PR on GitHub
```

### Option 3: Create a Release
```bash
git tag v1.0.0
git push origin v1.0.0
```

## 🔍 Monitor Your Deployments

- **Actions Tab**: Check the progress in your repository's Actions tab
- **Firebase Console**: Monitor deployments at https://console.firebase.google.com/project/academico-ai
- **Live Site**: Your deployed app will be at https://academico-ai.web.app

## 🆘 Troubleshooting

If you encounter issues:

1. **Check Action Logs**: Go to your repository's Actions tab to see detailed logs
2. **Verify Secrets**: Ensure all 7 secrets are added correctly
3. **Firebase Permissions**: The service account has all necessary permissions
4. **Local Testing**: Test builds locally first: `npm run build` in both frontend and backend

## 📞 Next Steps

Your CI/CD pipeline will now:
- ✅ Run tests and linting on every push/PR
- ✅ Create preview deployments for PRs
- ✅ Deploy to production on main branch pushes
- ✅ Create releases with git tags

Happy coding! 🎉
