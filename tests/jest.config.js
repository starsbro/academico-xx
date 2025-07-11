module.exports = {
  testEnvironment: 'jsdom',
  coverageProvider: 'v8',
  roots: ['<rootDir>', '<rootDir>/../frontend/src'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleDirectories: ['node_modules', '<rootDir>/node_modules', '<rootDir>/../frontend/node_modules'],
  resolver: undefined,
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/../frontend/src/app/components/$1',
    '^@/utils/(.*)$': '<rootDir>/../frontend/src/app/utils/$1',
    '^@/hooks/(.*)$': '<rootDir>/../frontend/src/app/hooks/$1',
    '^@/contexts/(.*)$': '<rootDir>/../frontend/src/contexts/$1',
    '^@/lib/(.*)$': '<rootDir>/../frontend/src/lib/$1',
    '^@/app/(.*)$': '<rootDir>/../frontend/src/app/$1',
    // Mock Firebase
    '^firebase/auth$': '<rootDir>/__mocks__/firebase-auth.js',
    '^../lib/firebase$': '<rootDir>/__mocks__/firebase.js',
    '^@/lib/firebase$': '<rootDir>/__mocks__/firebase.js',
    // Mock styling libraries
    '^tailwind-merge$': '<rootDir>/__mocks__/tailwind-merge.js',
    '^lucide-react$': '<rootDir>/__mocks__/lucide-react.js',
    '^clsx$': '<rootDir>/__mocks__/clsx.js',
    '^class-variance-authority$': '<rootDir>/__mocks__/class-variance-authority.js',
    // Mock Radix UI
    '^@radix-ui/react-avatar$': '<rootDir>/__mocks__/@radix-ui/react-avatar.js',
    '^@radix-ui/react-dropdown-menu$': '<rootDir>/__mocks__/@radix-ui/react-dropdown-menu.js',
    '^@radix-ui/react-scroll-area$': '<rootDir>/__mocks__/@radix-ui/react-scroll-area.js',
    // Mock Next.js
    '^next/navigation$': '<rootDir>/__mocks__/next-navigation.js',
    '^next/image$': '<rootDir>/__mocks__/next-image.js',
    // Handle static file imports
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 
      '<rootDir>/__mocks__/fileMock.js',
  },
  testMatch: [
    '<rootDir>/unit/**/*.test.[jt]s?(x)',
    '<rootDir>/integration/**/*.test.[jt]s?(x)',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.json'
    }],
  },
  collectCoverageFrom: [
    '../frontend/src/**/*.{js,jsx,ts,tsx}',
    '!../frontend/src/**/*.d.ts',
    '!../frontend/src/**/*.stories.{js,jsx,ts,tsx}',
    '!../frontend/src/**/*.test.{js,jsx,ts,tsx}',
    '!../frontend/src/**/index.{js,jsx,ts,tsx}',
    '!../frontend/src/**/*.types.{js,jsx,ts,tsx}',
    '!../frontend/src/app/layout.tsx',
    '!../frontend/src/app/globals.css',
    '!../frontend/src/app/page.tsx',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};
