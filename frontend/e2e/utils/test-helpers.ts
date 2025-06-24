// Re-export everything for easy imports
export * from './test-data';
export * from './page-helpers';
export * from './auth-helpers';

// Main combined helper class
import { Page } from '@playwright/test';
import { AuthHelper } from './auth-helpers';
import { BasePageHelper } from './page-helpers';

export class TestHelpers {
  public auth: AuthHelper;
  public page: BasePageHelper;

  constructor(page: Page) {
    this.auth = new AuthHelper(page);
    this.page = new BasePageHelper(page);
  }
}

// Convenience function for test setup
export function createTestHelpers(page: Page): TestHelpers {
  return new TestHelpers(page);
}
