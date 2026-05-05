import bcrypt from "bcryptjs";
import { prisma } from "../src/shared/providers/prisma";
import { criarQuestionarioPadraoParaClinica } from "../src/modules/questionarios/seed/default-questionario";

async function main() {
  const senhaHash = await bcrypt.hash("123456", 10);

  // Criar clínica demo
  const clinica = await prisma.clinica.upsert({
    where: { cnpj: "00000000000100" },
    update: {},
    create: {
      nome: "Clínica Demo",
      cnpj: "00000000000100",
      email: "demo@nutricao.com",
    },
  });

  await prisma.usuario.upsert({
    where: { email: "admin@nutricao.com" },
    update: {},
    create: {
      clinicaId: clinica.id,
      nome: "Administrador",
      email: "admin@nutricao.com",
      senha: senhaHash,
      perfil: "ADMIN",
    },
  });

  await prisma.usuario.upsert({
    where: { email: "nutri@nutricao.com" },
    update: {},
    create: {
      clinicaId: clinica.id,
      nome: "Dr(a). Nutricionista",
      email: "nutri@nutricao.com",
      senha: senhaHash,
      perfil: "NUTRICIONISTA",
    },
  });

  await prisma.usuario.upsert({
    where: { email: "secretaria@nutricao.com" },
    update: {},
    create: {
      clinicaId: clinica.id,
      nome: "Secretária",
      email: "secretaria@nutricao.com",
      senha: senhaHash,
      perfil: "SECRETARIA",
    },
  });

  const convenio = await prisma.convenio.upsert({
    where: { id: "particular" },
    update: {},
    create: {
      id: "particular",
      clinicaId: clinica.id,
      nome: "Particular",
    },
  });

  // Pacientes de teste (cria apenas se não existirem)
  const existentes = await prisma.paciente.findMany({
    where: { clinicaId: clinica.id },
    select: { cpf: true },
  });
  const cpfsExistentes = new Set(existentes.map((p) => p.cpf));

  let paciente1Id: string | undefined;
  let paciente2Id: string | undefined;

  if (!cpfsExistentes.has("11111111111")) {
    const p1 = await prisma.paciente.create({
      data: {
        clinicaId: clinica.id,
        nome: "Isabela Ataide Rosendo",
        email: "isabela@hotmail.com",
        cpf: "11111111111",
        telefone: "(83) 99051-1262",
        profissao: "Servidora Pública",
        sexo: "FEMININO",
        dataNascimento: new Date("1983-07-11"),
        endereco: "Rua Joaquim Chule, 385",
        bairro: "Bessa",
        municipio: "João Pessoa",
        uf: "PB",
        convenioId: convenio.id,
      },
    });
    paciente1Id = p1.id;
  }

  if (!cpfsExistentes.has("22222222222")) {
    const p2 = await prisma.paciente.create({
      data: {
        clinicaId: clinica.id,
        nome: "Olimpia de Lourdes Correia Cunha",
        email: "olimpiacunha@uol.com.br",
        cpf: "22222222222",
        telefone: "(83) 3243-0475",
        profissao: "Empresária",
        sexo: "FEMININO",
        dataNascimento: new Date("1941-08-13"),
        endereco: "Monteiro Lobato, 538",
        bairro: "Tambaú",
        municipio: "João Pessoa",
        uf: "PB",
        convenioId: convenio.id,
      },
    });
    paciente2Id = p2.id;
  }

  if (!cpfsExistentes.has("33333333333")) {
    await prisma.paciente.create({
      data: {
        clinicaId: clinica.id,
        nome: "Carlos Eduardo Silva",
        email: "carlos.silva@gmail.com",
        cpf: "33333333333",
        telefone: "(83) 98877-6543",
        profissao: "Engenheiro Civil",
        sexo: "MASCULINO",
        dataNascimento: new Date("1990-03-22"),
        endereco: "Av. Epitácio Pessoa, 1200",
        bairro: "Manaíra",
        municipio: "João Pessoa",
        uf: "PB",
        convenioId: convenio.id,
      },
    });
  }

  // Buscar pacientes pelo CPF para garantir que temos os IDs
  const isabela = await prisma.paciente.findFirst({
    where: { clinicaId: clinica.id, cpf: "11111111111" },
  });
  const olimpia = await prisma.paciente.findFirst({
    where: { clinicaId: clinica.id, cpf: "22222222222" },
  });
  const carlos = await prisma.paciente.findFirst({
    where: { clinicaId: clinica.id, cpf: "33333333333" },
  });

  // Evoluções clínicas para Isabela
  if (paciente1Id) {
    await prisma.evolucaoClinica.create({
      data: {
        pacienteId: paciente1Id,
        estadoClinico:
          "Objetivo = reeducação alimentar, estuda para concurso. Na TPM fica enjoada e com dor de barriga, rinite, unhas fortes, cabelo normais, alérgica a poeira, problemas com cheiros fortes.\ndia 17/12 = teve crise alérgica, teve asma.\ndia 19/01/11 = não\ndia 20/06/11 = super bem.",
        aparelhoDigestivo:
          "Intestino funciona bem\nazia de vez em quando\ndia 20/06/11 = bem, azia não\ndia 23/1/14 = está bem\ndia 07/04/14 = está bem",
        antecedentesMorbidos: "irmão mais velho diabético",
        medicamentos:
          "anticoncepcional - adoless\ndia 20/12 = ácido fólico\nta com óvulo de progesterona.\nomega tres\ndia 06/03/15 = nactalle (anticoncepcional) contínuo",
        outros:
          "Está fazendo personal com Serginho\ndia 20/12 = Dra Renata\ncontinua Renata Gadelha",
      },
    });
  }

  // Evoluções clínicas para Olimpia
  if (paciente2Id) {
    await prisma.evolucaoClinica.create({
      data: {
        pacienteId: paciente2Id,
        estadoClinico:
          "labirintite, objetivos - anemia, dor na coluna, Tg alto, ureia e glicose, dorme bem, roncando muito, não dores nas pernas, tem refluxo, intestino com gases.\ndia 13/03/201 = está muito bem, melhor das dores.\ndia 02/07 = herpes.",
        aparelhoDigestivo:
          "Intestino constipado\ncascara sagrada\ndia 13/03 = melhor\ndia 10/10 = intestino super constipado\ndia 12/11 = mais ou menos e dificuldade de deglição",
        antecedentesMorbidos: "irmão mais velho diabético",
        medicamentos:
          "Omega Sea- 2 ao dia (forever)\nGTF cromo\nGlucosamina\n1 x semana actonel\nLivial\ndia 05/06 = lecitina de soja",
        outros:
          "vai fazer a musculação\nmusculação 3 x semana\n2 x caminha\ndia 25/9/25 = voltou a semana passada",
      },
    });
  }

  // ===== Exames Base (85 exames laboratoriais) =====
  const examesBase = [
    // HEMOGRAMA
    {
      codigo: "40304361",
      nome: "Hemograma completo",
      valorMinimo: null,
      valorMaximo: null,
      unidade: null,
    },
    {
      codigo: "40304345",
      nome: "Hemoglobina",
      valorMinimo: 12.0,
      valorMaximo: 17.5,
      unidade: "g/dL",
    },
    {
      codigo: "40304337",
      nome: "Hematócrito",
      valorMinimo: 36.0,
      valorMaximo: 50.0,
      unidade: "%",
    },
    {
      codigo: "40304370",
      nome: "VHS (Hemossedimentação)",
      valorMinimo: 0,
      valorMaximo: 20,
      unidade: "mm/h",
    },
    {
      codigo: "40304558",
      nome: "Reticulócitos",
      valorMinimo: 0.5,
      valorMaximo: 2.5,
      unidade: "%",
    },
    // PERFIL GLICÊMICO
    {
      codigo: "40302040",
      nome: "Glicose de jejum",
      valorMinimo: 70,
      valorMaximo: 99,
      unidade: "mg/dL",
    },
    {
      codigo: "40302733",
      nome: "Hemoglobina glicada (HbA1c)",
      valorMinimo: 4.0,
      valorMaximo: 5.6,
      unidade: "%",
    },
    {
      codigo: "40302075",
      nome: "Hemoglobina glicada (A1 total)",
      valorMinimo: 4.0,
      valorMaximo: 6.0,
      unidade: "%",
    },
    {
      codigo: "40316360",
      nome: "Insulina basal",
      valorMinimo: 2.0,
      valorMaximo: 25.0,
      unidade: "uUI/mL",
    },
    {
      codigo: "40302709",
      nome: "Teste oral tolerância glicose (TOTG)",
      valorMinimo: 70,
      valorMaximo: 140,
      unidade: "mg/dL",
    },
    {
      codigo: "40301680",
      nome: "Curva glicêmica (4 dosagens)",
      valorMinimo: null,
      valorMaximo: null,
      unidade: "mg/dL",
    },
    {
      codigo: "40301958",
      nome: "Frutosaminas",
      valorMinimo: 205,
      valorMaximo: 285,
      unidade: "umol/L",
    },
    {
      codigo: "40316394",
      nome: "Peptídeo C",
      valorMinimo: 1.1,
      valorMaximo: 4.4,
      unidade: "ng/mL",
    },
    // PERFIL LIPÍDICO
    {
      codigo: "40301605",
      nome: "Colesterol total",
      valorMinimo: null,
      valorMaximo: 190,
      unidade: "mg/dL",
    },
    {
      codigo: "40301583",
      nome: "Colesterol HDL",
      valorMinimo: 40,
      valorMaximo: null,
      unidade: "mg/dL",
    },
    {
      codigo: "40301591",
      nome: "Colesterol LDL",
      valorMinimo: null,
      valorMaximo: 130,
      unidade: "mg/dL",
    },
    {
      codigo: "40302695",
      nome: "Colesterol VLDL",
      valorMinimo: null,
      valorMaximo: 30,
      unidade: "mg/dL",
    },
    {
      codigo: "40302547",
      nome: "Triglicerídeos",
      valorMinimo: null,
      valorMaximo: 150,
      unidade: "mg/dL",
    },
    {
      codigo: "40301354",
      nome: "Apolipoproteína A (Apo A)",
      valorMinimo: 120,
      valorMaximo: 176,
      unidade: "mg/dL",
    },
    {
      codigo: "40301362",
      nome: "Apolipoproteína B (Apo B)",
      valorMinimo: 52,
      valorMaximo: 129,
      unidade: "mg/dL",
    },
    {
      codigo: "40302210",
      nome: "Lipoproteína (a) - Lp(a)",
      valorMinimo: null,
      valorMaximo: 30,
      unidade: "mg/dL",
    },
    {
      codigo: "40302113",
      nome: "Homocisteína",
      valorMinimo: 5.0,
      valorMaximo: 15.0,
      unidade: "umol/L",
    },
    // FUNÇÃO HEPÁTICA
    {
      codigo: "40302504",
      nome: "TGO / AST",
      valorMinimo: 10,
      valorMaximo: 40,
      unidade: "U/L",
    },
    {
      codigo: "40302512",
      nome: "TGP / ALT",
      valorMinimo: 10,
      valorMaximo: 40,
      unidade: "U/L",
    },
    {
      codigo: "40301990",
      nome: "Gama GT (GGT)",
      valorMinimo: 8,
      valorMaximo: 61,
      unidade: "U/L",
    },
    {
      codigo: "40301885",
      nome: "Fosfatase alcalina",
      valorMinimo: 40,
      valorMaximo: 129,
      unidade: "U/L",
    },
    {
      codigo: "40301397",
      nome: "Bilirrubinas totais e frações",
      valorMinimo: 0.1,
      valorMaximo: 1.2,
      unidade: "mg/dL",
    },
    {
      codigo: "40301729",
      nome: "Desidrogenase lática (LDH)",
      valorMinimo: 80,
      valorMaximo: 225,
      unidade: "U/L",
    },
    // FUNÇÃO RENAL
    {
      codigo: "40302580",
      nome: "Ureia",
      valorMinimo: 15,
      valorMaximo: 40,
      unidade: "mg/dL",
    },
    {
      codigo: "40301630",
      nome: "Creatinina",
      valorMinimo: 0.7,
      valorMaximo: 1.3,
      unidade: "mg/dL",
    },
    {
      codigo: "40301508",
      nome: "Clearance de creatinina",
      valorMinimo: 80,
      valorMaximo: 120,
      unidade: "mL/min",
    },
    {
      codigo: "40301150",
      nome: "Ácido úrico",
      valorMinimo: 3.0,
      valorMaximo: 7.0,
      unidade: "mg/dL",
    },
    // PROTEÍNAS
    {
      codigo: "40302377",
      nome: "Proteínas totais",
      valorMinimo: 6.0,
      valorMaximo: 8.0,
      unidade: "g/dL",
    },
    {
      codigo: "40301222",
      nome: "Albumina",
      valorMinimo: 3.5,
      valorMaximo: 5.5,
      unidade: "g/dL",
    },
    {
      codigo: "40302326",
      nome: "Pré-albumina (Transtiretina)",
      valorMinimo: 20,
      valorMaximo: 40,
      unidade: "mg/dL",
    },
    {
      codigo: "40302369",
      nome: "Proteína ligadora do retinol",
      valorMinimo: 3.0,
      valorMaximo: 6.0,
      unidade: "mg/dL",
    },
    {
      codigo: "40301761",
      nome: "Eletroforese de proteínas",
      valorMinimo: null,
      valorMaximo: null,
      unidade: "g/dL",
    },
    {
      codigo: "40308391",
      nome: "Proteína C reativa (PCR quantitativa)",
      valorMinimo: null,
      valorMaximo: 0.5,
      unidade: "mg/dL",
    },
    // METABOLISMO DO FERRO
    {
      codigo: "40301842",
      nome: "Ferro sérico",
      valorMinimo: 50,
      valorMaximo: 150,
      unidade: "ug/dL",
    },
    {
      codigo: "40316270",
      nome: "Ferritina",
      valorMinimo: 12,
      valorMaximo: 300,
      unidade: "ng/mL",
    },
    {
      codigo: "40302520",
      nome: "Transferrina",
      valorMinimo: 200,
      valorMaximo: 360,
      unidade: "mg/dL",
    },
    {
      codigo: "40301427",
      nome: "Capacidade total de ligação do ferro (TIBC)",
      valorMinimo: 250,
      valorMaximo: 370,
      unidade: "ug/dL",
    },
    {
      codigo: "40301087",
      nome: "Ácido fólico eritrocitário",
      valorMinimo: 2.0,
      valorMaximo: 20.0,
      unidade: "ng/mL",
    },
    {
      codigo: "40316572",
      nome: "Vitamina B12",
      valorMinimo: 200,
      valorMaximo: 900,
      unidade: "pg/mL",
    },
    // ELETRÓLITOS E MINERAIS
    {
      codigo: "40302423",
      nome: "Sódio",
      valorMinimo: 136,
      valorMaximo: 145,
      unidade: "mEq/L",
    },
    {
      codigo: "40302318",
      nome: "Potássio",
      valorMinimo: 3.5,
      valorMaximo: 5.0,
      unidade: "mEq/L",
    },
    {
      codigo: "40301400",
      nome: "Cálcio total",
      valorMinimo: 8.6,
      valorMaximo: 10.2,
      unidade: "mg/dL",
    },
    {
      codigo: "40301419",
      nome: "Cálcio iônico",
      valorMinimo: 4.5,
      valorMaximo: 5.3,
      unidade: "mg/dL",
    },
    {
      codigo: "40301931",
      nome: "Fósforo",
      valorMinimo: 2.5,
      valorMaximo: 4.5,
      unidade: "mg/dL",
    },
    {
      codigo: "40302237",
      nome: "Magnésio",
      valorMinimo: 1.6,
      valorMaximo: 2.6,
      unidade: "mg/dL",
    },
    {
      codigo: "40301559",
      nome: "Cloro",
      valorMinimo: 98,
      valorMaximo: 106,
      unidade: "mEq/L",
    },
    {
      codigo: "40313328",
      nome: "Zinco",
      valorMinimo: 70,
      valorMaximo: 120,
      unidade: "ug/dL",
    },
    {
      codigo: "40313255",
      nome: "Selênio",
      valorMinimo: 46,
      valorMaximo: 143,
      unidade: "ug/L",
    },
    {
      codigo: "40301567",
      nome: "Cobre",
      valorMinimo: 70,
      valorMaximo: 140,
      unidade: "ug/dL",
    },
    {
      codigo: "40301273",
      nome: "Alumínio",
      valorMinimo: null,
      valorMaximo: 10,
      unidade: "ug/L",
    },
    {
      codigo: "40313310",
      nome: "Cromo",
      valorMinimo: 0.1,
      valorMaximo: 0.5,
      unidade: "ug/L",
    },
    // VITAMINAS
    {
      codigo: "40302830",
      nome: "Vitamina D (25-OH D3)",
      valorMinimo: 30,
      valorMaximo: 60,
      unidade: "ng/mL",
    },
    {
      codigo: "40302822",
      nome: "Vitamina D2",
      valorMinimo: 30,
      valorMaximo: 100,
      unidade: "ng/mL",
    },
    {
      codigo: "40305015",
      nome: "Vitamina D (1,25-dihidroxi)",
      valorMinimo: 15,
      valorMaximo: 75,
      unidade: "pg/mL",
    },
    {
      codigo: "40302601",
      nome: "Vitamina A (Retinol)",
      valorMinimo: 30,
      valorMaximo: 80,
      unidade: "ug/dL",
    },
    {
      codigo: "40301060",
      nome: "Vitamina C (Ácido ascórbico)",
      valorMinimo: 0.4,
      valorMaximo: 2.0,
      unidade: "mg/dL",
    },
    {
      codigo: "40302610",
      nome: "Vitamina E (Tocoferol)",
      valorMinimo: 5.0,
      valorMaximo: 18.0,
      unidade: "mg/L",
    },
    {
      codigo: "40302849",
      nome: "Vitamina K",
      valorMinimo: 0.1,
      valorMaximo: 2.2,
      unidade: "ng/mL",
    },
    {
      codigo: "40302784",
      nome: "Vitamina B1 (Tiamina)",
      valorMinimo: 70,
      valorMaximo: 180,
      unidade: "nmol/L",
    },
    {
      codigo: "40302792",
      nome: "Vitamina B2 (Riboflavina)",
      valorMinimo: 6.2,
      valorMaximo: 39.0,
      unidade: "nmol/L",
    },
    {
      codigo: "40302806",
      nome: "Vitamina B3 (Niacina)",
      valorMinimo: null,
      valorMaximo: null,
      unidade: "ug/L",
    },
    {
      codigo: "40302814",
      nome: "Vitamina B6 (Piridoxina)",
      valorMinimo: 5.0,
      valorMaximo: 50.0,
      unidade: "ug/L",
    },
    // FUNÇÃO TIREOIDEANA
    {
      codigo: "40316521",
      nome: "TSH",
      valorMinimo: 0.4,
      valorMaximo: 4.0,
      unidade: "uUI/mL",
    },
    {
      codigo: "40316556",
      nome: "T3 total (Triiodotironina)",
      valorMinimo: 80,
      valorMaximo: 200,
      unidade: "ng/dL",
    },
    {
      codigo: "40316467",
      nome: "T3 livre",
      valorMinimo: 2.0,
      valorMaximo: 4.4,
      unidade: "pg/mL",
    },
    {
      codigo: "40316548",
      nome: "T4 total (Tiroxina)",
      valorMinimo: 4.5,
      valorMaximo: 12.0,
      unidade: "ug/dL",
    },
    {
      codigo: "40316491",
      nome: "T4 livre",
      valorMinimo: 0.9,
      valorMaximo: 1.7,
      unidade: "ng/dL",
    },
    {
      codigo: "40316157",
      nome: "Anti-TPO",
      valorMinimo: null,
      valorMaximo: 35,
      unidade: "UI/mL",
    },
    {
      codigo: "40316106",
      nome: "Anti-tireoglobulina",
      valorMinimo: null,
      valorMaximo: 115,
      unidade: "UI/mL",
    },
    {
      codigo: "40316319",
      nome: "TBG (Globulina ligadora da tiroxina)",
      valorMinimo: 12,
      valorMaximo: 30,
      unidade: "ug/mL",
    },
    // HORMÔNIOS
    {
      codigo: "40316190",
      nome: "Cortisol (manhã)",
      valorMinimo: 5.0,
      valorMaximo: 23.0,
      unidade: "ug/dL",
    },
    {
      codigo: "40305465",
      nome: "Paratormônio (PTH)",
      valorMinimo: 15,
      valorMaximo: 65,
      unidade: "pg/mL",
    },
    {
      codigo: "40316246",
      nome: "Estradiol",
      valorMinimo: null,
      valorMaximo: null,
      unidade: "pg/mL",
    },
    {
      codigo: "40316513",
      nome: "Testosterona total",
      valorMinimo: null,
      valorMaximo: null,
      unidade: "ng/dL",
    },
    {
      codigo: "40316408",
      nome: "Progesterona",
      valorMinimo: null,
      valorMaximo: null,
      unidade: "ng/mL",
    },
    {
      codigo: "40316300",
      nome: "SHBG",
      valorMinimo: null,
      valorMaximo: null,
      unidade: "nmol/L",
    },
    // INFLAMATÓRIOS / IMUNOLOGIA
    {
      codigo: "40308383",
      nome: "PCR qualitativa",
      valorMinimo: null,
      valorMaximo: null,
      unidade: null,
    },
    {
      codigo: "40306305",
      nome: "Antigliadina IgA (Doença celíaca)",
      valorMinimo: null,
      valorMaximo: 20,
      unidade: "U/mL",
    },
    {
      codigo: "40306313",
      nome: "Antigliadina IgG (Doença celíaca)",
      valorMinimo: null,
      valorMaximo: 20,
      unidade: "U/mL",
    },
    {
      codigo: "40306259",
      nome: "Antiendomísio IgA",
      valorMinimo: null,
      valorMaximo: null,
      unidade: null,
    },
    {
      codigo: "40307220",
      nome: "IgA total",
      valorMinimo: 70,
      valorMaximo: 400,
      unidade: "mg/dL",
    },
    // URINA / DIGESTIVO
    {
      codigo: "40301109",
      nome: "Ácido lático (Lactato)",
      valorMinimo: 4.5,
      valorMaximo: 19.8,
      unidade: "mg/dL",
    },
    {
      codigo: "40301125",
      nome: "Ácido oxálico (urina 24h)",
      valorMinimo: null,
      valorMaximo: 40,
      unidade: "mg/24h",
    },
    {
      codigo: "40301281",
      nome: "Amilase",
      valorMinimo: 25,
      valorMaximo: 125,
      unidade: "U/L",
    },
    {
      codigo: "40302199",
      nome: "Lipase",
      valorMinimo: 10,
      valorMaximo: 140,
      unidade: "U/L",
    },
    // COPROLOGIA
    {
      codigo: "40303110",
      nome: "Parasitológico de fezes",
      valorMinimo: null,
      valorMaximo: null,
      unidade: null,
    },
    {
      codigo: "40303136",
      nome: "Sangue oculto nas fezes",
      valorMinimo: null,
      valorMaximo: null,
      unidade: null,
    },
    {
      codigo: "40303039",
      nome: "Coprológico funcional",
      valorMinimo: null,
      valorMaximo: null,
      unidade: null,
    },
    {
      codigo: "40303055",
      nome: "Gordura fecal",
      valorMinimo: null,
      valorMaximo: 7,
      unidade: "g/24h",
    },
    // GASOMETRIA
    {
      codigo: "40302016",
      nome: "Gasometria arterial",
      valorMinimo: null,
      valorMaximo: null,
      unidade: null,
    },
    {
      codigo: "40302407",
      nome: "Reserva alcalina (Bicarbonato)",
      valorMinimo: 22,
      valorMaximo: 26,
      unidade: "mEq/L",
    },
  ];

  for (const exame of examesBase) {
    const existe = await prisma.exameBase.findFirst({
      where: { clinicaId: clinica.id, codigo: exame.codigo },
    });
    if (!existe) {
      await prisma.exameBase.create({
        data: { ...exame, clinicaId: clinica.id, isBase: true },
      });
    }
  }
  console.log(`Exames base: ${examesBase.length} exames cadastrados`);

  // Questionário padrão do SAASN-15 (schema normalizado)
  const questionario = await criarQuestionarioPadraoParaClinica(clinica.id);

  // ===== Avaliações (respostas do questionário) para os 3 pacientes =====
  // Busca o questionário completo com módulos e perguntas
  const questionarioCompleto = await prisma.questionario.findUnique({
    where: { id: questionario.id },
    include: {
      modulos: {
        orderBy: { ordem: "asc" },
        include: {
          perguntas: { orderBy: { ordem: "asc" } },
        },
      },
    },
  });

  if (questionarioCompleto && isabela && olimpia && carlos) {
    // Coleta todas as perguntas em ordem
    const todasPerguntas = questionarioCompleto.modulos.flatMap(
      (m) => m.perguntas,
    );

    // Notas por paciente (63 respostas cada, escala 0-4)
    // Isabela: score ~72 — absoluta certeza de hipersensibilidade
    const notasIsabela = [
      // Cabeça (4): dor de cabeça, desmaio, tonturas, insônia
      3, 0, 2, 3,
      // Olhos (4): coceira, inchaço, olheiras, visão borrada
      2, 1, 3, 1,
      // Ouvidos (4): coceira, dores, fluido, zumbido
      1, 0, 0, 1,
      // Nariz (3): entupido, sinusite, ataques de espirro
      3, 2, 3,
      // Boca/Garganta (5): muco, tosse, dor de garganta, língua/lábios, aftas
      2, 1, 1, 0, 2,
      // Pele (5): acne, pele seca, cabelo, vermelhidão, suor excessivo
      1, 2, 1, 2, 1,
      // Coração (3): batimento falhando/rápido, dor no peito, congestão
      0, 0, 1,
      // Pulmão (3): asma, falta de fôlego, dificuldade respiratória
      3, 2, 2,
      // Trato Digestivo (7): náuseas, diarreia, constipação, distensão, arrotos, azia, dor estomacal
      2,
      1, 1, 2, 1, 2, 1,
      // Articulações/Músculos (5): dor articular, artrite, rigidez, dolorido, fraqueza
      1,
      0, 1, 2, 1,
      // Energia/Atividade (4): fadiga, apatia, hiperatividade, dificuldade de relaxar
      3,
      2, 0, 3,
      // Mente (8): memória, confusão, concentração, coordenação motora, decisão, repetições, pronúncia, aprendizagem
      1,
      0, 2, 0, 1, 0, 0, 1,
      // Emocional (4): humor, ansiedade, raiva, depressão
      2, 3, 1, 2,
      // Outros (4): doença frequente, urgência urinária, corrimento, edema
      1, 0, 0, 1,
    ]; // Total: 72

    // Olímpia: score ~38 — indicativo de hipersensibilidades
    const notasOlimpia = [
      // Cabeça (4)
      1, 0, 2, 1,
      // Olhos (4)
      1, 0, 1, 1,
      // Ouvidos (4)
      0, 1, 0, 1,
      // Nariz (3)
      1, 1, 0,
      // Boca/Garganta (5)
      1, 0, 1, 0, 0,
      // Pele (5)
      0, 1, 0, 1, 0,
      // Coração (3)
      1, 0, 0,
      // Pulmão (3)
      0, 1, 0,
      // Trato Digestivo (7)
      1, 1, 2, 2, 1, 1, 1,
      // Articulações/Músculos (5)
      2, 1, 2, 1, 1,
      // Energia/Atividade (4)
      1, 1, 0, 1,
      // Mente (8)
      1, 0, 1, 0, 0, 0, 0, 0,
      // Emocional (4)
      1, 1, 0, 1,
      // Outros (4)
      0, 1, 0, 1,
    ]; // Total: 38

    // Carlos: score ~18 — saudável
    const notasCarlos = [
      // Cabeça (4)
      1, 0, 0, 1,
      // Olhos (4)
      0, 0, 0, 0,
      // Ouvidos (4)
      0, 0, 0, 0,
      // Nariz (3)
      1, 0, 0,
      // Boca/Garganta (5)
      0, 0, 0, 0, 0,
      // Pele (5)
      1, 0, 0, 0, 1,
      // Coração (3)
      0, 0, 0,
      // Pulmão (3)
      0, 0, 0,
      // Trato Digestivo (7)
      0, 0, 0, 1, 0, 1, 0,
      // Articulações/Músculos (5)
      0, 0, 0, 1, 1,
      // Energia/Atividade (4)
      1, 0, 0, 1,
      // Mente (8)
      1, 0, 1, 0, 1, 0, 0, 1,
      // Emocional (4)
      1, 1, 0, 1,
      // Outros (4)
      0, 1, 0, 0,
    ]; // Total: 18

    const pacientesNotas = [
      {
        paciente: isabela,
        notas: notasIsabela,
        score: 72,
        data: new Date("2025-11-15"),
      },
      {
        paciente: olimpia,
        notas: notasOlimpia,
        score: 38,
        data: new Date("2025-12-03"),
      },
      {
        paciente: carlos,
        notas: notasCarlos,
        score: 18,
        data: new Date("2026-01-20"),
      },
    ];

    for (const { paciente, notas, score, data } of pacientesNotas) {
      // Verifica se já existe avaliação para este paciente neste questionário
      const avaliacaoExistente = await prisma.avaliacao.findFirst({
        where: { pacienteId: paciente.id, questionarioId: questionario.id },
      });

      if (!avaliacaoExistente) {
        await prisma.avaliacao.create({
          data: {
            clinicaId: clinica.id,
            dataRealizacao: data,
            scoreTotal: score,
            pacienteId: paciente.id,
            questionarioId: questionario.id,
            respostas: {
              create: todasPerguntas.map((pergunta, idx) => ({
                nota: notas[idx] ?? 0,
                perguntaId: pergunta.id,
                pacienteId: paciente.id,
              })),
            },
          },
        });
        console.log(`Avaliação criada: ${paciente.nome} — score ${score}`);
      } else {
        console.log(`Avaliação já existe: ${paciente.nome}`);
      }
    }
  }

  console.log("Seed executado com sucesso!");
  console.log(`Clínica: ${clinica.nome} (${clinica.id})`);
  console.log(
    "Usuarios: admin@nutricao.com / nutri@nutricao.com / secretaria@nutricao.com",
  );
  console.log("Senha padrão: 123456");
  console.log("Questionário QRM criado com respostas para 3 pacientes");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
