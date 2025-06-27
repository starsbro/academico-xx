// Mock for @radix-ui/react-dropdown-menu
const React = require('react');

const DropdownMenu = ({ children, ...props }) => 
  React.createElement('div', { ...props, 'data-testid': 'radix-dropdown-menu' }, children);

const DropdownMenuTrigger = React.forwardRef(({ children, ...props }, ref) => 
  React.createElement('button', { ...props, ref, 'data-testid': 'radix-dropdown-trigger' }, children)
);

const DropdownMenuContent = React.forwardRef(({ children, ...props }, ref) => 
  React.createElement('div', { ...props, ref, 'data-testid': 'radix-dropdown-content' }, children)
);

const DropdownMenuItem = React.forwardRef(({ children, ...props }, ref) => 
  React.createElement('div', { ...props, ref, 'data-testid': 'radix-dropdown-item' }, children)
);

const DropdownMenuCheckboxItem = React.forwardRef(({ children, ...props }, ref) => 
  React.createElement('div', { ...props, ref, 'data-testid': 'radix-dropdown-checkbox-item' }, children)
);

const DropdownMenuRadioItem = React.forwardRef(({ children, ...props }, ref) => 
  React.createElement('div', { ...props, ref, 'data-testid': 'radix-dropdown-radio-item' }, children)
);

const DropdownMenuLabel = React.forwardRef(({ children, ...props }, ref) => 
  React.createElement('div', { ...props, ref, 'data-testid': 'radix-dropdown-label' }, children)
);

const DropdownMenuSeparator = React.forwardRef((props, ref) => 
  React.createElement('hr', { ...props, ref, 'data-testid': 'radix-dropdown-separator' })
);

const DropdownMenuShortcut = ({ children, ...props }) => 
  React.createElement('span', { ...props, 'data-testid': 'radix-dropdown-shortcut' }, children);

const DropdownMenuGroup = ({ children, ...props }) => 
  React.createElement('div', { ...props, 'data-testid': 'radix-dropdown-group' }, children);

const DropdownMenuPortal = ({ children }) => children;

const DropdownMenuSub = ({ children, ...props }) => 
  React.createElement('div', { ...props, 'data-testid': 'radix-dropdown-sub' }, children);

const DropdownMenuSubContent = React.forwardRef(({ children, ...props }, ref) => 
  React.createElement('div', { ...props, ref, 'data-testid': 'radix-dropdown-sub-content' }, children)
);

const DropdownMenuSubTrigger = React.forwardRef(({ children, ...props }, ref) => 
  React.createElement('div', { ...props, ref, 'data-testid': 'radix-dropdown-sub-trigger' }, children)
);

const DropdownMenuRadioGroup = ({ children, ...props }) => 
  React.createElement('div', { ...props, 'data-testid': 'radix-dropdown-radio-group' }, children);

module.exports = {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  Root: DropdownMenu,
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioItem: DropdownMenuRadioItem,
  Label: DropdownMenuLabel,
  Separator: DropdownMenuSeparator,
  Shortcut: DropdownMenuShortcut,
  Group: DropdownMenuGroup,
  Portal: DropdownMenuPortal,
  Sub: DropdownMenuSub,
  SubContent: DropdownMenuSubContent,
  SubTrigger: DropdownMenuSubTrigger,
  RadioGroup: DropdownMenuRadioGroup
};
