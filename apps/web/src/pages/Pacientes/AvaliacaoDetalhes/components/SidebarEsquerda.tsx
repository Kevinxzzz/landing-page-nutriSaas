import { AvaliacaoComRespostas, ModuloAvaliacao } from "@/services/avaliacao";
import styles from "../AvaliacaoDetalhesPage.module.scss";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

interface SidebarEsquerdaProps {
  avaliacao: AvaliacaoComRespostas | null | undefined;
}

export function SidebarEsquerda({ avaliacao }: SidebarEsquerdaProps) {
  function scrollToModulo(id: string) {
    const elemento = document.getElementById(`modulo-${id}`);

    if (elemento) {
      elemento.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }
  return (
    <>
      <p className={styles.sidebarLabel}>Módulos</p>

      {avaliacao?.questionario?.modulos.map((modulo: ModuloAvaliacao) => (
        <button
          key={modulo.nome}
          className={styles.sideNavItem}
          onClick={() => scrollToModulo(modulo.id)}
        >
          <span>{modulo.nome}</span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
        </button>
      ))}
    </>
  );
}
