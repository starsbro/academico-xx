// Frontend tests configuration
module.exports = {
    ...require('./jest.config.js'),
    displayName: 'Frontend Tests',
    testMatch: [
        '**/unit/frontend/**/*.(test|spec).(ts|tsx|js|jsx)',
        '**/integration/frontend/**/*.(test|spec).(ts|tsx|js|jsx)'
    ]
};
