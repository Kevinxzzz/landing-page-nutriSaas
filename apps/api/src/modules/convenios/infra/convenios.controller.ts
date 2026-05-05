import { Request, Response } from 'express';
import { prisma } from '../../../shared/providers/prisma.js';
import { AppError } from '../../../shared/middlewares/errorHandler.js';
import { getClinicaId } from '../../../shared/middlewares/auth.js';

export async function listar(req: Request, res: Response) {
  const clinicaId = getClinicaId(req);
  const convenios = await prisma.convenio.findMany({
    where: { clinicaId },
    orderBy: { nome: 'asc' },
  });
  return res.json({ success: true, data: convenios });
}

export async function criar(req: Request, res: Response) {
  const clinicaId = getClinicaId(req);
  const convenio = await prisma.convenio.create({
    data: { ...req.body, clinicaId },
  });
  return res.status(201).json({ success: true, data: convenio });
}

export async function editar(req: Request<{ id: string }>, res: Response) {
  const clinicaId = getClinicaId(req);
  const { id } = req.params;
  const existente = await prisma.convenio.findFirst({ where: { id, clinicaId } });
  if (!existente) throw new AppError('Convênio não encontrado', 404);

  const convenio = await prisma.convenio.update({ where: { id }, data: req.body });
  return res.json({ success: true, data: convenio });
}

export async function excluir(req: Request<{ id: string }>, res: Response) {
  const clinicaId = getClinicaId(req);
  const { id } = req.params;
  const existente = await prisma.convenio.findFirst({ where: { id, clinicaId } });
  if (!existente) throw new AppError('Convênio não encontrado', 404);

  await prisma.convenio.delete({ where: { id } });
  return res.json({ success: true, message: 'Convênio excluído' });
}
