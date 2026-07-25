import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Task } from '../../types';
import TaskDetail from '../TaskDetail';

const mockTask: Task = {
  _id: '1',
  title: 'Test Task',
  description: 'Test description',
  status: 'todo',
  priority: 'high',
  dueDate: '2026-08-01T00:00:00.000Z',
  user: 'user1',
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
};

const renderDetail = (task: Task | null = mockTask, open = true) => {
  const onClose = jest.fn();
  const onSuccess = jest.fn();
  render(
    <TaskDetail task={task} open={open} onClose={onClose} onSuccess={onSuccess} />
  );
  return { onClose, onSuccess };
};

describe('TaskDetail Component', () => {
  test('renders task information', () => {
    renderDetail();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('todo')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  test('shows edit and delete buttons in view mode', () => {
    renderDetail();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  test('switches to edit mode when edit is clicked', async () => {
    renderDetail();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /edit/i }));
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  test('shows description fallback when empty', () => {
    renderDetail({ ...mockTask, description: undefined });
    const labels = screen.getAllByText('-');
    expect(labels.length).toBeGreaterThanOrEqual(1);
  });

  test('does not render when closed', () => {
    renderDetail(mockTask, false);
    expect(screen.queryByText('Test Task')).not.toBeInTheDocument();
  });
});
