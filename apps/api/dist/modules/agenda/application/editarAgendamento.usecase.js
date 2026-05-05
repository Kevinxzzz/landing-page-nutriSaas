import { prisma } from '../../../shared/providers/prisma.js';
import { AppError } from '../../../shared/middlewares/errorHandler.js';
export async function editarAgendamentoUseCase(id, input) {
    const existente = await prisma.agendamento.findUnique({ where: { id } });
    if (!existente) {
        throw new AppError('Agendamento não encontrado', 404);
    }
    const agendamento = await prisma.agendamento.update({
        where: { id },
        data: {
            ...(input.pacienteId && { pacienteId: input.pacienteId }),
            ...(input.convenioId !== undefined && { convenioId: input.convenioId || null }),
            ...(input.dataHora && { dataHora: new Date(input.dataHora) }),
            ...(input.tipo && { tipo: input.tipo }),
            ...(input.status && { status: input.status }),
            ...(input.encaixe !== undefined && { encaixe: input.encaixe }),
            ...(input.observacao !== undefined && { observacao: input.observacao || null }),
        },
        include: {
            paciente: { select: { id: true, nome: true, telefone: true, email: true } },
            convenio: { select: { id: true, nome: true } },
        },
    });
    return agendamento;
}
