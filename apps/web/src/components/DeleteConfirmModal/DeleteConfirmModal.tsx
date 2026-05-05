import React from "react";
import styles from "./DeleteConfirmModal.module.scss";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  isPending?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar Exclusão",
  isPending = false,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.excluirOverlay} onClick={onClose}>
      <div
        className={styles.excluirModal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.excluirHeader}>
          <div className={styles.excluirHeaderTitle}>
            <div className={styles.excluirIcon}>!</div>
            <h3>{title}</h3>
          </div>

          <button 
            className={styles.excluirCloseBtn} 
            onClick={onClose}
            disabled={isPending}
          >
            ✕
          </button>
        </div>

        <div className={styles.excluirBody}>
          <p className={styles.excluirDescricao}>{description}</p>

          <p className={styles.excluirAviso}>
            Essa ação <strong>não pode ser desfeita</strong>.
          </p>
        </div>

        <div className={styles.excluirFooter}>
          <button
            type="button"
            className={styles.excluirCancelBtn}
            onClick={onClose}
            disabled={isPending}
          >
            Cancelar
          </button>

          <button
            type="button"
            className={styles.excluirConfirmBtn}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Excluindo..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
