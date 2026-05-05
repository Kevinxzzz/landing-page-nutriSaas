import { describe, it, expect, vi, beforeEach } from "vitest";
import { prismaMock } from "@/shared/providers/__mocks__/prisma";
import {
  pegarAvaliacaoPorId,
  pegarAvaliacaoComRespostas,
  pegarAvaliacoesPorPacienteId,
  excluirAvaliacao,
} from "./avaliacoes.service";
import { AppError } from "@/shared/middlewares/errorHandler.js";

describe("avaliacoes.service", () => {
  const mockRegras = [
    { pontuacaoMin: 0, pontuacaoMax: 10, classificacao: "Baixo" },
    { pontuacaoMin: 11, pontuacaoMax: 20, classificacao: "Médio" },
    { pontuacaoMin: 21, pontuacaoMax: 30, classificacao: "Alto" },
  ];

  const mockAvaliacaoBase = {
    id: "avaliacao-1",
    clinicaId: "clinica-1",
    pacienteId: "paciente-1",
    dataRealizacao: new Date("2024-01-01"),
    questionario: {
      regras: mockRegras,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("pegarAvaliacaoPorId", () => {
    it("deve retornar erro 404 se a avaliação não for encontrada", async () => {
      prismaMock.avaliacao.findFirst.mockResolvedValue(null);

      await expect(
        pegarAvaliacaoPorId("avaliacao-invalida", "clinica-1")
      ).rejects.toThrow(new AppError("Avaliação não encontrada", 404));
    });

    it("deve incluir clinicaId no filtro (testar filtro por clinicaId)", async () => {
      prismaMock.avaliacao.findFirst.mockResolvedValue({
        ...mockAvaliacaoBase,
        scoreTotal: 5,
      } as any);

      await pegarAvaliacaoPorId("avaliacao-1", "clinica-1");

      expect(prismaMock.avaliacao.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "avaliacao-1", clinicaId: "clinica-1" },
        })
      );
    });

    it("deve calcular a regra de interpretação corretamente (dentro da faixa)", async () => {
      prismaMock.avaliacao.findFirst.mockResolvedValue({
        ...mockAvaliacaoBase,
        scoreTotal: 15, // Deve cair em "Médio"
      } as any);

      const result = await pegarAvaliacaoPorId("avaliacao-1", "clinica-1");
      expect(result.regraInterpretacao).toBe("Médio");
    });

    it("deve calcular a regra de interpretação no limite inferior", async () => {
      prismaMock.avaliacao.findFirst.mockResolvedValue({
        ...mockAvaliacaoBase,
        scoreTotal: 11, // Limite de "Médio"
      } as any);

      const result = await pegarAvaliacaoPorId("avaliacao-1", "clinica-1");
      expect(result.regraInterpretacao).toBe("Médio");
    });

    it("deve calcular a regra de interpretação no limite superior", async () => {
      prismaMock.avaliacao.findFirst.mockResolvedValue({
        ...mockAvaliacaoBase,
        scoreTotal: 20, // Limite superior de "Médio"
      } as any);

      const result = await pegarAvaliacaoPorId("avaliacao-1", "clinica-1");
      expect(result.regraInterpretacao).toBe("Médio");
    });

    it("deve retornar regra null/undefined se o score for fora de todas as faixas", async () => {
      prismaMock.avaliacao.findFirst.mockResolvedValue({
        ...mockAvaliacaoBase,
        scoreTotal: 50, // Fora
      } as any);

      const result = await pegarAvaliacaoPorId("avaliacao-1", "clinica-1");
      expect(result.regraInterpretacao).toBeUndefined();
    });
  });

  describe("pegarAvaliacaoComRespostas", () => {
    it("deve retornar erro 404 se a avaliação não for encontrada", async () => {
      prismaMock.avaliacao.findFirst.mockResolvedValue(null);

      await expect(
        pegarAvaliacaoComRespostas("avaliacao-invalida", "clinica-1")
      ).rejects.toThrow(new AppError("Avaliação não encontrada", 404));
    });

    it("deve buscar a avaliação com respostas incluindo nested relations e usar clinicaId", async () => {
      prismaMock.avaliacao.findFirst.mockResolvedValue({
        ...mockAvaliacaoBase,
        scoreTotal: 25, // Deve cair em "Alto"
      } as any);

      const result = await pegarAvaliacaoComRespostas("avaliacao-1", "clinica-1");

      // Verifica param de chamada
      expect(prismaMock.avaliacao.findFirst).toHaveBeenCalledWith({
        where: { id: "avaliacao-1", clinicaId: "clinica-1" },
        include: {
          questionario: {
            include: {
              labelEscolha: { orderBy: { nota: "asc" } },
              regras: { orderBy: { pontuacaoMin: "asc" } },
              modulos: {
                orderBy: { ordem: "asc" },
                include: {
                  perguntas: {
                    orderBy: { ordem: "asc" },
                    include: {
                      respostas: {
                        where: { avaliacaoId: "avaliacao-1" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Verifica cálculo da regra tb
      expect(result.regraInterpretacao).toBe("Alto");
    });
  });

  describe("pegarAvaliacoesPorPacienteId", () => {
    it("deve listar por paciente, ordenada por data e validar as regras", async () => {
      prismaMock.avaliacao.findMany.mockResolvedValue([
        { ...mockAvaliacaoBase, id: "avaliacao-1", scoreTotal: 5 }, // Baixo
        { ...mockAvaliacaoBase, id: "avaliacao-2", scoreTotal: 25 }, // Alto
        { ...mockAvaliacaoBase, id: "avaliacao-3", scoreTotal: 100 }, // Nulo
      ] as any);
      prismaMock.avaliacao.count.mockResolvedValue(3);

      const result = await pegarAvaliacoesPorPacienteId("paciente-1", "clinica-1");

      // Validando a lógica de listagem ordenada
      expect(prismaMock.avaliacao.findMany).toHaveBeenCalledWith({
        where: { pacienteId: "paciente-1", clinicaId: "clinica-1" },
        orderBy: { dataRealizacao: "desc" },
        skip: 0,
        take: 20,
        include: {
          questionario: {
            include: {
              regras: {
                orderBy: { pontuacaoMin: "asc" },
              },
            },
          },
        },
      });

      // Validando o array mapeado e cálculo do score
      expect(result.data).toHaveLength(3);
      expect(result.data[0].regraInterpretacao).toBe("Baixo");
      expect(result.data[1].regraInterpretacao).toBe("Alto");
      expect(result.data[2].regraInterpretacao).toBeNull();
      expect(result.total).toBe(3);
      expect(result.totalPages).toBe(1);
    });
  });

  describe("excluirAvaliacao", () => {
    it("deve retornar erro 404 ao excluir se não encontrada", async () => {
      prismaMock.avaliacao.findFirst.mockResolvedValue(null);

      await expect(
        excluirAvaliacao("avaliacao-invalida", "clinica-1")
      ).rejects.toThrow(new AppError("Avaliação não encontrada", 404));
      expect(prismaMock.avaliacao.delete).not.toHaveBeenCalled();
    });

    it("deve filtrar por clinicaId e excluir corretamente", async () => {
      prismaMock.avaliacao.findFirst.mockResolvedValue({ id: "avaliacao-1" } as any);

      await excluirAvaliacao("avaliacao-1", "clinica-1");

      // Verifica a segurança por tenant
      expect(prismaMock.avaliacao.findFirst).toHaveBeenCalledWith({
        where: { id: "avaliacao-1", clinicaId: "clinica-1" },
      });

      // Verifica o delete físico
      expect(prismaMock.avaliacao.delete).toHaveBeenCalledWith({
        where: { id: "avaliacao-1" },
      });
    });
  });
});
