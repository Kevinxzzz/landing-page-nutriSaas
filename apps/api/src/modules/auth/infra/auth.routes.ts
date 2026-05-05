import { Router } from 'express';
import { loginSchema } from '@nutricao/shared';
import { validate } from '../../../shared/middlewares/validate.js';
import { authMiddleware } from '../../../shared/middlewares/auth.js';
import * as controller from './auth.controller.js';

const router = Router();

router.post('/login', validate(loginSchema), controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', authMiddleware, controller.logout);
router.get('/me', authMiddleware, controller.me);

export { router as authRoutes };
