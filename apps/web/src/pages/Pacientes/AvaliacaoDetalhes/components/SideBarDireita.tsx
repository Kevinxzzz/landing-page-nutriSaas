import styles from "../AvaliacaoDetalhesPage.module.scss";
import { UseMutationResult } from "@tanstack/react-query";
import { AvaliacaoComRespostas } from "@/services/avaliacao";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  Calculator01Icon,
  DocumentCodeFreeIcons,
  Delete02Icon,
  Download01Icon,
} from "@hugeicons/core-free-icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Paciente } from "@/services/pacientes";
import { Skeleton } from "@/components/Loading/Skeleton";
import { SkeletonObservacao } from "@/components/Loading/skeletons/SkeletonObservacao";

interface SidebarDireitaProps {
  avaliacao: AvaliacaoComRespostas | null | undefined;
  paciente: Paciente | null | undefined;
  deleteMutation: UseMutationResult<unknown, unknown, string, unknown>;
  onDeleteClick: () => void;
  isLoading?: boolean;
}

export function SidebarDireita({
  avaliacao,
  paciente,
  deleteMutation,
  onDeleteClick,
  isLoading = false,
}: SidebarDireitaProps) {

  const handleExportPDF = () => {
    if (!avaliacao || !paciente) return;

    const doc = new jsPDF();
    const brandColor: [number, number, number] = [16, 185, 129]; // #10b981
    const gray800: [number, number, number] = [31, 41, 55];

    // Header Banner
    doc.setFillColor(brandColor[0], brandColor[1], brandColor[2]);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("NutriSaaS - Sistema de Gestão Nutricional", 20, 15);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório de Avaliação", 20, 28);

    // Patient Name - Highlighted
    doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(paciente.nome, 20, 60);

    // Divider
    doc.setDrawColor(229, 231, 235); // gray-200
    doc.line(20, 65, 190, 65);

    // Summary Details Section
    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Nascimento:", 20, 75);
    doc.text("Score Total:", 120, 75);
    doc.text("Data da Avaliação:", 20, 82);
    doc.text("Classificação:", 20, 89);

    doc.setFont("helvetica", "normal");
    const dataNasc = paciente.dataNascimento
      ? new Date(paciente.dataNascimento).toLocaleDateString("pt-BR")
      : "Não informada";
    const dataAval = new Date(avaliacao.dataRealizacao).toLocaleDateString("pt-BR");
    
    doc.text(dataNasc, 55, 75);
    doc.text(avaliacao.scoreTotal.toString(), 155, 75);
    doc.text(dataAval, 55, 82);
    doc.text(avaliacao.regraInterpretacao || "Sem classificação", 55, 89, { maxWidth: 135 });

    // Instruction Mapping
    const instructionMap = new Map<number, string>();
    avaliacao.questionario.labelEscolha.forEach((item) => {
      instructionMap.set(item.nota, item.label);
    });

    // Modules and questions
    let currentY = 105;

    avaliacao.questionario.modulos.forEach((modulo) => {
      // Keep vertical spacing consistent
      const verticalGap = 15;
      
      // Check for page break (header height + estimate table height)
      if (currentY > 240) {
        doc.addPage();
        currentY = 20;
      }

      // Module Title Header
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setFillColor(243, 244, 246); // gray-100
      doc.rect(15, currentY - 6, 180, 10, "F");
      doc.setTextColor(gray800[0], gray800[1], gray800[2]);
      doc.text(modulo.nome, 20, currentY);
      
      currentY += 8; // Consistent gap between title and table

      const tableData = modulo.perguntas.map((p) => {
        const nota = p.respostas[0]?.nota;
        const instrucao = nota !== undefined ? instructionMap.get(nota) || "-" : "-";
        return [
          p.descricao,
          instrucao,
          nota?.toString() || "-",
        ];
      });

      autoTable(doc, {
        startY: currentY,
        head: [["Pergunta", "Instruções", "Nota"]],
        body: tableData,
        theme: "striped",
        headStyles: { fillColor: brandColor, textColor: [255, 255, 255] },
        styles: { fontSize: 9, cellPadding: 3 }, // Fixed cell padding
        margin: { left: 20, right: 20 },
        columnStyles: {
          1: { cellWidth: 65 }, // Instruções
          2: { cellWidth: 15, halign: "center" }, // Nota
        },
      });

      // Update currentY using the library's return value + fixed buffer
      currentY = (doc as any).lastAutoTable.finalY + verticalGap;
    });


    const safeName = paciente.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
    const dateStr = new Date().toISOString().split("T")[0];
    const fileName = `avaliacao-${safeName}-${dateStr}.pdf`;
    doc.save(fileName);
  };


  return (
    <>
      <div className={styles.rightCard}>
        <h4 className={styles.rightTitle}>Resumo da avaliação</h4>

        <div className={styles.sideNavTopic}>
          <div className={styles.sideNavIcon}>
            <HugeiconsIcon icon={Calendar01Icon} size={16} />
          </div>
          <div className={styles.topicContent}>
            <div className={styles.topicTitle}>Data</div>
            <div className={styles.topicDescription}>
              {isLoading ? (
                <Skeleton width="80px" height="14px" />
              ) : avaliacao?.dataRealizacao ? (
                new Date(avaliacao.dataRealizacao).toLocaleDateString("pt-BR")
              ) : (
                "Nenhuma selecionada"
              )}
            </div>
          </div>
        </div>

        <div className={styles.sideNavTopic}>
          <div className={styles.sideNavIcon}>
            <HugeiconsIcon icon={Calculator01Icon} size={16} />
          </div>
          <div className={styles.topicContent}>
            <div className={styles.topicTitle}>Somatório</div>
            <div className={styles.topicDescription}>
              {isLoading ? (
                <Skeleton width="40px" height="14px" />
              ) : (
                avaliacao?.scoreTotal ?? "Nenhuma selecionada"
              )}
            </div>
          </div>
        </div>

        <div className={styles.sideNavTopic}>
          <div className={styles.sideNavIcon}>
            <HugeiconsIcon icon={DocumentCodeFreeIcons} size={16} />
          </div>
          <div className={styles.topicContent}>
            <div className={styles.topicTitle}>Observação</div>
            <div className={styles.topicDescription}>
              {isLoading ? (
                <div style={{ marginTop: "8px" }}>
                  <SkeletonObservacao />
                </div>
              ) : (
                avaliacao?.regraInterpretacao ?? "Nenhuma selecionada"
              )}
            </div>
          </div>
        </div>
        <button 
          className={`${styles.sideNavItem} ${styles.sideNavItemSuccess}`} 
          onClick={handleExportPDF}
        >
          <div className={styles.sideNavIcon}>
            <HugeiconsIcon icon={Download01Icon} size={16} strokeWidth={1.8} />
          </div>
          <span>Exportar PDF</span>
        </button>

        <button className={styles.sideNavItem} onClick={onDeleteClick}>
          <div className={styles.sideNavIcon}>
            <HugeiconsIcon icon={Delete02Icon} size={16} strokeWidth={1.8} />
          </div>
          <span>Excluir Avaliação</span>
        </button>

      </div>
    </>
  );
}
