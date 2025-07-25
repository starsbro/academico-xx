// Backend tests configuration  
module.exports = {
    ...require('./jest.config.js'),
    displayName: 'Backend Tests',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/config/jest.setup.backend.ts'],
    testMatch: [
        '**/unit/backend/**/*.(test|spec).(ts|js)',
        '**/integration/backend/**/*.(test|spec).(ts|js)'
    ],
    moduleNameMapper: {
        // Remove frontend-specific mappings for backend tests
        '^firebase/auth$': '<rootDir>/__mocks__/firebase-auth.js',
        '^../lib/firebase$': '<rootDir>/__mocks__/firebase.js',
        '^@/lib/firebase$': '<rootDir>/__mocks__/firebase.js',
    }
};
