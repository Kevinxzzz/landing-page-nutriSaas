import { Request, Response } from "express";
import { prisma } from "../../../shared/providers/prisma.js";
import { AppError } from "../../../shared/middlewares/errorHandler.js";
import { getClinicaId } from "../../../shared/middlewares/auth.js";
import * as service from "./pacientes.service.js";
import { CreatePacienteQuestionarioAvaliacaoInput } from "@nutricao/shared";

export async function listar(req: Request, res: Response) {
  const clinicaId = getClinicaId(req);
  const { busca, page = "1", limit = "20" } = req.query;

  const where: any = { clinicaId };
  if (busca) {
    where.OR = [
      { nome: { contains: busca as string, mode: "insensitive" as const } },
      { email: { contains: busca as string, mode: "insensitive" as const } },
      { telefone: { contains: busca as string } },
    ];
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const [pacientes, total] = await Promise.all([
    prisma.paciente.findMany({
      where,
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        convenio: { select: { id: true, nome: true } },
      },
      orderBy: { nome: "asc" },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    }),
    prisma.paciente.count({ where }),
  ]);

  return res.json({
    success: true,
    data: {
      data: pacientes,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
}

export async function buscarPorId(req: Request<{ id: string }>, res: Response) {
  const clinicaId = getClinicaId(req);
  const { id } = req.params;

  const paciente = await prisma.paciente.findFirst({
    where: { id, clinicaId },
    include: {
      convenio: { select: { id: true, nome: true } },
      agendamentos: {
        orderBy: { dataHora: "desc" },
        take: 10,
        include: { convenio: { select: { nome: true } } },
      },
    },
  });

  if (!paciente) throw new AppError("Paciente não encontrado", 404);

  return res.json({ success: true, data: paciente });
}

export async function criar(req: Request, res: Response) {
  const clinicaId = getClinicaId(req);

  const paciente = await prisma.paciente.create({
    data: {
      ...req.body,
      clinicaId,
      dataNascimento: req.body.dataNascimento
        ? new Date(req.body.dataNascimento)
        : null,
      validadeCarteira: req.body.validadeCarteira
        ? new Date(req.body.validadeCarteira)
        : null,
    },
  });

  return res.status(201).json({ success: true, data: paciente });
}

export async function editar(req: Request<{ id: string }>, res: Response) {
  const clinicaId = getClinicaId(req);
  const { id } = req.params;

  const existente = await prisma.paciente.findFirst({
    where: { id, clinicaId },
  });
  if (!existente) throw new AppError("Paciente não encontrado", 404);

  const paciente = await prisma.paciente.update({
    where: { id },
    data: {
      ...req.body,
      dataNascimento: req.body.dataNascimento
        ? new Date(req.body.dataNascimento)
        : undefined,
      validadeCarteira: req.body.validadeCarteira
        ? new Date(req.body.validadeCarteira)
        : undefined,
    },
  });

  return res.json({ success: true, data: paciente });
}

export async function excluir(req: Request<{ id: string }>, res: Response) {
  const clinicaId = getClinicaId(req);
  const { id } = req.params;

  const existente = await prisma.paciente.findFirst({
    where: { id, clinicaId },
  });
  if (!existente) throw new AppError("Paciente não encontrado", 404);

  await prisma.paciente.delete({ where: { id } });

  return res.json({ success: true, message: "Paciente excluído" });
}

export async function criarAvaliacao(req: Request, res: Response) {
  const payload = req.body as CreatePacienteQuestionarioAvaliacaoInput;
  const id = req.params.id as string;
  const questionarioId = req.params.questionarioId as string;

  const avaliacao = await service.criarAvaliacao(id, questionarioId, payload);

  return res.status(201).json({
    success: true,
    data: avaliacao,
    message: "Questionário preenchido com sucesso",
  });
}

export async function buscarNomePorId(
  req: Request<{ id: string }>,
  res: Response,
) {
  const id = req.params.id as string;

  const nome = await service.buscarNomePorId(id);

  return res.json({ success: true, data: { nome } });
}

export async function listarAvaliacoes(
  req: Request<{ id: string }>,
  res: Response,
) {
  const clinicaId = getClinicaId(req);
  const { id } = req.params;
  const { page = "1", limit = "20" } = req.query;

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const paginatedResult = await service.listarAvaliacoes(
    id,
    clinicaId,
    pageNum,
    limitNum
  );

  return res.json({ success: true, data: paginatedResult });
}
