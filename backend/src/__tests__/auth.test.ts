import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/auth';

jest.mock('../models/User');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const User = require('../models/User').default;

      User.findOne.mockResolvedValue(null);

      const mockUser = {
        _id: 'user1',
        name: 'Test',
        email: 'test@example.com',
        toJSON: () => ({ _id: 'user1', name: 'Test', email: 'test@example.com' }),
      };
      User.create.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test', email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('test@example.com');
    });

    it('should reject duplicate email', async () => {
      const User = require('../models/User').default;
      User.findOne.mockResolvedValue({ email: 'test@example.com' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test', email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Email already in use');
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const User = require('../models/User').default;
      const bcrypt = require('bcryptjs');

      const hashedPassword = bcrypt.hashSync('password123', 10);

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          _id: 'user1',
          name: 'Test',
          email: 'test@example.com',
          password: hashedPassword,
        }),
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should reject wrong password', async () => {
      const User = require('../models/User').default;
      const bcrypt = require('bcryptjs');

      const hashedPassword = bcrypt.hashSync('correctpassword', 10);

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          _id: 'user1',
          email: 'test@example.com',
          password: hashedPassword,
        }),
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });
  });
});
