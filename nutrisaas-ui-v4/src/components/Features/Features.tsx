import { motion, type Variants } from 'framer-motion'
import { 
  UserCircle, 
  Calendar, 
  Folder, 
  Ruler, 
  ClipboardText, 
  Flask, 
  Hospital, 
  ChartPieSlice, 
  ShieldCheck
} from '@phosphor-icons/react'
import './Features.scss'

const FEATURES = [
  { 
    id: 1,
    icon: <UserCircle weight="duotone" />, 
    title: 'Gestão Completa de Pacientes', 
    desc: 'Cadastro centralizado com histórico social, anamnese e ficha digital. Tenha o controle total das informações dos seus pacientes de forma segura.', 
    size: 'large' 
  },
  { 
    id: 2,
    icon: <Calendar weight="duotone" />, 
    title: 'Agenda Inteligente', 
    desc: 'Organize suas consultas, controle retornos e automatize confirmações para reduzir as faltas na sua clínica de nutrição.', 
    size: 'small'
  },
  { 
    id: 3,
    icon: <Folder weight="duotone" />, 
    title: 'Prontuário Eletrônico', 
    desc: 'Evolução clínica contínua com histórico detalhado e antecedentes. Esqueça o papel e tenha tudo salvo na nuvem.', 
    size: 'small'
  },
  { 
    id: 4,
    icon: <Ruler weight="duotone" />, 
    title: 'Antropometria', 
    desc: 'Acompanhe peso, IMC e medidas corporais com gráficos de evolução automáticos.', 
    size: 'large'
  },
  { 
    id: 5,
    icon: <ClipboardText weight="duotone" />, 
    title: 'Questionários e Anamnese', 
    desc: 'Crie protocolos de anamnese personalizados com pontuação e regras de classificação automáticas para cada paciente.', 
    size: 'small'
  },
  { 
    id: 6,
    icon: <Flask weight="duotone" />, 
    title: 'Controle de Exames Bioquímicos', 
    desc: 'Solicite e monitore parâmetros bioquímicos baseados em valores de referência nutricionais atualizados.', 
    size: 'small'
  },
  { 
    id: 7,
    icon: <ChartPieSlice weight="duotone" />, 
    title: 'Dashboard Analítico', 
    desc: 'Métricas estratégicas e relatórios gerenciais para o crescimento da sua clínica.', 
    size: 'large'
  },
  { 
    id: 8,
    icon: <ShieldCheck weight="duotone" />, 
    title: 'Segurança & Perfis', 
    desc: 'Dados isolados e controle granular de acesso para Admin, Nutri e Secretaria.', 
    size: 'small'
  },
  { 
    id: 9,
    icon: <Hospital weight="duotone" />, 
    title: 'Gestão de Convênios', 
    desc: 'Integração completa com operadoras de saúde e faturamento organizado.', 
    size: 'small'
  }
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.21, 0.45, 0.32, 0.9]
    }
  }
}

export default function Features() {
  return (
    <section className="features-v2" id="funcionalidades">
      <div className="features-v2__inner">
        <header className="features-v2__header">
          <motion.span 
            className="features-v2__badge"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Recursos do Sistema
          </motion.span>
          <motion.h2 
            className="features-v2__title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Tudo que sua clínica de nutrição precisa <br />
            <span>em um único software</span>
          </motion.h2>
          <motion.p 
            className="features-v2__subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Elimine planilhas e processos manuais. O NutriSaaS centraliza toda a 
            operação da sua clínica com inteligência e elegância.
          </motion.p>
        </header>

        <motion.div 
          className="features-v2__grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {FEATURES.map((feature) => (
            <motion.div 
              key={feature.id}
              className={`features-v2__card features-v2__card--${feature.size}`}
              variants={itemVariants}
            >
              <div className="features-v2__card-glow" />
              <div className="features-v2__card-content">
                <div className="features-v2__card-icon">
                  {feature.icon}
                </div>
                <div className="features-v2__card-text">
                  <h3 className="features-v2__card-title">{feature.title}</h3>
                  <p className="features-v2__card-desc">{feature.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
