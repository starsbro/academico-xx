module.exports = {
  genkit: jest.fn(() => ({
    generate: jest.fn(() => Promise.resolve({ text: 'AI response' })),
  })),
};
