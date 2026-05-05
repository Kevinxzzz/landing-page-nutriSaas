import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { HugeiconsIcon } from '@hugeicons/react';
import { CancelCircleIcon } from '@hugeicons/core-free-icons';
import { createAgendamentoSchema, type CreateAgendamentoInput } from '@nutricao/shared';
import { listarPacientes } from '@/services/pacientes';
import { listarConvenios } from '@/services/convenios';
import type { AgendamentoResponse } from '@/services/agenda';
import styles from './AgendamentoModal.module.scss';

interface AgendamentoModalProps {
  dataSelecionada: string;
  agendamento?: AgendamentoResponse | null;
  onSubmit: (data: CreateAgendamentoInput) => void;
  onClose: () => void;
  isPending: boolean;
}

export function AgendamentoModal({
  dataSelecionada,
  agendamento,
  onSubmit,
  onClose,
  isPending,
}: AgendamentoModalProps) {
  const { data: pacientesData } = useQuery({
    queryKey: ['pacientes-select'],
    queryFn: () => listarPacientes(),
  });

  const { data: convenios } = useQuery({
    queryKey: ['convenios-select'],
    queryFn: () => listarConvenios(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAgendamentoInput>({
    resolver: zodResolver(createAgendamentoSchema),
    defaultValues: {
      tipo: 'CONSULTA',
      status: 'AGENDADO',
      encaixe: false,
    },
  });

  useEffect(() => {
    if (agendamento) {
      reset({
        pacienteId: agendamento.pacienteId,
        convenioId: agendamento.convenio?.id || undefined,
        dataHora: agendamento.dataHora.slice(0, 16),
        tipo: agendamento.tipo as 'CONSULTA' | 'RETORNO',
        status: agendamento.status as any,
        encaixe: agendamento.encaixe,
        observacao: agendamento.observacao || undefined,
      });
    } else {
      reset({
        tipo: 'CONSULTA',
        status: 'AGENDADO',
        encaixe: false,
        dataHora: `${dataSelecionada}T08:00`,
      });
    }
  }, [agendamento, dataSelecionada, reset]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{agendamento ? 'Editar Agendamento' : 'Novo Agendamento'}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <HugeiconsIcon icon={CancelCircleIcon} size={18} strokeWidth={1.8} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.body}>
            <div className={styles.field}>
              <label>Paciente</label>
              <select {...register('pacienteId')}>
                <option value="">Selecione um paciente</option>
                {pacientesData?.data.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
              {errors.pacienteId && (
                <span className={styles.error}>{errors.pacienteId.message}</span>
              )}
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>Data e Hora</label>
                <input type="datetime-local" {...register('dataHora')} />
                {errors.dataHora && (
                  <span className={styles.error}>{errors.dataHora.message}</span>
                )}
              </div>

              <div className={styles.field}>
                <label>Tipo</label>
                <select {...register('tipo')}>
                  <option value="CONSULTA">Consulta</option>
                  <option value="RETORNO">Retorno</option>
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>Convênio</label>
                <select {...register('convenioId')}>
                  <option value="">Particular</option>
                  {convenios?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label>Status</label>
                <select {...register('status')}>
                  <option value="AGENDADO">Agendado</option>
                  <option value="CONFIRMOU">Confirmou</option>
                  <option value="PRESENTE">Presente</option>
                  <option value="ENCAIXE">Encaixe</option>
                  <option value="CANCELADO">Cancelado</option>
                  <option value="NAO_COMPARECEU">Não Compareceu</option>
                  <option value="REALIZADO">Realizado</option>
                  <option value="DESISTIU">Desistiu</option>
                  <option value="REMARCOU">Remarcou</option>
                </select>
              </div>
            </div>

            <div className={styles.checkField}>
              <input type="checkbox" id="encaixe" {...register('encaixe')} />
              <label htmlFor="encaixe">Encaixe</label>
            </div>

            <div className={styles.field}>
              <label>Observação</label>
              <textarea
                placeholder="Observações sobre o agendamento..."
                {...register('observacao')}
              />
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isPending}>
              {isPending ? 'Salvando...' : agendamento ? 'Salvar' : 'Agendar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
