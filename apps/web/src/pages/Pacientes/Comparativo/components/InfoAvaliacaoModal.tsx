import styles from "../ComparativoPage.module.scss";

type FaixaScore = {
  pontuacaoMin: number;
  pontuacaoMax: number;
  classificacao: string;
};

type ExemploCalculo = {
  descricao: string;
  formula: string;
  score: number;
};

interface InfoAvaliacaoModalProps {
  handleFecharModalInfoPontuacao: () => void;
  FAIXAS_SCORE: FaixaScore[];
  EXEMPLOS_CALCULO: ExemploCalculo[];
  getClassificacaoPorScore: (score: number) => string;
}

export function InfoAvaliacaoModal({
  handleFecharModalInfoPontuacao,
  FAIXAS_SCORE,
  EXEMPLOS_CALCULO,
  getClassificacaoPorScore,
}: InfoAvaliacaoModalProps) {
  return (
    <>
      <div
        className={styles.overlay}
        onClick={handleFecharModalInfoPontuacao}
      >
        <div className={styles.infoModal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h3>Como funciona o gráfico de evolução</h3>
            <button
              className={styles.closeBtn}
              onClick={handleFecharModalInfoPontuacao}
            >
              ×
            </button>
          </div>

          <div className={styles.modalBody}>
            <p className={styles.modalSubtitulo}>
              Quanto menor o score total, melhor a evolução do paciente.
            </p>

            <div className={styles.scoreSection}>
              <h4>Como o score é calculado</h4>
              <p>
                Cada resposta do questionário recebe uma nota. No fim, todas as
                notas são somadas para gerar o score total.
              </p>
              <div className={styles.scoreFormula}>
                Score total = nota 1 + nota 2 + nota 3 + ... + nota N
              </div>
              <p>
                Depois da soma, a observação é definida pela faixa de pontuação.
              </p>
            </div>

            <div className={styles.scoreSection}>
              <h4>Faixas de observação (conforme regra do score)</h4>
              <div className={styles.scoreTableWrapper}>
                <table className={styles.scoreTable}>
                  <thead>
                    <tr>
                      <th>Pontuação mínima</th>
                      <th>Pontuação máxima</th>
                      <th>Observação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FAIXAS_SCORE.map((faixa) => (
                      <tr key={`${faixa.pontuacaoMin}-${faixa.pontuacaoMax}`}>
                        <td>{faixa.pontuacaoMin}</td>
                        <td>
                          {faixa.pontuacaoMax === 9999
                            ? ">100"
                            : faixa.pontuacaoMax}
                        </td>
                        <td>{faixa.classificacao}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.scoreSection}>
              <h4>Exemplos de cálculo</h4>
              <div className={styles.scoreExamplesList}>
                {EXEMPLOS_CALCULO.map((exemplo) => (
                  <div
                    key={exemplo.descricao}
                    className={styles.scoreExampleItem}
                  >
                    <strong>{exemplo.descricao}</strong>
                    <p>{exemplo.formula}</p>
                    <p>
                      <strong>Score:</strong> {exemplo.score} -{" "}
                      {getClassificacaoPorScore(exemplo.score)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}