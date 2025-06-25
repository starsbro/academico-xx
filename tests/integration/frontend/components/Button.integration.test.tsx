import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/Button/Button';

// Integration test with minimal mocking for coverage
describe('Button Integration', () => {
  it('renders and handles interactions without mocks', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    
    render(
      <Button onClick={handleClick} variant="primary" size="medium">
        Test Button
      </Button>
    );

    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('inline-flex');
    
    // Test the actual component code execution
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    
    // This tests the actual className logic in the component
    expect(button).toHaveClass('bg-secondary');
  });

  it('applies size classes correctly', () => {
    render(<Button size="large">Large</Button>);
    const button = screen.getByRole('button');
    
    // This tests the actual className logic in the component
    expect(button).toHaveClass('h-11');
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:pointer-events-none');
  });
});
