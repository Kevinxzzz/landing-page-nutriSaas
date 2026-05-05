import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { verifyEmailSchema, type VerifyEmailInput } from "@nutricao/shared";
import styles from "./RedefinirSenha.module.scss";
import { esqueciSenha } from "@/services/user";

export function EsqueciSenhaPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VerifyEmailInput>({
    resolver: zodResolver(verifyEmailSchema),
  });

  const onSubmit = (data: VerifyEmailInput) => {
    try {
      esqueciSenha(data.email);
    } catch (error) {
      console.error("Erro ao enviar link de redefinição:", error);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>NutriSaaS</h1>
        <p className={styles.subtitle}>
          O link de redefinição de senha será enviado para o e-mail informado.
        </p>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.field}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register("email")}
            />
            {errors.email && (
              <span className={styles.error}>{errors.email.message}</span>
            )}
          </div>

          <button type="submit" className={styles.submitBtn}>
            Enviar link de redefinição
          </button>

          <p className={styles.cadastroLink}>
            Ja sabe sua senha? <Link to="/login">Clique aqui</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
