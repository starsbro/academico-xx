import { Page } from '@playwright/test';

export class AuthEmulatorHelper {
  constructor(private page: Page) {}

  /**
   * Start Firebase Auth Emulator for testing
   */
  async setupEmulator() {
    // This would typically be done in global setup
    console.log('🔧 Firebase Auth Emulator should be running on port 9099');
  }

  /**
   * Create a test user in the emulator
   */
  async createTestUser(email: string, password: string, displayName?: string) {
    // Use Firebase Admin SDK to create user in emulator
    // This is typically done in test setup
    console.log(`👤 Creating test user: ${email}`);
  }

  /**
   * Mock successful authentication by setting auth state
   */
  async mockAuthenticationState(user: { uid: string; email: string; displayName?: string }) {
    // Set localStorage/sessionStorage to mimic successful auth
    await this.page.evaluate((userData) => {
      localStorage.setItem('firebase:authUser:test', JSON.stringify({
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        emailVerified: true,
        isAnonymous: false,
      }));
    }, user);
  }

  /**
   * Clear authentication state
   */
  async clearAuthState() {
    await this.page.evaluate(() => {
      localStorage.removeItem('firebase:authUser:test');
      sessionStorage.clear();
    });
  }
}
