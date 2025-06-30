module.exports = {
  process() {
    return {
      code: 'module.exports = {};',
    };
  },
  getCacheKey() {
    return 'css-module-mock';
  },
};
