import { HugeiconsIcon } from "@hugeicons/react";
import {
  FileValidationIcon,
  Tick01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import styles from "./DraftConfirmationModal.module.scss";

interface DraftConfirmationModalProps {
  isOpen: boolean;
  updatedAt: string | undefined;
  onContinue: () => void;
  onDiscard: () => void;
}

export function DraftConfirmationModal({
  isOpen,
  updatedAt,
  onContinue,
  onDiscard,
}: DraftConfirmationModalProps) {
  if (!isOpen) return null;

  const dataFormatada = updatedAt
    ? new Date(updatedAt).toLocaleString("pt-BR")
    : "";

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>
            <HugeiconsIcon
              icon={FileValidationIcon}
              size={18}
              strokeWidth={2}
            />
            Questionário em andamento
          </h3>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.infoBox}>
            <p>
              Identificamos que você já iniciou o preenchimento deste
              questionário anteriormente. Deseja continuar de onde parou?
            </p>
            {dataFormatada && (
              <span className={styles.dateInfo}>
                Última alteração: {dataFormatada}
              </span>
            )}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.discardBtn}
            onClick={onDiscard}
          >
            <HugeiconsIcon icon={Delete02Icon} size={16} strokeWidth={2} />
            Descartar e começar do zero
          </button>
          <button
            type="button"
            className={styles.continueBtn}
            onClick={onContinue}
          >
            <HugeiconsIcon icon={Tick01Icon} size={16} strokeWidth={2} />
            Continuar respondendo
          </button>
        </div>
      </div>
    </div>
  );
}
