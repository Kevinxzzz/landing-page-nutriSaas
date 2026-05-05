import { useState } from "react";
import styles from "./AvaliacaoDetalhesPage.module.scss";
import { SidebarEsquerda } from "@/pages/Pacientes/AvaliacaoDetalhes/components/SidebarEsquerda";
import { SidebarDireita } from "@/pages/Pacientes/AvaliacaoDetalhes/components/SideBarDireita";
import { MainAvaliacaoDetalhes } from "./components/MainAvaliacaoDetalhes";
import { HeaderAvaliacaoDetalhes } from "./components/HeaderAvaliacaoDetalhes";
import {
  getAvaliacaoComRespostas,
  DeleteAvaliacao,
} from "@/services/avaliacao";
import { getPacientePorId, type Paciente } from "@/services/pacientes";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal/DeleteConfirmModal";
import { Skeleton } from "@/components/Loading/Skeleton";
import { SkeletonAvaliacaoModules } from "@/components/Loading/skeletons/SkeletonAvaliacaoModules";
import { LoadingError } from "@/components/Loading/LoadingError";
import { EmptyState } from "@/components/Loading/EmptyState";
import { ClipboardIcon } from "@hugeicons/core-free-icons";

export function AvaliacaoDetalhesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { avaliacaoId, pacienteId } = useParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    data: avaliacao,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["avaliacao", avaliacaoId],
    queryFn: async () => {
      const response = await getAvaliacaoComRespostas(avaliacaoId!);
      return response.data ?? null;
    },
    enabled: !!avaliacaoId,
  });
  const { data: paciente, isLoading: isLoadingPaciente } = useQuery({
    queryKey: ["paciente", pacienteId],
    queryFn: async () => {
      const response = await getPacientePorId(pacienteId!);
      return response ?? null;
    },
    enabled: !!pacienteId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => DeleteAvaliacao(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["avaliacao", avaliacaoId] });
      navigate(`/pacientes/${pacienteId}`);
    },
  });

  const isDataMissing = !isLoading && !isError && !avaliacao;

  return (
    <div className={styles.page}>
      <HeaderAvaliacaoDetalhes paciente={paciente} isLoadingPaciente={isLoadingPaciente}/>

      <div className={styles.layout}>
        <aside className={styles.sidebarLeft}>
          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "0 12px" }}>
              <Skeleton width="100%" height="40px" borderRadius="8px" />
              <Skeleton width="100%" height="40px" borderRadius="8px" />
              <Skeleton width="100%" height="40px" borderRadius="8px" />
            </div>
          ) : (
            <SidebarEsquerda avaliacao={avaliacao} />
          )}
        </aside>

        <main>
          {isLoading ? (
            <SkeletonAvaliacaoModules />
          ) : isError ? (
            <LoadingError 
              message="Erro ao carregar detalhes da avaliação." 
              onRetry={() => queryClient.invalidateQueries({ queryKey: ["avaliacao", avaliacaoId] })} 
            />
          ) : isDataMissing ? (
            <EmptyState 
              title="Avaliação não encontrada" 
              description="Não foi possível encontrar os dados desta avaliação." 
              icon={ClipboardIcon} 
            />
          ) : (
            <MainAvaliacaoDetalhes avaliacao={avaliacao ?? null} />
          )}
        </main>

        <aside className={styles.sidebarRight}>
          <SidebarDireita
            deleteMutation={deleteMutation}
            avaliacao={avaliacao}
            paciente={paciente}
            onDeleteClick={() => setIsDeleteModalOpen(true)}
            isLoading={isLoading}
          />
        </aside>
      </div>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (avaliacao?.id) {
            deleteMutation.mutate(avaliacao.id);
          }
        }}
        title="Excluir Avaliação"
        description="Tem certeza que deseja excluir esta avaliação? Essa ação não poderá ser desfeita."
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
