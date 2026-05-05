import { api } from "./api";
import type { ApiResponse, PaginatedResponse } from "@nutricao/shared";

export interface RegraInterpretacao {
  id: string;
  pontuacaoMin: number;
  pontuacaoMax: number;
  classificacao: string;
  questionarioId: string;
}

export interface Avaliacao {
  id: string;
  dataRealizacao: string;
  scoreTotal: number;
  pacienteId: string;
  questionarioId: string;
  regraInterpretacao?: string | null;
  questionario?: {
    regras: RegraInterpretacao[];
  };
}

export interface PerguntaAvaliacao {
  id: string;
  descricao: string;
  ordem: number;
  respostas: Array<{
    nota: number;
  }>;
}

export interface ModuloAvaliacao {
  id: string;
  nome: string;
  ordem: number;
  perguntas: PerguntaAvaliacao[];
}

export interface LabelEscolhaAvaliacao {
  nota: number;
  label: string;
}

export type AvaliacaoComRespostas = Avaliacao & {
  questionario: {
    regras: RegraInterpretacao[];
    modulos: ModuloAvaliacao[];
    labelEscolha: LabelEscolhaAvaliacao[];
  };
};


export interface Avaliacoes {
  id: string;
  dataRealizacao: string;
  scoreTotal: number;
  pacienteId: string;
  questionarioId: string;
}


export async function getAvaliacoesPorId(Id: string) {
  const response = await api.get<ApiResponse<Avaliacao>>(`/avaliacoes/${Id}`);
  return response.data;
}

export async function getAvaliacaoComRespostas(Id: string) {
  const response = await api.get<ApiResponse<AvaliacaoComRespostas>>(
    `/avaliacoes/${Id}/questionario`,
  );
  return response.data;
}

export async function getAvaliacoesPorPacienteId(
  PacienteId: string,
  page: number = 1,
  limit: number = 20
) {
  const response = await api.get<ApiResponse<PaginatedResponse<Avaliacao>>>(
    `/pacientes/${PacienteId}/avaliacoes`,
    { params: { page, limit } }
  );
  return response.data;
}

export async function DeleteAvaliacao(Id: string) {
  const response = await api.delete(`/avaliacoes/${Id}`);
  return response;
}
