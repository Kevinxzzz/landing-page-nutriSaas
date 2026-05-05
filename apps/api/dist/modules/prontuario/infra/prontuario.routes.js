import { Router } from 'express';
import { createEvolucaoSchema, createMedidaSchema } from '@nutricao/shared';
import { validate } from '../../../shared/middlewares/validate.js';
import { authMiddleware } from '../../../shared/middlewares/auth.js';
import * as controller from './prontuario.controller.js';
const router = Router();
router.use(authMiddleware);
// Evoluções
router.get('/:pacienteId/evolucoes', controller.listarEvolucoes);
router.post('/:pacienteId/evolucoes', validate(createEvolucaoSchema), controller.criarEvolucao);
router.put('/evolucoes/:id', controller.editarEvolucao);
// Medidas
router.get('/:pacienteId/medidas', controller.listarMedidas);
router.post('/:pacienteId/medidas', validate(createMedidaSchema), controller.criarMedida);
router.delete('/medidas/:id', controller.excluirMedida);
export { router as prontuarioRoutes };
