/*
  Warnings:

  - Added the required column `atualizado_em` to the `questionarios_modulos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atualizado_em` to the `questionarios_questoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "questionarios_modulos" ADD COLUMN     "atualizado_em" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "questionarios_questoes" ADD COLUMN     "atualizado_em" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
