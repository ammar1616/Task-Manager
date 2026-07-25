import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import TaskCard from '../TaskCard';

const mockTask = {
  _id: '1',
  title: 'Test Task',
  description: 'Test description',
  status: 'todo' as const,
  priority: 'high' as const,
  dueDate: '2026-08-01T00:00:00.000Z',
  attachment: 'file.pdf',
  user: 'user1',
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
};

const renderCard = (task = mockTask, onClick = jest.fn()) =>
  render(
    <DragDropContext onDragEnd={jest.fn()}>
      <Droppable droppableId="test">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <TaskCard task={task} index={0} onClick={onClick} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );

describe('TaskCard Component', () => {
  test('renders task title and priority', () => {
    renderCard();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  test('shows description text', () => {
    renderCard();
    expect(screen.getByText('todo')).toBeInTheDocument();
  });

  test('shows due date', () => {
    renderCard();
    expect(screen.getByText(/8\/1\/2026/)).toBeInTheDocument();
  });

  test('calls onClick when clicked', async () => {
    const onClick = jest.fn();
    renderCard(mockTask, onClick);
    const user = userEvent.setup();
    await user.click(screen.getByText('Test Task'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('shows attachment icon when task has attachment', () => {
    renderCard();
    expect(document.querySelector('.anticon-paper-clip')).toBeInTheDocument();
  });
});
