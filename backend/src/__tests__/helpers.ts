import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';

export const mockUserId = new mongoose.Types.ObjectId().toString();

export const mockAuth = (req: AuthRequest, _res: Response, next: NextFunction) => {
  req.user = { _id: mockUserId, name: 'Test User', email: 'test@example.com' };
  next();
};

export const createMockTask = (overrides = {}) => ({
  _id: new mongoose.Types.ObjectId(),
  title: 'Test Task',
  description: 'Test Description',
  status: 'todo',
  priority: 'medium',
  user: mockUserId,
  dueDate: undefined,
  attachment: undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});
