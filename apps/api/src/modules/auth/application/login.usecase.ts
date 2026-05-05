import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../shared/providers/prisma.js';
import { redisSet } from '../../../shared/providers/redis.js';
import { env } from '../../../config/env.js';
import { AppError } from '../../../shared/middlewares/errorHandler.js';
import type { LoginInput } from '@nutricao/shared';
import type { TokenPayload, AuthTokens } from '@nutricao/shared';

export async function loginUseCase(input: LoginInput): Promise<AuthTokens> {
  const usuario = await prisma.usuario.findUnique({
    where: { email: input.email },
  });

  if (!usuario) {
    throw new AppError('Credenciais inválidas', 401);
  }

  const senhaValida = await bcrypt.compare(input.senha, usuario.senha);

  if (!senhaValida) {
    throw new AppError('Credenciais inválidas', 401);
  }

  const payload: TokenPayload = {
    userId: usuario.id,
    clinicaId: usuario.clinicaId,
    email: usuario.email,
    perfil: usuario.perfil,
  };

  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });

  await redisSet(
    `refresh:${usuario.id}`,
    refreshToken,
    'EX',
    7 * 24 * 60 * 60,
  );

  return { accessToken, refreshToken };
}
