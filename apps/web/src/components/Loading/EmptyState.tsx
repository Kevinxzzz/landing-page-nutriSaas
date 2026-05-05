import { HugeiconsIcon } from "@hugeicons/react";
import { type HugeiconsProps } from "@hugeicons/react";
import styles from "./Loading.module.scss";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: HugeiconsProps["icon"];
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`${styles.emptyContainer} ${className}`}>
      {icon && <HugeiconsIcon icon={icon} size={40} className={styles.emptyIcon} />}
      <p className={styles.emptyTitle}>{title}</p>
      {description && <p className={styles.emptyDescription}>{description}</p>}
    </div>
  );
}
