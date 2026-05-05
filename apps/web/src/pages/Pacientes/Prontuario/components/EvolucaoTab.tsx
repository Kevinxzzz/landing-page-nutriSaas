import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon } from '@hugeicons/core-free-icons';
import { api } from '@/services/api';
import type { CreateEvolucaoInput } from '@nutricao/shared';
import styles from '../ProntuarioPage.module.scss';

interface EvolucaoTabProps {
  pacienteId: string;
}

export function EvolucaoTab({ pacienteId }: EvolucaoTabProps) {
  const [formAberto, setFormAberto] = useState(false);
  const queryClient = useQueryClient();

  const { data: evolucoes = [] } = useQuery({
    queryKey: ['evolucoes', pacienteId],
    queryFn: async () => {
      const { data } = await api.get(`/prontuario/${pacienteId}/evolucoes`);
      return data.data;
    },
  });

  const { register, handleSubmit, reset } = useForm<CreateEvolucaoInput>();

  const mutation = useMutation({
    mutationFn: async (data: CreateEvolucaoInput) => {
      return api.post(`/prontuario/${pacienteId}/evolucoes`, {
        ...data,
        pacienteId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evolucoes', pacienteId] });
      setFormAberto(false);
      reset();
    },
  });

  return (
    <div>
      <button
        className={styles.novaEvolucaoBtn}
        onClick={() => setFormAberto(!formAberto)}
      >
        <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2} /> Nova Evolução
      </button>

      {formAberto && (
        <form
          className={styles.evolucaoForm}
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
        >
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Estado Clínico / Sintomas</label>
              <textarea {...register('estadoClinico')} />
            </div>
            <div className={styles.field}>
              <label>Aparelho Digestivo</label>
              <textarea {...register('aparelhoDigestivo')} />
            </div>
            <div className={styles.field}>
              <label>Antecedentes Mórbidos</label>
              <textarea {...register('antecedentesMorbidos')} />
            </div>
            <div className={styles.field}>
              <label>Medicamentos</label>
              <textarea {...register('medicamentos')} />
            </div>
            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
              <label>Outros</label>
              <textarea {...register('outros')} />
            </div>
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
            <button type="submit" className={styles.submitBtn} disabled={mutation.isPending}>
              {mutation.isPending ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      )}

      {evolucoes.length === 0 ? (
        <div className={styles.empty}>Nenhuma evolução clínica registrada.</div>
      ) : (
        evolucoes.map((ev: any) => (
          <div key={ev.id} className={styles.evolucaoCard}>
            <div className={styles.evolucaoHeader}>
              <h3>Evolução Clínica</h3>
              <span className={styles.evolucaoDate}>
                {new Date(ev.criadoEm).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className={styles.evolucaoGrid}>
              {ev.estadoClinico && (
                <div className={styles.evolucaoField}>
                  <label>Estado Clínico</label>
                  <p>{ev.estadoClinico}</p>
                </div>
              )}
              {ev.aparelhoDigestivo && (
                <div className={styles.evolucaoField}>
                  <label>Aparelho Digestivo</label>
                  <p>{ev.aparelhoDigestivo}</p>
                </div>
              )}
              {ev.antecedentesMorbidos && (
                <div className={styles.evolucaoField}>
                  <label>Antecedentes Mórbidos</label>
                  <p>{ev.antecedentesMorbidos}</p>
                </div>
              )}
              {ev.medicamentos && (
                <div className={styles.evolucaoField}>
                  <label>Medicamentos</label>
                  <p>{ev.medicamentos}</p>
                </div>
              )}
              {ev.outros && (
                <div className={styles.evolucaoField} style={{ gridColumn: '1 / -1' }}>
                  <label>Outros</label>
                  <p>{ev.outros}</p>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
