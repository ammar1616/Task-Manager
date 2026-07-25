import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth';

process.env.JWT_SECRET = 'test-jwt-secret';
const SECRET = process.env.JWT_SECRET as string;

jest.mock('../models/User');

describe('Auth Middleware', () => {
  let req: AuthRequest;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { header: jest.fn() } as unknown as AuthRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should call next with valid token', async () => {
    const User = require('../models/User').default;
    const token = jwt.sign({ userId: 'user1' }, SECRET);
    (req.header as jest.Mock).mockReturnValue(`Bearer ${token}`);
    User.findById.mockResolvedValue({
      _id: 'user1',
      name: 'Test',
      email: 'test@example.com',
    });

    const auth = require('../middleware/auth').default;
    await auth(req, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
  });

  it('should return 401 without Authorization header', async () => {
    (req.header as jest.Mock).mockReturnValue(undefined);

    const auth = require('../middleware/auth').default;
    await auth(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 with non-Bearer header', async () => {
    (req.header as jest.Mock).mockReturnValue('Basic token');

    const auth = require('../middleware/auth').default;
    await auth(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 with invalid token', async () => {
    (req.header as jest.Mock).mockReturnValue('Bearer invalid-token');

    const auth = require('../middleware/auth').default;
    await auth(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when user not found in db', async () => {
    const User = require('../models/User').default;
    const token = jwt.sign({ userId: 'nonexistent' }, SECRET);
    (req.header as jest.Mock).mockReturnValue(`Bearer ${token}`);
    User.findById.mockResolvedValue(null);

    const auth = require('../middleware/auth').default;
    await auth(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    expect(next).not.toHaveBeenCalled();
  });
});
