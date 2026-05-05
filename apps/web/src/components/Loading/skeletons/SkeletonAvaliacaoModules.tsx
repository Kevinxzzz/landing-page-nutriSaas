import { Skeleton } from "../Skeleton";
import styles from "../../../pages/Pacientes/AvaliacaoDetalhes/AvaliacaoDetalhesPage.module.scss";

export function SkeletonAvaliacaoModules() {
  return (
    <div className={styles.questionarioWrapper}>
      <section className={styles.instrucoes}>
        <Skeleton width="220px" height="24px" style={{ marginBottom: "16px" }} />
        <div className={styles.legendaGrid}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={styles.legendaItem}>
              <Skeleton width="24px" height="24px" style={{ marginBottom: "4px" }} />
              <Skeleton width="80px" height="14px" />
            </div>
          ))}
        </div>
      </section>

      {[1, 2].map((m) => (
        <section key={m} className={styles.moduloCard}>
          <Skeleton width="250px" height="28px" style={{ marginBottom: "20px" }} />
          <div className={styles.perguntas}>
            {[1, 2, 3].map((p) => (
              <article key={p} className={styles.perguntaItem}>
                <Skeleton width="100%" height="18px" style={{ marginBottom: "12px" }} />
                <div className={styles.notasGrid}>
                  {[0, 1, 2, 3, 4].map((n) => (
                    <Skeleton key={n} width="36px" height="36px" borderRadius="8px" />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
