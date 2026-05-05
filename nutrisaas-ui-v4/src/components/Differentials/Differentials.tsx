import { motion, type Variants } from 'framer-motion'
import { 
  ShieldCheck, 
  Devices, 
  Lightning, 
  ChartLine, 
  CheckCircle,
  Sparkle,
  Target,
  ArrowRight
} from '@phosphor-icons/react'
import './Differentials.scss'

const HIGHLIGHTS = [
  'Multitenancy real com isolamento total',
  'Scoring automático em questionários',
  'Valores de referência integrados',
  'Níveis de acesso Admin e Nutri',
  'Ativação completa em < 1 hora',
]

const CARDS = [
  { 
    id: 1,
    icon: <ShieldCheck weight="duotone" />, 
    title: 'Segurança Enterprise', 
    desc: 'Arquitetura Multi-tenant que garante o isolamento absoluto dos dados de cada clínica.',
    color: 'emerald'
  },
  { 
    id: 2,
    icon: <Devices weight="duotone" />, 
    title: 'UX First Design', 
    desc: 'Interface limpa e intuitiva, projetada para a produtividade real do nutricionista.',
    color: 'blue'
  },
  { 
    id: 3,
    icon: <Lightning weight="duotone" />, 
    title: 'Deploy Instantâneo', 
    desc: 'Sem configurações complexas. Cadastre-se e comece a atender no mesmo dia.',
    color: 'amber'
  },
  { 
    id: 4,
    icon: <ChartLine weight="duotone" />, 
    title: 'Inteligência de Dados', 
    desc: 'Dashboards analíticos que transformam dados brutos em decisões estratégicas.',
    color: 'green'
  },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}

export default function Differentials() {
  return (
    <section className="differentials-v2" id="diferenciais">
      <div className="differentials-v2__inner">
        <div className="differentials-v2__layout">
          
          {/* Left Side: Content & List */}
          <div className="differentials-v2__content">
            <motion.header 
              className="differentials-v2__header"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="differentials-v2__badge">
                <Sparkle weight="fill" />
                Por que o NutriSaaS?
              </div>
              <h2 className="differentials-v2__title">
                Excelência técnica em <br />
                <span>cada detalhe</span>
              </h2>
              <p className="differentials-v2__subtitle">
                Mais do que um prontuário, uma infraestrutura completa para o 
                sucesso e a escalabilidade da sua prática clínica.
              </p>
            </motion.header>

            <motion.ul 
              className="differentials-v2__list"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {HIGHLIGHTS.map((text, idx) => (
                <motion.li key={idx} className="differentials-v2__list-item" variants={itemVariants}>
                  <div className="differentials-v2__list-icon">
                    <CheckCircle weight="fill" />
                  </div>
                  <span>{text}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div 
              className="differentials-v2__cta-box"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <a href="#contato" className="differentials-v2__cta-link">
                Falar com especialista <ArrowRight />
              </a>
            </motion.div>
          </div>

          {/* Right Side: Cards Grid */}
          <div className="differentials-v2__grid">
            {CARDS.map((card, idx) => (
              <motion.div 
                key={card.id}
                className={`differentials-v2__card differentials-v2__card--${card.color}`}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <div className="differentials-v2__card-icon">
                  {card.icon}
                </div>
                <h3 className="differentials-v2__card-title">{card.title}</h3>
                <p className="differentials-v2__card-desc">{card.desc}</p>
                <div className="differentials-v2__card-decoration">
                  <Target weight="thin" size={120} />
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
