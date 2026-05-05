-- CreateEnum
CREATE TYPE "Perfil" AS ENUM ('ADMIN', 'NUTRICIONISTA', 'SECRETARIA');

-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('MASCULINO', 'FEMININO');

-- CreateEnum
CREATE TYPE "TipoAgendamento" AS ENUM ('CONSULTA', 'RETORNO');

-- CreateEnum
CREATE TYPE "StatusAgendamento" AS ENUM ('AGENDADO', 'CONFIRMOU', 'PRESENTE', 'ENCAIXE', 'CANCELADO', 'NAO_COMPARECEU', 'REALIZADO', 'DESISTIU', 'REMARCOU');

-- CreateTable
CREATE TABLE "clinicas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "endereco" TEXT,
    "logomarca" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "clinica_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "perfil" "Perfil" NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pacientes" (
    "id" TEXT NOT NULL,
    "clinica_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "whatsapp" TEXT,
    "sexo" "Sexo",
    "data_nascimento" TIMESTAMP(3),
    "identidade" TEXT,
    "uf_identidade" TEXT,
    "orgao_expedidor" TEXT,
    "cpf" TEXT,
    "endereco" TEXT,
    "bairro" TEXT,
    "municipio" TEXT,
    "uf" TEXT,
    "cep" TEXT,
    "profissao" TEXT,
    "escolaridade" TEXT,
    "nome_mae" TEXT,
    "convenio_id" TEXT,
    "numero_carteira" TEXT,
    "validade_carteira" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "convenios" (
    "id" TEXT NOT NULL,
    "clinica_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "registro_ans" TEXT,
    "logomarca" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "convenios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agendamentos" (
    "id" TEXT NOT NULL,
    "clinica_id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "convenio_id" TEXT,
    "data_hora" TIMESTAMP(3) NOT NULL,
    "tipo" "TipoAgendamento" NOT NULL,
    "status" "StatusAgendamento" NOT NULL DEFAULT 'AGENDADO',
    "encaixe" BOOLEAN NOT NULL DEFAULT false,
    "observacao" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agendamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evolucoes_clinicas" (
    "id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "estado_clinico" TEXT,
    "aparelho_digestivo" TEXT,
    "antecedentes_morbidos" TEXT,
    "medicamentos" TEXT,
    "outros" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evolucoes_clinicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medidas" (
    "id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "peso" DOUBLE PRECISION,
    "altura" DOUBLE PRECISION,
    "cintura" DOUBLE PRECISION,
    "abdomen" DOUBLE PRECISION,
    "quadril" DOUBLE PRECISION,
    "braco_direito" DOUBLE PRECISION,
    "braco_esquerdo" DOUBLE PRECISION,
    "coxa_direita" DOUBLE PRECISION,
    "coxa_esquerda" DOUBLE PRECISION,
    "culote" DOUBLE PRECISION,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medidas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionarios" (
    "id" TEXT NOT NULL,
    "clinica_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "perguntas" JSONB NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questionarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respostas_questionarios" (
    "id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "questionario_id" TEXT NOT NULL,
    "respostas" JSONB NOT NULL,
    "somatorio" INTEGER,
    "resultado" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "respostas_questionarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exames_base" (
    "id" TEXT NOT NULL,
    "clinica_id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "valor_minimo" DOUBLE PRECISION,
    "valor_maximo" DOUBLE PRECISION,
    "unidade" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exames_base_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitacoes_exames" (
    "id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "data_solicitada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solicitacoes_exames_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitacoes_exames_itens" (
    "id" TEXT NOT NULL,
    "solicitacao_id" TEXT NOT NULL,
    "exame_base_id" TEXT NOT NULL,
    "data_resultado" TIMESTAMP(3),
    "resultado" TEXT,

    CONSTRAINT "solicitacoes_exames_itens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clinicas_cnpj_key" ON "clinicas"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_clinica_id_idx" ON "usuarios"("clinica_id");

-- CreateIndex
CREATE INDEX "pacientes_clinica_id_idx" ON "pacientes"("clinica_id");

-- CreateIndex
CREATE INDEX "convenios_clinica_id_idx" ON "convenios"("clinica_id");

-- CreateIndex
CREATE INDEX "agendamentos_clinica_id_idx" ON "agendamentos"("clinica_id");

-- CreateIndex
CREATE INDEX "agendamentos_data_hora_idx" ON "agendamentos"("data_hora");

-- CreateIndex
CREATE INDEX "agendamentos_paciente_id_idx" ON "agendamentos"("paciente_id");

-- CreateIndex
CREATE INDEX "agendamentos_usuario_id_idx" ON "agendamentos"("usuario_id");

-- CreateIndex
CREATE INDEX "evolucoes_clinicas_paciente_id_idx" ON "evolucoes_clinicas"("paciente_id");

-- CreateIndex
CREATE INDEX "medidas_paciente_id_idx" ON "medidas"("paciente_id");

-- CreateIndex
CREATE INDEX "questionarios_clinica_id_idx" ON "questionarios"("clinica_id");

-- CreateIndex
CREATE INDEX "respostas_questionarios_paciente_id_idx" ON "respostas_questionarios"("paciente_id");

-- CreateIndex
CREATE INDEX "exames_base_clinica_id_idx" ON "exames_base"("clinica_id");

-- CreateIndex
CREATE UNIQUE INDEX "exames_base_clinica_id_codigo_key" ON "exames_base"("clinica_id", "codigo");

-- CreateIndex
CREATE INDEX "solicitacoes_exames_paciente_id_idx" ON "solicitacoes_exames"("paciente_id");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_clinica_id_fkey" FOREIGN KEY ("clinica_id") REFERENCES "clinicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pacientes" ADD CONSTRAINT "pacientes_clinica_id_fkey" FOREIGN KEY ("clinica_id") REFERENCES "clinicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pacientes" ADD CONSTRAINT "pacientes_convenio_id_fkey" FOREIGN KEY ("convenio_id") REFERENCES "convenios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "convenios" ADD CONSTRAINT "convenios_clinica_id_fkey" FOREIGN KEY ("clinica_id") REFERENCES "clinicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_clinica_id_fkey" FOREIGN KEY ("clinica_id") REFERENCES "clinicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_convenio_id_fkey" FOREIGN KEY ("convenio_id") REFERENCES "convenios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evolucoes_clinicas" ADD CONSTRAINT "evolucoes_clinicas_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medidas" ADD CONSTRAINT "medidas_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionarios" ADD CONSTRAINT "questionarios_clinica_id_fkey" FOREIGN KEY ("clinica_id") REFERENCES "clinicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respostas_questionarios" ADD CONSTRAINT "respostas_questionarios_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respostas_questionarios" ADD CONSTRAINT "respostas_questionarios_questionario_id_fkey" FOREIGN KEY ("questionario_id") REFERENCES "questionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exames_base" ADD CONSTRAINT "exames_base_clinica_id_fkey" FOREIGN KEY ("clinica_id") REFERENCES "clinicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacoes_exames" ADD CONSTRAINT "solicitacoes_exames_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacoes_exames_itens" ADD CONSTRAINT "solicitacoes_exames_itens_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacoes_exames"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacoes_exames_itens" ADD CONSTRAINT "solicitacoes_exames_itens_exame_base_id_fkey" FOREIGN KEY ("exame_base_id") REFERENCES "exames_base"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
