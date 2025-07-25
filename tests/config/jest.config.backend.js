module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/../unit/backend'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.backend.ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/e2e/',
  ],
  moduleDirectories: ['node_modules', '<rootDir>/../../node_modules'],
  moduleNameMapper: {
    '^backend/functions/(.*)$': '<rootDir>/../../backend/functions/src/$1',
    '^pdfjs-dist/legacy/build/pdf.js$': '<rootDir>/../__mocks__/pdfjs-dist.js',
    '^genkit$': '<rootDir>/../__mocks__/genkit.js',
    '^@genkit-ai/googleai$': '<rootDir>/../__mocks__/@genkit-ai/googleai.js',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/../tsconfig.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};
