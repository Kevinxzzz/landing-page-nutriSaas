import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon, PencilEdit01Icon, Delete02Icon } from '@hugeicons/core-free-icons';
import { api } from '@/services/api';
import type { CreateExameBaseInput } from '@nutricao/shared';
import styles from '../ConfigPage.module.scss';

export function ExamesBaseConfig() {
  const [formAberto, setFormAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: exames = [] } = useQuery({
    queryKey: ['exames-base-config'],
    queryFn: async () => {
      const { data } = await api.get('/exames/base');
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
      queryClient.invalidateQueries({ queryKey: ['exames-base-config'] });
      queryClient.invalidateQueries({ queryKey: ['exames-base'] });
      fecharForm();
    },
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/exames/base/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exames-base-config'] });
    },
  });

  function fecharForm() {
    setFormAberto(false);
    setEditandoId(null);
    reset({ codigo: '', nome: '', valorMinimo: undefined, valorMaximo: undefined, unidade: '' });
  }

  function editar(ex: any) {
    setEditandoId(ex.id);
    reset({ codigo: ex.codigo, nome: ex.nome, valorMinimo: ex.valorMinimo, valorMaximo: ex.valorMaximo, unidade: ex.unidade || '' });
    setFormAberto(true);
  }

  return (
    <div>
      <div className={styles.header}>
        <h3>Exames Base</h3>
        <button className={styles.addBtn} onClick={() => { fecharForm(); setFormAberto(true); }}>
          <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2} /> Novo Exame
        </button>
      </div>

      {formAberto && (
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>Código</label>
                <input {...register('codigo')} placeholder="Ex: GLI" />
              </div>
              <div className={styles.field}>
                <label>Nome</label>
                <input {...register('nome')} placeholder="Ex: Glicemia" />
              </div>
              <div className={styles.field}>
                <label>Valor Mínimo</label>
                <input type="number" step="0.01" {...register('valorMinimo')} />
              </div>
              <div className={styles.field}>
                <label>Valor Máximo</label>
                <input type="number" step="0.01" {...register('valorMaximo')} />
              </div>
              <div className={styles.field}>
                <label>Unidade</label>
                <input {...register('unidade')} placeholder="Ex: mg/dL" />
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

      <div className={styles.container}>
        {exames.length === 0 ? (
          <div className={styles.empty}>Nenhum exame base cadastrado.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr><th>Código</th><th>Nome</th><th>Min</th><th>Máx</th><th>Unidade</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {exames.map((ex: any) => (
                <tr key={ex.id}>
                  <td>{ex.codigo}</td>
                  <td>{ex.nome}</td>
                  <td>{ex.valorMinimo ?? '-'}</td>
                  <td>{ex.valorMaximo ?? '-'}</td>
                  <td>{ex.unidade || '-'}</td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn} onClick={() => editar(ex)}><HugeiconsIcon icon={PencilEdit01Icon} size={16} strokeWidth={2} /></button>
                      <button className={`${styles.actionBtn} ${styles.danger}`}
                        onClick={() => { if (confirm('Excluir exame?')) excluirMutation.mutate(ex.id); }}>
                        <HugeiconsIcon icon={Delete02Icon} size={16} strokeWidth={2} />
                      </button>
                    </div>
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
