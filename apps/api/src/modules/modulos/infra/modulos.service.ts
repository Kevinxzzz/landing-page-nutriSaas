import {
  CreateModuloPerguntaInput,
  UpdateModuloPerguntaInput,
  UpdateQuestionarioModuloInput,
} from "@nutricao/shared";
import { AppError } from "../../../shared/middlewares/errorHandler.js";
import { prisma } from "../../../shared/providers/prisma.js";
import { resolverQuestionarioParaMutacaoEstrutural } from "../../questionarios/infra/questionarios.service.js";

function clampOrdem(ordem: number, max: number) {
  if (ordem < 1) return 1;
  if (ordem > max) return max;
  return ordem;
}

export async function criarPergunta(
  clinicaId: string,
  moduloId: string,
  data: CreateModuloPerguntaInput,
) {
  const modulo = await prisma.modulo.findFirst({
    where: {
      id: moduloId,
      questionario: {
        clinicaId,
      },
    },
    select: {
      id: true,
      ordem: true,
      questionarioId: true,
    },
  });

  if (!modulo) {
    throw new AppError("Módulo não encontrado para a clínica", 404);
  }

  const alvo = await resolverQuestionarioParaMutacaoEstrutural(
    clinicaId,
    modulo.questionarioId,
  );

  let moduloAlvoId = modulo.id;

  if (alvo.versionado) {
    const moduloClonado = await prisma.modulo.findFirst({
      where: {
        questionarioId: alvo.questionarioId,
        ordem: modulo.ordem,
      },
      select: { id: true },
    });

    if (!moduloClonado) {
      throw new AppError(
        "Módulo correspondente não encontrado na nova versão",
        404,
      );
    }

    moduloAlvoId = moduloClonado.id;
  }

  const pergunta = await prisma.$transaction(async (tx) => {
    await tx.pergunta.updateMany({
      where: { moduloId: moduloAlvoId, ordem: { gte: data.ordem } },
      data: { ordem: { increment: 1 } },
    });

    return tx.pergunta.create({
      data: {
        moduloId: moduloAlvoId,
        descricao: data.descricao,
        ordem: data.ordem,
      },
    });
  });

  return pergunta;
}

export async function editarModulo(
  clinicaId: string,
  moduloId: string,
  data: UpdateQuestionarioModuloInput,
) {
  const modulo = await prisma.modulo.findFirst({
    where: {
      id: moduloId,
      questionario: {
        clinicaId,
      },
    },
    select: {
      id: true,
      nome: true,
      ordem: true,
      questionarioId: true,
    },
  });

  if (!modulo) {
    throw new AppError("Módulo não encontrado para a clínica", 404);
  }

  if (data.nome === undefined && data.ordem === undefined) {
    throw new AppError("Nenhuma alteração enviada", 400);
  }

  const totalModulos = await prisma.modulo.count({
    where: { questionarioId: modulo.questionarioId },
  });

  const novaOrdem =
    data.ordem === undefined
      ? modulo.ordem
      : clampOrdem(data.ordem, Math.max(totalModulos, 1));

  const atualizado = await prisma.$transaction(async (tx) => {
    if (novaOrdem < modulo.ordem) {
      await tx.modulo.updateMany({
        where: {
          questionarioId: modulo.questionarioId,
          ordem: { gte: novaOrdem, lt: modulo.ordem },
        },
        data: {
          ordem: { increment: 1 },
        },
      });
    } else if (novaOrdem > modulo.ordem) {
      await tx.modulo.updateMany({
        where: {
          questionarioId: modulo.questionarioId,
          ordem: { gt: modulo.ordem, lte: novaOrdem },
        },
        data: {
          ordem: { decrement: 1 },
        },
      });
    }

    return tx.modulo.update({
      where: { id: moduloId },
      data: {
        ...(data.nome !== undefined ? { nome: data.nome } : {}),
        ...(data.ordem !== undefined ? { ordem: novaOrdem } : {}),
      },
    });
  });

  return atualizado;
}

export async function excluirModulo(clinicaId: string, moduloId: string) {
  const modulo = await prisma.modulo.findFirst({
    where: {
      id: moduloId,
      questionario: {
        clinicaId,
      },
    },
    select: {
      id: true,
      ordem: true,
      questionarioId: true,
    },
  });

  if (!modulo) {
    throw new AppError("Módulo não encontrado para a clínica", 404);
  }

  const alvo = await resolverQuestionarioParaMutacaoEstrutural(
    clinicaId,
    modulo.questionarioId,
  );

  let moduloAlvoId = modulo.id;
  let moduloAlvoOrdem = modulo.ordem;

  if (alvo.versionado) {
    const moduloClonado = await prisma.modulo.findFirst({
      where: {
        questionarioId: alvo.questionarioId,
        ordem: modulo.ordem,
      },
      select: { id: true, ordem: true },
    });

    if (!moduloClonado) {
      throw new AppError(
        "Módulo correspondente não encontrado na nova versão",
        404,
      );
    }

    moduloAlvoId = moduloClonado.id;
    moduloAlvoOrdem = moduloClonado.ordem;
  }

  await prisma.$transaction(async (tx) => {
    await tx.modulo.delete({ where: { id: moduloAlvoId } });

    await tx.modulo.updateMany({
      where: {
        questionarioId: alvo.questionarioId,
        ordem: { gt: moduloAlvoOrdem },
      },
      data: {
        ordem: { decrement: 1 },
      },
    });
  });
}

