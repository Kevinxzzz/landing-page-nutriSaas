import { Request, Response } from 'express';
import { prisma } from '../../../shared/providers/prisma.js';
import { AppError } from '../../../shared/middlewares/errorHandler.js';

// Evolução Clínica
export async function listarEvolucoes(req: Request<{ pacienteId: string }>, res: Response) {
  const { pacienteId } = req.params;

  const evolucoes = await prisma.evolucaoClinica.findMany({
    where: { pacienteId },
    orderBy: { criadoEm: 'desc' },
  });

  return res.json({ success: true, data: evolucoes });
}

export async function criarEvolucao(req: Request<{ pacienteId: string }>, res: Response) {
  const { pacienteId } = req.params;

  const paciente = await prisma.paciente.findUnique({ where: { id: pacienteId } });
  if (!paciente) throw new AppError('Paciente não encontrado', 404);

  const evolucao = await prisma.evolucaoClinica.create({
    data: { ...req.body, pacienteId },
  });

  return res.status(201).json({ success: true, data: evolucao });
}

export async function editarEvolucao(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;

  const existente = await prisma.evolucaoClinica.findUnique({ where: { id } });
  if (!existente) throw new AppError('Evolução não encontrada', 404);

  const evolucao = await prisma.evolucaoClinica.update({
    where: { id },
    data: req.body,
  });

  return res.json({ success: true, data: evolucao });
}

// Medidas
export async function listarMedidas(req: Request<{ pacienteId: string }>, res: Response) {
  const { pacienteId } = req.params;

  const medidas = await prisma.medida.findMany({
    where: { pacienteId },
    orderBy: { data: 'desc' },
  });

  return res.json({ success: true, data: medidas });
}

export async function criarMedida(req: Request<{ pacienteId: string }>, res: Response) {
  const { pacienteId } = req.params;

  const paciente = await prisma.paciente.findUnique({ where: { id: pacienteId } });
  if (!paciente) throw new AppError('Paciente não encontrado', 404);

  const medida = await prisma.medida.create({
    data: {
      ...req.body,
      pacienteId,
      data: new Date(req.body.data),
    },
  });

  return res.status(201).json({ success: true, data: medida });
}

export async function excluirMedida(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;

  const existente = await prisma.medida.findUnique({ where: { id } });
  if (!existente) throw new AppError('Medida não encontrada', 404);

  await prisma.medida.delete({ where: { id } });

  return res.json({ success: true, message: 'Medida excluída' });
}
