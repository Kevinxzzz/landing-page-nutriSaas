import { Router } from "express";
import { createUsuarioSchema } from "@nutricao/shared";
import { validate } from "../../../shared/middlewares/validate.js";
import { authMiddleware, roleGuard } from "../../../shared/middlewares/auth.js";
import * as controller from "./usuarios.controller.js";

const router = Router();
router.post("/esqueci-senha", controller.esqueciSenha);
router.post("/redefinir-senha", controller.alterarSenha);

router.use(authMiddleware);
router.use(roleGuard("ADMIN"));

router.get("/", controller.listar);
router.post("/", validate(createUsuarioSchema), controller.criar);
router.put("/:id", controller.editar);
router.delete("/:id", controller.excluir);

export { router as usuariosRoutes };
