import { prisma } from "../../../shared/providers/prisma.js";
import { AppError } from "../../../shared/middlewares/errorHandler.js";
import { CreatePacienteQuestionarioAvaliacaoInput } from "@nutricao/shared";
import { pegarAvaliacoesPorPacienteId as buscarAvaliacoesService } from "../../avaliacoes/infra/avaliacoes.service.js";

export async function criarAvaliacao(
  id: string,
  questionarioId: string,
  data: CreatePacienteQuestionarioAvaliacaoInput,
) {
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
    throw new AppError(
      "Questionário inativo. Utilize a versão ativa mais recente",
      400,
    );
  }

  if (paciente.clinicaId !== questionario.clinicaId) {
    throw new AppError(
      "Paciente e questionário não pertencem à mesma clínica",
      400,
    );
  }

  const scoreTotal = respostas.reduce((acc, r) => acc + r.nota, 0);

  const avaliacao = await prisma.avaliacao.create({
    data: {
      clinicaId: paciente.clinicaId,
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

export async function buscarNomePorId(id: string) {
  const paciente = await prisma.paciente.findUnique({
    where: { id },
    select: { nome: true },
  });

  if (!paciente) {
    throw new AppError("Paciente não encontrado", 404);
  }

  return paciente.nome;
}

export async function listarAvaliacoes(
  pacienteId: string,
  clinicaId: string,
  page?: number,
  limit?: number,
) {
  return buscarAvaliacoesService(pacienteId, clinicaId, page, limit);
}
