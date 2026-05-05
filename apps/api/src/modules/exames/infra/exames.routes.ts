import { Router } from 'express';
import { createExameBaseSchema, solicitarExameSchema, registrarResultadoSchema } from '@nutricao/shared';
import { validate } from '../../../shared/middlewares/validate.js';
import { authMiddleware } from '../../../shared/middlewares/auth.js';
import { roleGuard } from '../../../shared/middlewares/auth.js';
import * as controller from './exames.controller.js';

const router = Router();

router.use(authMiddleware);

// Exames Base (config)
router.get('/base', controller.listarExamesBase);
router.post('/base', roleGuard('ADMIN', 'NUTRICIONISTA'), validate(createExameBaseSchema), controller.criarExameBase);
router.put('/base/:id', roleGuard('ADMIN', 'NUTRICIONISTA'), controller.editarExameBase);
router.delete('/base/:id', roleGuard('ADMIN'), controller.excluirExameBase);

// Solicitações por paciente
router.get('/paciente/:pacienteId', controller.listarSolicitacoes);
router.post('/paciente/:pacienteId', validate(solicitarExameSchema), controller.solicitarExame);
router.delete('/:id', controller.excluirSolicitacao);

// Resultado
router.post('/resultado', validate(registrarResultadoSchema), controller.registrarResultado);

export { router as examesRoutes };
