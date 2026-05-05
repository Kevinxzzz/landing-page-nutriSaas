import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { HugeiconsIcon } from "@hugeicons/react";
import { GitCommitHorizontalIcon } from "@hugeicons/core-free-icons";
import styles from "./../ComparativoPage.module.scss";

interface graficoData {
  data: string;
  score: number;
}

interface graficoComparativoProps {
  graficoDados: graficoData[];
  onInfoClick: () => void;
}

export function GraficoComparativo({
  graficoDados,
  onInfoClick,
}: graficoComparativoProps) {
  return (
    <>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={graficoDados}
          margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="4 4" opacity={0.3} />

          <XAxis dataKey="data" tick={{ fontSize: 12 }} tickMargin={10} />

          <YAxis tick={{ fontSize: 12 }} tickMargin={10} domain={[0, 140]} />

          <Tooltip
            cursor={{ strokeDasharray: "4 4" }}
            contentStyle={{
              background: "#111827",
              borderRadius: 10,
              border: "1px solid #374151",
              color: "#fff",
              padding: "10px 12px",
            }}
            labelStyle={{ color: "#fff", fontWeight: 600 }}
            formatter={(value) => [`${value} pontos`, "Evolução"]}
          />

          <Legend
            verticalAlign="top"
            align="left"
            content={() => (
              <div className={styles.chartLegend}>
                <div className={styles.chartLegendLeft}>
                  <span className={styles.chartLegendIcon}>
                    <HugeiconsIcon
                      icon={GitCommitHorizontalIcon}
                      size={18}
                      strokeWidth={2}
                    />
                  </span>
                  <span className={styles.chartLegendLabel}>Evolução</span>
                </div>

                <button
                  type="button"
                  className={styles.infoButton}
                  onClick={onInfoClick}
                  title="Entenda como a pontuação funciona"
                  aria-label="Mostrar explicação da pontuação"
                >
                  i
                </button>
              </div>
            )}
          />

          <Line
            type="monotone"
            dataKey="score"
            name="Evolução"
            stroke="#29f172"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
