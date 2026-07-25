import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import BoardView from '../BoardView';

var mockApi: { get: jest.Mock; post: jest.Mock; put: jest.Mock; patch: jest.Mock; delete: jest.Mock };

jest.mock('../../api/axios', () => {
  mockApi = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockApi,
    SERVER_URL: 'http://localhost:5000',
  };
});

const mockTasks = [
  { _id: '1', title: 'Task 1', description: 'Desc', status: 'todo', priority: 'high', dueDate: '2026-08-01T00:00:00.000Z', user: 'u1', createdAt: '2026-07-01T00:00:00.000Z', updatedAt: '2026-07-01T00:00:00.000Z' },
  { _id: '2', title: 'Task 2', description: '', status: 'in_progress', priority: 'medium', user: 'u1', createdAt: '2026-07-01T00:00:00.000Z', updatedAt: '2026-07-01T00:00:00.000Z' },
  { _id: '3', title: 'Task 3', description: 'Desc', status: 'done', priority: 'low', user: 'u1', createdAt: '2026-07-01T00:00:00.000Z', updatedAt: '2026-07-01T00:00:00.000Z' },
];

const renderBoard = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <BoardView />
      </AuthProvider>
    </MemoryRouter>
  );

describe('BoardView Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApi.get.mockResolvedValue({ data: { tasks: mockTasks, total: 3, page: 1, totalPages: 1 } });
  });

  test('renders search input', async () => {
    renderBoard();
    expect(await screen.findByPlaceholderText('Search tasks...')).toBeInTheDocument();
  });

  test('renders stats cards (total, overdue, columns)', async () => {
    renderBoard();
    expect(await screen.findByText('Total')).toBeInTheDocument();
    expect(await screen.findByText('Overdue')).toBeInTheDocument();
    const todos = await screen.findAllByText('To Do');
    expect(todos.length).toBeGreaterThanOrEqual(1);
    const progress = await screen.findAllByText('In Progress');
    expect(progress.length).toBeGreaterThanOrEqual(1);
    const dones = await screen.findAllByText('Done');
    expect(dones.length).toBeGreaterThanOrEqual(1);
  });

  test('renders task data and column cards after API resolves', async () => {
    renderBoard();
    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalled();
    });
    expect(await screen.findByText('Task 1')).toBeInTheDocument();
    expect(await screen.findByText('Task 2')).toBeInTheDocument();
    expect(await screen.findByText('Task 3')).toBeInTheDocument();
    const todos = screen.getAllByText('To Do');
    expect(todos.length).toBe(2);
    const progress = screen.getAllByText('In Progress');
    expect(progress.length).toBe(2);
    const dones = screen.getAllByText('Done');
    expect(dones.length).toBe(2);
  });

  test('shows error message when API fails', async () => {
    mockApi.get.mockRejectedValue(new Error('Network error'));
    renderBoard();
    expect(await screen.findByText('Failed to load tasks')).toBeInTheDocument();
  });
});
