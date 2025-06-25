const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './frontend',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/frontend/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/frontend/src/app/components/$1',
    '^@/utils/(.*)$': '<rootDir>/frontend/src/app/utils/$1',
    '^@/hooks/(.*)$': '<rootDir>/frontend/src/app/hooks/$1',
    '^@/contexts/(.*)$': '<rootDir>/frontend/src/contexts/$1',
    '^@/lib/(.*)$': '<rootDir>/frontend/src/lib/$1',
    '^@/app/(.*)$': '<rootDir>/frontend/src/app/$1',
  },
  testMatch: [
    '<rootDir>/tests/unit/frontend/**/*.test.[jt]s?(x)',
    '<rootDir>/frontend/src/**/*.test.[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'frontend/src/**/*.{js,jsx,ts,tsx}',
    '!frontend/src/**/*.d.ts',
    '!frontend/src/**/*.stories.{js,jsx,ts,tsx}',
    '!frontend/src/**/*.test.{js,jsx,ts,tsx}',
    '!frontend/src/**/index.{js,jsx,ts,tsx}',
  ],
};

module.exports = createJestConfig(customJestConfig);
