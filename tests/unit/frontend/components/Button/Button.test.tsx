import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../../../../../frontend/src/components/Button/Button";

describe("Button", () => {
  it("renders with default props", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Click me");
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("can be disabled", () => {
    render(<Button disabled>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeDisabled();
  });

  it("renders with different variants", () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders with different sizes", () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(<Button size="medium">Medium</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(<Button size="large">Large</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("custom-class");
  });
});
