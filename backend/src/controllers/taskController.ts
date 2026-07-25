import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import * as taskService from '../services/taskService';

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await taskService.getTasks(req.user!._id);
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user!._id);
    res.json(task);
  } catch (error: any) {
    const status = error.message === 'Task not found' ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const task = await taskService.createTask({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      dueDate: req.body.dueDate,
      userId: req.user!._id,
    });

    res.status(201).json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const task = await taskService.updateTask(req.params.id, req.user!._id, {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      dueDate: req.body.dueDate,
    });

    res.json(task);
  } catch (error: any) {
    const status = error.message === 'Task not found' ? 404 : 500;
    res.status(status).json({ message: error.message });
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
  } catch (error: any) {
    const status = error.message === 'Task not found' ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    await taskService.deleteTask(req.params.id, req.user!._id);
    res.json({ message: 'Task deleted' });
  } catch (error: any) {
    const status = error.message === 'Task not found' ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};
