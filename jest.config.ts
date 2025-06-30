import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/frontend/jest.setup.ts'],
  moduleNameMapper: {
    // Handle Next.js internal modules
    '^@/(.*)$': '<rootDir>/frontend/src/$1',
    '^@/components/(.*)$': '<rootDir>/frontend/src/app/components/$1',
    '^@/utils/(.*)$': '<rootDir>/frontend/src/app/utils/$1',
    '^@/hooks/(.*)$': '<rootDir>/frontend/src/app/hooks/$1',
    // Handle static file imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 
      '<rootDir>/__mocks__/fileMock.js',
  },
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.[jt]s?(x)',
    '<rootDir>/frontend/src/**/*.test.[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'frontend/src/**/*.{js,jsx,ts,tsx}',
    '!frontend/src/**/*.d.ts',
    '!frontend/src/**/*.stories.{js,jsx,ts,tsx}',
    '!frontend/src/**/*.test.{js,jsx,ts,tsx}',
    '!frontend/src/**/index.{js,jsx,ts,tsx}',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
      },
    }],
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  roots: ['<rootDir>/tests', '<rootDir>/frontend/src'],
};

export default config;
