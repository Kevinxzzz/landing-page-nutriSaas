import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Buildings, Barbell, FirstAid, GraduationCap, Plant, CheckCircle } from '@phosphor-icons/react'
import InteractiveTechBackground from '../InteractiveTechBackground/InteractiveTechBackground';
import './ForWho.scss'

const PROFILES = [
  {
    id: 0,
    icon: User,
    title: 'Nutricionistas autônomos',
    desc: 'Profissionais liberais que atendem individualmente e precisam de uma ferramenta que organize toda a jornada do paciente sem complexidade.',
    tags: ['Prontuário', 'Agenda', 'Medidas'],
  },
  {
    id: 1,
    icon: Buildings,
    title: 'Clínicas e consultórios',
    desc: 'Estruturas com equipe multidisciplinar que precisam de controle de usuários, múltiplos nutricionistas e visão gerencial da clínica.',
    tags: ['Multitenancy', 'Relatórios', 'Equipe'],
  },
  {
    id: 2,
    icon: Barbell,
    title: 'Clínicas esportivas',
    desc: 'Nutricionistas que atendem atletas e precisam acompanhar evolução corporal, exames bioquímicos e performance ao longo do tempo.',
    tags: ['Antropometria', 'Exames', 'Evolução'],
  },
  {
    id: 3,
    icon: FirstAid,
    title: 'Nutri. hospitalares',
    desc: 'Profissionais em ambientes clínicos que registram evoluções contínuas, histórico de condições mórbidas e controle de medicações.',
    tags: ['Evolução clínica', 'Histórico'],
  },
  {
    id: 4,
    icon: GraduationCap,
    title: 'Clínicas acadêmicas',
    desc: 'Instituições de ensino que precisam de um sistema robusto para formação de alunos, registros de atendimentos e avaliações padronizadas.',
    tags: ['Questionários', 'Avaliações'],
  },
  {
    id: 5,
    icon: Plant,
    title: 'Centros de bem-estar',
    desc: 'Espaços de saúde integrativa que combinam nutrição com outras práticas e precisam centralizar as informações de cada paciente.',
    tags: ['Fichas', 'Convênios'],
  },
]

const AUTO_PLAY_INTERVAL = 5000;

export default function ForWho() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PROFILES.length);
    }, AUTO_PLAY_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered]);

  const activeProfile = PROFILES[activeIndex];
  const ActiveIcon = activeProfile.icon;

  return (
    <section className="for-who-v2" id="para-quem">
      <InteractiveTechBackground 
        className="for-who-v2__bg"
        cellSize={4}
        clusterCount={6}
        gridOpacity={0.03}
        sweepOpacity={0.035}
        noiseIntensity={0.008}
        intensity={1.1}
      />
      <div className="for-who-v2__inner">
        
        <header className="for-who-v2__header">
          <span className="for-who-v2__badge">Ecossistema Flexível</span>
          <h2 className="for-who-v2__title">
            Feito para quem{' '}
            <span>cuida de quem cuida da saúde</span>
          </h2>
          <p className="for-who-v2__subtitle">
            Do consultório individual à rede de clínicas — o NutriSaaS se adapta
            ao seu contexto e escala com o seu crescimento.
          </p>
        </header>

        <div 
          className="for-who-v2__layout"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Left: Tab List */}
          <div className="for-who-v2__tabs">
            {PROFILES.map((profile, index) => {
              const isActive = index === activeIndex;
              const Icon = profile.icon;
              
              return (
                <button
                  key={profile.id}
                  className={`for-who-v2__tab ${isActive ? 'is-active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                >
                  <div className="for-who-v2__tab-icon">
                    <Icon weight={isActive ? "fill" : "regular"} size={20} />
                  </div>
                  <span className="for-who-v2__tab-title">{profile.title}</span>
                  
                  {isActive && (
                    <motion.div 
                      className="for-who-v2__tab-progress"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ 
                        duration: isHovered ? 0 : AUTO_PLAY_INTERVAL / 1000, 
                        ease: "linear" 
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Showcase Window */}
          <div className="for-who-v2__showcase">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProfile.id}
                className="for-who-v2__showcase-card"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="for-who-v2__showcase-bg-icon">
                  <ActiveIcon weight="duotone" />
                </div>

                <div className="for-who-v2__showcase-content">
                  <div className="for-who-v2__showcase-icon-box">
                    <ActiveIcon weight="duotone" size={32} />
                  </div>
                  
                  <h3 className="for-who-v2__showcase-title">{activeProfile.title}</h3>
                  <p className="for-who-v2__showcase-desc">{activeProfile.desc}</p>
                  
                  <div className="for-who-v2__showcase-tags">
                    {activeProfile.tags.map(tag => (
                      <span key={tag} className="for-who-v2__showcase-tag">
                        <CheckCircle weight="fill" size={16} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  )
}
