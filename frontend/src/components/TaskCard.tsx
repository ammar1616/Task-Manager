import React from 'react';
import { Card, Tag, Typography } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import { Draggable } from '@hello-pangea/dnd';
import { Task } from '../types';

const { Text } = Typography;

const priorityColors: Record<string, string> = {
  high: '#ff4d4f',
  medium: '#faad14',
  low: '#52c41a',
};

const statusColors: Record<string, string> = {
  todo: '#d9d9d9',
  in_progress: '#1677ff',
  done: '#52c41a',
};

interface Props {
  task: Task;
  index: number;
  onClick: () => void;
}

const TaskCard: React.FC<Props> = ({ task, index, onClick }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          style={{ ...provided.draggableProps.style, marginBottom: 8 }}
        >
          <Card
            size="small"
            style={{
              borderLeft: `4px solid ${priorityColors[task.priority]}`,
              cursor: 'pointer',
            }}
          >
            <Text strong style={{ fontSize: 13 }}>{task.title}</Text>
            <div style={{ marginTop: 6, display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
              <Tag color={statusColors[task.status]} style={{ fontSize: 11 }}>
                {task.status.replace('_', ' ')}
              </Tag>
              {task.dueDate && (
                <Text style={{ fontSize: 11, color: isOverdue ? '#ff4d4f' : '#999' }}>
                  {isOverdue ? 'Overdue: ' : ''}{new Date(task.dueDate).toLocaleDateString()}
                </Text>
              )}
              {task.attachment && <PaperClipOutlined style={{ color: '#999', fontSize: 12 }} />}
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
