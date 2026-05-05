import { prisma } from '../../../shared/providers/prisma.js';
import { AppError } from '../../../shared/middlewares/errorHandler.js';
export async function alterarStatusUseCase(id, input) {
    const existente = await prisma.agendamento.findUnique({ where: { id } });
    if (!existente) {
        throw new AppError('Agendamento não encontrado', 404);
    }
    const agendamento = await prisma.agendamento.update({
        where: { id },
        data: { status: input.status },
        include: {
            paciente: { select: { id: true, nome: true, telefone: true } },
            convenio: { select: { id: true, nome: true } },
        },
    });
    return agendamento;
}
