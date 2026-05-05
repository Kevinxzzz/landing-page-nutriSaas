import { Router } from "express";
import {
  createPacienteSchema,
  updatePacienteSchema,
  createPacienteQuestionarioAvaliacaoSchema,
} from "@nutricao/shared";

import { validate } from "../../../shared/middlewares/validate.js";
import { authMiddleware } from "../../../shared/middlewares/auth.js";
import { publicRateLimiter } from "../../../shared/middlewares/rateLimiter.js";
import * as controller from "./pacientes.controller.js";

const router = Router();

// Rotas públicas
router.post(
  "/:id/questionarios/:questionarioId/avaliacoes",
  publicRateLimiter,
  validate(createPacienteQuestionarioAvaliacaoSchema),
  controller.criarAvaliacao,
);

router.get("/:id/nome", controller.buscarNomePorId);

// Rotas autenticadas
router.use(authMiddleware);

router.get("/", controller.listar);
router.get("/:id/avaliacoes", controller.listarAvaliacoes);
router.get("/:id", controller.buscarPorId);
router.post("/", validate(createPacienteSchema), controller.criar);
router.put("/:id", validate(updatePacienteSchema), controller.editar);
router.delete("/:id", controller.excluir);

export { router as pacientesRoutes };
