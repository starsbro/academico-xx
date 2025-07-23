module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/../unit', '<rootDir>/../integration'],
  testMatch: [
    '**/tests/**/*.(test|spec).(ts|tsx|js|jsx)'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/e2e/',
  ],
  moduleDirectories: ['node_modules', '<rootDir>/../../node_modules', '<rootDir>/../frontend/node_modules'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/../../frontend/src/components/$1',
    '^@/utils/(.*)$': '<rootDir>/../../frontend/src/utils/$1',
    '^@/hooks/(.*)$': '<rootDir>/../../frontend/src/hooks/$1',
    '^@/contexts/(.*)$': '<rootDir>/../../frontend/src/contexts/$1',
    '^@/lib/(.*)$': '<rootDir>/../../frontend/src/lib/$1',
    '^@/app/(.*)$': '<rootDir>/../../frontend/src/app/$1',
    '^firebase/auth$': '<rootDir>/../__mocks__/firebase-auth.js',
    '^../lib/firebase$': '<rootDir>/../__mocks__/firebase.js',
    '^@/lib/firebase$': '<rootDir>/../__mocks__/firebase.js',
    '^tailwind-merge$': '<rootDir>/../__mocks__/tailwind-merge.js',
    '^lucide-react$': '<rootDir>/../__mocks__/lucide-react.js',
    '^clsx$': '<rootDir>/../__mocks__/clsx.js',
    '^class-variance-authority$': '<rootDir>/../__mocks__/class-variance-authority.js',
    '^@radix-ui/react-avatar$': '<rootDir>/../__mocks__/@radix-ui/react-avatar.js',
    '^@radix-ui/react-dropdown-menu$': '<rootDir>/../__mocks__/@radix-ui/react-dropdown-menu.js',
    '^@radix-ui/react-scroll-area$': '<rootDir>/../__mocks__/@radix-ui/react-scroll-area.js',
    '^next/navigation$': '<rootDir>/../__mocks__/next-navigation.js',
    '^next/image$': '<rootDir>/../__mocks__/next-image.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/../__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/../tsconfig.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};
