import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  PlusSignIcon,
  StethoscopeIcon,
  HeartCheckIcon,
  Shield01Icon,
  PillIcon,
  ClipboardIcon,
} from '@hugeicons/core-free-icons';
import { api } from '@/services/api';
import type { CreateEvolucaoInput } from '@nutricao/shared';
import styles from '../ProntuarioPage.module.scss';

interface Props {
  pacienteId: string;
}

const secoes = [
  {
    key: 'estadoClinico',
    label: 'Sintomas',
    icon: StethoscopeIcon,
    colorClass: 'timelineIconGray',
  },
  {
    key: 'aparelhoDigestivo',
    label: 'Aparelho Digestivo',
    icon: HeartCheckIcon,
    colorClass: 'timelineIconRed',
  },
  {
    key: 'antecedentesMorbidos',
    label: 'Antecedentes Mórbidos',
    icon: Shield01Icon,
    colorClass: 'timelineIconBlue',
  },
  {
    key: 'medicamentos',
    label: 'Medicamentos',
    icon: PillIcon,
    colorClass: 'timelineIconYellow',
  },
  {
    key: 'outros',
    label: 'Outros',
    icon: ClipboardIcon,
    colorClass: 'timelineIconTeal',
  },
] as const;

export function EstadoClinicoTimeline({ pacienteId }: Props) {
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

  // Consolidar evoluções por seção
  const secaoData = secoes.map((secao) => {
    const conteudos = evolucoes
      .filter((ev: any) => ev[secao.key])
      .map((ev: any) => ev[secao.key] as string);
    return {
      ...secao,
      conteudo: conteudos.join('\n'),
      hasContent: conteudos.length > 0,
    };
  });

  return (
    <div>
      <button
        className={styles.novaEvolucaoBtn}
        onClick={() => setFormAberto(!formAberto)}
      >
        <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2} />
        Nova Evolução
      </button>

      {formAberto && (
        <form
          className={styles.evolucaoForm}
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          style={{ marginBottom: '1.75rem' }}
        >
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Sintomas / Estado Clínico</label>
              <textarea rows={4} {...register('estadoClinico')} placeholder="Descreva os sintomas do paciente..." />
            </div>
            <div className={styles.field}>
              <label>Aparelho Digestivo</label>
              <textarea rows={4} {...register('aparelhoDigestivo')} placeholder="Estado do aparelho digestivo..." />
            </div>
            <div className={styles.field}>
              <label>Antecedentes Mórbidos</label>
              <textarea rows={4} {...register('antecedentesMorbidos')} placeholder="Histórico de doenças..." />
            </div>
            <div className={styles.field}>
              <label>Medicamentos</label>
              <textarea rows={4} {...register('medicamentos')} placeholder="Medicamentos em uso..." />
            </div>
            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
              <label>Outros</label>
              <textarea rows={3} {...register('outros')} placeholder="Atividade física, acompanhamento profissional..." />
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
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Salvando...' : 'Salvar Evolução'}
            </button>
          </div>
        </form>
      )}

      {evolucoes.length === 0 && !formAberto ? (
        <div className={styles.empty}>
          Nenhuma evolução clínica registrada.
        </div>
      ) : (
        <div className={styles.timeline}>
          {secaoData.map((secao) => (
            <div key={secao.key} className={styles.timelineItem}>
              <div
                className={`${styles.timelineIcon} ${styles[secao.colorClass]}`}
              >
                <HugeiconsIcon icon={secao.icon} size={15} strokeWidth={2} />
              </div>
              <h4 className={styles.timelineLabel}>{secao.label}</h4>
              <div
                className={`${styles.timelineContent} ${
                  !secao.hasContent ? styles.timelineContentEmpty : ''
                }`}
              >
                {secao.hasContent ? (
                  <p>{secao.conteudo}</p>
                ) : (
                  <p>Nenhum registro</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
