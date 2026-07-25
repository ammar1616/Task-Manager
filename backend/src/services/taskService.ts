import Task from '../models/Task';
import type { ITask } from '../models/Task';

interface GetTasksParams {
  userId: string;
  search?: string;
  status?: string;
  priority?: string;
  sortBy?: string;
  order?: string;
  page?: number;
  limit?: number;
}

export const getTasks = async (params: GetTasksParams) => {
  const { userId, search, status, priority, sortBy, order, page = 1, limit = 10 } = params;

  const filter: Record<string, unknown> = { user: userId };

  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }
  if (status) {
    filter.status = status;
  }
  if (priority) {
    filter.priority = priority;
  }

  const sortField = sortBy || 'createdAt';
  const sortOrder = order === 'asc' ? 1 : -1;

  const skip = (page - 1) * limit;
  const [tasks, total] = await Promise.all([
    Task.find(filter).sort({ [sortField]: sortOrder }).skip(skip).limit(limit),
    Task.countDocuments(filter),
  ]);

  return { tasks, total, page, totalPages: Math.ceil(total / limit) };
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
  attachment?: string;
  userId: string;
}) => {
  return Task.create({
    title: data.title,
    description: data.description,
    status: data.status || 'todo',
    priority: data.priority || 'medium',
    dueDate: data.dueDate,
    attachment: data.attachment,
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
    attachment: string;
  }>
) => {
  const task = await Task.findOne({ _id: taskId, user: userId });
  if (!task) {
    throw new Error('Task not found');
  }

  if (data.title !== undefined) task.title = data.title;
  if (data.description !== undefined) task.description = data.description;
  if (data.status !== undefined) task.status = data.status as ITask['status'];
  if (data.priority !== undefined) task.priority = data.priority as ITask['priority'];
  if (data.dueDate !== undefined) task.dueDate = data.dueDate ?? undefined;
  if (data.attachment !== undefined) task.attachment = data.attachment;

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

  task.status = status as ITask['status'];
  return task.save();
};

export const deleteTask = async (taskId: string, userId: string) => {
  const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
  if (!task) {
    throw new Error('Task not found');
  }
  return task;
};
