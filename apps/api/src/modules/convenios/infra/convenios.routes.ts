import { Router } from 'express';
import { createConvenioSchema, updateConvenioSchema } from '@nutricao/shared';
import { validate } from '../../../shared/middlewares/validate.js';
import { authMiddleware, roleGuard } from '../../../shared/middlewares/auth.js';
import * as controller from './convenios.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/', controller.listar);
router.post('/', roleGuard('ADMIN'), validate(createConvenioSchema), controller.criar);
router.put('/:id', roleGuard('ADMIN'), validate(updateConvenioSchema), controller.editar);
router.delete('/:id', roleGuard('ADMIN'), controller.excluir);

export { router as conveniosRoutes };
