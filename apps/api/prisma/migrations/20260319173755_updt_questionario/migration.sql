/*
  Warnings:

  - You are about to drop the column `atualizado_em` on the `questionarios` table. All the data in the column will be lost.
  - You are about to drop the column `criado_em` on the `questionarios` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `questionarios` table. All the data in the column will be lost.
  - You are about to drop the column `titulo` on the `questionarios` table. All the data in the column will be lost.
  - You are about to drop the column `questionario_versao_id` on the `questionarios_modulos` table. All the data in the column will be lost.
  - You are about to drop the column `titulo` on the `questionarios_modulos` table. All the data in the column will be lost.
  - You are about to drop the column `enunciado` on the `questionarios_questoes` table. All the data in the column will be lost.
  - You are about to drop the column `obrigatoria` on the `questionarios_questoes` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `questionarios_questoes` table. All the data in the column will be lost.
  - You are about to drop the column `criado_em` on the `questionarios_respostas` table. All the data in the column will be lost.
  - You are about to drop the column `questionario_versao_id` on the `questionarios_respostas` table. All the data in the column will be lost.
  - You are about to drop the `questionarios_questoes_opcoes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `questionarios_respostas_itens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `questionarios_respostas_itens_opcoes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `questionarios_versoes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[clinica_id,nome,versao]` on the table `questionarios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[questionario_id,ordem]` on the table `questionarios_modulos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nome` to the `questionarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `questionarios_modulos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionario_id` to the `questionarios_modulos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descricao` to the `questionarios_questoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avaliacao_id` to the `questionarios_respostas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nota` to the `questionarios_respostas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pergunta_id` to the `questionarios_respostas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "questionarios_modulos" DROP CONSTRAINT "questionarios_modulos_questionario_versao_id_fkey";

-- DropForeignKey
ALTER TABLE "questionarios_questoes_opcoes" DROP CONSTRAINT "questionarios_questoes_opcoes_questao_id_fkey";

-- DropForeignKey
ALTER TABLE "questionarios_respostas" DROP CONSTRAINT "questionarios_respostas_questionario_versao_id_fkey";

-- DropForeignKey
ALTER TABLE "questionarios_respostas_itens" DROP CONSTRAINT "questionarios_respostas_itens_questao_id_fkey";

-- DropForeignKey
ALTER TABLE "questionarios_respostas_itens" DROP CONSTRAINT "questionarios_respostas_itens_resposta_id_fkey";

-- DropForeignKey
ALTER TABLE "questionarios_respostas_itens_opcoes" DROP CONSTRAINT "questionarios_respostas_itens_opcoes_questao_opcao_id_fkey";

-- DropForeignKey
ALTER TABLE "questionarios_respostas_itens_opcoes" DROP CONSTRAINT "questionarios_respostas_itens_opcoes_resposta_item_id_fkey";

-- DropForeignKey
ALTER TABLE "questionarios_versoes" DROP CONSTRAINT "questionarios_versoes_questionario_id_fkey";

-- DropIndex
DROP INDEX "questionarios_modulos_questionario_versao_id_idx";

-- DropIndex
DROP INDEX "questionarios_modulos_questionario_versao_id_ordem_key";

-- DropIndex
DROP INDEX "questionarios_respostas_questionario_versao_id_idx";

-- AlterTable
ALTER TABLE "questionarios" DROP COLUMN "atualizado_em",
DROP COLUMN "criado_em",
DROP COLUMN "descricao",
DROP COLUMN "titulo",
ADD COLUMN     "nome" TEXT NOT NULL,
ADD COLUMN     "versao" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "questionarios_modulos" DROP COLUMN "questionario_versao_id",
DROP COLUMN "titulo",
ADD COLUMN     "nome" TEXT NOT NULL,
ADD COLUMN     "questionario_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "questionarios_questoes" DROP COLUMN "enunciado",
DROP COLUMN "obrigatoria",
DROP COLUMN "tipo",
ADD COLUMN     "descricao" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "questionarios_respostas" DROP COLUMN "criado_em",
DROP COLUMN "questionario_versao_id",
ADD COLUMN     "avaliacao_id" TEXT NOT NULL,
ADD COLUMN     "nota" INTEGER NOT NULL,
ADD COLUMN     "pergunta_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "questionarios_questoes_opcoes";

-- DropTable
DROP TABLE "questionarios_respostas_itens";

-- DropTable
DROP TABLE "questionarios_respostas_itens_opcoes";

-- DropTable
DROP TABLE "questionarios_versoes";

-- DropEnum
DROP TYPE "TipoQuestao";

-- CreateTable
CREATE TABLE "questionarios_regras_interpretacao" (
    "id" TEXT NOT NULL,
    "pontuacao_min" INTEGER NOT NULL,
    "pontuacao_max" INTEGER NOT NULL,
    "classificacao" TEXT NOT NULL,
    "questionario_id" TEXT NOT NULL,

    CONSTRAINT "questionarios_regras_interpretacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionarios_avaliacoes" (
    "id" TEXT NOT NULL,
    "data_realizacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score_total" INTEGER NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "questionario_id" TEXT NOT NULL,

    CONSTRAINT "questionarios_avaliacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "questionarios_regras_interpretacao_questionario_id_idx" ON "questionarios_regras_interpretacao"("questionario_id");

-- CreateIndex
CREATE INDEX "questionarios_avaliacoes_paciente_id_idx" ON "questionarios_avaliacoes"("paciente_id");

-- CreateIndex
CREATE INDEX "questionarios_avaliacoes_questionario_id_idx" ON "questionarios_avaliacoes"("questionario_id");

-- CreateIndex
CREATE UNIQUE INDEX "questionarios_clinica_id_nome_versao_key" ON "questionarios"("clinica_id", "nome", "versao");

-- CreateIndex
CREATE INDEX "questionarios_modulos_questionario_id_idx" ON "questionarios_modulos"("questionario_id");

-- CreateIndex
CREATE UNIQUE INDEX "questionarios_modulos_questionario_id_ordem_key" ON "questionarios_modulos"("questionario_id", "ordem");

-- CreateIndex
CREATE INDEX "questionarios_respostas_avaliacao_id_idx" ON "questionarios_respostas"("avaliacao_id");

-- CreateIndex
CREATE INDEX "questionarios_respostas_pergunta_id_idx" ON "questionarios_respostas"("pergunta_id");

-- AddForeignKey
ALTER TABLE "questionarios_modulos" ADD CONSTRAINT "questionarios_modulos_questionario_id_fkey" FOREIGN KEY ("questionario_id") REFERENCES "questionarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionarios_regras_interpretacao" ADD CONSTRAINT "questionarios_regras_interpretacao_questionario_id_fkey" FOREIGN KEY ("questionario_id") REFERENCES "questionarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionarios_avaliacoes" ADD CONSTRAINT "questionarios_avaliacoes_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionarios_avaliacoes" ADD CONSTRAINT "questionarios_avaliacoes_questionario_id_fkey" FOREIGN KEY ("questionario_id") REFERENCES "questionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionarios_respostas" ADD CONSTRAINT "questionarios_respostas_avaliacao_id_fkey" FOREIGN KEY ("avaliacao_id") REFERENCES "questionarios_avaliacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionarios_respostas" ADD CONSTRAINT "questionarios_respostas_pergunta_id_fkey" FOREIGN KEY ("pergunta_id") REFERENCES "questionarios_questoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
