import { Router } from 'express';
import { onboardingSchema, updateClinicaSchema } from '@nutricao/shared';
import { validate } from '../../../shared/middlewares/validate.js';
import { authMiddleware, roleGuard } from '../../../shared/middlewares/auth.js';
import * as controller from './clinica.controller.js';

const clinicaRoutes = Router();

clinicaRoutes.post('/onboarding', validate(onboardingSchema), controller.onboarding);
clinicaRoutes.get('/', authMiddleware, controller.getClinica);
clinicaRoutes.put('/', authMiddleware, roleGuard('ADMIN'), validate(updateClinicaSchema), controller.atualizarClinica);

export { clinicaRoutes };
