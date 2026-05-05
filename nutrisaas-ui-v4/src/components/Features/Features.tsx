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
    title: 'Gestão de Pacientes', 
    desc: 'Cadastro centralizado com histórico social, convênios e ficha completa. Tudo que você precisa saber sobre seu paciente em um só lugar.', 
    size: 'large' 
  },
  { 
    id: 2,
    icon: <Calendar weight="duotone" />, 
    title: 'Agenda Inteligente', 
    desc: 'Gerencie consultas, encaixes e o ciclo de vida do atendimento em tempo real.', 
    size: 'small'
  },
  { 
    id: 3,
    icon: <Folder weight="duotone" />, 
    title: 'Prontuário Digital', 
    desc: 'Evolução clínica contínua com histórico digestivo e antecedentes mórbidos.', 
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
    title: 'Questionários', 
    desc: 'Crie avaliações personalizadas com pontuação e regras de classificação automáticas.', 
    size: 'small'
  },
  { 
    id: 6,
    icon: <Flask weight="duotone" />, 
    title: 'Controle de Exames', 
    desc: 'Solicite e monitore parâmetros bioquímicos baseados em valores de referência.', 
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
            Ecossistema Completo
          </motion.span>
          <motion.h2 
            className="features-v2__title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Tudo que sua clínica precisa <br />
            <span>em uma única plataforma</span>
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
