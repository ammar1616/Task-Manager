import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as authService from '../services/authService';

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
  } catch (error: any) {
    const status = error.message === 'Email already in use' ? 400 : 500;
    res.status(status).json({ message: error.message });
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
  } catch (error: any) {
    const status = error.message === 'Invalid credentials' ? 401 : 500;
    res.status(status).json({ message: error.message });
  }
};
