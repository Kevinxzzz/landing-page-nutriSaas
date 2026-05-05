import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/shared/providers/prisma", async () => {
  const { mockDeep } = await import("vitest-mock-extended");
  return {
    prisma: mockDeep(),
  };
});

import { prisma } from "@/shared/providers/prisma";
import type { DeepMockProxy } from "vitest-mock-extended";
import type { PrismaClient } from "@prisma/client";

import * as service from "./questionarios.service";

const prismaMockStr = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("Questionarios Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const clinicaId = "clinica-123";

  describe("Criação de questionário", () => {
    it("deve criar um questionário com sucesso quando não existe conflito de nome e versão", async () => {
      const payload = {
        nome: "Novo Questionario",
        descricao: "Teste",
        versao: 1,
      };

      prismaMockStr.clinica.findUnique.mockResolvedValueOnce({
        id: clinicaId,
      } as any);
      prismaMockStr.questionario.findFirst.mockResolvedValueOnce(null as any);
      prismaMockStr.questionario.create.mockResolvedValueOnce({
        id: "quest-1",
        clinicaId,
        nome: payload.nome,
        descricao: payload.descricao,
        versao: 1,
        ativo: true,
      } as any);

      const result = await service.criar(clinicaId, payload);

      expect(prismaMockStr.questionario.findFirst).toHaveBeenCalledWith({
        where: { clinicaId, nome: payload.nome, versao: 1 },
      });
      expect(result).toHaveProperty("id", "quest-1");
    });

    it("deve falhar ao tentar criar se a clínica não existir", async () => {
      const payload = { nome: "Novo Questionario" };

      prismaMockStr.clinica.findUnique.mockResolvedValueOnce(null as any);

      await expect(service.criar(clinicaId, payload)).rejects.toThrow(
        "Clínica não encontrada",
      );
    });

    it("deve falhar se já existir um questionário com mesmo nome e versão", async () => {
      const payload = { nome: "Novo Questionario", versao: 1 };

      prismaMockStr.clinica.findUnique.mockResolvedValueOnce({
        id: clinicaId,
      } as any);
      prismaMockStr.questionario.findFirst.mockResolvedValueOnce({
        id: "existente",
      } as any);

      await expect(service.criar(clinicaId, payload)).rejects.toThrow(
        "Esse questionário já existe",
      );
    });
  });

  describe("Soft delete", () => {
    it("deve mudar a flag ativo para false ao excluir questionário existente", async () => {
      const questionarioId = "quest-ref";

      prismaMockStr.questionario.findFirst.mockResolvedValueOnce({
        id: questionarioId,
        ativo: true,
      } as any);

      await service.excluir(clinicaId, questionarioId);

      expect(prismaMockStr.questionario.update).toHaveBeenCalledWith({
        where: { id: questionarioId },
        data: { ativo: false },
      });
    });

    it("deve ignorar exclusão de questionário que já está inativo", async () => {
      const questionarioId = "quest-ref";

      prismaMockStr.questionario.findFirst.mockResolvedValueOnce({
        id: questionarioId,
        ativo: false,
      } as any);

      await service.excluir(clinicaId, questionarioId);

      expect(prismaMockStr.questionario.update).not.toHaveBeenCalled();
    });
  });

  describe("Validação de overlap de regras de interpretação", () => {
    it("deve falhar se regra inserida sobrepor outra existente", async () => {
      const questionarioId = "quest-ref";
      const payload = {
        pontuacaoMin: 10,
        pontuacaoMax: 20,
        classificacao: "Moderada",
      };

      // Mock the resolver Questionario
      prismaMockStr.questionario.findFirst.mockResolvedValueOnce({
        id: questionarioId,
        _count: { avaliacoes: 0 },
      } as any);

      prismaMockStr.regraInterpretacao.findFirst.mockResolvedValueOnce({
        id: "sobreposta",
      } as any);

      await expect(
        service.adicionarRegra(clinicaId, questionarioId, payload),
      ).rejects.toThrow("Faixa de pontuação sobreposta com regra existente");
    });

    it("deve falhar se pontuacaoMin > pontuacaoMax", async () => {
      const questionarioId = "quest-ref";
      const payload = {
        pontuacaoMin: 20,
        pontuacaoMax: 10,
        classificacao: "Inválida",
      };

      prismaMockStr.questionario.findFirst.mockResolvedValueOnce({
        id: questionarioId,
        _count: { avaliacoes: 0 },
      } as any);

      await expect(
        service.adicionarRegra(clinicaId, questionarioId, payload),
      ).rejects.toThrow("pontuacaoMin deve ser menor ou igual à pontuacaoMax");
    });
  });

  describe("Versionamento automático (Clone)", () => {
    it("deve identificar a mutação, verificar se há avaliações e não clonar se avaliacoes for 0", async () => {
      const questionarioId = "quest-123";

      prismaMockStr.questionario.findFirst.mockResolvedValueOnce({
        id: questionarioId,
        _count: { avaliacoes: 0 },
      } as any);

      const result = await service.resolverQuestionarioParaMutacaoEstrutural(
        clinicaId,
        questionarioId,
      );

      expect(result).toEqual({ questionarioId, versionado: false });
      expect(prismaMockStr.$transaction).not.toHaveBeenCalled();
    });

    it("deve realizar um clone (versionamento) ao fazer mutações caso possua avaliacões", async () => {
      const questionarioId = "quest-123";

      // setup para resolverQuestionarioParaMutacaoEstrutural
      prismaMockStr.questionario.findFirst.mockResolvedValueOnce({
        id: questionarioId,
        nome: "Questionario Base",
        _count: { avaliacoes: 5 },
      } as any);

      // setup para clonarQuestionarioParaNovaVersao (findFirst original)
      prismaMockStr.questionario.findFirst.mockResolvedValueOnce({
        id: questionarioId,
        nome: "Questionario Base",
        versao: 1,
        labelEscolha: [{ label: "A", nota: 1 }],
        modulos: [{ nome: "M1", ordem: 1, perguntas: [] }],
        regras: [{ pontuacaoMin: 0, pontuacaoMax: 10, classificacao: "B" }],
      } as any);

      // max aggregation query support
      prismaMockStr.questionario.aggregate.mockResolvedValueOnce({
        _max: { versao: 1 },
      } as any);

      // transação do PrismaMock (precisamos fazer proxy da callback)
      prismaMockStr.$transaction.mockImplementationOnce(async (cb: any) => {
        // Mock of transaction arg ctx
        return await cb(prismaMockStr as any);
      });

      // inside transaction updatemany
      prismaMockStr.questionario.updateMany.mockResolvedValueOnce({
        count: 1,
      } as any);

      // inside transaction create novoQuestionario
      prismaMockStr.questionario.create.mockResolvedValueOnce({
        id: "novo-quest-456",
        versao: 2,
      } as any);

      const result = await service.resolverQuestionarioParaMutacaoEstrutural(
        clinicaId,
        questionarioId,
      );

      expect(result).toEqual({
        questionarioId: "novo-quest-456",
        versionado: true,
      });
      expect(prismaMockStr.questionario.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            versao: 2,
            nome: "Questionario Base",
            clinicaId: clinicaId,
            ativo: true,
          }),
        }),
      );
    });
  });
});
