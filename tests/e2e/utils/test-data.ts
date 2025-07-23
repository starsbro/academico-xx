export const TEST_USERS = {
  valid: {
    email: 'test@academico-ai.com',
    password: 'TestPassword123!',
    fullName: 'Test User',
  },
  invalid: {
    email: 'invalid@email.com',
    password: 'wrongpassword',
    fullName: 'Invalid User',
  },
  admin: {
    email: 'admin@academico-ai.com',
    password: 'AdminPassword123!',
    fullName: 'Admin User',
  },
};

export const TEST_CHAT_MESSAGES = [
  'What is artificial intelligence?',
  'Explain machine learning in simple terms',
  'How does neural networks work?',
  'What are the applications of AI in education?',
];

export const TEST_URLS = {
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  academicChat: '/academic-chat',
} as const;

export const SELECTORS = {
  // Auth selectors
  emailInput: '#email',
  passwordInput: '#password',
  signInButton: 'button:has-text("Sign in")',
  signUpButton: 'button:has-text("Create account")',

  // Navigation selectors
  userButton: '[data-testid="user-button"]',
  homeLink: 'text=Home',
  chatLink: 'text=Academic Chat',

  // Chat selectors
  chatInput: 'textarea, input[type="text"]',
  searchButton: '[data-testid="search-button"]',

  // Common selectors
  loadingSpinner: '.animate-spin, [data-testid="loading"]',
  errorMessage: '[data-testid="error"]',
} as const;

export const TEST_CONFIG = {
  baseURL: 'http://localhost:3000',
  timeout: 30000,
} as const;

export const TEST_TIMEOUTS = {
  short: 5000,
  medium: 15000,
  long: 30000,
  appLoad: 10000,
} as const;
