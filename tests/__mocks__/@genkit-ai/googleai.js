module.exports = {
  googleAI: Object.assign(
    jest.fn(() => ({
      model: jest.fn(() => ({})), // for plugins
    })),
    {
      model: jest.fn(() => ({})), // for direct use
    }
  ),
};
