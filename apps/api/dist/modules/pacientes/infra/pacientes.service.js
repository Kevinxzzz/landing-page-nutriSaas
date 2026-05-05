import { prisma } from "../../../shared/providers/prisma.js";
import { AppError } from "../../../shared/middlewares/errorHandler.js";
export async function criarAvaliacao(id, questionarioId, data) {
    const { respostas } = data;
    const paciente = await prisma.paciente.findUnique({
        where: { id },
    });
    if (!paciente) {
        throw new AppError("Paciente não encontrado", 404);
    }
    const questionario = await prisma.questionario.findUnique({
        where: { id: questionarioId },
    });
    if (!questionario) {
        throw new AppError("Questionário não encontrado", 404);
    }
    if (!questionario.ativo) {
        throw new AppError("Questionário inativo. Utilize a versão ativa mais recente", 400);
    }
    const scoreTotal = respostas.reduce((acc, r) => acc + r.nota, 0);
    const avaliacao = await prisma.avaliacao.create({
        data: {
            pacienteId: id,
            questionarioId,
            scoreTotal,
            respostas: {
                create: respostas.map((resposta) => ({
                    pacienteId: id,
                    perguntaId: resposta.perguntaId,
                    nota: resposta.nota,
                })),
            },
        },
    });
    return avaliacao;
}
export async function pegarAvaliacoesPorPacienteId(pacienteId) {
    const avaliacoes = await prisma.avaliacao.findMany({
        where: { pacienteId },
        orderBy: { dataRealizacao: "desc" },
    });
    return avaliacoes;
}
