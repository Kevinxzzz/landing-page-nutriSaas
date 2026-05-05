import { Router } from 'express';
import { authMiddleware } from '../../../shared/middlewares/auth.js';
import * as controller from './relatorios.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/', controller.gerarRelatorio);

export { router as relatoriosRoutes };
