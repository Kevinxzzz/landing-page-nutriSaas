import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@nutricao/shared";
import styles from "./RedefinirSenha.module.scss";
import { esqueciSenha } from "@/services/user";

export function RedefinirSenhaPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordInput) => {
    try {
      esqueciSenha(data.novaSenha);
    } catch (error) {
      console.error("Erro ao enviar link de redefinição:", error);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>NutriSaaS</h1>
        <p className={styles.subtitle}>Altere sua senha.</p>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.field}>
            <label htmlFor="email">Nova senha</label>
            <input
              id="password"
              type="password"
              placeholder="Digite sua nova senha"
              {...register("novaSenha")}
            />
            {errors.novaSenha && (
              <span className={styles.error}>{errors.novaSenha.message}</span>
            )}
          </div>

          <button type="submit" className={styles.submitBtn}>
            Alterar senha
          </button>
        </form>
      </div>
    </div>
  );
}
