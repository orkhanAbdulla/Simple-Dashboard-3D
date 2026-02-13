import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddDesignerForm from './AddDesignerForm';

describe('AddDesignerForm', () => {
  it('renders form fields', () => {
    render(<AddDesignerForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/working hours/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add designer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<AddDesignerForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /add designer/i }));

    expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/working hours must be between 1 and 24/i)).toBeInTheDocument();
  });

  it('shows error for name shorter than 2 chars', async () => {
    const user = userEvent.setup();
    render(<AddDesignerForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/full name/i), 'A');
    await user.type(screen.getByLabelText(/working hours/i), '8');
    await user.click(screen.getByRole('button', { name: /add designer/i }));

    expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
  });

  it('shows error for invalid working hours', async () => {
    const user = userEvent.setup();
    render(<AddDesignerForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/full name/i), 'Alice');
    await user.type(screen.getByLabelText(/working hours/i), '25');
    await user.click(screen.getByRole('button', { name: /add designer/i }));

    expect(screen.getByText(/working hours must be between 1 and 24/i)).toBeInTheDocument();
  });

  it('calls onSubmit with valid data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AddDesignerForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/full name/i), 'Alice Smith');
    await user.type(screen.getByLabelText(/working hours/i), '8');
    await user.click(screen.getByRole('button', { name: /add designer/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      fullName: 'Alice Smith',
      workingHours: 8,
    });
  });

  it('calls onCancel when cancel clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<AddDesignerForm onSubmit={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalled();
  });
});
