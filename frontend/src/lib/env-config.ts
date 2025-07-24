/**
 * Environment Configuration Utility
 * Automatically detects environment and provides appropriate backend URL
 */

// Environment detection
export const isDevelopment =
  process.env.NODE_ENV === 'development' || (typeof window !== 'undefined' && window.location.hostname === 'localhost');

export const isProduction =
  process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && window.location.hostname !== 'localhost';

// Backend URL configuration
const BACKEND_URLS = {
  development: 'http://localhost:5050',
  production: 'https://api-bcsebzkoea-uc.a.run.app',
};

/**
 * Get the appropriate backend URL based on current environment
 * @returns {string} Backend URL for current environment
 */
export const getBackendUrl = (): string => {
  // For server-side rendering, check NODE_ENV
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'production' ? BACKEND_URLS.production : BACKEND_URLS.development;
  }

  // For client-side, check hostname
  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.includes('localhost');

  return isLocalhost ? BACKEND_URLS.development : BACKEND_URLS.production;
};

/**
 * Get current environment name
 * @returns {'development' | 'production'}
 */
export const getCurrentEnvironment = (): 'development' | 'production' => {
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'production' ? 'production' : 'development';
  }

  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.includes('localhost');

  return isLocalhost ? 'development' : 'production';
};

// Export for debugging
export const ENV_CONFIG = {
  current: getCurrentEnvironment(),
  backendUrl: getBackendUrl(),
  isDevelopment,
  isProduction,
  urls: BACKEND_URLS,
};

// Log current configuration in development
if (isDevelopment && typeof window !== 'undefined') {
  console.log('🔧 Environment Config:', ENV_CONFIG);
}
