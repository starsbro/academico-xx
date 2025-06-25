import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '@/components/ThemeToggle';

describe('ThemeToggle', () => {
  const mockMatchMedia = (matches: boolean) => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  };

  beforeEach(() => {
    // Clear class list before each test
    document.documentElement.classList.remove('dark');
  });

  test('renders the toggle button', () => {
    mockMatchMedia(false); // Light mode by default
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });

  test('initializes with light mode if prefers-color-scheme is light', () => {
    mockMatchMedia(false);
    render(<ThemeToggle />);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    // Check for sun icon using test-id
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument();
  });

  test('initializes with dark mode if prefers-color-scheme is dark', () => {
    mockMatchMedia(true);
    render(<ThemeToggle />);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument();
  });

  test('toggles theme from light to dark on click', () => {
    mockMatchMedia(false);
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle theme/i });

    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();

    fireEvent.click(button);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument();
  });

  test('toggles theme from dark to light on click', () => {
    mockMatchMedia(true);
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle theme/i });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();

    fireEvent.click(button);

    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument();
  });

  test('has correct aria-label', () => {
    mockMatchMedia(false);
    render(<ThemeToggle />);
    expect(screen.getByLabelText(/toggle theme/i)).toBeInTheDocument();
  });
});
