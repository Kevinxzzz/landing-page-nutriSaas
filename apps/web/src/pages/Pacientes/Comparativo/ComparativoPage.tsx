import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ComparativoPage.module.scss";
import { HeaderComparativo } from "./components/HeaderComparativo";
import { buscarNomePacientePublico } from "@/services/pacientes";
import {
  getAvaliacoesPorPacienteId,
  DeleteAvaliacao,
  type RegraInterpretacao,
  type Avaliacao,
} from "@/services/avaliacao";
import type { ApiResponse, PaginatedResponse } from "@nutricao/shared";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GraficoComparativo } from "./components/GraficoComparativo";
import { FilterComparativo } from "./components/FilterComparativo";
import { TabelaComparativo } from "./components/TabelaComparativo";
import { InfoAvaliacaoModal } from "./components/InfoAvaliacaoModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal/DeleteConfirmModal";
import {
  getInterpretacaoScore,
} from "@/utils/scoreInterpretacao";
import { Skeleton } from "@/components/Loading/Skeleton";
import { SkeletonTable } from "@/components/Loading/skeletons/SkeletonTable";
import { LoadingError } from "@/components/Loading/LoadingError";
import { EmptyState } from "@/components/Loading/EmptyState";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ClipboardIcon,
} from "@hugeicons/core-free-icons";

const EXEMPLOS_CALCULO = [
  {
    descricao: "Exemplo 1 (baixo score)",
    formula: "0 + 1 + 2 + 1 + 0 + 1 + 0 + 1 + 2 + 1 = 9",
    score: 9,
  },
  {
    descricao: "Exemplo 2 (faixa intermediária)",
    formula: "3 + 4 + 3 + 2 + 4 + 3 + 4 + 3 + 4 + 4 = 34",
    score: 34,
  },
  {
    descricao: "Exemplo 3 (score elevado)",
    formula: "4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 = 48",
    score: 48,
  },
  {
    descricao: "Exemplo 4 (score muito alto)",
    formula: "28 perguntas x nota 4 = 112",
    score: 112,
  },
];

function getDataAtualInput() {
  const hoje = new Date();
  const hojeLocal = new Date(hoje.getTime() - hoje.getTimezoneOffset() * 60000);
  return hojeLocal.toISOString().slice(0, 10);
}

