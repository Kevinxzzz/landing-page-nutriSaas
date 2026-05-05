import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { redisGet } from '../providers/redis.js';
import { AppError } from './errorHandler.js';
import type { TokenPayload } from '@nutricao/shared';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Token não fornecido', 401);
  }

  const token = authHeader.split(' ')[1];

  const isBlacklisted = await redisGet(`bl:${token}`);
  if (isBlacklisted) {
    throw new AppError('Token inválido', 401);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    req.user = decoded;
    next();
  } catch {
    throw new AppError('Token inválido ou expirado', 401);
  }
}

export function getClinicaId(req: Request): string {
  if (!req.user?.clinicaId) throw new AppError('Clínica não identificada', 401);
  return req.user.clinicaId;
}

export function roleGuard(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Não autenticado', 401);
    }

    if (!roles.includes(req.user.perfil)) {
      throw new AppError('Sem permissão para acessar este recurso', 403);
    }

    next();
  };
}
