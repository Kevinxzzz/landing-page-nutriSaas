import { Response, Request } from "express";
import { getClinicaId } from "@/shared/middlewares/auth.js";
import * as service from "./avaliacoes.service.js";

export async function buscarPorId(req: Request<{ id: string }>, res: Response) {
  const clinicaId = getClinicaId(req);
  const id = req.params.id;

  const avaliacao = await service.pegarAvaliacaoPorId(id, clinicaId);

  return res.json({ success: true, data: avaliacao });
}

export async function buscarComRespostas(
  req: Request<{ id: string }>,
  res: Response,
) {
  const clinicaId = getClinicaId(req);
  const id = req.params.id;

  const avaliacao = await service.pegarAvaliacaoComRespostas(id, clinicaId);

  return res.json({ success: true, data: avaliacao });
}

export async function excluir(req: Request<{ id: string }>, res: Response) {
  const clinicaId = getClinicaId(req);
  const id = req.params.id;

  await service.excluirAvaliacao(id, clinicaId);

  return res.status(204).send();
}