export function ComparativoPage() {
  const navigate = useNavigate();
  const { pacienteId } = useParams();
  const queryClient = useQueryClient();

  const [dataInicio, setDataInicio] = useState<string>("");
  const [dataFim, setDataFim] = useState<string>(() => getDataAtualInput());
  const [page, setPage] = useState(1);
  const limit = 20;

  const [modalInfoPontuacaoAberto, setModalInfoPontuacaoAberto] =
    useState(false);
  const [excluirAvaliacaoModalAberto, setExcluirAvaliacaoModalAberto] =
    useState(false);
  const [avaliacaoIdParaExcluir, setAvaliacaoIdParaExcluir] =
    useState<string>("");

  const { data: nomePaciente, isLoading: isLoadingNome } = useQuery({
    queryKey: ["paciente-nome-publico", pacienteId],
    queryFn: () => buscarNomePacientePublico(pacienteId!),
    enabled: !!pacienteId,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { 
    data: avaliacoesResponse,
    isLoading: isLoadingAvaliacoes,
    isError: isErrorAvaliacoes,
    refetch: refetchAvaliacoes
  } = useQuery({
    queryKey: ["avaliacoes", pacienteId, page, limit],
    queryFn: () => getAvaliacoesPorPacienteId(pacienteId!, page, limit),
    enabled: !!pacienteId,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

  const deleteAvaliacaoMutation = useMutation({
    mutationFn: (id: string) => DeleteAvaliacao(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["avaliacoes", pacienteId] });
      const previousData = queryClient.getQueryData<ApiResponse<PaginatedResponse<Avaliacao>>>([
        "avaliacoes",
        pacienteId,
        "full",
      ]);

      queryClient.setQueryData(
        ["avaliacoes", pacienteId],
        (old: ApiResponse<PaginatedResponse<Avaliacao>> | undefined) => {
          if (!old || !old.data || !old.data.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              data: old.data.data.filter((avaliacao) => avaliacao.id != id),
            }
          };
        },
      );

      return { previousData };
    },
    onSuccess: () => {
      setExcluirAvaliacaoModalAberto(false);
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(
        ["avaliacoes", pacienteId, "full"],
        context?.previousData,
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["avaliacoes", pacienteId] });
    },
  });

  const paginatedData = avaliacoesResponse?.data;
  const avaliacoes = paginatedData?.data || [];
  const totalPages = paginatedData?.totalPages || 1;

  const formatarData = (dataISO: string) => {
    return new Date(dataISO).toLocaleDateString("pt-BR");
  };

  const resultadosFiltrados = avaliacoes.filter((avaliacao) => {
    const data = avaliacao.dataRealizacao.slice(0, 10);
    const inicioOk = !dataInicio || data >= dataInicio;
    const fimOk = !dataFim || data <= dataFim;
    return inicioOk && fimOk;
  });


  const regrasDoQuestionario: RegraInterpretacao[] =
    avaliacoes[0]?.questionario?.regras ?? [];

  const parseDateInput = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const handleAbrirModalInfoPontuacao = () => {
    setModalInfoPontuacaoAberto(true);
  };

  const handleFecharModalInfoPontuacao = () => {
    setModalInfoPontuacaoAberto(false);
  };

  const handleAbrirModalExcluirAvaliacao = (id: string) => {
    setExcluirAvaliacaoModalAberto(true);
    setAvaliacaoIdParaExcluir(id);
  };

  const handleFecharModalExcluirAvaliacao = () => {
    setExcluirAvaliacaoModalAberto(false);
  };

  const graficoDados = resultadosFiltrados
    .slice()
    .sort(
      (a, b) =>
        new Date(a.dataRealizacao).getTime() -
        new Date(b.dataRealizacao).getTime(),
    )
    .map((item) => ({
      data: formatarData(item.dataRealizacao),
      score: item.scoreTotal,
    }));

  return (
    <div>
      <HeaderComparativo nomePaciente={nomePaciente} isLoadingNome={isLoadingNome}/>
      <div className={styles.chartContainer}>
        {isLoadingAvaliacoes ? (
          <div className={styles.chartGraphic}>
            <Skeleton width="100%" height="300px" borderRadius="12px" />
          </div>
        ) : isErrorAvaliacoes ? (
          <LoadingError 
            message="Erro ao carregar dados do gráfico." 
            onRetry={() => refetchAvaliacoes()} 
          />
        ) : (
          <div className={styles.chartGraphic}>
            <GraficoComparativo
              graficoDados={graficoDados}
              onInfoClick={handleAbrirModalInfoPontuacao}
            />
          </div>
        )}
      </div>

      <div className={styles.header}>
        <FilterComparativo
          dataInicio={dataInicio}
          setDataInicio={setDataInicio}
          dataFim={dataFim}
          setDataFim={setDataFim}
        />
      </div>

      <div className={styles.container}>
        {isLoadingAvaliacoes ? (
          <SkeletonTable />
        ) : isErrorAvaliacoes ? (
          <LoadingError 
            message="Erro ao carregar histórico de avaliações." 
            onRetry={() => refetchAvaliacoes()} 
          />
        ) : resultadosFiltrados.length === 0 ? (
          <EmptyState 
            title={avaliacoes.length === 0 ? "Não há avaliações para comparação" : "Nenhum resultado no período selecionado"} 
            description={avaliacoes.length === 0 ? "Aplique pelo menos uma avaliação para ver o comparativo aqui." : "Tente ajustar os filtros de data acima."}
            icon={ClipboardIcon} 
          />
        ) : (
          <TabelaComparativo
            pacienteId={pacienteId!}
            resultadosFiltrados={resultadosFiltrados}
            formatarData={formatarData}
            navigate={navigate}
            handleAbrirModalExcluirAvaliacao={handleAbrirModalExcluirAvaliacao}
          />
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <button
            className={styles.paginationBtn}
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            title="Anterior"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} />
          </button>

          <span className={styles.paginationText}>
            {page} de {totalPages}
          </span>

          <button
            className={styles.paginationBtn}
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            title="Próxima"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} />
          </button>
        </div>
      )}

      {modalInfoPontuacaoAberto && (
        <div
          className={styles.overlay}
          onClick={handleFecharModalInfoPontuacao}
        >
          <div
            className={styles.infoModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Como funciona o gráfico de evolução</h3>
              <button
                className={styles.closeBtn}
                onClick={handleFecharModalInfoPontuacao}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.modalSubtitulo}>
                Quanto menor o score total, melhor a evolução do paciente.
              </p>

              <div className={styles.scoreSection}>
                <h4>Como o score é calculado</h4>
                <p>
                  Cada resposta do questionário recebe uma nota. No fim, todas
                  as notas são somadas para gerar o score total.
                </p>
                <div className={styles.scoreFormula}>
                  Score total = nota 1 + nota 2 + nota 3 + ... + nota N
                </div>
                <p>
                  Depois da soma, a observação é definida pela faixa de
                  pontuação.
                </p>
              </div>

              <div className={styles.scoreSection}>
                <h4>Faixas de observação (conforme regra do score)</h4>
                {regrasDoQuestionario.length === 0 ? (
                  <p className={styles.modalSubtitulo}>
                    Nenhuma avaliação disponível para exibir as faixas.
                  </p>
                ) : (
                  <div className={styles.scoreTableWrapper}>
                    <table className={styles.scoreTable}>
                      <thead>
                        <tr>
                          <th>Pontuação mínima</th>
                          <th>Pontuação máxima</th>
                          <th>Observação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...regrasDoQuestionario]
                          .sort((a, b) => a.pontuacaoMin - b.pontuacaoMin)
                          .map((regra) => (
                            <tr key={`${regra.pontuacaoMin}-${regra.pontuacaoMax}`}>
                              <td>{regra.pontuacaoMin}</td>
                              <td>{regra.pontuacaoMax}</td>
                              <td>{regra.classificacao}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className={styles.scoreSection}>
                <h4>Exemplos de cálculo</h4>
                <div className={styles.scoreExamplesList}>
                  {EXEMPLOS_CALCULO.map((exemplo) => {
                    const { classificacao } = getInterpretacaoScore(
                      exemplo.score,
                      regrasDoQuestionario,
                    );
                    return (
                      <div
                        key={exemplo.descricao}
                        className={styles.scoreExampleItem}
                      >
                        <strong>{exemplo.descricao}</strong>
                        <p>{exemplo.formula}</p>
                        <p>
                          <strong>Score:</strong> {exemplo.score} –{" "}
                          {classificacao}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* {modalInfoPontuacaoAberto && (
  <InfoAvaliacaoModal
    handleFecharModalInfoPontuacao={handleFecharModalInfoPontuacao}
    FAIXAS_SCORE={FAIXAS_SCORE}
    EXEMPLOS_CALCULO={EXEMPLOS_CALCULO}
    getClassificacaoPorScore={getClassificacaoPorScore}
  />
)} */}
      <DeleteConfirmModal
        isOpen={excluirAvaliacaoModalAberto}
        onClose={handleFecharModalExcluirAvaliacao}
        onConfirm={() => deleteAvaliacaoMutation.mutate(avaliacaoIdParaExcluir)}
        title="Excluir Avaliação"
        description="Tem certeza que deseja excluir esta avaliação?"
        isPending={deleteAvaliacaoMutation.isPending}
      />
    </div>
  );
}
