import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon, Delete02Icon } from '@hugeicons/core-free-icons';
import { api } from '@/services/api';
import type { CreateMedidaInput } from '@nutricao/shared';
import styles from '../ProntuarioPage.module.scss';

interface MedidasTabProps {
  pacienteId: string;
}

const medidaFields = [
  { key: 'peso', label: 'Peso (kg)' },
  { key: 'altura', label: 'Altura (cm)' },
  { key: 'cintura', label: 'Cintura' },
  { key: 'abdomen', label: 'Abdômen' },
  { key: 'quadril', label: 'Quadril' },
  { key: 'bracoDireito', label: 'Braço Dir.' },
  { key: 'bracoEsquerdo', label: 'Braço Esq.' },
  { key: 'coxaDireita', label: 'Coxa Dir.' },
  { key: 'coxaEsquerda', label: 'Coxa Esq.' },
  { key: 'culote', label: 'Culote' },
] as const;

export function MedidasTab({ pacienteId }: MedidasTabProps) {
  const [formAberto, setFormAberto] = useState(false);
  const queryClient = useQueryClient();

  const { data: medidas = [] } = useQuery({
    queryKey: ['medidas', pacienteId],
    queryFn: async () => {
      const { data } = await api.get(`/prontuario/${pacienteId}/medidas`);
      return data.data;
    },
  });

  const { register, handleSubmit, reset } = useForm<CreateMedidaInput>();

  const criarMutation = useMutation({
    mutationFn: async (data: CreateMedidaInput) => {
      const payload: any = { ...data, pacienteId };
      for (const f of medidaFields) {
        if (payload[f.key] !== undefined && payload[f.key] !== '') {
          payload[f.key] = Number(payload[f.key]);
        } else {
          delete payload[f.key];
        }
      }
      return api.post(`/prontuario/${pacienteId}/medidas`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medidas', pacienteId] });
      setFormAberto(false);
      reset();
    },
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/prontuario/medidas/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medidas', pacienteId] });
    },
  });

  return (
    <div>
      <button
        className={styles.novaMedidaBtn}
        onClick={() => setFormAberto(!formAberto)}
      >
        <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2} /> Adicionar Medida
      </button>

      {formAberto && (
        <form
          className={styles.evolucaoForm}
          onSubmit={handleSubmit((data) => criarMutation.mutate(data))}
        >
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Data da Avaliação *</label>
              <input type="date" {...register('data')} />
            </div>
            {medidaFields.map((f) => (
              <div key={f.key} className={styles.field}>
                <label>{f.label}</label>
                <input
                  type="number"
                  step="0.1"
                  {...register(f.key as any)}
                  placeholder="0.0"
                />
              </div>
            ))}
          </div>
          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => {
                setFormAberto(false);
                reset();
              }}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.submitBtn} disabled={criarMutation.isPending}>
              {criarMutation.isPending ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      )}

      <div className={styles.medidasTable}>
        {medidas.length === 0 ? (
          <div className={styles.empty}>Nenhuma medida registrada.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Data</th>
                {medidaFields.map((f) => (
                  <th key={f.key}>{f.label}</th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {medidas.map((m: any) => (
                <tr key={m.id}>
                  <td>{new Date(m.data).toLocaleDateString('pt-BR')}</td>
                  {medidaFields.map((f) => (
                    <td key={f.key}>{m[f.key] ?? '-'}</td>
                  ))}
                  <td>
                    <button
                      className={styles.medidaActionBtn}
                      onClick={() => {
                        if (confirm('Excluir esta medida?')) {
                          excluirMutation.mutate(m.id);
                        }
                      }}
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={16} strokeWidth={2} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
