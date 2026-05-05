import { api } from './api';
import type { ApiResponse } from '@nutricao/shared';

export interface ConvenioItem {
  id: string;
  nome: string;
  registroANS: string | null;
}

export async function listarConvenios() {
  const { data: res } = await api.get<ApiResponse<ConvenioItem[]>>('/convenios');
  return res.data!;
}
