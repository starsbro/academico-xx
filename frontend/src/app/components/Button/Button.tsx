import { ButtonProps } from './Button.types';
import { clsx } from 'clsx';
import { cva } from 'class-variance-authority';

// Define button variants using CVA (Class Variance Authority)
const buttonVariants = cva(
  // Base styles
  'border-none rounded-md cursor-pointer font-semibold transition-all duration-200 ease-in-out no-underline inline-flex items-center justify-start opacity-100 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: [
          // Light mode
          'bg-blue-600 text-white border border-transparent',
          'hover:bg-blue-700 disabled:hover:bg-blue-600',
          // Dark mode
          'dark:bg-purple-500 dark:text-white',
          'dark:hover:bg-purple-400 dark:disabled:hover:bg-purple-500',
        ],
        secondary: [
          // Light mode
          'bg-blue-100 text-blue-600 border border-blue-600',
          'hover:bg-blue-200 hover:border-blue-700',
          // Dark mode
          'dark:bg-purple-900/20 dark:text-white dark:border-purple-500',
          'dark:hover:bg-purple-800/30 dark:hover:border-purple-400',
        ],
        outline: [
          // Light mode
          'bg-transparent text-blue-600 border border-blue-600',
          'hover:bg-blue-600 hover:text-white',
          // Dark mode
          'dark:text-purple-500 dark:border-purple-500',
          'dark:hover:bg-purple-500 dark:hover:text-gray-900',
        ],
      },
      size: {
        small: 'text-sm',
        medium: 'px-6 py-3 text-base',
        large: 'px-8 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  }
);

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  className,
}: ButtonProps) => {
  return (
    <button className={clsx(buttonVariants({ variant, size }), className)} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};
