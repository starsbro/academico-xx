# Page snapshot

```yaml
- heading "Welcome back!" [level=1]
- paragraph: Sign in to continue your academic journey
- text: Email address
- textbox "Email address"
- text: Password
- textbox "Password"
- button
- link "Forgot your password?":
  - /url: /reset-password/
- button "Signing in..." [disabled]
- text: Or continue with
- button "Continue with Google" [disabled]:
  - img
  - text: Continue with Google
- paragraph:
  - text: Don't have an account?
  - link "Create one now":
    - /url: /sign-up/
- paragraph: Powered by Academico AI
- alert
- button "Open Next.js Dev Tools":
  - img
```