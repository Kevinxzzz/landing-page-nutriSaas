import { prisma } from "@/shared/providers/prisma";
import { AppError } from "@/shared/middlewares/errorHandler.js";
export async function pegarAvaliacaoPorId(id) {
    const avaliacao = await prisma.avaliacao.findFirst({
        where: { id },
    });
    if (!avaliacao) {
        throw new AppError("Avaliação não encontrada", 404);
    }
    const regraInterpretacao = await prisma.regraInterpretacao.findFirst({
        select: {
            classificacao: true,
        },
        where: {
            questionarioId: avaliacao.questionarioId,
            pontuacaoMin: {
                lte: avaliacao.scoreTotal,
            },
            pontuacaoMax: {
                gte: avaliacao.scoreTotal,
            },
        },
    });
    return { ...avaliacao, regraInterpretacao };
}
export async function pegarAvaliacaoComRespostas(id) {
    const avaliacao = await prisma.avaliacao.findUnique({
        where: { id },
        include: {
            questionario: {
                include: {
                    labelEscolha: {
                        orderBy: { nota: "asc" },
                    },
                    regras: {
                        orderBy: { pontuacaoMin: "asc" },
                    },
                    modulos: {
                        orderBy: { ordem: "asc" },
                        include: {
                            perguntas: {
                                orderBy: { ordem: "asc" },
                                include: {
                                    respostas: {
                                        where: {
                                            avaliacaoId: id,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    if (!avaliacao) {
        throw new AppError("Avaliação não encontrada", 404);
    }
    return {
        ...avaliacao,
        regraInterpretacao: avaliacao.questionario.regras.find((regra) => avaliacao.scoreTotal >= regra.pontuacaoMin &&
            avaliacao.scoreTotal <= regra.pontuacaoMax)?.classificacao,
    };
}
export async function DeleteAvaliacao(id) {
    const avaliacaoDeletada = await prisma.avaliacao.delete({
        where: { id },
    });
    if (!avaliacaoDeletada) {
        throw new AppError("Avaliação não encontrada", 404);
    }
}
