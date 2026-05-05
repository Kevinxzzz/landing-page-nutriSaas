import styles from "../ComparativoPage.module.scss";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/Loading/Skeleton";

interface HeaderComparativoProps {
  nomePaciente?: string;
  isLoadingNome: boolean;
}

export function HeaderComparativo({ nomePaciente, isLoadingNome }: HeaderComparativoProps) {
  const nome = nomePaciente || "Paciente não identificado";
  const navigate = useNavigate();

  function getInitials(nome: string): string {
    return nome
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  return (
    <>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={2} />
        <span>Voltar ao Prontuário</span>
      </button>

      <div className={styles.subViewHeader}>
        {isLoadingNome || !nomePaciente ? (
          <Skeleton width="40px" height="40px" borderRadius="50%" />
        ) : (
          <div className={styles.subViewAvatar}>{getInitials(nome)}</div>
        )}
        <div>
          <h2 className={styles.subViewTitle}>Questionários</h2>
          <p className={styles.subViewSubtitle}>{nome}</p>
        </div>
      </div>
    </>
  );
}
