import { Router } from "express";
import { authMiddleware } from "../../../shared/middlewares/auth.js";
import * as controller from "./avaliacoes.controller.js";
const router = Router();
router.use(authMiddleware);
router.get("/:id", controller.buscarPorId);
router.get("/:id/questionario", controller.buscarComRespostas);
router.delete("/:id", controller.Exluir);
export { router as avaliacoesRoutes };
