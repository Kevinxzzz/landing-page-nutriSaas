import { api } from './api';
import type {
  ApiResponse,
  CreateAgendamentoInput,
  UpdateAgendamentoInput,
  UpdateStatusInput,
} from '@nutricao/shared';

export interface AgendamentoResponse {
  id: string;
  pacienteId: string;
  paciente: { id: string; nome: string; telefone: string | null; email: string | null };
  convenio: { id: string; nome: string } | null;
  dataHora: string;
  tipo: string;
  status: string;
  encaixe: boolean;
  observacao: string | null;
}

export async function listarAgendaDia(data: string) {
  const { data: res } = await api.get<ApiResponse<AgendamentoResponse[]>>(
    '/agendamentos',
    { params: { data } },
  );
  return res.data!;
}

export async function criarAgendamento(input: CreateAgendamentoInput) {
  const { data: res } = await api.post<ApiResponse<AgendamentoResponse>>(
    '/agendamentos',
    input,
  );
  return res.data!;
}

export async function editarAgendamento(id: string, input: UpdateAgendamentoInput) {
  const { data: res } = await api.put<ApiResponse<AgendamentoResponse>>(
    `/agendamentos/${id}`,
    input,
  );
  return res.data!;
}

export async function alterarStatus(id: string, input: UpdateStatusInput) {
  const { data: res } = await api.patch<ApiResponse<AgendamentoResponse>>(
    `/agendamentos/${id}/status`,
    input,
  );
  return res.data!;
}

export async function excluirAgendamento(id: string) {
  await api.delete(`/agendamentos/${id}`);
}
