import type { RegraInterpretacao } from "@/services/avaliacao";

export type NivelScore = 0 | 1 | 2 | 3;

export interface InterpretacaoScore {
  classificacao: string;
  nivel: NivelScore;
}

const FALLBACK: InterpretacaoScore = {
  classificacao: "Sem classificação",
  nivel: 3,
};

/**
 * Ordena as regras por pontuacaoMin (menor → maior) e atribui um nível
 * baseado na posição: 0 = verde, 1 = amarelo, 2 = laranja, 3 = vermelho.
 * Funciona independente dos intervalos configurados no backend.
 */
export function getInterpretacaoScore(
  score: number,
  regras: RegraInterpretacao[],
): InterpretacaoScore {
  if (!regras || regras.length === 0) return FALLBACK;

  const regrasOrdenadas = [...regras].sort(
    (a, b) => a.pontuacaoMin - b.pontuacaoMin,
  );

  const indice = regrasOrdenadas.findIndex(
    (r) => score >= r.pontuacaoMin && score <= r.pontuacaoMax,
  );

  if (indice === -1) return FALLBACK;

  const total = regrasOrdenadas.length;
  let nivel: NivelScore;

  if (total <= 1) {
    nivel = 0;
  } else if (total === 2) {
    nivel = indice === 0 ? 0 : 3;
  } else if (total === 3) {
    nivel = ([0, 1, 3] as NivelScore[])[indice] ?? 3;
  } else {
    // 4 ou mais regras: distribui uniformemente entre os 4 níveis
    const step = total / 4;
    const rawNivel = Math.floor(indice / step);
    nivel = (Math.min(rawNivel, 3) as NivelScore);
  }

  return {
    classificacao: regrasOrdenadas[indice].classificacao,
    nivel,
  };
}

const NIVEL_PARA_CLASSE: Record<NivelScore, string> = {
  0: "observacaoGreen",
  1: "observacaoYellow",
  2: "observacaoOrange",
  3: "observacaoRed",
};

/**
 * Retorna a classe CSS correta do módulo SCSS para o nível de score dado.
 * Ex: getClasseCorPorNivel(1, styles) → styles.observacaoYellow
 */
export function getClasseCorPorNivel(
  nivel: NivelScore,
  styles: Record<string, string>,
): string {
  return styles[NIVEL_PARA_CLASSE[nivel]] ?? "";
}
