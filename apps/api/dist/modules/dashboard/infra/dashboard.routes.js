import { Router } from 'express';
import { authMiddleware } from '../../../shared/middlewares/auth.js';
import { getDashboard } from './dashboard.controller.js';
const dashboardRoutes = Router();
dashboardRoutes.use(authMiddleware);
dashboardRoutes.get('/', getDashboard);
export { dashboardRoutes };
