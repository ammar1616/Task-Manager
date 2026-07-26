import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import taskRoutes from '../routes/tasks';
import { mockUserId, createMockTask } from './helpers';

jest.mock('../middleware/auth', () => ({
  __esModule: true,
  default: (req: Request, _res: Response, next: NextFunction) => {
    Object.assign(req, { user: { _id: 'mock-user-id', name: 'Test User', email: 'test@example.com' } });
    next();
  },
}));

jest.mock('../models/Task');

const app = express();
app.use(express.json());
app.use('/api/tasks', taskRoutes);

describe('Task Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/tasks', () => {
    it('should return paginated tasks', async () => {
      const Task = require('../models/Task').default;
      const mockTasks = [
        createMockTask({ _id: 't1', title: 'Task 1' }),
        createMockTask({ _id: 't2', title: 'Task 2' }),
      ];

      Task.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockTasks),
      });
      Task.countDocuments.mockResolvedValue(2);

      const res = await request(app).get('/api/tasks');

      expect(res.status).toBe(200);
      expect(res.body.tasks).toHaveLength(2);
      expect(res.body.total).toBe(2);
    });

    it('should search tasks by title', async () => {
      const Task = require('../models/Task').default;

      Task.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      });
      Task.countDocuments.mockResolvedValue(0);

      const res = await request(app).get('/api/tasks?search=test');

      expect(res.status).toBe(200);
      expect(Task.find).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.objectContaining({ $regex: 'test', $options: 'i' }),
        })
      );
    });

    it('should filter by priority', async () => {
      const Task = require('../models/Task').default;

      Task.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      });
      Task.countDocuments.mockResolvedValue(0);

      const res = await request(app).get('/api/tasks?priority=high');

      expect(res.status).toBe(200);
      expect(Task.find).toHaveBeenCalledWith(
        expect.objectContaining({ priority: 'high' })
      );
    });

    it('should filter by status', async () => {
      const Task = require('../models/Task').default;

      Task.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      });
      Task.countDocuments.mockResolvedValue(0);

      const res = await request(app).get('/api/tasks?status=in_progress');

      expect(res.status).toBe(200);
      expect(Task.find).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'in_progress' })
      );
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a task', async () => {
      const Task = require('../models/Task').default;
      const mockTask = createMockTask({ _id: 't1' });
      Task.create.mockResolvedValue(mockTask);

      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'New Task' });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Test Task');
    });

    it('should reject missing title', async () => {
      const res = await request(app).post('/api/tasks').send({});

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should create a task with file attachment', async () => {
      const Task = require('../models/Task').default;
      const mockTask = createMockTask({ _id: 't1', attachment: '/uploads/test-file.txt' });
      Task.create.mockResolvedValue(mockTask);

      const res = await request(app)
        .post('/api/tasks')
        .field('title', 'Task with file')
        .attach('attachment', Buffer.from('file content'), 'test-file.txt');

      expect(res.status).toBe(201);
      expect(res.body.attachment).toContain('/uploads/');
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a task by id', async () => {
      const Task = require('../models/Task').default;
      Task.findOne.mockResolvedValue(createMockTask({ _id: 't1' }));

      const res = await request(app).get('/api/tasks/t1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title');
    });

    it('should return 404 for unknown task', async () => {
      const Task = require('../models/Task').default;
      Task.findOne.mockResolvedValue(null);

      const res = await request(app).get('/api/tasks/unknown');

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const Task = require('../models/Task').default;
      const mockTask = {
        ...createMockTask({ _id: 't1' }),
        title: 'Test Task',
        description: '',
        status: 'todo',
        priority: 'medium',
        save: jest.fn().mockResolvedValue({
          ...createMockTask({ _id: 't1' }),
          title: 'Updated',
        }),
      };
      Task.findOne.mockResolvedValue(mockTask);

      const res = await request(app)
        .put('/api/tasks/t1')
        .send({ title: 'Updated' });

      expect(res.status).toBe(200);
      expect(mockTask.title).toBe('Updated');
    });

    it('should return 404 for unknown task', async () => {
      const Task = require('../models/Task').default;
      Task.findOne.mockResolvedValue(null);

      const res = await request(app)
        .put('/api/tasks/unknown')
        .send({ title: 'Updated' });

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/tasks/:id/status', () => {
    it('should update task status', async () => {
      const Task = require('../models/Task').default;
      const mockTask = {
        ...createMockTask({ _id: 't1' }),
        save: jest.fn().mockResolvedValue({
          ...createMockTask({ _id: 't1' }),
          status: 'done',
        }),
      };
      Task.findOne.mockResolvedValue(mockTask);

      const res = await request(app)
        .patch('/api/tasks/t1/status')
        .send({ status: 'done' });

      expect(res.status).toBe(200);
      expect(mockTask.status).toBe('done');
    });

    it('should reject invalid status', async () => {
      const res = await request(app)
        .patch('/api/tasks/t1/status')
        .send({ status: 'invalid' });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const Task = require('../models/Task').default;
      Task.findOneAndDelete.mockResolvedValue(createMockTask({ _id: 't1' }));

      const res = await request(app).delete('/api/tasks/t1');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Task deleted');
    });

    it('should return 404 for unknown task', async () => {
      const Task = require('../models/Task').default;
      Task.findOneAndDelete.mockResolvedValue(null);

      const res = await request(app).delete('/api/tasks/unknown');

      expect(res.status).toBe(404);
    });
  });
});
