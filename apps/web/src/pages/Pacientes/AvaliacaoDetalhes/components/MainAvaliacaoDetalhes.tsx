import { AvaliacaoComRespostas } from "@/services/avaliacao";
import styles from "../AvaliacaoDetalhesPage.module.scss";

interface MainAvaliacaoDetalhesProps {
  avaliacao: AvaliacaoComRespostas | null;
}
export function MainAvaliacaoDetalhes({
  avaliacao,
}: MainAvaliacaoDetalhesProps) {
  return (
    <>
      <div className={styles.questionarioWrapper}>
        <section className={styles.instrucoes}>
          <h3>Instruções de Interpretação</h3>

          <div className={styles.legendaGrid}>
            {avaliacao?.questionario?.labelEscolha.map((item) => (
              <div key={item.nota} className={styles.legendaItem}>
                <strong>{item.nota}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {avaliacao?.questionario?.modulos.map((modulo: any) => (
          <section
            key={modulo.nome}
            className={styles.moduloCard}
            id={`modulo-${modulo.id}`}
          >
            <h2>{modulo.nome}</h2>

            <div className={styles.perguntas}>
              {modulo.perguntas.map((p: any, index: number) => (
                <article key={index} className={styles.perguntaItem}>
                  <p className={styles.perguntaTexto}>{p.descricao}</p>

                  <div className={styles.notasGrid}>
                    {[0, 1, 2, 3, 4].map((nota) => (
                      <div
                        key={nota}
                        className={`${styles.notaBox} ${
                          p.respostas[0]?.nota === nota
                            ? styles.notaSelecionada
                            : ""
                        }`}
                      >
                        {nota}
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
