// Integration tests configuration
module.exports = {
    ...require('./jest.config.js'),
    displayName: 'Integration Tests',
    roots: ['<rootDir>/integration'],
    testMatch: [
        '**/integration/**/*.(test|spec).(ts|tsx|js|jsx)'
    ]
};
