import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon, PencilEdit01Icon, Delete02Icon } from '@hugeicons/core-free-icons';
import { api } from '@/services/api';
import type { CreateUsuarioInput } from '@nutricao/shared';
import styles from '../ConfigPage.module.scss';

const perfilLabels: Record<string, { label: string; className: string }> = {
  ADMIN: { label: 'Administrador', className: styles.admin },
  NUTRICIONISTA: { label: 'Nutricionista', className: styles.nutri },
  SECRETARIA: { label: 'Secretária', className: styles.secretaria },
};

export function UsuariosConfig() {
  const [formAberto, setFormAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: usuarios = [] } = useQuery({
    queryKey: ['usuarios-config'],
    queryFn: async () => {
      const { data } = await api.get('/usuarios');
      return data.data;
    },
  });

  const { register, handleSubmit, reset } = useForm<CreateUsuarioInput>();

  const mutation = useMutation({
    mutationFn: async (data: CreateUsuarioInput) => {
      if (editandoId) return api.put(`/usuarios/${editandoId}`, data);
      return api.post('/usuarios', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios-config'] });
      fecharForm();
    },
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/usuarios/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios-config'] });
    },
  });

  function fecharForm() {
    setFormAberto(false);
    setEditandoId(null);
    reset({ nome: '', email: '', senha: '', perfil: 'NUTRICIONISTA' });
  }

  function editar(user: any) {
    setEditandoId(user.id);
    reset({ nome: user.nome, email: user.email, senha: '', perfil: user.perfil });
    setFormAberto(true);
  }

  return (
    <div>
      <div className={styles.header}>
        <h3>Usuários</h3>
        <button className={styles.addBtn} onClick={() => { fecharForm(); setFormAberto(true); }}>
          <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2} /> Novo Usuário
        </button>
      </div>

      {formAberto && (
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>Nome</label>
                <input {...register('nome')} placeholder="Nome completo" />
              </div>
              <div className={styles.field}>
                <label>E-mail</label>
                <input type="email" {...register('email')} />
              </div>
              <div className={styles.field}>
                <label>Senha {editandoId && '(deixe vazio para manter)'}</label>
                <input type="password" {...register('senha')} placeholder={editandoId ? '••••••' : 'Mínimo 6 caracteres'} />
              </div>
              <div className={styles.field}>
                <label>Perfil</label>
                <select {...register('perfil')}>
                  <option value="ADMIN">Administrador</option>
                  <option value="NUTRICIONISTA">Nutricionista</option>
                  <option value="SECRETARIA">Secretária</option>
                </select>
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
        {usuarios.length === 0 ? (
          <div className={styles.empty}>Nenhum usuário cadastrado.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {usuarios.map((u: any) => (
                <tr key={u.id}>
                  <td>{u.nome}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`${styles.badge} ${perfilLabels[u.perfil]?.className || ''}`}>
                      {perfilLabels[u.perfil]?.label || u.perfil}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn} onClick={() => editar(u)}><HugeiconsIcon icon={PencilEdit01Icon} size={16} strokeWidth={2} /></button>
                      <button className={`${styles.actionBtn} ${styles.danger}`}
                        onClick={() => { if (confirm('Excluir usuário?')) excluirMutation.mutate(u.id); }}>
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
