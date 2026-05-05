import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ClipboardIcon,
  FileValidationIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import styles from "./../ComparativoPage.module.scss";
import { UseMutationResult } from "@tanstack/react-query";

type PacienteSelecionado = {
  id: string;
  nome: string;
};

type Questionario = {
  id: string;
  nome: string;
  versao: number;
};

interface ModalResponderExameComparativoProps {
  handleFecharModalQuestionarios: () => void;
  pacienteSelecionado: PacienteSelecionado;
  questionarios: Questionario[];
  podeCadastrarDefault: boolean;
  isSecretaria: boolean;
  isLoadingQuestionarios: boolean;
  cadastrarDefaultMutation: UseMutationResult<any, any, void, any>;
  questionarioCopiadoId: string | null;
  handleCopiarUrl: (questionarioId: string) => void;
}

export function ModalResponderExameComparativo({
  handleFecharModalQuestionarios,
  pacienteSelecionado,
  questionarios,
  podeCadastrarDefault,
  cadastrarDefaultMutation,
  questionarioCopiadoId,
  handleCopiarUrl,
  isSecretaria,
  isLoadingQuestionarios,
}: ModalResponderExameComparativoProps) {
  return (
    <>
      <div className={styles.overlay} onClick={handleFecharModalQuestionarios}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h3>
              <HugeiconsIcon
                icon={FileValidationIcon}
                size={18}
                strokeWidth={2}
              />
              Selecionar Questionário
            </h3>
            <button
              className={styles.closeBtn}
              onClick={handleFecharModalQuestionarios}
            >
              ×
            </button>
          </div>

          <div className={styles.modalBody}>
            <p className={styles.modalSubtitulo}>
              Paciente: <strong>{pacienteSelecionado.nome}</strong>
            </p>

            <div className={styles.modalInfoText}>
              <p>
                Selecione o questionário que deseja aplicar. Assim que o
                paciente finalizar o preenchimento, o resultado é gerado
                automaticamente e fica disponível no sistema.
              </p>
              <p>
                Você também pode copiar o link para compartilhar por WhatsApp,
                e-mail ou outro canal de atendimento.
              </p>
            </div>

            {isLoadingQuestionarios ? (
              <div className={styles.empty}>Carregando questionários...</div>
            ) : questionarios.length === 0 ? (
              <div className={styles.emptyQuestionarios}>
                {podeCadastrarDefault ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <p>
                      Ainda não há questionários cadastrados. Você pode usar o
                      questionário de hipersensibilidade padrão.
                    </p>
                    <button
                      className={styles.novoBtn}
                      onClick={() => cadastrarDefaultMutation.mutate()}
                      disabled={cadastrarDefaultMutation.isPending}
                    >
                      <HugeiconsIcon
                        icon={PlusSignIcon}
                        size={16}
                        strokeWidth={2}
                      />
                      {cadastrarDefaultMutation.isPending
                        ? "Cadastrando..."
                        : "Cadastrar questionário padrão"}
                    </button>
                  </div>
                ) : isSecretaria ? (
                  <p className={styles.emptyMessageWithIcon}>
                    <HugeiconsIcon
                      icon={FileValidationIcon}
                      size={16}
                      strokeWidth={2}
                    />
                    Não há questionários cadastrados. Informe a um nutricionista
                    para realizar o cadastro.
                  </p>
                ) : (
                  <p>Não há questionários cadastrados.</p>
                )}
              </div>
            ) : (
              <ul className={styles.questionariosList}>
                {questionarios.map((questionario) => {
                  const path = `/questionarios/${questionario.id}/pacientes/${pacienteSelecionado.id}/responder`;
                  const foiCopiado = questionarioCopiadoId === questionario.id;

                  return (
                    <li
                      key={questionario.id}
                      className={styles.questionarioItem}
                    >
                      <div className={styles.questionarioInfo}>
                        <strong>{questionario.nome}</strong>
                        <span>Versão {questionario.versao}</span>
                      </div>

                      <div className={styles.questionarioActions}>
                        <button
                          className={`${styles.actionBtn} ${styles.openBtn}`}
                          onClick={() => window.open(path, "_blank")}
                        >
                          <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            size={14}
                            strokeWidth={2}
                          />
                          Abrir
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.copyBtn} ${foiCopiado ? styles.successBtn : ""}`}
                          onClick={() => handleCopiarUrl(questionario.id)}
                        >
                          <HugeiconsIcon
                            icon={ClipboardIcon}
                            size={14}
                            strokeWidth={2}
                          />
                          {foiCopiado ? "✓ Copiado" : "Copiar URL"}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
