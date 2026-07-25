import { Router } from 'express';
import auth from '../middleware/auth';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from '../controllers/taskController';
import {
  createTaskValidation,
  updateTaskValidation,
  updateStatusValidation,
} from '../validations/task';

const router = Router();

router.use(auth);

router.get('/', getTasks);
router.get('/:id', getTask);
router.post('/', createTaskValidation, createTask);
router.put('/:id', updateTaskValidation, updateTask);
router.patch('/:id/status', updateStatusValidation, updateTaskStatus);
router.delete('/:id', deleteTask);

export default router;
