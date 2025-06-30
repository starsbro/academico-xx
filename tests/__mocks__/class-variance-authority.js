// Mock for class-variance-authority package
module.exports = {
  cva: (base, config) => {
    return (props = {}) => {
      // Simple implementation that returns the base class
      // In a real implementation, this would handle variants and compound variants
      let classes = base || '';
      
      if (config && config.variants && props) {
        Object.keys(props).forEach(key => {
          if (config.variants[key] && config.variants[key][props[key]]) {
            const variant = config.variants[key][props[key]];
            if (Array.isArray(variant)) {
              classes += ' ' + variant.join(' ');
            } else {
              classes += ' ' + variant;
            }
          }
        });
      }
      
      return classes.trim();
    };
  }
};

// Default export
module.exports.cva = module.exports.cva;
