import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { loginSchema, type LoginInput } from '@nutricao/shared';
import { useLogin } from '@/hooks/useAuth';
import styles from './LoginPage.module.scss';

export function LoginPage() {
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    login(data);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Nutrição</h1>
        <p className={styles.subtitle}>Acesse sua conta</p>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className={styles.apiError}>
              {(error as any).response?.data?.message || 'Erro ao fazer login'}
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register('email')}
            />
            {errors.email && (
              <span className={styles.error}>{errors.email.message}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="Sua senha"
              {...register('senha')}
            />
            {errors.senha && (
              <span className={styles.error}>{errors.senha.message}</span>
            )}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isPending}>
            {isPending ? 'Acessando...' : 'Acessar'}
          </button>

          <p className={styles.cadastroLink}>
            Não tem conta? <Link to="/cadastro">Cadastre sua clínica</Link>
          </p>
            <p className={styles.cadastroLink}>
              <Link to="/esqueci-senha">Esqueci minha senha</Link>
            </p>
        </form>
      </div>
    </div>
  );
}
