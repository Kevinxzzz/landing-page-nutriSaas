import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  RulerIcon,
  TestTubeIcon,
  ArrowRight01Icon,
  Calendar01Icon,
  Mail01Icon,
  SmartPhone01Icon,
  Location01Icon,
  PencilEdit01Icon,
  ClipboardIcon,
  FileSearchIcon,
  FilePlusIcon,
  FileValidationIcon,
  CheckListIcon,
  GitCompareIcon,
  PlayCircleIcon,
  StopCircleIcon,
  Clock01Icon,
  Calculator01Icon,
  DocumentCodeFreeIcons,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import { Skeleton } from "@/components/Loading/Skeleton";
import { SkeletonObservacao } from "@/components/Loading/skeletons/SkeletonObservacao";
import { EmptyState } from "@/components/Loading/EmptyState";
import { api } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import { EstadoClinicoTimeline } from "./components/EstadoClinicoTimeline";
import { MedidasTab } from "./components/MedidasTab";
import { ExamesTab } from "./components/ExamesTab";
import styles from "./ProntuarioPage.module.scss";
import {
  Avaliacoes,
  Avaliacao,
  AvaliacaoComRespostas,
  getAvaliacoesPorId,
  getAvaliacoesPorPacienteId,
} from "@/services/avaliacao";
import {
  getInterpretacaoScore,
  getClasseCorPorNivel,
} from "@/utils/scoreInterpretacao";
import { LoadingError } from "@/components/Loading/LoadingError";

type View = "atendimento" | "medidas" | "exames";

