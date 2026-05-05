import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listarAgendaDia,
  criarAgendamento,
  editarAgendamento,
  alterarStatus,
  excluirAgendamento,
} from '@/services/agenda';
import type { CreateAgendamentoInput, UpdateAgendamentoInput, UpdateStatusInput } from '@nutricao/shared';

export function useAgendaDia(data: string) {
  return useQuery({
    queryKey: ['agenda', data],
    queryFn: () => listarAgendaDia(data),
  });
}

export function useCriarAgendamento(data: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAgendamentoInput) => criarAgendamento(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda', data] });
    },
  });
}

export function useEditarAgendamento(data: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAgendamentoInput }) =>
      editarAgendamento(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda', data] });
    },
  });
}

export function useAlterarStatus(data: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateStatusInput }) =>
      alterarStatus(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda', data] });
    },
  });
}

export function useExcluirAgendamento(data: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => excluirAgendamento(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda', data] });
    },
  });
}