export async function editarPergunta(
  clinicaId: string,
  moduloId: string,
  perguntaId: string,
  data: UpdateModuloPerguntaInput,
) {
  const pergunta = await prisma.pergunta.findFirst({
    where: {
      id: perguntaId,
      moduloId,
      modulo: {
        questionario: {
          clinicaId,
        },
      },
    },
    select: {
      id: true,
      descricao: true,
      ordem: true,
      moduloId: true,
    },
  });

  if (!pergunta) {
    throw new AppError("Pergunta não encontrada para a clínica", 404);
  }

  if (data.descricao === undefined && data.ordem === undefined) {
    throw new AppError("Nenhuma alteração enviada", 400);
  }

  const totalPerguntas = await prisma.pergunta.count({
    where: { moduloId: pergunta.moduloId },
  });

  const novaOrdem =
    data.ordem === undefined
      ? pergunta.ordem
      : clampOrdem(data.ordem, Math.max(totalPerguntas, 1));

  const atualizada = await prisma.$transaction(async (tx) => {
    if (novaOrdem < pergunta.ordem) {
      await tx.pergunta.updateMany({
        where: {
          moduloId: pergunta.moduloId,
          ordem: { gte: novaOrdem, lt: pergunta.ordem },
        },
        data: {
          ordem: { increment: 1 },
        },
      });
    } else if (novaOrdem > pergunta.ordem) {
      await tx.pergunta.updateMany({
        where: {
          moduloId: pergunta.moduloId,
          ordem: { gt: pergunta.ordem, lte: novaOrdem },
        },
        data: {
          ordem: { decrement: 1 },
        },
      });
    }

    return tx.pergunta.update({
      where: { id: perguntaId },
      data: {
        ...(data.descricao !== undefined ? { descricao: data.descricao } : {}),
        ...(data.ordem !== undefined ? { ordem: novaOrdem } : {}),
      },
    });
  });

  return atualizada;
}

export async function excluirPergunta(
  clinicaId: string,
  moduloId: string,
  perguntaId: string,
) {
  const pergunta = await prisma.pergunta.findFirst({
    where: {
      id: perguntaId,
      moduloId,
      modulo: {
        questionario: {
          clinicaId,
        },
      },
    },
    select: {
      id: true,
      ordem: true,
      moduloId: true,
      modulo: {
        select: {
          ordem: true,
          questionarioId: true,
        },
      },
    },
  });

  if (!pergunta) {
    throw new AppError("Pergunta não encontrada para a clínica", 404);
  }

  const alvo = await resolverQuestionarioParaMutacaoEstrutural(
    clinicaId,
    pergunta.modulo.questionarioId,
  );

  let moduloAlvoId = pergunta.moduloId;
  let perguntaAlvoId = pergunta.id;
  let perguntaAlvoOrdem = pergunta.ordem;

  if (alvo.versionado) {
    const moduloClonado = await prisma.modulo.findFirst({
      where: {
        questionarioId: alvo.questionarioId,
        ordem: pergunta.modulo.ordem,
      },
      select: { id: true },
    });

    if (!moduloClonado) {
      throw new AppError(
        "Módulo correspondente não encontrado na nova versão",
        404,
      );
    }

    const perguntaClonada = await prisma.pergunta.findFirst({
      where: {
        moduloId: moduloClonado.id,
        ordem: pergunta.ordem,
      },
      select: { id: true, ordem: true },
    });

    if (!perguntaClonada) {
      throw new AppError(
        "Pergunta correspondente não encontrada na nova versão",
        404,
      );
    }

    moduloAlvoId = moduloClonado.id;
    perguntaAlvoId = perguntaClonada.id;
    perguntaAlvoOrdem = perguntaClonada.ordem;
  }

  await prisma.$transaction(async (tx) => {
    await tx.pergunta.delete({ where: { id: perguntaAlvoId } });

    await tx.pergunta.updateMany({
      where: {
        moduloId: moduloAlvoId,
        ordem: { gt: perguntaAlvoOrdem },
      },
      data: {
        ordem: { decrement: 1 },
      },
    });
  });
}
