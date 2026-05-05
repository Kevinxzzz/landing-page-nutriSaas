import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HugeiconsIcon } from '@hugeicons/react';
import { PrinterIcon, Search01Icon } from '@hugeicons/core-free-icons';
import { api } from '@/services/api';
import { StatusAgendamento } from '@nutricao/shared';
import styles from './RelatoriosPage.module.scss';

const statusLabels: Record<string, string> = {
  AGENDADO: 'Agendado', CONFIRMOU: 'Confirmou', PRESENTE: 'Presente',
  ENCAIXE: 'Encaixe', CANCELADO: 'Cancelado', NAO_COMPARECEU: 'Não Compareceu',
  REALIZADO: 'Realizado', DESISTIU: 'Desistiu', REMARCOU: 'Remarcou',
};

function getFirstOfMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

export function RelatoriosPage() {
  const [dataInicio, setDataInicio] = useState(getFirstOfMonth());
  const [dataFim, setDataFim] = useState(getToday());
  const [status, setStatus] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['relatorio', dataInicio, dataFim, status],
    queryFn: async () => {
      const params: any = { dataInicio, dataFim };
      if (status) params.status = status;
      const { data } = await api.get('/relatorios', { params });
      return data.data;
    },
  });

  const agendamentos = data?.agendamentos || [];
  const resumo = data?.resumo || { total: 0, realizados: 0, cancelados: 0 };

  return (
    <div>
      <div className={styles.filtros}>
        <div className={styles.field}>
          <label>Data Início</label>
          <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label>Data Fim</label>
          <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Todos</option>
            {Object.values(StatusAgendamento).map((s) => (
              <option key={s} value={s}>{statusLabels[s]}</option>
            ))}
          </select>
        </div>
        <button className={styles.filtrarBtn} onClick={() => refetch()}>
          <HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={2} /> Filtrar
        </button>
        <button className={styles.imprimirBtn} onClick={() => window.print()}>
          <HugeiconsIcon icon={PrinterIcon} size={16} strokeWidth={2} /> Imprimir
        </button>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <strong>{resumo.total}</strong>
          <span>Total</span>
        </div>
        <div className={styles.stat}>
          <strong>{resumo.realizados}</strong>
          <span>Realizados</span>
        </div>
        <div className={styles.stat}>
          <strong>{resumo.cancelados}</strong>
          <span>Cancelados</span>
        </div>
      </div>

      <div className={styles.container}>
        {isLoading ? (
          <div className={styles.empty}>Carregando...</div>
        ) : agendamentos.length === 0 ? (
          <div className={styles.empty}>Nenhum registro encontrado.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Hora</th>
                <th>Paciente</th>
                <th>Convênio</th>
                <th>Telefone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {agendamentos.map((ag: any) => (
                <tr key={ag.id}>
                  <td>{new Date(ag.dataHora).toLocaleDateString('pt-BR')}</td>
                  <td>
                    {new Date(ag.dataHora).toLocaleTimeString('pt-BR', {
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </td>
                  <td>{ag.paciente.nome}</td>
                  <td>{ag.convenio?.nome || 'Particular'}</td>
                  <td>{ag.paciente.telefone || '-'}</td>
                  <td>{statusLabels[ag.status] || ag.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
