import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import * as taskService from '../services/taskService';
import { errorMessage } from '../utils/errors';

const handleTaskError = (error: unknown, res: Response) => {
  const msg = errorMessage(error);
  if (msg === 'Task not found') {
    res.status(404).json({ message: msg });
  } else {
    res.status(500).json({ message: msg });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const result = await taskService.getTasks({
      userId: req.user!._id,
      search: req.query.search as string,
      status: req.query.status as string,
      priority: req.query.priority as string,
      sortBy: req.query.sortBy as string,
      order: req.query.order as string,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
    });

    res.json(result);
  } catch (error: unknown) {
    res.status(500).json({ message: errorMessage(error) });
  }
};

export const getTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user!._id);
    res.json(task);
  } catch (error: unknown) {
    handleTaskError(error, res);
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const attachment = req.file ? `/uploads/${req.file.filename}` : undefined;

    const task = await taskService.createTask({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      dueDate: req.body.dueDate,
      attachment,
      userId: req.user!._id,
    });

    res.status(201).json(task);
  } catch (error: unknown) {
    res.status(500).json({ message: errorMessage(error) });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const attachment = req.file ? `/uploads/${req.file.filename}` : undefined;

    const task = await taskService.updateTask(req.params.id, req.user!._id, {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      dueDate: req.body.dueDate,
      attachment,
    });

    res.json(task);
  } catch (error: unknown) {
    handleTaskError(error, res);
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const task = await taskService.updateTaskStatus(
      req.params.id,
      req.user!._id,
      req.body.status
    );

    res.json(task);
  } catch (error: unknown) {
    handleTaskError(error, res);
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    await taskService.deleteTask(req.params.id, req.user!._id);
    res.json({ message: 'Task deleted' });
  } catch (error: unknown) {
    handleTaskError(error, res);
  }
};
