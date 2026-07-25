import Task from '../models/Task';

export const getTasks = async (userId: string) => {
  return Task.find({ user: userId }).sort({ createdAt: -1 });
};

export const getTaskById = async (taskId: string, userId: string) => {
  const task = await Task.findOne({ _id: taskId, user: userId });
  if (!task) {
    throw new Error('Task not found');
  }
  return task;
};

export const createTask = async (data: {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: Date;
  userId: string;
}) => {
  return Task.create({
    title: data.title,
    description: data.description,
    status: data.status || 'todo',
    priority: data.priority || 'medium',
    dueDate: data.dueDate,
    user: data.userId,
  });
};

export const updateTask = async (
  taskId: string,
  userId: string,
  data: Partial<{
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: Date | null;
  }>
) => {
  const task = await Task.findOne({ _id: taskId, user: userId });
  if (!task) {
    throw new Error('Task not found');
  }

  if (data.title !== undefined) task.title = data.title;
  if (data.description !== undefined) task.description = data.description;
  if (data.status !== undefined) task.status = data.status as any;
  if (data.priority !== undefined) task.priority = data.priority as any;
  if (data.dueDate !== undefined) task.dueDate = data.dueDate;

  return task.save();
};

export const updateTaskStatus = async (
  taskId: string,
  userId: string,
  status: string
) => {
  const task = await Task.findOne({ _id: taskId, user: userId });
  if (!task) {
    throw new Error('Task not found');
  }

  task.status = status as any;
  return task.save();
};

export const deleteTask = async (taskId: string, userId: string) => {
  const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
  if (!task) {
    throw new Error('Task not found');
  }
  return task;
};
