import { Request, Response } from 'express';
import { prisma } from '../../../shared/providers/prisma.js';
import { AppError } from '../../../shared/middlewares/errorHandler.js';
import { getClinicaId } from '../../../shared/middlewares/auth.js';

// Exames Base (config)
export async function listarExamesBase(req: Request, res: Response) {
  const clinicaId = getClinicaId(req);
  const { tipo } = req.query; // 'base' | 'custom' | undefined (all)

  const where: any = { clinicaId };
  if (tipo === 'base') where.isBase = true;
  if (tipo === 'custom') where.isBase = false;

  const exames = await prisma.exameBase.findMany({
    where,
    orderBy: { nome: 'asc' },
  });
  return res.json({ success: true, data: exames });
}

export async function criarExameBase(req: Request, res: Response) {
  const clinicaId = getClinicaId(req);

  const existente = await prisma.exameBase.findFirst({
    where: { clinicaId, codigo: req.body.codigo },
  });
  if (existente) throw new AppError('Código de exame já existe', 409);

  const exame = await prisma.exameBase.create({
    data: { ...req.body, clinicaId, isBase: false },
  });
  return res.status(201).json({ success: true, data: exame });
}

export async function editarExameBase(req: Request<{ id: string }>, res: Response) {
  const clinicaId = getClinicaId(req);
  const { id } = req.params;
  const existente = await prisma.exameBase.findFirst({ where: { id, clinicaId } });
  if (!existente) throw new AppError('Exame não encontrado', 404);
  if (existente.isBase) throw new AppError('Exames base não podem ser editados', 403);

  const exame = await prisma.exameBase.update({ where: { id }, data: req.body });
  return res.json({ success: true, data: exame });
}

export async function excluirExameBase(req: Request<{ id: string }>, res: Response) {
  const clinicaId = getClinicaId(req);
  const { id } = req.params;
  const existente = await prisma.exameBase.findFirst({ where: { id, clinicaId } });
  if (!existente) throw new AppError('Exame não encontrado', 404);
  if (existente.isBase) throw new AppError('Exames base não podem ser excluídos', 403);

  await prisma.exameBase.delete({ where: { id } });
  return res.json({ success: true, message: 'Exame exclu��do' });
}

// Solicitações de Exame (por paciente)
export async function listarSolicitacoes(req: Request<{ pacienteId: string }>, res: Response) {
  const { pacienteId } = req.params;

  const solicitacoes = await prisma.solicitacaoExame.findMany({
    where: { pacienteId },
    include: {
      itens: {
        include: { exameBase: true },
      },
    },
    orderBy: { dataSolicitada: 'desc' },
  });

  return res.json({ success: true, data: solicitacoes });
}

export async function solicitarExame(req: Request<{ pacienteId: string }>, res: Response) {
  const { pacienteId } = req.params;
  const { exameBaseIds } = req.body;

  const paciente = await prisma.paciente.findUnique({ where: { id: pacienteId } });
  if (!paciente) throw new AppError('Paciente não encontrado', 404);

  const solicitacao = await prisma.solicitacaoExame.create({
    data: {
      pacienteId,
      itens: {
        create: exameBaseIds.map((exameBaseId: string) => ({
          exameBaseId,
        })),
      },
    },
    include: {
      itens: { include: { exameBase: true } },
    },
  });

  return res.status(201).json({ success: true, data: solicitacao });
}

export async function registrarResultado(req: Request, res: Response) {
  const { itemId, dataResultado, resultado } = req.body;

  const item = await prisma.solicitacaoExameItem.findUnique({
    where: { id: itemId },
  });
  if (!item) throw new AppError('Item de solicitação não encontrado', 404);

  const updated = await prisma.solicitacaoExameItem.update({
    where: { id: itemId },
    data: {
      dataResultado: new Date(dataResultado),
      resultado,
    },
    include: { exameBase: true },
  });

  return res.json({ success: true, data: updated });
}

export async function excluirSolicitacao(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;

  const existente = await prisma.solicitacaoExame.findUnique({ where: { id } });
  if (!existente) throw new AppError('Solicitação não encontrada', 404);

  await prisma.solicitacaoExame.delete({ where: { id } });
  return res.json({ success: true, message: 'Solicitação excluída' });
}
