import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon, PencilEdit01Icon, Delete02Icon } from '@hugeicons/core-free-icons';
import { api } from '@/services/api';
import type { CreateConvenioInput } from '@nutricao/shared';
import styles from '../ConfigPage.module.scss';

export function ConveniosConfig() {
  const [formAberto, setFormAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: convenios = [] } = useQuery({
    queryKey: ['convenios-config'],
    queryFn: async () => {
      const { data } = await api.get('/convenios');
      return data.data;
    },
  });

  const { register, handleSubmit, reset } = useForm<CreateConvenioInput>();

  const mutation = useMutation({
    mutationFn: async (data: CreateConvenioInput) => {
      if (editandoId) return api.put(`/convenios/${editandoId}`, data);
      return api.post('/convenios', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convenios-config'] });
      queryClient.invalidateQueries({ queryKey: ['convenios-select'] });
      fecharForm();
    },
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/convenios/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convenios-config'] });
    },
  });

  function fecharForm() {
    setFormAberto(false);
    setEditandoId(null);
    reset({ nome: '', registroANS: '' });
  }

  function editar(conv: any) {
    setEditandoId(conv.id);
    reset({ nome: conv.nome, registroANS: conv.registroANS || '' });
    setFormAberto(true);
  }

  return (
    <div>
      <div className={styles.header}>
        <h3>Convênios</h3>
        <button className={styles.addBtn} onClick={() => { fecharForm(); setFormAberto(true); }}>
          <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2} /> Novo Convênio
        </button>
      </div>

      {formAberto && (
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>Nome</label>
                <input {...register('nome')} placeholder="Nome do convênio" />
              </div>
              <div className={styles.field}>
                <label>Registro ANS</label>
                <input {...register('registroANS')} placeholder="Opcional" />
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
        {convenios.length === 0 ? (
          <div className={styles.empty}>Nenhum convênio cadastrado.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr><th>Nome</th><th>Registro ANS</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {convenios.map((c: any) => (
                <tr key={c.id}>
                  <td>{c.nome}</td>
                  <td>{c.registroANS || '-'}</td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn} onClick={() => editar(c)}><HugeiconsIcon icon={PencilEdit01Icon} size={16} strokeWidth={2} /></button>
                      <button className={`${styles.actionBtn} ${styles.danger}`}
                        onClick={() => { if (confirm('Excluir convênio?')) excluirMutation.mutate(c.id); }}>
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
