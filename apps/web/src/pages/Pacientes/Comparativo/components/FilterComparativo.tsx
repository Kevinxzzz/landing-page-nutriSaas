import styles from "./../ComparativoPage.module.scss";

interface FilterComparativoProps {
  dataInicio: string;
  setDataInicio: React.Dispatch<React.SetStateAction<string>>;
  dataFim: string;
  setDataFim: React.Dispatch<React.SetStateAction<string>>;
}
export function FilterComparativo({
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,
}: FilterComparativoProps) {
  return (
    <div className={styles.filterRangeInline}>
      <span className={styles.filterTag}>De</span>
      <input
        type="date"
        lang="pt-BR"
        className={styles.filterDateInput}
        value={dataInicio}
        onChange={(e) => setDataInicio(e.target.value)}
        aria-label="Filtrar de"
        title="Data inicial"
      />

      <span className={styles.filterTag}>Até</span>
      <input
        type="date"
        lang="pt-BR"
        className={styles.filterDateInput}
        value={dataFim}
        onChange={(e) => setDataFim(e.target.value)}
        aria-label="Filtrar até"
        title="Data final"
      />
    </div>
  );
}
