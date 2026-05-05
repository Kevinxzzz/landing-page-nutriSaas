import { prisma } from "@/shared/providers/prisma";

type CategoriaSintomas = {
  categoria: string;
  sintomas: string[];
};

const QUESTIONARIO_PADRAO_NOME = "Rastreamento de Hipersensibilidades";
const QUESTIONARIO_PADRAO_VERSAO = 1;

const CATEGORIAS_SINTOMAS: CategoriaSintomas[] = [
  {
    categoria: "Cabeça",
    sintomas: ["dor de cabeça", "desmaio", "tonturas", "insônia"],
  },
  {
    categoria: "Olhos",
    sintomas: ["coceira", "inchaço", "olheiras", "visão borrada"],
  },
  {
    categoria: "Ouvidos",
    sintomas: ["coceira", "dores", "fluido", "zumbido"],
  },
  {
    categoria: "Nariz",
    sintomas: ["entupido", "sinusite", "ataques de espirro"],
  },
  {
    categoria: "Boca/Garganta",
    sintomas: ["muco", "tosse", "dor de garganta", "língua/lábios", "aftas"],
  },
  {
    categoria: "Pele",
    sintomas: ["acne", "pele seca", "cabelo", "vermelhidão", "suor excessivo"],
  },
  {
    categoria: "Coração",
    sintomas: ["batimento falhando/rápido", "dor no peito", "congestão"],
  },
  {
    categoria: "Pulmão",
    sintomas: ["asma", "falta de fôlego", "dificuldade respiratória"],
  },
  {
    categoria: "Trato Digestivo",
    sintomas: [
      "náuseas",
      "diarreia",
      "constipação",
      "distensão",
      "arrotos",
      "azia",
      "dor estomacal",
    ],
  },
  {
    categoria: "Articulações/Músculos",
    sintomas: ["dor articular", "artrite", "rigidez", "dolorido", "fraqueza"],
  },
  {
    categoria: "Energia/Atividade",
    sintomas: ["fadiga", "apatia", "hiperatividade", "dificuldade de relaxar"],
  },
  {
    categoria: "Mente",
    sintomas: [
      "memória",
      "confusão",
      "concentração",
      "coordenação motora",
      "decisão",
      "repetições",
      "pronúncia",
      "aprendizagem",
    ],
  },
  {
    categoria: "Emocional",
    sintomas: ["humor", "ansiedade", "raiva", "depressão"],
  },
  {
    categoria: "Outros",
    sintomas: ["doença frequente", "urgência urinária", "corrimento", "edema"],
  },
];

const REGRAS_PADRAO = [
  {
    pontuacaoMin: 0,
    pontuacaoMax: 30,
    classificacao:
      "Pessoa mais saudável, menores chances de hipersensibilidades",
  },
  {
    pontuacaoMin: 31,
    pontuacaoMax: 39,
    classificacao: "Indicativo de existência de hipersensibilidades",
  },
  {
    pontuacaoMin: 40,
    pontuacaoMax: 99,
    classificacao: "Absoluta certeza de existência de hipersensibilidade",
  },
  {
    pontuacaoMin: 100,
    pontuacaoMax: 9999,
    classificacao:
      "Saúde muito ruim — alta dificuldade para tarefas diárias, possível associação com doenças crônicas e degenerativas",
  },
];

const LABELS_ESCOLHA_PADRAO = {
  0: "Nunca ou quase nunca teve esse sintoma",
  1: "Ocasionalmente teve, mas não foi severo",
  2: "Ocasionalmente teve, efeito severo",
  3: "Frequentemente teve, efeito não severo",
  4: "Frequentemente teve, efeito foi severo",
} as const;

async function upsertLabelsEscolhaPadrao(questionarioId: string) {
  await Promise.all(
    Object.entries(LABELS_ESCOLHA_PADRAO).map(([nota, label]) =>
      prisma.labelEscolha.upsert({
        where: {
          questionarioId_nota: {
            questionarioId,
            nota: Number(nota),
          },
        },
        update: { label: label },
        create: {
          questionarioId,
          nota: Number(nota),
          label: label,
        },
      }),
    ),
  );
}

export function getQuestionarioPadraoNome() {
  return QUESTIONARIO_PADRAO_NOME;
}

export async function criarQuestionarioPadraoParaClinica(clinicaId: string) {
  const existente = await prisma.questionario.findFirst({
    where: {
      clinicaId,
      nome: QUESTIONARIO_PADRAO_NOME,
      versao: QUESTIONARIO_PADRAO_VERSAO,
    },
  });

  if (existente) {
    const moduloCount = await prisma.modulo.count({
      where: { questionarioId: existente.id },
    });

    if (moduloCount === 0) {
      console.warn(
        `Questionário "${QUESTIONARIO_PADRAO_NOME}" encontrado sem módulos (registro fantasma). Removendo e recriando...`,
      );
      await prisma.questionario.delete({ where: { id: existente.id } });
    } else {
      await upsertLabelsEscolhaPadrao(existente.id);
      return existente;
    }
  }

  const questionario = await prisma.questionario.create({
    data: {
      clinicaId,
      nome: QUESTIONARIO_PADRAO_NOME,
      versao: QUESTIONARIO_PADRAO_VERSAO,
      ativo: true,
      labelEscolha: {
        create: Object.entries(LABELS_ESCOLHA_PADRAO).map(([nota, label]) => ({
          nota: Number(nota),
          label: label,
        })),
      },
      modulos: {
        create: CATEGORIAS_SINTOMAS.map((categoria, indiceModulo) => ({
          nome: categoria.categoria,
          ordem: indiceModulo + 1,
          perguntas: {
            create: categoria.sintomas.map((sintoma, indicePergunta) => ({
              descricao: sintoma,
              ordem: indicePergunta + 1,
            })),
          },
        })),
      },
      regras: {
        create: REGRAS_PADRAO,
      },
    },
  });

  return questionario;
}
