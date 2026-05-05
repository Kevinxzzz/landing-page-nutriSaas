import { Router } from 'express';
import { createAgendamentoSchema, updateAgendamentoSchema, updateStatusSchema } from '@nutricao/shared';
import { validate } from '../../../shared/middlewares/validate.js';
import { authMiddleware } from '../../../shared/middlewares/auth.js';
import * as controller from './agenda.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/', controller.listar);
router.post('/', validate(createAgendamentoSchema), controller.criar);
router.put('/:id', validate(updateAgendamentoSchema), controller.editar);
router.patch('/:id/status', validate(updateStatusSchema), controller.alterarStatus);
router.delete('/:id', controller.excluir);

export { router as agendaRoutes };
