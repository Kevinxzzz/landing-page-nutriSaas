import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Buildings, Users, Stethoscope, CheckCircle, Clock } from '@phosphor-icons/react'
import InteractiveTechBackground from '../InteractiveTechBackground/InteractiveTechBackground'
import './HowItWorks.scss'

// Perpetual Micro-interaction components (Taste Skill)
const MicroClinic = () => (
  <div className="hiw-micro hiw-micro--clinic">
    <div className="hiw-micro__header">
      <div className="hiw-micro__dot" />
      <div className="hiw-micro__line" style={{ width: '40%' }} />
    </div>
    <div className="hiw-micro__blocks">
      <motion.div 
        className="hiw-micro__block" 
        animate={{ opacity: [0.6, 1, 0.6], scale: [0.98, 1, 0.98] }} 
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} 
      />
      <motion.div 
        className="hiw-micro__block" 
        animate={{ opacity: [0.6, 1, 0.6], scale: [0.98, 1, 0.98] }} 
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} 
      />
    </div>
  </div>
)

const MicroUsers = () => (
  <div className="hiw-micro hiw-micro--users">
    <motion.div 
      className="hiw-micro__avatar"
      animate={{ y: [-5, 5, -5] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <img src="https://i.pravatar.cc/150?img=44" alt="Paciente" />
    </motion.div>
    <div className="hiw-micro__lines">
      <motion.div 
        className="hiw-micro__line" 
        animate={{ width: ['40%', '80%', '40%'] }} 
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
      />
      <div className="hiw-micro__line" style={{ width: '60%' }} />
    </div>
  </div>
)

const MicroRecords = () => (
  <div className="hiw-micro hiw-micro--records">
    <motion.div 
      className="hiw-micro__status"
      animate={{ opacity: [1, 0, 0, 1] }}
      transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.6, 1] }}
    >
      <Clock weight="fill" className="hiw-micro__status-icon" />
      <span>Em andamento</span>
    </motion.div>
    <motion.div 
      className="hiw-micro__check"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: [0.8, 1.1, 1], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.5, 0.9] }}
    >
      <CheckCircle weight="fill" />
      <span>Prontuário salvo</span>
    </motion.div>
  </div>
)

const MICRO_ANIMATIONS = [
  <MicroClinic key="1" />, 
  <MicroUsers key="2" />, 
  <MicroRecords key="3" />
]

const STEPS = [
  {
    n: '01',
    icon: <Buildings weight="duotone" />,
    label: 'Clínica',
    title: 'Configuração Descomplicada',
    desc: 'Cadastre sua clínica, adicione sua equipe com perfis de acesso e personalize o ambiente em minutos. O software se adapta a você.',
  },
  {
    n: '02',
    icon: <Users weight="duotone" />,
    label: 'Pacientes',
    title: 'Gestão de Pacientes Centralizada',
    desc: 'Registre dados pessoais, histórico social e crie anamneses completas. Tenha a visão 360° da saúde do seu paciente a um clique.',
  },
  {
    n: '03',
    icon: <Stethoscope weight="duotone" />,
    label: 'Atendimentos',
    title: 'Prontuário Eletrônico e Atendimento',
    desc: 'Registre evoluções, avaliações antropométricas e gere dietas inteligentes de forma ágil. Otimize o tempo de consulta.',
  },
]

export default function HowItWorks() {
  const containerRef = useRef<HTMLElement>(null)
  
  // Track scroll progress of the 300vh section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const [activeStep, setActiveStep] = useState(0)

  // Sync scroll progress to active step state
  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      let step = Math.floor(latest * STEPS.length)
      if (step >= STEPS.length) step = STEPS.length - 1
      
      if (step !== activeStep) {
        setActiveStep(step)
      }
    })
  }, [scrollYProgress, activeStep])

  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <section className="how-it-works-v2" id="como-funciona" ref={containerRef}>
      <div className="how-it-works-v2__sticky">
        {/* Premium Interactive Background */}
        <InteractiveTechBackground
          className="how-it-works-v2__bg"
          cellSize={4}
          clusterCount={7}
          gridOpacity={0.03}
          sweepOpacity={0.035}
          noiseIntensity={0.008}
          intensity={1.1}
        />

        <div className="how-it-works-v2__inner">
          
          {/* Left Column: Text & Vertical Bar */}
          <div className="how-it-works-v2__left">
            <span className="how-it-works-v2__badge">Como Funciona o Sistema</span>
            <h2 className="how-it-works-v2__title">
              Automação e eficiência em <br />
              <span>cada etapa do atendimento</span>
            </h2>
            
            <div className="how-it-works-v2__content-wrapper">
              <div className="how-it-works-v2__topics">
                {STEPS.map((step, index) => (
                  <div 
                    key={step.n} 
                    className={`how-it-works-v2__topic ${activeStep === index ? 'is-active' : ''}`}
                  >
                    {step.label}
                  </div>
                ))}
              </div>

              <div className="how-it-works-v2__track-wrapper">
                <div className="how-it-works-v2__track-line">
                  <motion.div 
                    className="how-it-works-v2__track-fill" 
                    style={{ height: progressHeight }} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Single Fading Card */}
          <div className="how-it-works-v2__right">
            <div className="how-it-works-v2__card-viewer">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  className="how-it-works-v2__card"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div className="how-it-works-v2__card-header">
                    <div className="how-it-works-v2__card-icon">
                      {STEPS[activeStep].icon}
                    </div>
                    <span className="how-it-works-v2__card-number">{STEPS[activeStep].n}</span>
                  </div>
                  
                  <div className="how-it-works-v2__card-body">
                    <h3 className="how-it-works-v2__card-title">{STEPS[activeStep].title}</h3>
                    <p className="how-it-works-v2__card-desc">{STEPS[activeStep].desc}</p>
                  </div>
                  
                  <div className="how-it-works-v2__card-visual">
                    {MICRO_ANIMATIONS[activeStep]}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
