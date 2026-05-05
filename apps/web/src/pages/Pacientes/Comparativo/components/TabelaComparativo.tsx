import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, ViewIcon } from "@hugeicons/core-free-icons";
import styles from "./../ComparativoPage.module.scss";
import { Avaliacao } from "@/services/avaliacao";
import { NavigateFunction } from "react-router-dom";
import { UseMutationResult } from "@tanstack/react-query";
interface TabelaComparativoProps {
  pacienteId: string;
  resultadosFiltrados: Avaliacao[];
  formatarData: (dataISO: string) => string;
  navigate: NavigateFunction;
  handleAbrirModalExcluirAvaliacao: (id: string) => void;
}
export function TabelaComparativo({
  pacienteId,
  resultadosFiltrados,
  formatarData,
  navigate,
  handleAbrirModalExcluirAvaliacao,
}: TabelaComparativoProps) {
  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Data</th>
            <th>Evolução</th>
            <th>Observação</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {resultadosFiltrados?.map((item) => (
            <tr key={item.id}>
              <td>{formatarData(item.dataRealizacao)}</td>
              <td>{item.scoreTotal}</td>
              <td>{item.regraInterpretacao}</td>
              <td>
                <div className={styles.actions}>
                  <button
                    className={`${styles.actionBtn} ${styles.shortcutBtn}`}
                    onClick={() =>
                      navigate(`/avaliacoes/${item.id}/${pacienteId}`)
                    }
                    title="Ver detalhes"
                  >
                    <HugeiconsIcon icon={ViewIcon} size={16} strokeWidth={2} />
                  </button>

                  <button
                    className={`${styles.actionBtn} ${styles.danger}`}
                    onClick={() => handleAbrirModalExcluirAvaliacao(item.id)}
                    title="Excluir"
                  >
                    <HugeiconsIcon
                      icon={Delete02Icon}
                      size={16}
                      strokeWidth={2}
                    />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
