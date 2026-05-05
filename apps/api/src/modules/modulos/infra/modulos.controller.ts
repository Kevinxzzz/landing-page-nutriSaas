import { Request, Response } from "express";
import {
  CreateModuloPerguntaInput,
  UpdateModuloPerguntaInput,
  UpdateQuestionarioModuloInput,
} from "@nutricao/shared";
import * as service from "./modulos.service";
import { getClinicaId } from "../../../shared/middlewares/auth.js";

export async function criarPergunta(
  req: Request<{ moduloId: string }>,
  res: Response,
) {
  const clinicaId = getClinicaId(req);
  const { moduloId } = req.params;
  const payload = req.body as CreateModuloPerguntaInput;

  const pergunta = await service.criarPergunta(clinicaId, moduloId, payload);

  return res.status(201).json({ success: true, data: pergunta });
}

export async function editarModulo(
  req: Request<{ moduloId: string }>,
  res: Response,
) {
  const clinicaId = getClinicaId(req);
  const { moduloId } = req.params;
  const payload = req.body as UpdateQuestionarioModuloInput;

  const modulo = await service.editarModulo(clinicaId, moduloId, payload);

  return res.json({ success: true, data: modulo });
}

export async function excluirModulo(
  req: Request<{ moduloId: string }>,
  res: Response,
) {
  const clinicaId = getClinicaId(req);
  const { moduloId } = req.params;

  await service.excluirModulo(clinicaId, moduloId);

  return res.json({ success: true, message: "Módulo excluído" });
}

export async function editarPergunta(
  req: Request<{ moduloId: string; perguntaId: string }>,
  res: Response,
) {
  const clinicaId = getClinicaId(req);
  const { moduloId, perguntaId } = req.params;
  const payload = req.body as UpdateModuloPerguntaInput;

  const pergunta = await service.editarPergunta(
    clinicaId,
    moduloId,
    perguntaId,
    payload,
  );

  return res.json({ success: true, data: pergunta });
}

export async function excluirPergunta(
  req: Request<{ moduloId: string; perguntaId: string }>,
  res: Response,
) {
  const clinicaId = getClinicaId(req);
  const { moduloId, perguntaId } = req.params;

  await service.excluirPergunta(clinicaId, moduloId, perguntaId);

  return res.json({ success: true, message: "Pergunta excluída" });
}
