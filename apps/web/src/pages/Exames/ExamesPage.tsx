import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  TestTubeIcon,
  PlusSignIcon,
  PencilEdit01Icon,
  Delete02Icon,
  Search01Icon,
} from '@hugeicons/core-free-icons';
import { api } from '@/services/api';
import type { CreateExameBaseInput } from '@nutricao/shared';
import styles from './ExamesPage.module.scss';

type Tab = 'base' | 'meus';

interface ExameBase {
  id: string;
  codigo: string;
  nome: string;
  valorMinimo: number | null;
  valorMaximo: number | null;
  unidade: string | null;
  isBase: boolean;
}

export function ExamesPage() {
  const [tab, setTab] = useState<Tab>('base');
  const [busca, setBusca] = useState('');
  const [formAberto, setFormAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: examesBase = [], isLoading: loadingBase } = useQuery<ExameBase[]>({
    queryKey: ['exames-page', 'base'],
    queryFn: async () => {
      const { data } = await api.get('/exames/base?tipo=base');
      return data.data;
    },
  });

  const { data: meusExames = [], isLoading: loadingMeus } = useQuery<ExameBase[]>({
    queryKey: ['exames-page', 'custom'],
    queryFn: async () => {
      const { data } = await api.get('/exames/base?tipo=custom');
      return data.data;
    },
  });

  const { register, handleSubmit, reset } = useForm<CreateExameBaseInput>();

  const mutation = useMutation({
    mutationFn: async (data: CreateExameBaseInput) => {
      const payload = {
        ...data,
        valorMinimo: data.valorMinimo ? Number(data.valorMinimo) : undefined,
        valorMaximo: data.valorMaximo ? Number(data.valorMaximo) : undefined,
      };
      if (editandoId) return api.put(`/exames/base/${editandoId}`, payload);
      return api.post('/exames/base', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exames-page'] });
      queryClient.invalidateQueries({ queryKey: ['exames-base'] });
      fecharForm();
    },
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/exames/base/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exames-page'] });
      queryClient.invalidateQueries({ queryKey: ['exames-base'] });
    },
  });

  const listaAtual = tab === 'base' ? examesBase : meusExames;
  const isLoading = tab === 'base' ? loadingBase : loadingMeus;

  const examesFiltrados = useMemo(() => {
    if (!busca.trim()) return listaAtual;
    const termo = busca.toLowerCase();
    return listaAtual.filter(
      (ex) =>
        ex.nome.toLowerCase().includes(termo) ||
        ex.codigo.toLowerCase().includes(termo)
    );
  }, [listaAtual, busca]);

  function fecharForm() {
    setFormAberto(false);
    setEditandoId(null);
    reset({ codigo: '', nome: '', valorMinimo: undefined, valorMaximo: undefined, unidade: '' });
  }

  function editar(ex: ExameBase) {
    setEditandoId(ex.id);
    reset({
      codigo: ex.codigo,
      nome: ex.nome,
      valorMinimo: ex.valorMinimo ?? undefined,
      valorMaximo: ex.valorMaximo ?? undefined,
      unidade: ex.unidade || '',
    });
    setFormAberto(true);
  }

  const isMeus = tab === 'meus';

  return (
    <div className={styles.page}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'base' ? styles.active : ''}`}
          onClick={() => { setTab('base'); setBusca(''); fecharForm(); }}
        >
          Exames Base
          <span className={styles.tabCount}>{examesBase.length}</span>
        </button>
        <button
          className={`${styles.tab} ${tab === 'meus' ? styles.active : ''}`}
          onClick={() => { setTab('meus'); setBusca(''); fecharForm(); }}
        >
          Meus Exames
          {meusExames.length > 0 && (
            <span className={styles.tabCount}>{meusExames.length}</span>
          )}
        </button>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>
            <HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={2} />
          </span>
          <input
            className={styles.searchInput}
            type="text"
            placeholder={isMeus ? 'Buscar nos meus exames...' : 'Buscar por nome ou código TUSS...'}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {isMeus && (
          <button className={styles.addBtn} onClick={() => { fecharForm(); setFormAberto(true); }}>
            <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2} />
            Novo Exame
          </button>
        )}
      </div>

      {/* Form (Meus Exames only) */}
      {isMeus && formAberto && (
        <div className={styles.formCard}>
          <p className={styles.formTitle}>
            {editandoId ? 'Editar Exame' : 'Novo Exame Personalizado'}
          </p>
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>Código</label>
                <input {...register('codigo')} placeholder="Ex: BIOIMP" />
              </div>
              <div className={styles.field}>
                <label>Nome</label>
                <input {...register('nome')} placeholder="Ex: Bioimpedância" />
              </div>
              <div className={styles.field}>
                <label>Valor Mínimo</label>
                <input type="number" step="0.01" {...register('valorMinimo')} placeholder="0.00" />
              </div>
              <div className={styles.field}>
                <label>Valor Máximo</label>
                <input type="number" step="0.01" {...register('valorMaximo')} placeholder="0.00" />
              </div>
              <div className={styles.field}>
                <label>Unidade</label>
                <input {...register('unidade')} placeholder="Ex: %" />
              </div>
            </div>
            <div className={styles.formActions}>
              <button type="button" className={styles.cancelBtn} onClick={fecharForm}>Cancelar</button>
              <button type="submit" className={styles.submitBtn} disabled={mutation.isPending}>
                {mutation.isPending ? 'Salvando...' : editandoId ? 'Salvar' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className={styles.loading}>Carregando exames...</div>
      ) : isMeus && meusExames.length === 0 && !busca.trim() && !formAberto ? (
        /* Empty state para Meus Exames */
        <div className={styles.tableCard}>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <HugeiconsIcon icon={TestTubeIcon} size={48} strokeWidth={1.2} />
            </div>
            <h3 className={styles.emptyTitle}>Nenhum exame personalizado</h3>
            <p className={styles.emptyDesc}>
              Aqui você pode cadastrar exames específicos da sua clínica que não
              existem na tabela base TUSS. Por exemplo: bioimpedância, calorimetria
              indireta, testes de intolerância alimentar, entre outros.
            </p>
            <button className={styles.emptyBtn} onClick={() => { fecharForm(); setFormAberto(true); }}>
              <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2} />
              Criar Primeiro Exame
            </button>
          </div>
        </div>
      ) : examesFiltrados.length === 0 ? (
        <div className={styles.tableCard}>
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <HugeiconsIcon icon={Search01Icon} size={40} strokeWidth={1.5} />
            </div>
            <p>Nenhum exame encontrado para "{busca}"</p>
          </div>
        </div>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{isMeus ? 'Código' : 'Código TUSS'}</th>
                <th>Nome</th>
                <th>Valor Mín</th>
                <th>Valor Máx</th>
                <th>Unidade</th>
                {isMeus && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {examesFiltrados.map((ex) => (
                <tr key={ex.id}>
                  <td className={styles.codeCell}>{ex.codigo}</td>
                  <td>{ex.nome}</td>
                  <td className={styles.valueCell}>
                    {ex.valorMinimo != null ? ex.valorMinimo : '-'}
                  </td>
                  <td className={styles.valueCell}>
                    {ex.valorMaximo != null ? ex.valorMaximo : '-'}
                  </td>
                  <td>
                    {ex.unidade ? (
                      <span className={styles.unitBadge}>{ex.unidade}</span>
                    ) : '-'}
                  </td>
                  {isMeus && (
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.actionBtn} onClick={() => editar(ex)} title="Editar">
                          <HugeiconsIcon icon={PencilEdit01Icon} size={16} strokeWidth={2} />
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.danger}`}
                          onClick={() => { if (confirm('Excluir exame?')) excluirMutation.mutate(ex.id); }}
                          title="Excluir"
                        >
                          <HugeiconsIcon icon={Delete02Icon} size={16} strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.footer}>
            <span>
              {examesFiltrados.length} {examesFiltrados.length === 1 ? 'exame' : 'exames'}
              {busca.trim() ? ` encontrado${examesFiltrados.length !== 1 ? 's' : ''}` : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
