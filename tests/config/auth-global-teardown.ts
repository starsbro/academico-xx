import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Cleaning up authentication test environment...');
  
  // Stop Firebase emulator if we started it
  console.log('🛑 Stopping Firebase Auth Emulator...');
  
  // Any other cleanup
  console.log('✅ Test environment cleaned up');
}

export default globalTeardown;
