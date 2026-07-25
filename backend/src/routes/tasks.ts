import { Router } from 'express';
import auth from '../middleware/auth';
import upload from '../config/multer';
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
  listTasksValidation,
} from '../validations/task';

const router = Router();

router.use(auth);

router.get('/', listTasksValidation, getTasks);
router.get('/:id', getTask);
router.post('/', upload.single('attachment'), createTaskValidation, createTask);
router.put('/:id', upload.single('attachment'), updateTaskValidation, updateTask);
router.patch('/:id/status', updateStatusValidation, updateTaskStatus);
router.delete('/:id', deleteTask);

export default router;
