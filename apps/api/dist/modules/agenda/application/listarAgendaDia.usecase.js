import { prisma } from '../../../shared/providers/prisma.js';
export async function listarAgendaDiaUseCase(data, clinicaId, usuarioId) {
    const inicio = new Date(data);
    inicio.setHours(0, 0, 0, 0);
    const fim = new Date(data);
    fim.setHours(23, 59, 59, 999);
    const where = {
        clinicaId,
        dataHora: { gte: inicio, lte: fim },
    };
    if (usuarioId) {
        where.usuarioId = usuarioId;
    }
    const agendamentos = await prisma.agendamento.findMany({
        where,
        include: {
            paciente: { select: { id: true, nome: true, telefone: true, email: true } },
            convenio: { select: { id: true, nome: true } },
        },
        orderBy: { dataHora: 'asc' },
    });
    return agendamentos;
}
