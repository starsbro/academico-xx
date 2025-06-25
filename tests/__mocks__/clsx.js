// Mock for clsx package
module.exports = {
  clsx: (...args) => {
    // Simple implementation that concatenates string arguments
    return args
      .filter(Boolean)
      .map(arg => {
        if (typeof arg === 'string') return arg;
        if (typeof arg === 'object' && arg !== null) {
          return Object.keys(arg).filter(key => arg[key]).join(' ');
        }
        return '';
      })
      .join(' ');
  }
};

// Default export
module.exports.clsx = module.exports.clsx;
