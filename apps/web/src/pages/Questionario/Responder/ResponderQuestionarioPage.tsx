import { useMemo, useState, useEffect } from "react";
import axios from "axios";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserGroupIcon, Tick01Icon } from "@hugeicons/core-free-icons";
import {
  buscarQuestionario,
  enviarRespostasQuestionario,
  type RespostaPayload,
} from "@/services/questionarios";
import { buscarNomePacientePublico } from "@/services/pacientes";
import { useDebounce } from "@/hooks/useDebounce";
import { DraftConfirmationModal } from "./components/DraftConfirmationModal";
import styles from "./ResponderQuestionarioPage.module.scss";

const OPCOES_NOTA: Record<number, string> = {
  0: "Nunca ou quase nunca teve esse sintoma",
  1: "Ocasionalmente teve, mas não foi severo",
  2: "Ocasionalmente teve, efeito severo",
  3: "Frequentemente teve, efeito não severo",
  4: "Frequentemente teve, efeito foi severo",
};

export function ResponderQuestionarioPage() {
  const { questionarioId, pacienteId } = useParams<{
    questionarioId: string;
    pacienteId: string;
  }>();

  const [respostas, setRespostas] = useState<Record<string, number>>({});
  const [erroFormulario, setErroFormulario] = useState<string | null>(null);
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [exibirLegendaFlutuante, setExibirLegendaFlutuante] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  // Estados para o Rascunho (Draft)
  const draftKey = `draft_questionario_${questionarioId}_${pacienteId}`;
  const [mostrarModalDraft, setMostrarModalDraft] = useState(false);
  const [draftCarregado, setDraftCarregado] = useState(false);
  const [dataDraft, setDataDraft] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);

  const debouncedRespostas = useDebounce(respostas, 800);

  const {
    data: questionario,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["questionario-publico", questionarioId],
    queryFn: () => buscarQuestionario(questionarioId as string),
    enabled: !!questionarioId,
  });

  const { data: nomePaciente, isLoading: isLoadingNomePaciente } = useQuery({
    queryKey: ["paciente-nome-publico", pacienteId],
    queryFn: () => buscarNomePacientePublico(pacienteId as string),
    enabled: !!pacienteId,
  });

  const perguntas = useMemo(() => {
    if (!questionario) return [];
    return questionario.modulos
      .sort((a, b) => a.ordem - b.ordem)
      .flatMap((modulo) =>
        modulo.perguntas
          .sort((a, b) => a.ordem - b.ordem)
          .map((pergunta) => ({
            ...pergunta,
            moduloId: modulo.id,
          })),
      );
  }, [questionario]);

  const opcoesNota = useMemo(() => {
    const labelsDinamicos = questionario?.labelEscolha
      ?.slice()
      .sort((a, b) => a.nota - b.nota)
      .reduce<Record<number, string>>((acc, item) => {
        acc[item.nota] = item.label;
        return acc;
      }, {});

    if (!labelsDinamicos || Object.keys(labelsDinamicos).length === 0) {
      return OPCOES_NOTA;
    }

    return labelsDinamicos;
  }, [questionario?.labelEscolha]);

  const notasDisponiveis = useMemo(
    () =>
      Object.keys(opcoesNota)
        .map(Number)
        .sort((a, b) => a - b),
    [opcoesNota],
  );

  const totalPerguntas = perguntas.length;
  const totalRespondidas = Object.keys(respostas).length;
  const progressoPorcentagem =
    totalPerguntas > 0 ? (totalRespondidas / totalPerguntas) * 100 : 0;

  const mutation = useMutation({
    mutationFn: (payload: RespostaPayload[]) =>
      enviarRespostasQuestionario(
        pacienteId as string,
        questionarioId as string,
        payload,
      ),
    onSuccess: (response) => {
      // Limpa rascunho após sucesso
      localStorage.removeItem(draftKey);
      setErroFormulario(null);
      setMensagemSucesso(
        response?.message || "Questionário preenchido com sucesso",
      );
    },
    onError: (error: unknown) => {
      let errorMessage = "Erro ao enviar. Tente novamente.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      setErroFormulario(errorMessage);
    },
  });

  // 1. Carregar rascunho ao montar componente
  useEffect(() => {
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.respostas && Object.keys(parsed.respostas).length > 0) {
          setDataDraft(parsed.updatedAt);
          setMostrarModalDraft(true);
        }
      } catch (e) {
        console.error("Erro ao carregar rascunho", e);
      }
    }
    setDraftCarregado(true);
  }, [draftKey]);

  // 2. Salvar rascunho automaticamente (Debounce)
  useEffect(() => {
    // Só salva se o formulário já foi "iniciado" ou recuperado,
    // para evitar sobrescrever com um state vazio no mount
    if (!draftCarregado || Object.keys(debouncedRespostas).length === 0) return;

    const saveDraft = () => {
      setIsSaving(true);
      const draft = {
        respostas: debouncedRespostas,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(draftKey, JSON.stringify(draft));

      // Simulando um tempo de feedback visual
      setTimeout(() => setIsSaving(false), 600);
    };

    saveDraft();
  }, [debouncedRespostas, draftKey, draftCarregado]);

  function handleContinuarDraft() {
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setRespostas(parsed.respostas);
      } catch (e) {
        console.error("Erro ao recuperar rascunho", e);
      }
    }
    setMostrarModalDraft(false);
  }

  function handleDescartarDraft() {
    localStorage.removeItem(draftKey);
    setRespostas({});
    setMostrarModalDraft(false);
  }

  function handleSelecionarNota(perguntaId: string, nota: number) {
    setErroFormulario(null);
    setRespostas((prev) => ({ ...prev, [perguntaId]: nota }));
  }

  function handleSubmit() {
    setTentouEnviar(true);

    if (totalRespondidas < totalPerguntas) {
      setErroFormulario(
        "Por favor, responda todas as questões antes de finalizar.",
      );

      // Encontra a primeira pergunta não respondida
      const primeiraFaltante = perguntas.find(
        (p) => respostas[p.id] === undefined,
      );

      if (primeiraFaltante) {
        const elemento = document.getElementById(
          `pergunta-${primeiraFaltante.id}`,
        );
        elemento?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const payload: RespostaPayload[] = perguntas.map((p) => ({
      perguntaId: p.id,
      nota: respostas[p.id],
    }));

    mutation.mutate(payload);
  }

  if (isLoading)
    return (
      <main className={styles.page}>
        <div className={styles.header}>
          <h1>Carregando...</h1>
        </div>
      </main>
    );
  if (isError || !questionario)
    return (
      <main className={styles.page}>
        <div className={styles.header}>
          <h1>Erro ao carregar questionário</h1>
        </div>
      </main>
    );

  if (mensagemSucesso)
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <section className={styles.sucessoCard}>
            <h1>{mensagemSucesso}</h1>
            <p>Você já pode fechar o site.</p>
          </section>
        </div>
      </main>
    );

  const progresso = progressoPorcentagem.toFixed(0);

  return (
    <main className={styles.page}>
      {/* BOTÃO FLUTUANTE */}
      <div className={styles.fabWrapper}>
        {exibirLegendaFlutuante && (
          <div className={styles.popover}>
            <h4>Significado das Notas:</h4>
            <ul>
              {Object.entries(opcoesNota).map(([n, t]) => (
                <li key={n}>
                  <strong>{n}:</strong> {t}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          className={styles.fabButton}
          onClick={() => setExibirLegendaFlutuante(!exibirLegendaFlutuante)}
        >
          {exibirLegendaFlutuante ? "×" : "?"}
        </button>
      </div>

      <div className={styles.container}>
        {/* Modal de Recuperação de Rascunho */}
        <DraftConfirmationModal
          isOpen={mostrarModalDraft}
          updatedAt={dataDraft}
          onContinue={handleContinuarDraft}
          onDiscard={handleDescartarDraft}
        />
        <header className={styles.header}>
          <div className={styles.headerGrid}>
            <div className={styles.headerMain}>
              <div className={styles.headerTitleRow}>
                <span className={styles.headerTag}>Questionário</span>
                {Object.keys(respostas).length > 0 && (
                  <div
                    className={`${styles.saveStatus} ${isSaving ? styles.saving : ""}`}
                  >
                    {isSaving ? (
                      "Salvando..."
                    ) : (
                      <>
                        <HugeiconsIcon
                          icon={Tick01Icon}
                          size={14}
                          strokeWidth={2.5}
                        />{" "}
                        Salvo
                      </>
                    )}
                  </div>
                )}
              </div>
              <h1>{questionario?.nome}</h1>
              <p>
                Avaliação de Hipersensibilidades - Versão {questionario?.versao}
              </p>
            </div>

            <div className={styles.pacienteCard}>
              <span className={styles.pacienteCardIcon}>
                <HugeiconsIcon
                  icon={UserGroupIcon}
                  size={16}
                  strokeWidth={1.9}
                />
              </span>
              <div className={styles.pacienteCardText}>
                <span className={styles.pacienteCardLabel}>Paciente</span>
                <strong className={styles.pacienteCardName}>
                  {isLoadingNomePaciente
                    ? "Carregando paciente..."
                    : nomePaciente || "Paciente não identificado"}
                </strong>
              </div>
            </div>
          </div>
        </header>

        {/* SUMÁRIO ESTÁTICO RESTAURADO */}
        <section className={styles.instrucoes}>
          <h3>Instruções de Preenchimento</h3>
          <div className={styles.legendaGrid}>
            {Object.entries(opcoesNota).map(([nota, texto]) => (
              <div key={nota} className={styles.legendaItem}>
                <strong>{nota}</strong>
                <span>{texto}</span>
              </div>
            ))}
          </div>
          <p className={styles.avisoFab}>
            💡 <strong>Dica:</strong> Se esquecer as notas durante o
            preenchimento, basta clicar no botão no canto da tela
            <button
              className={styles.fabButton}
              style={{ width: "30px", height: "30px", fontSize: "16px" }}
            >
              ?
            </button>{" "}
            {/* verde no canto da tela. */}
          </p>
        </section>

        <div className={styles.stickyProgress}>
          <span>Progresso</span>
          <div className={styles.progressBar}>
            <div className={styles.fill} style={{ width: `${progresso}%` }} />
          </div>
          <span>
            {totalRespondidas}/{totalPerguntas}
          </span>
        </div>

        {questionario.modulos
          .sort((a, b) => a.ordem - b.ordem)
          .map((modulo) => (
            <section key={modulo.id} className={styles.moduloCard}>
              <h2>{modulo.nome}</h2>
              <div className={styles.perguntas}>
                {modulo.perguntas
                  .sort((a, b) => a.ordem - b.ordem)
                  .map((pergunta) => {
                    const respondida = respostas[pergunta.id] !== undefined;
                    const mostrarErro = tentouEnviar && !respondida;

                    return (
                      <article
                        key={pergunta.id}
                        id={`pergunta-${pergunta.id}`}
                        className={`${styles.perguntaItem} ${mostrarErro ? styles.perguntaIncompleta : ""}`}
                      >
                        {mostrarErro && (
                          <div className={styles.avisoErro}>
                            <span className={styles.exclamacao}>!</span>
                            Esta pergunta é obrigatória
                          </div>
                        )}

                        <p className={styles.perguntaTexto}>
                          {pergunta.descricao}
                        </p>

                        <div className={styles.notasGrid}>
                          {notasDisponiveis.map((nota) => {
                            return (
                              <label
                                key={`${pergunta.id}-${nota}`}
                                className={styles.notaLabel}
                              >
                                <input
                                  type="radio"
                                  name={`pergunta-${pergunta.id}`}
                                  value={nota}
                                  checked={respostas[pergunta.id] === nota}
                                  onChange={() =>
                                    handleSelecionarNota(pergunta.id, nota)
                                  }
                                />
                                <div className={styles.circle}>{nota}</div>
                              </label>
                            );
                          })}
                        </div>
                      </article>
                    );
                  })}
              </div>
            </section>
          ))}

        <footer className={styles.footer}>
          {erroFormulario && (
            <div className={styles.apiError}>{erroFormulario}</div>
          )}

          <button
            type="button"
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Enviando..." : "Finalizar Questionário"}
          </button>
        </footer>
      </div>
    </main>
  );
}
