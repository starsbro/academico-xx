// Unit tests configuration
module.exports = {
    ...require('./jest.config.js'),
    displayName: 'Unit Tests',
    roots: ['<rootDir>/unit'],
    testMatch: [
        '**/unit/**/*.(test|spec).(ts|tsx|js|jsx)'
    ]
};
