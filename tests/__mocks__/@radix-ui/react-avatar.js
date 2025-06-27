// Mock for @radix-ui/react-avatar
const React = require('react');

const Avatar = React.forwardRef(({ children, ...props }, ref) => 
  React.createElement('div', { ...props, ref, 'data-testid': 'radix-avatar' }, children)
);

const AvatarImage = React.forwardRef((props, ref) => 
  React.createElement('img', { ...props, ref, 'data-testid': 'radix-avatar-image' })
);

const AvatarFallback = React.forwardRef(({ children, ...props }, ref) => 
  React.createElement('div', { ...props, ref, 'data-testid': 'radix-avatar-fallback' }, children)
);

module.exports = {
  Avatar,
  AvatarImage,
  AvatarFallback,
  Root: Avatar,
  Image: AvatarImage,
  Fallback: AvatarFallback
};
