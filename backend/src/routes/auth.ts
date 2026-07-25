import { Router } from 'express';
import auth from '../middleware/auth';
import { register, login, getMe } from '../controllers/authController';
import { registerValidation, loginValidation } from '../validations/auth';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', auth, getMe);

export default router;
