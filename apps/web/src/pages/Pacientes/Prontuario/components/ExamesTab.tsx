import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon, Delete02Icon, TaskDone01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { api } from '@/services/api';
import styles from '../ProntuarioPage.module.scss';

interface ExamesTabProps {
  pacienteId: string;
}

type TabExame = 'base' | 'meus';

export function ExamesTab({ pacienteId }: ExamesTabProps) {
  const [solicitando, setSolicitando] = useState(false);
  const [tabExame, setTabExame] = useState<TabExame>('base');
  const [busca, setBusca] = useState('');
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [resultadoForm, setResultadoForm] = useState<{
    itemId: string;
    resultado: string;
    dataResultado: string;
  } | null>(null);
  const queryClient = useQueryClient();

  const { data: solicitacoes = [] } = useQuery({
    queryKey: ['exames-solicitacoes', pacienteId],
    queryFn: async () => {
      const { data } = await api.get(`/exames/paciente/${pacienteId}`);
      return data.data;
    },
  });

  const { data: examesBase = [] } = useQuery<any[]>({
    queryKey: ['exames-base', 'base'],
    queryFn: async () => {
      const { data } = await api.get('/exames/base?tipo=base');
      return data.data;
    },
  });

  const { data: meusExames = [] } = useQuery<any[]>({
    queryKey: ['exames-base', 'custom'],
    queryFn: async () => {
      const { data } = await api.get('/exames/base?tipo=custom');
      return data.data;
    },
  });

  const listaAtual = tabExame === 'base' ? examesBase : meusExames;

  const examesFiltrados = useMemo(() => {
    if (!busca.trim()) return listaAtual;
    const termo = busca.toLowerCase();
    return listaAtual.filter(
      (ex: any) =>
        ex.nome.toLowerCase().includes(termo) ||
        ex.codigo.toLowerCase().includes(termo)
    );
  }, [listaAtual, busca]);

  const solicitarMutation = useMutation({
    mutationFn: async () => {
      return api.post(`/exames/paciente/${pacienteId}`, {
        pacienteId,
        exameBaseIds: selecionados,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exames-solicitacoes', pacienteId] });
      setSolicitando(false);
      setSelecionados([]);
      setBusca('');
    },
  });

  const resultadoMutation = useMutation({
    mutationFn: async (data: { itemId: string; dataResultado: string; resultado: string }) => {
      return api.post('/exames/resultado', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exames-solicitacoes', pacienteId] });
      setResultadoForm(null);
    },
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/exames/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exames-solicitacoes', pacienteId] });
    },
  });

  function toggleExame(id: string) {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id],
    );
  }

  return (
    <div>
      <button
        className={styles.novaEvolucaoBtn}
        onClick={() => setSolicitando(!solicitando)}
      >
        <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2} /> Solicitar Exame
      </button>

      {solicitando && (
        <div className={styles.evolucaoForm}>
          {/* Tabs dentro do form de solicitação */}
          <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid #e5e7eb', marginBottom: '0.75rem' }}>
            <button
              type="button"
              onClick={() => { setTabExame('base'); setBusca(''); }}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: tabExame === 'base' ? '#10b981' : '#9ca3af',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${tabExame === 'base' ? '#10b981' : 'transparent'}`,
                marginBottom: '-2px',
                cursor: 'pointer',
              }}
            >
              Exames Base ({examesBase.length})
            </button>
            <button
              type="button"
              onClick={() => { setTabExame('meus'); setBusca(''); }}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: tabExame === 'meus' ? '#10b981' : '#9ca3af',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${tabExame === 'meus' ? '#10b981' : 'transparent'}`,
                marginBottom: '-2px',
                cursor: 'pointer',
              }}
            >
              Meus Exames ({meusExames.length})
            </button>
          </div>

          {/* Busca */}
          <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}>
              <HugeiconsIcon icon={Search01Icon} size={14} strokeWidth={2} />
            </span>
            <input
              type="text"
              placeholder="Filtrar exames..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '0.8125rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Lista de exames com checkboxes */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.375rem',
            marginBottom: '1rem',
            maxHeight: '280px',
            overflowY: 'auto',
          }}>
            {examesFiltrados.map((ex: any) => (
              <label key={ex.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8125rem',
                cursor: 'pointer',
                padding: '0.25rem 0.375rem',
                borderRadius: '0.375rem',
                background: selecionados.includes(ex.id) ? '#f0fdf4' : 'transparent',
                transition: 'background 0.15s',
              }}>
                <input
                  type="checkbox"
                  checked={selecionados.includes(ex.id)}
                  onChange={() => toggleExame(ex.id)}
                  style={{ accentColor: '#10b981' }}
                />
                <span style={{ flex: 1 }}>{ex.nome}</span>
                {ex.unidade && (
                  <span style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>{ex.unidade}</span>
                )}
              </label>
            ))}
          </div>

          {examesFiltrados.length === 0 && (
            <p style={{ color: '#9ca3af', fontSize: '0.8125rem', textAlign: 'center', padding: '1rem 0' }}>
              {busca.trim()
                ? 'Nenhum exame encontrado.'
                : tabExame === 'meus'
                  ? 'Nenhum exame personalizado cadastrado. Cadastre em Exames > Meus Exames.'
                  : 'Nenhum exame base disponível.'}
            </p>
          )}

          {selecionados.length > 0 && (
            <p style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginBottom: '0.5rem' }}>
              {selecionados.length} exame{selecionados.length !== 1 ? 's' : ''} selecionado{selecionados.length !== 1 ? 's' : ''}
            </p>
          )}

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => { setSolicitando(false); setSelecionados([]); setBusca(''); }}>
              Cancelar
            </button>
            <button
              type="button"
              className={styles.submitBtn}
              disabled={selecionados.length === 0 || solicitarMutation.isPending}
              onClick={() => solicitarMutation.mutate()}
            >
              {solicitarMutation.isPending ? 'Solicitando...' : `Solicitar (${selecionados.length})`}
            </button>
          </div>
        </div>
      )}

      {resultadoForm && (
        <div className={styles.evolucaoForm}>
          <h4 style={{ marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: 600 }}>
            Registrar Resultado
          </h4>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Data do Resultado</label>
              <input
                type="date"
                value={resultadoForm.dataResultado}
                onChange={(e) => setResultadoForm({ ...resultadoForm, dataResultado: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label>Resultado</label>
              <input
                value={resultadoForm.resultado}
                onChange={(e) => setResultadoForm({ ...resultadoForm, resultado: e.target.value })}
                placeholder="Valor do resultado"
              />
            </div>
          </div>
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => setResultadoForm(null)}>
              Cancelar
            </button>
            <button
              type="button"
              className={styles.submitBtn}
              disabled={!resultadoForm.resultado || resultadoMutation.isPending}
              onClick={() => resultadoMutation.mutate(resultadoForm)}
            >
              {resultadoMutation.isPending ? 'Salvando...' : 'Salvar Resultado'}
            </button>
          </div>
        </div>
      )}

      {solicitacoes.length === 0 ? (
        <div className={styles.empty}>Nenhum exame solicitado.</div>
      ) : (
        solicitacoes.map((sol: any) => (
          <div key={sol.id} className={styles.evolucaoCard}>
            <div className={styles.evolucaoHeader}>
              <h3>
                Solicitação — {new Date(sol.dataSolicitada).toLocaleDateString('pt-BR')}
              </h3>
              <button
                className={styles.medidaActionBtn}
                onClick={() => {
                  if (confirm('Excluir esta solicitação?')) excluirMutation.mutate(sol.id);
                }}
              >
                <HugeiconsIcon icon={Delete02Icon} size={16} strokeWidth={2} />
              </button>
            </div>
            <div className={styles.medidasTable}>
              <table>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Exame</th>
                    <th>Resultado</th>
                    <th>Data Resultado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {sol.itens.map((item: any) => (
                    <tr key={item.id}>
                      <td>{item.exameBase.codigo}</td>
                      <td>{item.exameBase.nome}</td>
                      <td>{item.resultado || '-'}</td>
                      <td>
                        {item.dataResultado
                          ? new Date(item.dataResultado).toLocaleDateString('pt-BR')
                          : '-'}
                      </td>
                      <td>
                        {!item.resultado && (
                          <button
                            className={styles.medidaActionBtn}
                            style={{ color: '#10b981' }}
                            title="Registrar resultado"
                            onClick={() =>
                              setResultadoForm({
                                itemId: item.id,
                                resultado: '',
                                dataResultado: new Date().toISOString().split('T')[0],
                              })
                            }
                          >
                            <HugeiconsIcon icon={TaskDone01Icon} size={16} strokeWidth={2} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
