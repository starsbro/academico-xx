export const TEST_USERS = {
  valid: {
    email: 'xiao.xingx@northeastern.edu',
    password: '186369xx',
    fullName: 'Xingxing Xiao',
  },
  invalid: {
    email: 'invalid@email.com',
    password: 'wrongpassword',
    fullName: 'Invalid User',
  },
  admin: {
    email: 'admin@academico-ai.com',
    password: 'Admin123456!',
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
  signIn: '/auth/signin',
  signUp: '/auth/signup',
  academicChat: '/academic-chat',
} as const;

export const SELECTORS = {
  // Auth selectors
  emailInput: '[placeholder="Enter your email"]',
  passwordInput: '[placeholder="Enter your password"]',
  signInButton: 'button:has-text("Sign in")',
  signUpButton: 'button:has-text("Create account")',

  // Navigation selectors
  userButton: '[data-testid="user-button"]',
  homeLink: 'text=Home',
  chatLink: 'text=Academic Chat',

  // Chat selectors
  chatInput: '[placeholder="What are you thinking?"]',
  searchButton: '[data-testid="search-button"]',

  // Common selectors
  loadingSpinner: '[data-testid="loading"]',
  errorMessage: '[data-testid="error"]',
} as const;

export const TEST_CONFIG = {
  baseURL: 'http://localhost:3000',
  timeout: 30000,

  // Routes
  routes: {
    home: '/',
    signIn: '/sign-in',
    signUp: '/sign-up',
    academicChat: '/academic-chat',
  },

  // Test user data (update with your actual test accounts)
  users: {
    valid: {
      email: 'test@example.com',
      password: 'testpassword123',
      name: 'Test User',
    },
    invalid: {
      email: 'invalid@example.com',
      password: 'wrongpassword',
    },
  },

  // Common selectors
  selectors: {
    emailInput: '#email',
    passwordInput: '#password',
    submitButton: 'button[type="submit"]',
    signInButton: 'button:has-text("Sign in")',
    signUpLink: 'a:has-text("Sign up")',
    navElements: 'nav, header, [role="navigation"]',
  },
} as const;

export const TEST_TIMEOUTS = {
  short: 5000,
  medium: 15000,
  long: 30000,
  appLoad: 10000,
} as const;
