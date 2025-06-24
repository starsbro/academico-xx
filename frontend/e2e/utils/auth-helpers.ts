import { Page } from '@playwright/test';
import { BasePageHelper } from './page-helpers';
import { TEST_CONFIG } from './test-data';

export class AuthHelper extends BasePageHelper {
  constructor(page: Page) {
    super(page);
  }

  async navigateToSignIn() {
    await this.goto(TEST_CONFIG.routes.signIn);
    await this.logPageInfo('Navigated to Sign In');
  }

  async navigateToSignUp() {
    await this.goto(TEST_CONFIG.routes.signUp);
    await this.logPageInfo('Navigated to Sign Up');
  }

  async fillSignInForm(email?: string, password?: string) {
    const testEmail = email || TEST_CONFIG.users.valid.email;
    const testPassword = password || TEST_CONFIG.users.valid.password;

    await this.page.fill(TEST_CONFIG.selectors.emailInput, testEmail);
    await this.page.fill(TEST_CONFIG.selectors.passwordInput, testPassword);

    console.log(`📝 Filled sign-in form with: ${testEmail}`);
  }

  async submitSignInForm() {
    const submitButton = this.page.locator(TEST_CONFIG.selectors.signInButton).first();
    await submitButton.click();
    await this.waitForAppLoad();

    console.log('🔄 Submitted sign-in form');
  }

  async attemptSignIn(email?: string, password?: string): Promise<string> {
    await this.navigateToSignIn();
    await this.fillSignInForm(email, password);
    await this.submitSignInForm();

    const finalRoute = await this.getCurrentRoute();
    console.log(`🎯 Sign-in attempt resulted in route: ${finalRoute}`);

    return finalRoute;
  }

  async isAuthenticated(): Promise<boolean> {
    const currentRoute = await this.getCurrentRoute();
    const isAuth = !currentRoute.includes('/sign-in') && !currentRoute.includes('/sign-up');

    console.log(`🔐 Authentication status: ${isAuth ? 'Authenticated' : 'Not authenticated'}`);
    return isAuth;
  }

  async requireAuthentication(): Promise<boolean> {
    if (await this.isAuthenticated()) {
      console.log('✅ Already authenticated');
      return true;
    }

    console.log('🔑 Attempting authentication...');
    await this.attemptSignIn();

    const success = await this.isAuthenticated();
    console.log(`🎯 Authentication ${success ? 'successful' : 'failed'}`);

    return success;
  }

  async signOut() {
    // Look for sign out button/link
    const signOutSelectors = [
      'button:has-text("Sign out")',
      'a:has-text("Sign out")',
      'button:has-text("Logout")',
      'a:has-text("Logout")',
    ];

    for (const selector of signOutSelectors) {
      const element = this.page.locator(selector).first();
      if ((await element.count()) > 0) {
        await element.click();
        await this.waitForAppLoad();
        console.log('🚪 Signed out successfully');
        return;
      }
    }

    console.log('⚠️ No sign out button found');
  }
}
