import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlusSignIcon,
  PencilEdit01Icon,
  Delete02Icon,
  CheckListIcon,
} from "@hugeicons/core-free-icons";
import { listarPacientes } from "@/services/pacientes";
import { api } from "@/services/api";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuthStore } from "@/stores/authStore";
import { QuestionarioSelectorModal } from "@/components/QuestionarioSelectorModal/QuestionarioSelectorModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal/DeleteConfirmModal";
import styles from "./PacientesPage.module.scss";

type PacienteSelecionado = {
  id: string;
  nome: string;
};

export function PacientesPage() {
  const [busca, setBusca] = useState("");
  const [modalQuestionariosAberto, setModalQuestionariosAberto] =
    useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] =
    useState<PacienteSelecionado | null>(null);
  const [pacienteIdExcluir, setPacienteIdExcluir] = useState<string | null>(
    null,
  );
  const [isExcluirModalOpen, setIsExcluirModalOpen] = useState(false);
  const buscaDebounced = useDebounce(busca);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const perfil = (user?.perfil || "").toUpperCase();
  const podeCadastrarDefault = perfil === "ADMIN" || perfil === "NUTRICIONISTA";
  const isSecretaria = perfil === "SECRETARIA";

  const { data, isLoading } = useQuery({
    queryKey: ["pacientes", buscaDebounced],
    queryFn: () => listarPacientes(buscaDebounced || undefined),
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/pacientes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pacientes"] });
      setIsExcluirModalOpen(false);
      setPacienteIdExcluir(null);
    },
  });

  function handleDelete(paciente: PacienteSelecionado) {
    setPacienteIdExcluir(paciente.id);
    setPacienteSelecionado(paciente);
    setIsExcluirModalOpen(true);
  }

  function handleConfirmDelete() {
    if (pacienteIdExcluir) {
      excluirMutation.mutate(pacienteIdExcluir);
    }
  }

  function handleCancelDelete() {
    setIsExcluirModalOpen(false);
    setPacienteIdExcluir(null);
  }

  function handleAbrirQuestionarios(paciente: PacienteSelecionado) {
    setPacienteSelecionado(paciente);
    setModalQuestionariosAberto(true);
  }

  function handleFecharModalQuestionarios() {
    setModalQuestionariosAberto(false);
    setPacienteSelecionado(null);
  }

  const pacientes = data?.data || [];

  return (
    <div>
      <div className={styles.header}>
        <input
          type="text"
          className={styles.searchBox}
          placeholder="Buscar por nome, e-mail ou telefone..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button
          className={styles.novoBtn}
          onClick={() => navigate("/pacientes/novo")}
        >
          <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2} /> Novo
          Paciente
        </button>
      </div>

      <div className={styles.container}>
        {isLoading ? (
          <div className={styles.empty}>Carregando...</div>
        ) : pacientes.length === 0 ? (
          <div className={styles.empty}>Nenhum paciente encontrado.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Convênio</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span
                      className={styles.nomeLink}
                      onClick={() => navigate(`/pacientes/${p.id}`)}
                    >
                      {p.nome}
                    </span>
                  </td>
                  <td>{p.email || "-"}</td>
                  <td>{p.telefone || "-"}</td>
                  <td>{p.convenio?.nome || "Particular"}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.actionBtn} ${styles.shortcutBtn}`}
                        onClick={() =>
                          handleAbrirQuestionarios({ id: p.id, nome: p.nome })
                        }
                        title="Aplicar questionário"
                      >
                        <HugeiconsIcon
                          icon={CheckListIcon}
                          size={14}
                          strokeWidth={2}
                        />
                        {/* Questionários */}
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() => navigate(`/pacientes/${p.id}/editar`)}
                        title="Editar"
                      >
                        <HugeiconsIcon
                          icon={PencilEdit01Icon}
                          size={16}
                          strokeWidth={2}
                        />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.danger}`}
                        onClick={() => handleDelete({ id: p.id, nome: p.nome })}
                        title="Excluir"
                      >
                        <HugeiconsIcon
                          icon={Delete02Icon}
                          size={16}
                          strokeWidth={2}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={isExcluirModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Excluir paciente"
        description={`Tem certeza que deseja excluir o paciente ${pacienteSelecionado?.nome}? Essa ação não poderá ser desfeita.`}
        isPending={excluirMutation.isPending}
      />

      <QuestionarioSelectorModal
        open={modalQuestionariosAberto}
        paciente={pacienteSelecionado}
        onClose={handleFecharModalQuestionarios}
        podeCadastrarDefault={podeCadastrarDefault}
        isSecretaria={isSecretaria}
      />
    </div>
  );
}
