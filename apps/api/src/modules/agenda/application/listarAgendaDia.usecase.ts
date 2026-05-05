import { prisma } from "../../../shared/providers/prisma.js";

function parseLocalDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export async function listarAgendaDiaUseCase(
  data: string,
  clinicaId: string,
  usuarioId?: string,
) {
  const inicio = parseLocalDate(data);
  inicio.setHours(0, 0, 0, 0);

  const fim = parseLocalDate(data);
  fim.setHours(23, 59, 59, 999);

  const where: any = {
    clinicaId,
    dataHora: { gte: inicio, lte: fim },
  };

  if (usuarioId) {
    where.usuarioId = usuarioId;
  }

  const agendamentos = await prisma.agendamento.findMany({
    where,
    include: {
      paciente: {
        select: { id: true, nome: true, telefone: true, email: true },
      },
      convenio: { select: { id: true, nome: true } },
    },
    orderBy: { dataHora: "asc" },
  });

  return agendamentos;
}
