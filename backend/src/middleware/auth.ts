import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
  };
}

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const header = req.header('Authorization');
    if (!header?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.user = { _id: user._id.toString(), name: user.name, email: user.email };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default auth;
