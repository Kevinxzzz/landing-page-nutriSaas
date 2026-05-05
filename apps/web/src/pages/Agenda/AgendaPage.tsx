import { useState, useCallback } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, ArrowRight01Icon, PlusSignIcon } from '@hugeicons/core-free-icons';
import { useQueryClient } from '@tanstack/react-query';
import {
  useAgendaDia,
  useCriarAgendamento,
  useEditarAgendamento,
  useAlterarStatus,
  useExcluirAgendamento,
} from './hooks/useAgenda';
import { useSocket, useSocketEvent } from '@/hooks/useSocket';
import { TabelaAgenda } from './components/TabelaAgenda';
import { AgendamentoModal } from './components/AgendamentoModal';
import type { AgendamentoResponse } from '@/services/agenda';
import type { CreateAgendamentoInput } from '@nutricao/shared';
import styles from './AgendaPage.module.scss';

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

export function AgendaPage() {
  const [dataSelecionada, setDataSelecionada] = useState(formatDate(new Date()));
  const [modalAberto, setModalAberto] = useState(false);
  const [agendamentoEditando, setAgendamentoEditando] =
    useState<AgendamentoResponse | null>(null);

  const { data: agendamentos = [], isLoading } = useAgendaDia(dataSelecionada);
  const criarMutation = useCriarAgendamento(dataSelecionada);
  const editarMutation = useEditarAgendamento(dataSelecionada);
  const statusMutation = useAlterarStatus(dataSelecionada);
  const excluirMutation = useExcluirAgendamento(dataSelecionada);

  const queryClient = useQueryClient();
  const socketRef = useSocket();

  const handleSocketUpdate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['agenda', dataSelecionada] });
  }, [queryClient, dataSelecionada]);

  useSocketEvent(socketRef, 'agenda:novo', handleSocketUpdate);
  useSocketEvent(socketRef, 'agenda:atualizado', handleSocketUpdate);
  useSocketEvent(socketRef, 'agenda:status', handleSocketUpdate);
  useSocketEvent(socketRef, 'agenda:excluido', handleSocketUpdate);

  function navigateDate(days: number) {
    const d = new Date(dataSelecionada + 'T12:00:00');
    d.setDate(d.getDate() + days);
    setDataSelecionada(formatDate(d));
  }

  function handleSubmit(data: CreateAgendamentoInput) {
    if (agendamentoEditando) {
      editarMutation.mutate(
        { id: agendamentoEditando.id, input: data },
        {
          onSuccess: () => {
            setModalAberto(false);
            setAgendamentoEditando(null);
          },
        },
      );
    } else {
      criarMutation.mutate(data, {
        onSuccess: () => {
          setModalAberto(false);
        },
      });
    }
  }

  function handleChangeStatus(id: string, status: string) {
    statusMutation.mutate({ id, input: { status: status as any } });
  }

  function handleEdit(ag: AgendamentoResponse) {
    setAgendamentoEditando(ag);
    setModalAberto(true);
  }

  function handleDelete(id: string) {
    if (confirm('Deseja realmente excluir este agendamento?')) {
      excluirMutation.mutate(id);
    }
  }

  const totalAgendados = agendamentos.length;
  const totalPresentes = agendamentos.filter(
    (a) => a.status === 'PRESENTE' || a.status === 'REALIZADO',
  ).length;
  const totalCancelados = agendamentos.filter(
    (a) => a.status === 'CANCELADO' || a.status === 'DESISTIU',
  ).length;

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.dateNav}>
          <button className={styles.dateBtn} onClick={() => navigateDate(-1)}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} strokeWidth={1.8} />
          </button>
          <input
            type="date"
            className={styles.dateInput}
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
          />
          <button className={styles.dateBtn} onClick={() => navigateDate(1)}>
            <HugeiconsIcon icon={ArrowRight01Icon} size={18} strokeWidth={1.8} />
          </button>
          <button
            className={styles.todayBtn}
            onClick={() => setDataSelecionada(formatDate(new Date()))}
          >
            Hoje
          </button>
        </div>

        <button
          className={styles.agendarBtn}
          onClick={() => {
            setAgendamentoEditando(null);
            setModalAberto(true);
          }}
        >
          <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2} /> Agendar
        </button>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <strong>{totalAgendados}</strong>
          <span>Agendados</span>
        </div>
        <div className={styles.stat}>
          <strong>{totalPresentes}</strong>
          <span>Presentes</span>
        </div>
        <div className={styles.stat}>
          <strong>{totalCancelados}</strong>
          <span>Cancelados</span>
        </div>
      </div>

      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <TabelaAgenda
          agendamentos={agendamentos}
          onChangeStatus={handleChangeStatus}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {modalAberto && (
        <AgendamentoModal
          dataSelecionada={dataSelecionada}
          agendamento={agendamentoEditando}
          onSubmit={handleSubmit}
          onClose={() => {
            setModalAberto(false);
            setAgendamentoEditando(null);
          }}
          isPending={criarMutation.isPending || editarMutation.isPending}
        />
      )}
    </div>
  );
}
