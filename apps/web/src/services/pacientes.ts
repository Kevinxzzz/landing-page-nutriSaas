import axios from "axios";
import { api } from "./api";
import type { ApiResponse, PaginatedResponse } from "@nutricao/shared";

const publicApi = axios.create({
  baseURL: "/api",
});

export interface PacienteListItem {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  convenio: { id: string; nome: string } | null;
}

export type Convenio = {
  id: string;
  nome: string;
};

export type Agendamento = {
  id: string;
  // coloque os campos se você for usar depois
};

export type Paciente = {
  id: string;
  clinicaId: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  whatsapp: string | null;
  sexo: "MASCULINO" | "FEMININO" | null;
  dataNascimento: string | null;
  identidade: string | null;
  ufIdentidade: string | null;
  orgaoExpedidor: string | null;
  cpf: string | null;
  endereco: string | null;
  bairro: string | null;
  municipio: string | null;
  uf: string | null;
  cep: string | null;
  profissao: string | null;
  escolaridade: string | null;
  nomeMae: string | null;
  convenioId: string | null;
  numeroCarteira: string | null;
  validadeCarteira: string | null;
  criadoEm: string;
  atualizadoEm: string;
  convenio: Convenio | null;
  agendamentos: Agendamento[];
};

export async function listarPacientes(busca?: string) {
  const { data: res } = await api.get<
    ApiResponse<PaginatedResponse<PacienteListItem>>
  >("/pacientes", { params: { busca, limit: 100 } });
  return res.data!;
}

export async function getPacientePorId(id: string) {
  const { data } = await api.get<ApiResponse<Paciente>>(`/pacientes/${id}`);
  return data.data;
}

export async function buscarNomePacientePublico(id: string) {
  const { data } = await publicApi.get<ApiResponse<{ nome: string }>>(
    `/pacientes/${id}/nome`,
  );

  return data.data?.nome ?? "";
}
