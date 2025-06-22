import { Page } from '@playwright/test';
import { TEST_CONFIG, TEST_TIMEOUTS } from './test-data';

export class BasePageHelper {
  constructor(protected page: Page) {}

  async goto(route: string) {
    await this.page.goto(route);
    await this.waitForAppLoad();
  }

  async waitForAppLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500); // Buffer for React hydration
  }

  async takeDebugScreenshot(name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({
      path: `debug-screenshots/${name}-${timestamp}.png`,
      fullPage: true,
    });
  }

  async checkForErrors(): Promise<boolean> {
    const errorElements = await this.page.locator('text=/error|Error|404|not found/i').count();
    return errorElements === 0;
  }

  async getCurrentRoute(): Promise<string> {
    const url = this.page.url();
    return url.replace(TEST_CONFIG.baseURL, '') || '/';
  }

  async waitForRoute(expectedRoute: string, timeout = TEST_TIMEOUTS.medium) {
    await this.page.waitForURL(`**${expectedRoute}*`, { timeout });
  }

  async logPageInfo(context?: string) {
    const title = await this.page.title();
    const url = this.page.url();
    const route = await this.getCurrentRoute();

    console.log(`📍 ${context || 'Page Info'}: "${title}" at ${route}, URL is ${url}.`);
  }
}
