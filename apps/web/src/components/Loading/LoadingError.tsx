import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, PlayCircleIcon } from "@hugeicons/core-free-icons";
import styles from "./Loading.module.scss";

interface LoadingErrorProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function LoadingError({
  message = "Erro ao carregar os dados.",
  onRetry,
  className = "",
}: LoadingErrorProps) {
  return (
    <div className={`${styles.errorContainer} ${className}`}>
      <HugeiconsIcon icon={AlertCircleIcon} size={32} className={styles.errorIcon} />
      <p className={styles.errorMessage}>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className={styles.retryButton}>
          <HugeiconsIcon icon={PlayCircleIcon} size={16} />
          <span>Tentar novamente</span>
        </button>
      )}
    </div>
  );
}
