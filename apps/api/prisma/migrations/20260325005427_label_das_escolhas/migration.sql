-- CreateTable
CREATE TABLE "questionarios_titulos_escolha" (
    "id" TEXT NOT NULL,
    "questionario_id" TEXT NOT NULL,
    "Label" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,

    CONSTRAINT "questionarios_titulos_escolha_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "questionarios_titulos_escolha_questionario_id_idx" ON "questionarios_titulos_escolha"("questionario_id");

-- CreateIndex
CREATE UNIQUE INDEX "questionarios_titulos_escolha_questionario_id_nota_key" ON "questionarios_titulos_escolha"("questionario_id", "nota");

-- AddForeignKey
ALTER TABLE "questionarios_titulos_escolha" ADD CONSTRAINT "questionarios_titulos_escolha_questionario_id_fkey" FOREIGN KEY ("questionario_id") REFERENCES "questionarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
