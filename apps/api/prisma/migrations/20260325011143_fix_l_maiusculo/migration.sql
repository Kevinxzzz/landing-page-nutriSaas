/*
  Warnings:

  - You are about to drop the column `Label` on the `questionarios_titulos_escolha` table. All the data in the column will be lost.
  - Added the required column `label` to the `questionarios_titulos_escolha` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "questionarios_titulos_escolha" DROP COLUMN "Label",
ADD COLUMN     "label" TEXT NOT NULL;