function getInitials(nome: string): string {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function getAge(dateStr: string): number {
  const birth = new Date(dateStr);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function ProntuarioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [view, setView] = useState<View>("atendimento");
  const [avaliacoesPage, setAvaliacoesPage] = useState(1);
  const [avaliacaoSelecionadaId, setAvaliacaoSelecionadaId] = useState<
    string | null
  >(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerStartedAt, setTimerStartedAt] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Queries ---
  const { 
    data: paciente, 
    isLoading: isLoadingPaciente,
    isError: isErrorPaciente,
    refetch: refetchPaciente
  } = useQuery({
    queryKey: ["paciente", id],
    queryFn: async () => {
      const { data } = await api.get(`/pacientes/${id}`);
      return data.data;
    },
  });

  const { 
    data: avaliacoesResponse, 
    isLoading: isLoadingAvaliacoes,
  } = useQuery({
    queryKey: ["avaliacoes", id, avaliacoesPage],
    queryFn: () => getAvaliacoesPorPacienteId(id!, avaliacoesPage, 20),
    enabled: !!id,
    refetchOnMount: "always",
  });

  const listAvaliacoes = avaliacoesResponse?.data?.data || [];
  const totalPagesAvaliacoes = avaliacoesResponse?.data?.totalPages || 1;


  // Sync avaliacaoSelecionadaId with first item when list loads
  useEffect(() => {
    if (listAvaliacoes.length > 0 && !avaliacaoSelecionadaId) {
      setAvaliacaoSelecionadaId(listAvaliacoes[0].id);
    }
  }, [listAvaliacoes, avaliacaoSelecionadaId]);

  const { 
    data: avaliacaoSelecionadaResponse, 
    isLoading: isLoadingAvaliacaoDetalhe 
  } = useQuery({
    queryKey: ["avaliacao-selecionada", avaliacaoSelecionadaId],
    queryFn: () => getAvaliacoesPorId(avaliacaoSelecionadaId!),
    enabled: !!avaliacaoSelecionadaId,
  });

  const selectedAvaliacao = avaliacaoSelecionadaResponse?.data;

  const startTimer = useCallback(() => {
    setTimerActive(true);
    setTimerStartedAt(new Date());
    setTimerSeconds(0);
  }, []);

  const stopTimer = useCallback(() => {
    setTimerActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // --- Timer ---
  useEffect(() => {
    if (timerActive) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerActive]);

  // Remove global loading, use granular skeletons instead

  const isNutricionista = user?.perfil === "NUTRICIONISTA";

  // Sub-views (Medidas / Exames)
  if (view === "medidas" || view === "exames") {
    return (
      <div>
        <button
          className={styles.backBtn}
          onClick={() => setView("atendimento")}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={2} />
          <span>Voltar ao Prontuário</span>
        </button>
        <div className={styles.subViewHeader}>
          <div className={styles.subViewAvatar}>
            {getInitials(paciente?.nome || "??")}
          </div>
          <div>
            <h2 className={styles.subViewTitle}>
              {view === "medidas" ? "Medidas Corporais" : "Exames"}
            </h2>
            <p className={styles.subViewSubtitle}>{paciente?.nome}</p>
          </div>
        </div>
        {view === "medidas" && <MedidasTab pacienteId={id!} />}
        {view === "exames" && <ExamesTab pacienteId={id!} />}
      </div>
    );
  }

  const endereco = paciente
    ? [
        paciente.endereco,
        paciente.bairro,
        paciente.municipio,
        paciente.uf,
      ]
        .filter(Boolean)
        .join(", ")
    : "";
  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <span className={styles.breadcrumbLink} onClick={() => navigate("/")}>
          Início
        </span>
        <span className={styles.breadcrumbSep}>/</span>
        <span
          className={styles.breadcrumbLink}
          onClick={() => navigate("/pacientes")}
        >
          Pacientes
        </span>
        <span className={styles.breadcrumbSep}>/</span>
        <span className={styles.breadcrumbCurrent}>{paciente?.nome}</span>
      </nav>

      {/* Timer Bar */}
      {isNutricionista && (
        <div
          className={`${styles.timerBar} ${timerActive ? styles.timerBarActive : ""}`}
        >
          <div className={styles.timerLeft}>
            <HugeiconsIcon icon={Clock01Icon} size={18} strokeWidth={2} />
            {timerActive ? (
              <>
                <span className={styles.timerLabel}>
                  Atendimento em andamento
                </span>
                <span className={styles.timerClock}>
                  {formatDuration(timerSeconds)}
                </span>
                {timerStartedAt && (
                  <span className={styles.timerStarted}>
                    Início:{" "}
                    {timerStartedAt.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </>
            ) : (
              <span className={styles.timerLabel}>
                {timerSeconds > 0
                  ? `Último atendimento: ${formatDuration(timerSeconds)}`
                  : "Iniciar atendimento para cronometrar"}
              </span>
            )}
          </div>
          <div className={styles.timerActions}>
            {!timerActive ? (
              <button className={styles.timerStartBtn} onClick={startTimer}>
                <HugeiconsIcon
                  icon={PlayCircleIcon}
                  size={18}
                  strokeWidth={1.8}
                />
                <span>Iniciar Atendimento</span>
              </button>
            ) : (
              <button className={styles.timerStopBtn} onClick={stopTimer}>
                <HugeiconsIcon
                  icon={StopCircleIcon}
                  size={18}
                  strokeWidth={1.8}
                />
                <span>Finalizar</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Layout principal */}
      <div className={styles.layout}>
        {/* Sidebar Esquerda */}
        <aside className={styles.sidebarLeft}>
          <p className={styles.sidebarLabel}>Navegação</p>
          <button
            className={styles.sideNavItem}
            onClick={() => setView("medidas")}
          >
            <div className={styles.sideNavIcon}>
              <HugeiconsIcon icon={RulerIcon} size={16} strokeWidth={1.8} />
            </div>
            <span>Medidas</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={12} strokeWidth={2} />
          </button>
          <button
            className={styles.sideNavItem}
            onClick={() => setView("exames")}
          >
            <div className={styles.sideNavIcon}>
              <HugeiconsIcon icon={TestTubeIcon} size={16} strokeWidth={1.8} />
            </div>
            <span>Exames</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={12} strokeWidth={2} />
          </button>
          <button
            className={styles.sideNavItem}
            onClick={() => navigate(`/pacientes/${id!}/comparativo`)}
          >
            <div className={styles.sideNavIcon}>
              <HugeiconsIcon icon={ClipboardIcon} size={16} strokeWidth={1.8} />
            </div>
            <span>Questionários</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={12} strokeWidth={2} />
          </button>
        </aside>

        {/* Conteúdo Central */}
        <main className={styles.center}>
          <section className={styles.heroCard}>
            {isErrorPaciente ? (
              <LoadingError message="Erro ao carregar paciente" onRetry={refetchPaciente} />
            ) : !isLoadingPaciente && !paciente ? (
              <EmptyState title="Paciente não encontrado" icon={AlertCircleIcon} />
            ) : (
              <>
                <div className={styles.heroTop}>
                  {isLoadingPaciente ? (
                    <Skeleton width="56px" height="56px" borderRadius="14px" />
                  ) : (
                    <div className={styles.avatar}>{getInitials(paciente?.nome || "??")}</div>
                  )}
                  <div className={styles.heroInfo}>
                    <h1 className={styles.heroName}>
                      {isLoadingPaciente ? <Skeleton width="200px" height="24px" /> : paciente?.nome}
                    </h1>
                    <div className={styles.heroBadges}>
                      {isLoadingPaciente ? (
                        <>
                          <Skeleton width="80px" height="20px" borderRadius="100px" />
                          <Skeleton width="80px" height="20px" borderRadius="100px" />
                        </>
                      ) : (
                        <>
                          {paciente?.profissao && (
                            <span className={styles.badge}>{paciente.profissao}</span>
                          )}
                          <span className={styles.badgeConvenio}>
                            {paciente?.convenio?.nome || "Particular"}
                          </span>
                          {paciente?.dataNascimento && (
                            <span className={styles.badgeAge}>
                              {getAge(paciente.dataNascimento)} anos
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  {!isLoadingPaciente && paciente && (
                    <button
                      className={styles.editBtn}
                      onClick={() => navigate(`/pacientes/${id}/editar`)}
                    >
                      <HugeiconsIcon
                        icon={PencilEdit01Icon}
                        size={14}
                        strokeWidth={2}
                      />
                      <span>Editar</span>
                    </button>
                  )}
                </div>

                <div className={styles.heroDetails}>
                  <div className={styles.heroDetail}>
                    <HugeiconsIcon
                      icon={Calendar01Icon}
                      size={15}
                      strokeWidth={1.8}
                    />
                    <span>
                      {isLoadingPaciente ? (
                        <Skeleton width="80px" height="14px" />
                      ) : paciente?.dataNascimento ? (
                        new Date(paciente.dataNascimento).toLocaleDateString("pt-BR")
                      ) : (
                        "Não informada"
                      )}
                    </span>
                  </div>
                  <div className={styles.heroDetail}>
                    <HugeiconsIcon
                      icon={Mail01Icon}
                      size={15}
                      strokeWidth={1.8}
                    />
                    <span>
                      {isLoadingPaciente ? (
                        <Skeleton width="150px" height="14px" />
                      ) : (
                        paciente?.email || "Não informado"
                      )}
                    </span>
                  </div>
                  <div className={styles.heroDetail}>
                    <HugeiconsIcon
                      icon={SmartPhone01Icon}
                      size={15}
                      strokeWidth={1.8}
                    />
                    <span>
                      {isLoadingPaciente ? (
                        <Skeleton width="100px" height="14px" />
                      ) : (
                        paciente?.telefone || "Não informado"
                      )}
                    </span>
                  </div>
                  <div className={styles.heroDetail}>
                    <HugeiconsIcon
                      icon={Location01Icon}
                      size={15}
                      strokeWidth={1.8}
                    />
                    <span>
                      {isLoadingPaciente ? (
                        <Skeleton width="200px" height="14px" />
                      ) : (
                        endereco || "Endereço não informado"
                      )}
                    </span>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* Ações Rápidas */}
          <section className={styles.quickActions}>
            <div className={styles.actionGroup}>
              <p className={styles.actionGroupLabel}>Exames</p>
              <div className={styles.actionBtns}>
                <button
                  className={`${styles.actionBtn} ${styles.actionBlue}`}
                  onClick={() => setView("exames")}
                >
                  <HugeiconsIcon
                    icon={FilePlusIcon}
                    size={13}
                    strokeWidth={2}
                  />
                  Solicitar
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.actionOrange}`}
                  onClick={() => setView("exames")}
                >
                  <HugeiconsIcon
                    icon={FileSearchIcon}
                    size={13}
                    strokeWidth={2}
                  />
                  Solicitados
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.actionGreen}`}
                  onClick={() => setView("exames")}
                >
                  <HugeiconsIcon
                    icon={FileValidationIcon}
                    size={13}
                    strokeWidth={2}
                  />
                  Resultados
                </button>
              </div>
            </div>
          </section>

          {/* Estado Clínico */}
          <section className={styles.clinicalSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Estado Clínico</h2>
              <span className={styles.sectionSubtitle}>
                Histórico de evoluções do paciente
              </span>
            </div>
            <EstadoClinicoTimeline pacienteId={id!} />
          </section>
        </main>

        {/* Sidebar Direita */}
        <aside className={styles.sidebarRight}>
          <div className={styles.rightCard}>
            <h4 className={styles.rightTitle}>Resultados de Questionários</h4>
            <select
              className={styles.rightSelect}
              value={avaliacaoSelecionadaId || ""}
              onChange={(e) => setAvaliacaoSelecionadaId(e.target.value)}
            >
              {listAvaliacoes.length > 0 ? (
                listAvaliacoes.map((av: Avaliacao) => (
                  <option key={av.id} value={av.id}>
                    {new Date(av.dataRealizacao).toLocaleDateString("pt-BR")}
                  </option>
                ))
              ) : (
                <option value="">Selecione um questionário</option>
              )}
            </select>

            {totalPagesAvaliacoes > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', marginBottom: '1rem', fontSize: '0.8rem' }}>
                <button 
                  style={{ border: 'none', background: 'transparent', cursor: avaliacoesPage === 1 ? 'not-allowed' : 'pointer', color: '#6b7280' }}
                  onClick={() => setAvaliacoesPage(p => Math.max(1, p - 1))} 
                  disabled={avaliacoesPage === 1}
                >
                  &laquo; Anterior
                </button>
                <span style={{ color: '#9ca3af' }}>{avaliacoesPage} / {totalPagesAvaliacoes}</span>
                <button 
                  style={{ border: 'none', background: 'transparent', cursor: avaliacoesPage >= totalPagesAvaliacoes ? 'not-allowed' : 'pointer', color: '#6b7280' }}
                  onClick={() => setAvaliacoesPage(p => Math.min(totalPagesAvaliacoes, p + 1))} 
                  disabled={avaliacoesPage >= totalPagesAvaliacoes}
                >
                  Próxima &raquo;
                </button>
              </div>
            )}

            {selectedAvaliacao?.regraInterpretacao && (() => {
              const regras = selectedAvaliacao.questionario?.regras ?? [];
              const { nivel } = getInterpretacaoScore(
                selectedAvaliacao.scoreTotal,
                regras,
              );
              const corClasse = getClasseCorPorNivel(nivel, styles);
              return (
                <div 
                  className={`${styles.observacaoCard} ${corClasse}`} 
                  style={{ 
                    borderColor: isLoadingAvaliacaoDetalhe ? "#e5e7eb" : undefined,
                    background: isLoadingAvaliacaoDetalhe ? "#f9fafb" : undefined,
                    borderLeftColor: isLoadingAvaliacaoDetalhe ? "#e5e7eb" : undefined
                  }}
                >
                  <span className={styles.observacaoLabel}>Observação</span>
                  {isLoadingAvaliacaoDetalhe ? (
                    <SkeletonObservacao />
                  ) : selectedAvaliacao ? (
                    <>
                      <p className={styles.observacaoText}>
                        {selectedAvaliacao.regraInterpretacao}
                      </p>
                      <span className={styles.observacaoScore}>
                        Score: {selectedAvaliacao.scoreTotal}
                      </span>
                    </>
                  ) : (
                    <p className={styles.observacaoText} style={{ color: "#9ca3af", fontStyle: "italic", fontWeight: "normal" }}>
                      {listAvaliacoes.length === 0 ? "Nenhum questionário aplicado" : "Nenhuma observação cadastrada"}
                    </p>
                  )}
                </div>
              );
            })()}

            <div className={styles.sideNavTopic}>
              <div className={styles.sideNavIcon}>
                <HugeiconsIcon
                  icon={Calendar01Icon}
                  size={16}
                  strokeWidth={1.8}
                />
              </div>
              <div className={styles.TopicContent}>
                <div className={styles.topicTitle}>Data</div>
                <div className={styles.topicDescription}>
                  {(isLoadingAvaliacaoDetalhe || isLoadingAvaliacoes) ? (
                    <Skeleton width="80px" height="14px" />
                  ) : selectedAvaliacao?.dataRealizacao ? (
                    new Date(selectedAvaliacao.dataRealizacao).toLocaleDateString("pt-BR")
                  ) : (
                    "Nenhuma selecionada"
                  )}
                </div>
              </div>
            </div>

            {isLoadingAvaliacaoDetalhe || isLoadingAvaliacoes ? (
              <Skeleton width="100%" height="44px" borderRadius="8px" />
            ) : (
              <button
                className={styles.sideNavItem}
                onClick={() => {
                  const idToUse = avaliacaoSelecionadaId;
                  if (idToUse) {
                    navigate(`/avaliacoes/${idToUse}/${id}`);
                  }
                }}
                disabled={!avaliacaoSelecionadaId}
                style={{
                  opacity: !avaliacaoSelecionadaId ? 0.5 : 1,
                }}
              >
                <div className={styles.sideNavIcon}>
                  <HugeiconsIcon
                    icon={ClipboardIcon}
                    size={16}
                    strokeWidth={1.8}
                  />
                </div>
                <span>Ver Respostas</span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={12}
                  strokeWidth={2}
                />
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

{
  /* <aside className={styles.sidebarRight}>
  <div className={styles.rightCard}>
    <h4 className={styles.rightTitle}>Resultados de Questionários</h4>
    <select className={styles.rightSelect}>
      <option>Selecione um questionário</option>
    </select>
    <div className={styles.rightEmpty}>
      <HugeiconsIcon icon={ClipboardIcon} size={32} strokeWidth={1.5} style={{ color: '#d1d5db' }} />
      <p>Nenhum questionário aplicado</p>
      <span>Aplique um questionário durante o atendimento para ver os resultados aqui.</span>
    </div>
  </div>
</aside> */
}
