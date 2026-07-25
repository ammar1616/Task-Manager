import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Row, Col, Card, Input, Select, Statistic, Pagination, Spin, Empty, message } from 'antd';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { SearchOutlined } from '@ant-design/icons';
import api from '../api/axios';
import { Task } from '../types';
import TaskCard from './TaskCard';
import TaskDetail from './TaskDetail';
import TaskForm from './TaskForm';

const { Meta } = Card;

const columns = [
  { id: 'todo', title: 'To Do', color: '#d9d9d9' },
  { id: 'in_progress', title: 'In Progress', color: '#1677ff' },
  { id: 'done', title: 'Done', color: '#52c41a' },
];

const BoardView: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchTasks = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const params: any = { page, limit: 10 };
      if (search) params.search = search;
      if (priorityFilter) params.priority = priorityFilter;

      const res = await api.get('/tasks', { params, signal: controller.signal });
      setTasks(res.data.tasks);
      setTotal(res.data.total);
    } catch (err: any) {
      if (err.name !== 'CanceledError') {
        message.error('Failed to load tasks');
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, priorityFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const getColumnTasks = (status: string) =>
    tasks.filter((t) => t.status === status);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    const task = tasks.find((t) => t._id === draggableId);
    if (!task || task.status === newStatus) return;

    setTasks((prev) =>
      prev.map((t) => (t._id === draggableId ? { ...t, status: newStatus as Task['status'] } : t))
    );

    try {
      await api.patch(`/tasks/${draggableId}/status`, { status: newStatus });
      message.success('Status updated');
    } catch {
      message.error('Failed to update status');
      fetchTasks();
    }
  };

  const getOverdueCount = () =>
    tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date()).length;

  return (
    <div style={{ padding: '80px 24px 24px' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Row gutter={12} style={{ marginBottom: 16 }}>
              <Col flex="auto">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  allowClear
                />
              </Col>
              <Col>
                <Select
                  placeholder="Priority"
                  value={priorityFilter}
                  onChange={(v) => { setPriorityFilter(v); setPage(1); }}
                  allowClear
                  style={{ width: 140 }}
                >
                  <Select.Option value="low">Low</Select.Option>
                  <Select.Option value="medium">Medium</Select.Option>
                  <Select.Option value="high">High</Select.Option>
                </Select>
              </Col>
              <Col>
                <Select
                  placeholder="Add Task"
                  style={{ width: 140 }}
                  onSelect={() => setFormOpen(true)}
                  value={undefined}
                >
                  <Select.Option value="add">+ New Task</Select.Option>
                </Select>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <Row gutter={12} style={{ marginBottom: 16 }}>
              <Col span={4}>
                <Card size="small"><Statistic title="Total" value={total} /></Card>
              </Col>
              <Col span={4}>
                <Card size="small"><Statistic title="Overdue" value={getOverdueCount()} valueStyle={{ color: '#ff4d4f' }} /></Card>
              </Col>
              {columns.map((col) => (
                <Col span={4} key={col.id}>
                  <Card size="small">
                    <Statistic title={col.title} value={tasks.filter((t) => t.status === col.id).length} />
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>

          {loading ? (
            <Col span={24} style={{ textAlign: 'center', padding: 60 }}>
              <Spin size="large" />
            </Col>
          ) : tasks.length === 0 ? (
            <Col span={24} style={{ textAlign: 'center', padding: 60 }}>
              <Empty description="No tasks found" />
            </Col>
          ) : (
            columns.map((col) => (
              <Col span={8} key={col.id}>
                <Card
                  title={col.title}
                  size="small"
                  style={{ minHeight: 200 }}
                  headStyle={{ borderBottom: `3px solid ${col.color}` }}
                >
                  <Droppable droppableId={col.id}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: 60 }}>
                        {getColumnTasks(col.id).map((task, index) => (
                          <TaskCard
                            key={task._id}
                            task={task}
                            index={index}
                            onClick={() => { setSelectedTask(task); setDetailOpen(true); }}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Card>
              </Col>
            ))
          )}

          <Col span={24} style={{ textAlign: 'center' }}>
            <Pagination
              current={page}
              total={total}
              pageSize={10}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
            />
          </Col>
        </Row>
      </DragDropContext>

      <TaskDetail
        task={selectedTask}
        open={detailOpen}
        onClose={() => { setDetailOpen(false); setSelectedTask(null); }}
        onSuccess={fetchTasks}
      />
      <TaskForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={fetchTasks}
      />
    </div>
  );
};

export default BoardView;
