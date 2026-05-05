import styles from "./../ComparativoPage.module.scss";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar01Icon } from "@hugeicons/core-free-icons";

interface ModalRangeDataComparativoProps {
  handleFecharModal: () => void;

  dataInicio: string;
  setDataInicio: React.Dispatch<React.SetStateAction<string>>;

  dataFim: string;
  setDataFim: React.Dispatch<React.SetStateAction<string>>;

  handleLimparFiltro: () => void;
}

export function ModalRangeDataComparativo({
  handleFecharModal,
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,
  handleLimparFiltro,
}: ModalRangeDataComparativoProps) {
  return (
    <div className={styles.overlay} onClick={handleFecharModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>
            <HugeiconsIcon icon={Calendar01Icon} size={18} strokeWidth={2} />
            Filtrar por intervalo de datas
          </h3>

          <button className={styles.closeBtn} onClick={handleFecharModal}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalInfoText}>
            <p>
              Escolha um intervalo de datas para filtrar as avaliações exibidas
              na tabela e no gráfico.
            </p>
          </div>

          <div className={styles.dateRangeModal}>
            <div className={styles.dateField}>
              <label>Data início</label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>

            <div className={styles.dateField}>
              <label>Data fim</label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button className={styles.actionBtn} onClick={handleLimparFiltro}>
              Limpar filtro
            </button>

            <button className={styles.novoBtn} onClick={handleFecharModal}>
              Aplicar filtro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}