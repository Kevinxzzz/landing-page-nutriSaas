import { prisma } from '../../../shared/providers/prisma.js';
import { AppError } from '../../../shared/middlewares/errorHandler.js';
export async function criarAgendamentoUseCase(input, usuarioId, clinicaId) {
    const paciente = await prisma.paciente.findUnique({
        where: { id: input.pacienteId },
    });
    if (!paciente) {
        throw new AppError('Paciente não encontrado', 404);
    }
    const agendamento = await prisma.agendamento.create({
        data: {
            clinicaId,
            pacienteId: input.pacienteId,
            usuarioId,
            convenioId: input.convenioId || null,
            dataHora: new Date(input.dataHora),
            tipo: input.tipo,
            status: input.status || 'AGENDADO',
            encaixe: input.encaixe || false,
            observacao: input.observacao || null,
        },
        include: {
            paciente: { select: { id: true, nome: true, telefone: true } },
            convenio: { select: { id: true, nome: true } },
        },
    });
    return agendamento;
}
