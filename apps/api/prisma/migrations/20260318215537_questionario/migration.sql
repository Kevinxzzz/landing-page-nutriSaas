/*
  Warnings:

  - You are about to drop the column `nome` on the `questionarios` table. All the data in the column will be lost.
  - You are about to drop the column `perguntas` on the `questionarios` table. All the data in the column will be lost.
  - You are about to drop the `respostas_questionarios` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `atualizado_em` to the `questionarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo` to the `questionarios` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoQuestao" AS ENUM ('TEXTO', 'BOOLEANO', 'NUMERICO', 'ESCALA', 'MULTIPLA_ESCOLHA', 'CHECKBOX');

-- DropForeignKey
ALTER TABLE "respostas_questionarios" DROP CONSTRAINT "respostas_questionarios_paciente_id_fkey";

-- DropForeignKey
ALTER TABLE "respostas_questionarios" DROP CONSTRAINT "respostas_questionarios_questionario_id_fkey";

-- AlterTable
ALTER TABLE "questionarios" DROP COLUMN "nome",
DROP COLUMN "perguntas",
ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "atualizado_em" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "descricao" TEXT,
ADD COLUMN     "titulo" TEXT NOT NULL;

-- DropTable
DROP TABLE "respostas_questionarios";

-- CreateTable
CREATE TABLE "questionarios_versoes" (
    "id" TEXT NOT NULL,
    "questionario_id" TEXT NOT NULL,
    "versao" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questionarios_versoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionarios_modulos" (
    "id" TEXT NOT NULL,
    "questionario_versao_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,

    CONSTRAINT "questionarios_modulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionarios_questoes" (
    "id" TEXT NOT NULL,
    "modulo_id" TEXT NOT NULL,
    "enunciado" TEXT NOT NULL,
    "tipo" "TipoQuestao" NOT NULL,
    "obrigatoria" BOOLEAN NOT NULL DEFAULT false,
    "ordem" INTEGER NOT NULL,

    CONSTRAINT "questionarios_questoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionarios_questoes_opcoes" (
    "id" TEXT NOT NULL,
    "questao_id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "valor" DOUBLE PRECISION,
    "ordem" INTEGER NOT NULL,

    CONSTRAINT "questionarios_questoes_opcoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionarios_respostas" (
    "id" TEXT NOT NULL,
    "questionario_versao_id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questionarios_respostas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionarios_respostas_itens" (
    "id" TEXT NOT NULL,
    "resposta_id" TEXT NOT NULL,
    "questao_id" TEXT NOT NULL,
    "valor_texto" TEXT,
    "valor_numero" DOUBLE PRECISION,
    "valor_booleano" BOOLEAN,

    CONSTRAINT "questionarios_respostas_itens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionarios_respostas_itens_opcoes" (
    "id" TEXT NOT NULL,
    "resposta_item_id" TEXT NOT NULL,
    "questao_opcao_id" TEXT NOT NULL,

    CONSTRAINT "questionarios_respostas_itens_opcoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "questionarios_versoes_questionario_id_idx" ON "questionarios_versoes"("questionario_id");

-- CreateIndex
CREATE UNIQUE INDEX "questionarios_versoes_questionario_id_versao_key" ON "questionarios_versoes"("questionario_id", "versao");

-- CreateIndex
CREATE INDEX "questionarios_modulos_questionario_versao_id_idx" ON "questionarios_modulos"("questionario_versao_id");

-- CreateIndex
CREATE UNIQUE INDEX "questionarios_modulos_questionario_versao_id_ordem_key" ON "questionarios_modulos"("questionario_versao_id", "ordem");

-- CreateIndex
CREATE INDEX "questionarios_questoes_modulo_id_idx" ON "questionarios_questoes"("modulo_id");

-- CreateIndex
CREATE UNIQUE INDEX "questionarios_questoes_modulo_id_ordem_key" ON "questionarios_questoes"("modulo_id", "ordem");

-- CreateIndex
CREATE INDEX "questionarios_questoes_opcoes_questao_id_idx" ON "questionarios_questoes_opcoes"("questao_id");

-- CreateIndex
CREATE UNIQUE INDEX "questionarios_questoes_opcoes_questao_id_ordem_key" ON "questionarios_questoes_opcoes"("questao_id", "ordem");

-- CreateIndex
CREATE INDEX "questionarios_respostas_questionario_versao_id_idx" ON "questionarios_respostas"("questionario_versao_id");

-- CreateIndex
CREATE INDEX "questionarios_respostas_paciente_id_idx" ON "questionarios_respostas"("paciente_id");

-- CreateIndex
CREATE INDEX "questionarios_respostas_itens_resposta_id_idx" ON "questionarios_respostas_itens"("resposta_id");

-- CreateIndex
CREATE INDEX "questionarios_respostas_itens_questao_id_idx" ON "questionarios_respostas_itens"("questao_id");

-- CreateIndex
CREATE INDEX "questionarios_respostas_itens_opcoes_resposta_item_id_idx" ON "questionarios_respostas_itens_opcoes"("resposta_item_id");

-- CreateIndex
CREATE INDEX "questionarios_respostas_itens_opcoes_questao_opcao_id_idx" ON "questionarios_respostas_itens_opcoes"("questao_opcao_id");

-- AddForeignKey
ALTER TABLE "questionarios_versoes" ADD CONSTRAINT "questionarios_versoes_questionario_id_fkey" FOREIGN KEY ("questionario_id") REFERENCES "questionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionarios_modulos" ADD CONSTRAINT "questionarios_modulos_questionario_versao_id_fkey" FOREIGN KEY ("questionario_versao_id") REFERENCES "questionarios_versoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionarios_questoes" ADD CONSTRAINT "questionarios_questoes_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "questionarios_modulos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionarios_questoes_opcoes" ADD CONSTRAINT "questionarios_questoes_opcoes_questao_id_fkey" FOREIGN KEY ("questao_id") REFERENCES "questionarios_questoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionarios_respostas" ADD CONSTRAINT "questionarios_respostas_questionario_versao_id_fkey" FOREIGN KEY ("questionario_versao_id") REFERENCES "questionarios_versoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionarios_respostas" ADD CONSTRAINT "questionarios_respostas_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionarios_respostas_itens" ADD CONSTRAINT "questionarios_respostas_itens_resposta_id_fkey" FOREIGN KEY ("resposta_id") REFERENCES "questionarios_respostas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionarios_respostas_itens" ADD CONSTRAINT "questionarios_respostas_itens_questao_id_fkey" FOREIGN KEY ("questao_id") REFERENCES "questionarios_questoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionarios_respostas_itens_opcoes" ADD CONSTRAINT "questionarios_respostas_itens_opcoes_resposta_item_id_fkey" FOREIGN KEY ("resposta_item_id") REFERENCES "questionarios_respostas_itens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionarios_respostas_itens_opcoes" ADD CONSTRAINT "questionarios_respostas_itens_opcoes_questao_opcao_id_fkey" FOREIGN KEY ("questao_opcao_id") REFERENCES "questionarios_questoes_opcoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
