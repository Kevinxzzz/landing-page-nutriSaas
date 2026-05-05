import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../shared/providers/prisma.js';
import { env } from '../../../config/env.js';
import { AppError } from '../../../shared/middlewares/errorHandler.js';
import { getClinicaId } from '../../../shared/middlewares/auth.js';
import type { TokenPayload, AuthTokens } from '@nutricao/shared';

export async function onboarding(req: Request, res: Response) {
  const { clinica, admin } = req.body;

  const emailExistente = await prisma.usuario.findUnique({
    where: { email: admin.email },
  });
  if (emailExistente) throw new AppError('E-mail já cadastrado', 409);

  if (clinica.cnpj) {
    const cnpjExistente = await prisma.clinica.findUnique({
      where: { cnpj: clinica.cnpj },
    });
    if (cnpjExistente) throw new AppError('CNPJ já cadastrado', 409);
  }

  const senhaHash = await bcrypt.hash(admin.senha, 10);

  const result = await prisma.$transaction(async (tx) => {
    const novaClinica = await tx.clinica.create({
      data: {
        nome: clinica.nome,
        cnpj: clinica.cnpj || null,
        telefone: clinica.telefone || null,
        email: clinica.email || null,
        endereco: clinica.endereco || null,
      },
    });

    const novoAdmin = await tx.usuario.create({
      data: {
        clinicaId: novaClinica.id,
        nome: admin.nome,
        email: admin.email,
        senha: senhaHash,
        perfil: 'ADMIN',
      },
    });

    await tx.convenio.create({
      data: {
        clinicaId: novaClinica.id,
        nome: 'Particular',
      },
    });

    return { clinica: novaClinica, admin: novoAdmin };
  });

  const payload: TokenPayload = {
    userId: result.admin.id,
    clinicaId: result.clinica.id,
    email: result.admin.email,
    perfil: result.admin.perfil,
  };

  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });

  return res.status(201).json({
    success: true,
    data: {
      clinica: result.clinica,
      tokens: { accessToken, refreshToken } as AuthTokens,
    },
  });
}

export async function getClinica(req: Request, res: Response) {
  const clinicaId = getClinicaId(req);

  const clinica = await prisma.clinica.findUnique({
    where: { id: clinicaId },
  });

  return res.json({ success: true, data: clinica });
}

export async function atualizarClinica(req: Request, res: Response) {
  const clinicaId = getClinicaId(req);

  const clinica = await prisma.clinica.update({
    where: { id: clinicaId },
    data: req.body,
  });

  return res.json({ success: true, data: clinica });
}
