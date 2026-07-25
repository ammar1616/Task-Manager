import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import * as authService from '../services/authService';
import { errorMessage } from '../utils/errors';

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, email, password } = req.body;
    const result = await authService.registerUser(name, email, password);
    res.status(201).json(result);
  } catch (error: unknown) {
    const status = errorMessage(error) === 'Email already in use' ? 400 : 500;
    res.status(status).json({ message: errorMessage(error) });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.json(result);
  } catch (error: unknown) {
    const status = errorMessage(error) === 'Invalid credentials' ? 401 : 500;
    res.status(status).json({ message: errorMessage(error) });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await authService.getCurrentUser(req.user!._id);
    res.json(user);
  } catch {
    res.status(404).json({ message: 'User not found' });
  }
};
