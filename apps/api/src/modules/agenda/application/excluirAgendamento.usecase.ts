import { prisma } from '../../../shared/providers/prisma.js';
import { AppError } from '../../../shared/middlewares/errorHandler.js';

export async function excluirAgendamentoUseCase(id: string) {
  const existente = await prisma.agendamento.findUnique({ where: { id } });

  if (!existente) {
    throw new AppError('Agendamento não encontrado', 404);
  }

  await prisma.agendamento.delete({ where: { id } });
}
