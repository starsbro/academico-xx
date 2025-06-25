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
    
    // Test the actual component code execution
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders different variants correctly', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    
    // Test that the component renders without throwing
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Secondary');
  });

  it('renders different sizes correctly', () => {
    render(<Button size="large">Large</Button>);
    const button = screen.getByRole('button');
    
    // Test that the component renders without throwing
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Large');
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Disabled');
  });
});
