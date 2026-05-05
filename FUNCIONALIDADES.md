# Funcionalidades do Projeto: NutriSaaS

O projeto **NutriSaaS** é uma plataforma completa (Software as a Service) voltada para o gerenciamento de clínicas de nutrição e profissionais da saúde. O ecossistema é dividido em duas aplicações principais (monorepo):
- **Web**: Frontend desenvolvido em React/Vite com TypeScript.
- **API**: Backend desenvolvido em Node.js (Express) com Prisma ORM e PostgreSQL.

Abaixo estão descritas todas as principais funcionalidades mapeadas no projeto:

## 1. Gestão de Autenticação e Autorização (Usuários e Clínicas)
- **Múltiplos Perfis de Acesso:** Suporte a diferentes níveis de permissão (`ADMIN`, `NUTRICIONISTA`, `SECRETARIA`), garantindo controle de acesso granular.
- **Multitenancy (Clínicas):** A plataforma suporta múltiplas clínicas, onde os dados de pacientes, agendas e configurações são isolados por clínica.
- **Onboarding e Configurações:** Fluxo de entrada para novos usuários e configuração dos dados básicos da clínica (logo, informações de contato, etc).

## 2. Gestão de Pacientes
- **Cadastro Completo:** Registro de pacientes com dados pessoais, endereço, contato, histórico social (profissão, escolaridade) e associação a convênios médicos.
- **Ficha do Paciente:** Visão centralizada com o histórico do paciente na clínica.

## 3. Agenda e Agendamentos
- **Controle de Marcações:** Criação de agendamentos para consultas ou retornos.
- **Gerenciamento de Status:** Acompanhamento do ciclo de vida da consulta (Agendado, Confirmou, Presente, Em Atendimento, Cancelado, Remarcou, etc).
- **Encaixes:** Suporte explícito a agendamentos de encaixe.

## 4. Prontuário Eletrônico e Acompanhamento
- **Evolução Clínica:** Registro contínuo do estado do paciente a cada consulta, incluindo histórico do aparelho digestivo, antecedentes mórbidos e medicações em uso.
- **Antropometria (Medidas):** Acompanhamento evolutivo de dados corporais como peso, altura, circunferências (cintura, abdômen, quadril, braços, coxas) para análise de resultados ao longo do tempo.

## 5. Avaliações e Questionários Dinâmicos
- **Construtor de Questionários:** Criação de questionários personalizados divididos em módulos/seções.
- **Métricas e Scores:** Cada resposta pode ter uma pontuação atrelada.
- **Regras de Interpretação:** O sistema calcula o "score total" do questionário e enquadra o paciente em classificações predefinidas baseadas em limites de pontuação.
- **Aplicação:** Registro de avaliações preenchidas pelos pacientes.

## 6. Solicitação e Controle de Exames
- **Base de Exames:** Catálogo de exames laboratoriais padronizados, com a definição de valores mínimos, máximos e unidades de medida de referência.
- **Solicitações:** Geração de pedidos de exames para os pacientes.
- **Resultados:** Lançamento de resultados no sistema para acompanhar parâmetros bioquímicos ao longo do tratamento.

## 7. Gestão de Convênios
- **Cadastro de Planos de Saúde:** Registro de operadoras, números de registro ANS e logomarcas, permitindo vincular pacientes e faturar/organizar consultas de acordo com a cobertura de saúde.

## 8. Dashboard e Relatórios
- **Visão Estratégica:** Painel de controle inicial (Dashboard) com métricas de atendimentos e situação da clínica.
- **Relatórios:** Módulo para extração e análise de dados da clínica, histórico de agendamentos e consolidados gerenciais.

---
**Estrutura Técnica Mapeada:**
* Tecnologias principais: TypeScript, Node/Express, Prisma, PostgreSQL, React, Vite, Tailwind/Sass, Zustand, Playwright (E2E), Vitest.
