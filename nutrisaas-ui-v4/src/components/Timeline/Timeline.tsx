import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { TrendUp, Target, ChartLineUp, CheckCircle } from '@phosphor-icons/react';
import InteractiveTechBackground from '../InteractiveTechBackground/InteractiveTechBackground';
import './Timeline.scss';

const TIMELINE_DATA = [
  {
    id: 1,
    date: '1ª Consulta — 15 Jan',
    title: 'Avaliação Inicial',
    desc: 'Anamnese completa, antropometria e definição de metas. Paciente com objetivo de reeducação alimentar.',
    statValue: '78.5 kg',
    statLabel: 'Peso inicial',
    icon: <Target weight="duotone" />
  },
  {
    id: 2,
    date: 'Retorno — 12 Fev',
    title: 'Primeiros Resultados',
    desc: 'Paciente relata mais disposição. Redução de medidas abdominais e melhora nos exames laboratoriais.',
    statValue: '-2.3 kg',
    statLabel: 'Peso perdido',
    icon: <TrendUp weight="duotone" />
  },
  {
    id: 3,
    date: 'Acompanhamento — 18 Mar',
    title: 'Evolução Consistente',
    desc: 'Ajuste de plano alimentar. Questionário de hipersensibilidade identifica intolerância à lactose.',
    statValue: '-4.8 kg',
    statLabel: 'Total perdido',
    icon: <ChartLineUp weight="duotone" />
  },
  {
    id: 4,
    date: 'Resultado — 22 Abr',
    title: 'Meta Atingida',
    desc: 'Paciente atinge peso ideal com melhora significativa em todos os indicadores. Plano de manutenção definido.',
    statValue: '-7.2 kg',
    statLabel: 'Resultado final',
    icon: <CheckCircle weight="duotone" />
  }
];

const TimelineItem = ({ item, index }: { item: typeof TIMELINE_DATA[0], index: number }) => {
  const ref = useRef(null);
  // Using useInView to trigger the node's glowing state as it reaches the center of the viewport
  const isInView = useInView(ref, { once: false, margin: "-30% 0px -30% 0px" });

  return (
    <div className="timeline__item" ref={ref}>
      <div className={`timeline__node ${isInView ? 'is-active' : ''}`}>
        {item.icon}
      </div>
      <div className="timeline__content-wrapper">
        <motion.div 
          className="timeline__content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
        >
          <span className="timeline__date">{item.date}</span>
          <h3 className="timeline__card-title">{item.title}</h3>
          <p className="timeline__card-desc">{item.desc}</p>
          <div className="timeline__stat">
            <span className="timeline__stat-value">{item.statValue}</span>
            <span className="timeline__stat-label">{item.statLabel}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default function Timeline() {
  const containerRef = useRef(null);
  
  // Track scroll progress within the container for the vertical progress line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="timeline" id="timeline">
      <InteractiveTechBackground 
        className="timeline__bg"
        cellSize={4}
        clusterCount={6}
        gridOpacity={0.03}
        sweepOpacity={0.035}
        noiseIntensity={0.008}
        intensity={1.1}
      />
      <div className="timeline__inner">
        
        <div className="timeline__header">
          <div className="timeline__badge">
            <ChartLineUp weight="bold" size={16} />
            Evolução Real
          </div>
          <h2 className="timeline__title">
            Acompanhe cada passo da <br />
            <span>jornada do paciente</span>
          </h2>
          <p className="timeline__subtitle">
            Veja como o NutriSaaS transforma dados em uma história visual de progresso, engajando e fidelizando através de resultados.
          </p>
        </div>

        <div className="timeline__track-container" ref={containerRef}>
          <div className="timeline__line-bg">
            <motion.div className="timeline__line-fill" style={{ scaleY }} />
          </div>

          {TIMELINE_DATA.map((item, index) => (
            <TimelineItem key={item.id} item={item} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}
