import { Button } from '@/components/ui/button';
import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('Button Component', () => {
  it('renders button with correct text', () => {
    const { container } = render(<Button>Click me</Button>);

    const button = within(container).getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const { container } = render(<Button onClick={handleClick}>Click me</Button>);

    const button = within(container).getByRole('button', { name: /click me/i });
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    const { container } = render(<Button disabled>Click me</Button>);

    const button = within(container).getByRole('button', { name: /click me/i });
    expect(button).toBeDisabled();
  });

  it('applies variant classes correctly', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);

    const button = within(container).getByRole('button', { name: 'Delete' });
    expect(button).toHaveClass('bg-destructive');
  });
});
