// Mock for @radix-ui/react-scroll-area
const React = require('react');

const ScrollArea = React.forwardRef(({ children, ...props }, ref) => 
  React.createElement('div', { ...props, ref, 'data-testid': 'radix-scroll-area' }, children)
);

const ScrollBar = React.forwardRef((props, ref) => 
  React.createElement('div', { ...props, ref, 'data-testid': 'radix-scroll-bar' })
);

const ScrollAreaViewport = React.forwardRef(({ children, ...props }, ref) => 
  React.createElement('div', { ...props, ref, 'data-testid': 'radix-scroll-viewport' }, children)
);

const ScrollAreaScrollbar = React.forwardRef(({ children, ...props }, ref) => 
  React.createElement('div', { ...props, ref, 'data-testid': 'radix-scroll-scrollbar' }, children)
);

const ScrollAreaThumb = React.forwardRef((props, ref) => 
  React.createElement('div', { ...props, ref, 'data-testid': 'radix-scroll-thumb' })
);

const ScrollAreaCorner = React.forwardRef((props, ref) => 
  React.createElement('div', { ...props, ref, 'data-testid': 'radix-scroll-corner' })
);

module.exports = {
  ScrollArea,
  ScrollBar,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
  Root: ScrollArea,
  Viewport: ScrollAreaViewport,
  Scrollbar: ScrollAreaScrollbar,
  Thumb: ScrollAreaThumb,
  Corner: ScrollAreaCorner
};
