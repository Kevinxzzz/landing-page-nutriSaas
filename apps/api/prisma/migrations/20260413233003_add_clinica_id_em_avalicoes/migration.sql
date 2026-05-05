/*
  Warnings:

  - Added the required column `clinica_id` to the `questionarios_avaliacoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "questionarios_avaliacoes" ADD COLUMN     "clinica_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "questionarios_avaliacoes_clinica_id_idx" ON "questionarios_avaliacoes"("clinica_id");

-- AddForeignKey
ALTER TABLE "questionarios_avaliacoes" ADD CONSTRAINT "questionarios_avaliacoes_clinica_id_fkey" FOREIGN KEY ("clinica_id") REFERENCES "clinicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
