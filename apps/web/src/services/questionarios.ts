import axios from "axios";
import type { ApiResponse, PaginatedResponse } from "@nutricao/shared";
import { api } from "@/services/api";

const publicApi = axios.create({
  baseURL: "/api",
});

export interface QuestionarioPergunta {
  id: string;
  descricao: string;
  ordem: number;
  moduloId: string;
}

export interface QuestionarioModulo {
  id: string;
  nome: string;
  ordem: number;
  questionarioId: string;
  perguntas: QuestionarioPergunta[];
}

export interface QuestionarioLabelEscolha {
  id: string;
  nota: number;
  label: string;
}

export interface QuestionarioDetalhe {
  id: string;
  clinicaId: string;
  nome: string;
  versao: number;
  ativo: boolean;
  modulos: QuestionarioModulo[];
  labelEscolha?: QuestionarioLabelEscolha[];
}

export interface RespostaPayload {
  perguntaId: string;
  nota: number;
}

export interface QuestionarioListItem {
  id: string;
  nome: string;
  versao: number;
  ativo: boolean;
  totalModulos: number;
}

export async function buscarQuestionario(questionarioId: string) {
  const { data } = await publicApi.get<ApiResponse<QuestionarioDetalhe>>(
    `/questionarios/${questionarioId}`,
  );

  return data.data as QuestionarioDetalhe;
}

export async function enviarRespostasQuestionario(
  pacienteId: string,
  questionarioId: string,
  respostas: RespostaPayload[],
) {
  const { data } = await publicApi.post<ApiResponse<unknown>>(
    `/pacientes/${pacienteId}/questionarios/${questionarioId}/avaliacoes`,
    {
      respostas,
    },
  );

  return data;
}

export async function listarQuestionarios() {
  const { data } =
    await api.get<ApiResponse<PaginatedResponse<QuestionarioListItem>>>(
      "/questionarios",
    );

  return data.data?.data ?? [];
}

export async function criarQuestionarioDefault() {
  const { data } = await api.post<ApiResponse<unknown>>(
    "/questionarios/default",
  );

  return data;
}
