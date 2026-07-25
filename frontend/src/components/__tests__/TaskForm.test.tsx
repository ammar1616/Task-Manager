import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '../TaskForm';

const renderForm = (open = true) => {
  const onClose = jest.fn();
  const onSuccess = jest.fn();
  render(<TaskForm open={open} onClose={onClose} onSuccess={onSuccess} />);
  return { onClose, onSuccess };
};

describe('TaskForm Component', () => {
  test('renders the form when open', () => {
    renderForm();
    expect(screen.getByText('New Task')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
    expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    renderForm(false);
    expect(screen.queryByText('New Task')).not.toBeInTheDocument();
  });

  test('validates title is required', async () => {
    renderForm();
    const user = userEvent.setup();
    const okButton = screen.getByRole('button', { name: /ok/i });
    await user.click(okButton);
    expect(await screen.findByText('Title required')).toBeInTheDocument();
  });
});
