import { prisma } from "@/shared/providers/prisma";
import { AppError } from "@/shared/middlewares/errorHandler.js";
import { criarQuestionarioPadraoParaClinica } from "../seed/default-questionario";
function mapLabelEscolha(item) {
    return {
        id: item.id,
        nota: item.nota,
        label: item.label,
    };
}
async function buscarQuestionarioDaClinica(clinicaId, questionarioId) {
    const questionario = await prisma.questionario.findFirst({
        where: { id: questionarioId, clinicaId },
        select: { id: true },
    });
    if (!questionario) {
        throw new AppError("Questionário não encontrado para a clínica", 404);
    }
}
async function clonarQuestionarioParaNovaVersao(clinicaId, questionarioId) {
    const original = await prisma.questionario.findFirst({
        where: { id: questionarioId, clinicaId },
        include: {
            labelEscolha: {
                orderBy: { nota: "asc" },
            },
            modulos: {
                orderBy: { ordem: "asc" },
                include: {
                    perguntas: {
                        orderBy: { ordem: "asc" },
                    },
                },
            },
            regras: true,
        },
    });
    if (!original) {
        throw new AppError("Questionário não encontrado para a clínica", 404);
    }
    const versaoMaisRecente = await prisma.questionario.aggregate({
        where: {
            clinicaId,
            nome: original.nome,
        },
        _max: { versao: true },
    });
    const novaVersao = (versaoMaisRecente._max.versao ?? original.versao) + 1;
    const novoQuestionario = await prisma.$transaction(async (tx) => {
        await tx.questionario.updateMany({
            where: {
                clinicaId,
                nome: original.nome,
                ativo: true,
            },
            data: { ativo: false },
        });
        return tx.questionario.create({
            data: {
                clinicaId,
                nome: original.nome,
                versao: novaVersao,
                ativo: true,
                labelEscolha: {
                    create: original.labelEscolha.map((labelEscolha) => ({
                        label: labelEscolha.label,
                        nota: labelEscolha.nota,
                    })),
                },
                modulos: {
                    create: original.modulos.map((modulo) => ({
                        nome: modulo.nome,
                        ordem: modulo.ordem,
                        perguntas: {
                            create: modulo.perguntas.map((pergunta) => ({
                                descricao: pergunta.descricao,
                                ordem: pergunta.ordem,
                            })),
                        },
                    })),
                },
                regras: {
                    create: original.regras.map((regra) => ({
                        pontuacaoMin: regra.pontuacaoMin,
                        pontuacaoMax: regra.pontuacaoMax,
                        classificacao: regra.classificacao,
                    })),
                },
            },
        });
    });
    return novoQuestionario;
}
export async function resolverQuestionarioParaMutacaoEstrutural(clinicaId, questionarioId) {
    const questionario = await prisma.questionario.findFirst({
        where: { id: questionarioId, clinicaId },
        select: {
            id: true,
            _count: { select: { avaliacoes: true } },
        },
    });
    if (!questionario) {
        throw new AppError("Questionário não encontrado para a clínica", 404);
    }
    if (questionario._count.avaliacoes === 0) {
        return { questionarioId, versionado: false };
    }
    const novoQuestionario = await clonarQuestionarioParaNovaVersao(clinicaId, questionarioId);
    return { questionarioId: novoQuestionario.id, versionado: true };
}
export async function criar(clinicaId, data) {
    const clinica = await prisma.clinica.findUnique({
        where: { id: clinicaId },
    });
    if (!clinica) {
        throw new AppError("Clínica não encontrada", 404);
    }
    const questionarioExistente = await prisma.questionario.findFirst({
        where: { clinicaId, nome: data.nome, versao: data.versao ?? 1 },
    });
    if (questionarioExistente) {
        throw new AppError("Esse questionário já existe", 400);
    }
    const questionario = await prisma.questionario.create({
        data: {
            ...data,
            versao: data.versao ?? 1,
            clinicaId,
        },
    });
    return questionario;
}
export async function listar(clinicaId, params) {
    const where = {
        clinicaId,
        ...(params.incluirDeletados ? {} : { ativo: true }),
    };
    const [questionarios, total] = await Promise.all([
        prisma.questionario.findMany({
            where,
            orderBy: [{ nome: "asc" }, { versao: "desc" }],
            skip: (params.page - 1) * params.limit,
            take: params.limit,
            select: {
                id: true,
                nome: true,
                versao: true,
                ativo: true,
                modulos: {
                    orderBy: { ordem: "asc" },
                    select: {
                        id: true,
                        nome: true,
                        ordem: true,
                        _count: {
                            select: {
                                perguntas: true,
                            },
                        },
                    },
                },
            },
        }),
        prisma.questionario.count({ where }),
    ]);
    const data = questionarios.map((questionario) => {
        const modulos = questionario.modulos.map((modulo) => ({
            id: modulo.id,
            nome: modulo.nome,
            ordem: modulo.ordem,
            totalPerguntas: modulo._count.perguntas,
        }));
        return {
            id: questionario.id,
            nome: questionario.nome,
            versao: questionario.versao,
            ativo: questionario.ativo,
            totalModulos: modulos.length,
            modulos,
        };
    });
    return {
        data,
        total,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(total / params.limit),
    };
}
export async function listarModulosComPerguntas(questionarioId, params) {
    const questionario = await prisma.questionario.findFirst({
        where: {
            id: questionarioId,
            ...(params.incluirDeletados ? {} : { ativo: true }),
        },
        include: {
            labelEscolha: {
                orderBy: { nota: "asc" },
            },
            modulos: {
                orderBy: { ordem: "asc" },
                include: {
                    perguntas: {
                        orderBy: { ordem: "asc" },
                    },
                },
            },
        },
    });
    if (!questionario) {
        throw new AppError("Questionário não encontrado para a clínica", 404);
    }
    return {
        ...questionario,
        labelEscolha: questionario.labelEscolha.map(mapLabelEscolha),
    };
}
export async function listarTitulosEscolha(clinicaId, questionarioId) {
    await buscarQuestionarioDaClinica(clinicaId, questionarioId);
    const titulos = await prisma.labelEscolha.findMany({
        where: { questionarioId },
        orderBy: { nota: "asc" },
    });
    return titulos.map(mapLabelEscolha);
}
export async function upsertTitulosEscolha(clinicaId, questionarioId, itens) {
    await buscarQuestionarioDaClinica(clinicaId, questionarioId);
    const titulos = await prisma.$transaction(itens.map((item) => prisma.labelEscolha.upsert({
        where: {
            questionarioId_nota: {
                questionarioId,
                nota: item.nota,
            },
        },
        update: {
            label: item.label,
        },
        create: {
            questionarioId,
            nota: item.nota,
            label: item.label,
        },
    })));
    return titulos.sort((a, b) => a.nota - b.nota).map(mapLabelEscolha);
}
export async function atualizarTituloEscolha(clinicaId, questionarioId, nota, label) {
    await buscarQuestionarioDaClinica(clinicaId, questionarioId);
    const titulo = await prisma.labelEscolha.upsert({
        where: {
            questionarioId_nota: {
                questionarioId,
                nota,
            },
        },
        update: {
            label: label,
        },
        create: {
            questionarioId,
            nota,
            label: label,
        },
    });
    return mapLabelEscolha(titulo);
}
export async function excluirTituloEscolha(clinicaId, questionarioId, nota) {
    await buscarQuestionarioDaClinica(clinicaId, questionarioId);
    await prisma.labelEscolha.deleteMany({
        where: {
            questionarioId,
            nota,
        },
    });
}
export async function editar(clinicaId, questionarioId, data) {
    const existente = await prisma.questionario.findFirst({
        where: { id: questionarioId, clinicaId },
    });
    if (!existente) {
        throw new AppError("Questionário não encontrado para a clínica", 404);
    }
    if (data.nome === undefined) {
        throw new AppError("Nenhuma alteração de metadado enviada", 400);
    }
    const novoNome = data.nome ?? existente.nome;
    const novaVersao = existente.versao;
    const conflitoVersao = await prisma.questionario.findFirst({
        where: {
            clinicaId,
            nome: novoNome,
            versao: novaVersao,
            id: { not: questionarioId },
        },
        select: { id: true },
    });
    if (conflitoVersao) {
        throw new AppError("Já existe questionário com este nome e versão", 400);
    }
    const questionario = await prisma.questionario.update({
        where: { id: questionarioId },
        data: {
            nome: novoNome,
        },
    });
    return questionario;
}
export async function excluir(clinicaId, questionarioId) {
    const existente = await prisma.questionario.findFirst({
        where: { id: questionarioId, clinicaId },
        select: { id: true, ativo: true },
    });
    if (!existente) {
        throw new AppError("Questionário não encontrado para a clínica", 404);
    }
    if (!existente.ativo) {
        return;
    }
    await prisma.questionario.update({
        where: { id: questionarioId },
        data: { ativo: false },
    });
}
export async function adicionarModulo(clinicaId, questionarioId, data) {
    const alvo = await resolverQuestionarioParaMutacaoEstrutural(clinicaId, questionarioId);
    const modulo = await prisma.$transaction(async (tx) => {
        await tx.modulo.updateMany({
            where: {
                questionarioId: alvo.questionarioId,
                ordem: { gte: data.ordem },
            },
            data: { ordem: { increment: 1 } },
        });
        return tx.modulo.create({
            data: {
                nome: data.nome,
                ordem: data.ordem,
                questionarioId: alvo.questionarioId,
            },
        });
    });
    return modulo;
}
export async function adicionarRegra(clinicaId, questionarioId, data) {
    const alvo = await resolverQuestionarioParaMutacaoEstrutural(clinicaId, questionarioId);
    if (data.pontuacaoMin > data.pontuacaoMax) {
        throw new AppError("pontuacaoMin deve ser menor ou igual à pontuacaoMax", 400);
    }
    const faixaSobreposta = await prisma.regraInterpretacao.findFirst({
        where: {
            questionarioId: alvo.questionarioId,
            NOT: [
                { pontuacaoMax: { lt: data.pontuacaoMin } },
                { pontuacaoMin: { gt: data.pontuacaoMax } },
            ],
        },
        select: { id: true },
    });
    if (faixaSobreposta) {
        throw new AppError("Faixa de pontuação sobreposta com regra existente", 400);
    }
    const regra = await prisma.regraInterpretacao.create({
        data: {
            questionarioId: alvo.questionarioId,
            pontuacaoMin: data.pontuacaoMin,
            pontuacaoMax: data.pontuacaoMax,
            classificacao: data.classificacao,
        },
    });
    return regra;
}
export async function criarQuestionarioDefault(clinicaId) {
    const clinica = await prisma.clinica.findUnique({ where: { id: clinicaId } });
    if (!clinica) {
        throw new AppError("Clínica não encontrada", 404);
    }
    const questionario = await criarQuestionarioPadraoParaClinica(clinicaId);
    return questionario;
}
