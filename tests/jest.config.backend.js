module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/unit/backend', '<rootDir>/integration/backend'],
  moduleNameMapper: {
    '^backend/functions/(.*)$': '<rootDir>/../../backend/functions/src/$1',
    '^pdfjs-dist/legacy/build/pdf.js$': '<rootDir>/__mocks__/pdfjs-dist.js',
    '^genkit$': '<rootDir>/__mocks__/genkit.js',
    '^@genkit-ai/googleai$': '<rootDir>/__mocks__/@genkit-ai/googleai.js',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};
