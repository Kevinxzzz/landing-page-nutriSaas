import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../../shared/providers/prisma.js";
import { AppError } from "../../../shared/middlewares/errorHandler.js";
import { getClinicaId } from "../../../shared/middlewares/auth.js";

export async function listar(req: Request, res: Response) {
  const clinicaId = getClinicaId(req);
  const usuarios = await prisma.usuario.findMany({
    where: { clinicaId },
    select: {
      id: true,
      nome: true,
      email: true,
      perfil: true,
      criadoEm: true,
    },
    orderBy: { nome: "asc" },
  });
  return res.json({ success: true, data: usuarios });
}

export async function criar(req: Request, res: Response) {
  const clinicaId = getClinicaId(req);

  const existente = await prisma.usuario.findUnique({
    where: { email: req.body.email },
  });
  if (existente) throw new AppError("E-mail já cadastrado", 409);

  const senhaHash = await bcrypt.hash(req.body.senha, 10);

  const usuario = await prisma.usuario.create({
    data: {
      clinicaId,
      nome: req.body.nome,
      email: req.body.email,
      senha: senhaHash,
      perfil: req.body.perfil,
    },
    select: {
      id: true,
      nome: true,
      email: true,
      perfil: true,
      criadoEm: true,
    },
  });

  return res.status(201).json({ success: true, data: usuario });
}

export async function editar(req: Request<{ id: string }>, res: Response) {
  const clinicaId = getClinicaId(req);
  const { id } = req.params;

  const existente = await prisma.usuario.findFirst({
    where: { id, clinicaId },
  });
  if (!existente) throw new AppError("Usuário não encontrado", 404);

  const data: any = {
    nome: req.body.nome,
    email: req.body.email,
    perfil: req.body.perfil,
  };

  if (req.body.senha) {
    data.senha = await bcrypt.hash(req.body.senha, 10);
  }

  const usuario = await prisma.usuario.update({
    where: { id },
    data,
    select: {
      id: true,
      nome: true,
      email: true,
      perfil: true,
      criadoEm: true,
    },
  });

  return res.json({ success: true, data: usuario });
}

export async function excluir(req: Request<{ id: string }>, res: Response) {
  const clinicaId = getClinicaId(req);
  const { id } = req.params;

  const existente = await prisma.usuario.findFirst({
    where: { id, clinicaId },
  });
  if (!existente) throw new AppError("Usuário não encontrado", 404);

  if (existente.perfil === "ADMIN") {
    const totalAdmins = await prisma.usuario.count({
      where: { clinicaId, perfil: "ADMIN" },
    });
    if (totalAdmins <= 1) {
      throw new AppError("Não é possível excluir o último administrador", 400);
    }
  }

  await prisma.usuario.delete({ where: { id } });
  return res.json({ success: true, message: "Usuário excluído" });
}

export async function esqueciSenha(req: Request, res: Response) {
  const { email } = req.body;

  const existente = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!existente) {
    return res
      .status(404)
      .json({ success: false, message: "Email não encontrado" });
  }

  return res.json({ success: true, data: { email, found: !!existente } });
}

export async function alterarSenha(req: Request, res: Response) {
  const { email, novaSenha } = req.body;
  const atualizarSenha = await prisma.usuario.update({
    where: { email },
    data: { senha: await bcrypt.hash(novaSenha, 10) },
  });

  return res.json({
    success: true,
    data: { email, senhaAtualizada: !!atualizarSenha },
  });
}
