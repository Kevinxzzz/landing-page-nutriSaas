import { prisma } from '../../../shared/providers/prisma.js';
import { getClinicaId } from '../../../shared/middlewares/auth.js';
export async function gerarRelatorio(req, res) {
    const clinicaId = getClinicaId(req);
    const { dataInicio, dataFim, status, convenioId } = req.query;
    const inicio = dataInicio
        ? new Date(dataInicio)
        : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    inicio.setHours(0, 0, 0, 0);
    const fim = dataFim ? new Date(dataFim) : new Date();
    fim.setHours(23, 59, 59, 999);
    const where = {
        clinicaId,
        dataHora: { gte: inicio, lte: fim },
    };
    if (status)
        where.status = status;
    if (convenioId)
        where.convenioId = convenioId;
    const agendamentos = await prisma.agendamento.findMany({
        where,
        include: {
            paciente: { select: { id: true, nome: true, telefone: true } },
            convenio: { select: { id: true, nome: true } },
        },
        orderBy: { dataHora: 'asc' },
    });
    const totalRealizados = agendamentos.filter((a) => a.status === 'REALIZADO').length;
    const totalCancelados = agendamentos.filter((a) => a.status === 'CANCELADO' || a.status === 'DESISTIU').length;
    return res.json({
        success: true,
        data: {
            agendamentos,
            resumo: {
                total: agendamentos.length,
                realizados: totalRealizados,
                cancelados: totalCancelados,
            },
        },
    });
}
