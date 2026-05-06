import { motion } from 'framer-motion'
import { Star, Quotes, CheckCircle } from '@phosphor-icons/react'
import './Testimonials.scss'

const TESTIMONIALS = [
  {
    stars: 5,
    quote: 'Antes do NutriSaaS eu perdia horas com planilhas e papelada. Hoje tenho o histórico completo de cada paciente em segundos e a equipe toda trabalhando integrada.',
    name: 'Dra. Camila Rocha',
    role: 'Nutricionista clínica',
    location: 'São Paulo, SP',
    initials: 'CR',
    featured: true,
  },
  {
    stars: 5,
    quote: 'O controle de exames e antropometria finalmente num só lugar. Consigo mostrar a evolução do paciente em gráfico, o que muda completamente a consulta.',
    name: 'Dr. Rafael Mendes',
    role: 'Nutricionista esportivo',
    location: 'Curitiba, PR',
    initials: 'RM',
  },
  {
    stars: 5,
    quote: 'A agenda integrada ao prontuário é exatamente o que faltava. Agora a secretária confirma a consulta e eu já tenho tudo preparado.',
    name: 'Dra. Juliana Torres',
    role: 'Gestora de clínica',
    location: 'Rio de Janeiro, RJ',
    initials: 'JT',
  },
  {
    stars: 5,
    quote: 'Os questionários dinâmicos com scoring automático poupam 30 minutos por consulta. É uma das funcionalidades que mais surpreendeu a equipe.',
    name: 'Ms. André Lima',
    role: 'Nutricionista hospitalar',
    location: 'Belo Horizonte, MG',
    initials: 'AL',
  },
  {
    stars: 5,
    quote: 'Atendo três clínicas diferentes e o sistema isola tudo perfeitamente. Não precisei de nenhum treinamento especial — é muito intuitivo.',
    name: 'Dra. Priscila Neves',
    role: 'Nutricionista',
    location: 'Porto Alegre, RS',
    initials: 'PN',
  },
  {
    stars: 5,
    quote: 'O onboarding foi absurdamente rápido. Em menos de uma hora já estava cadastrando pacientes e gerando prontuários. Suporte excelente.',
    name: 'Dr. Felipe Santos',
    role: 'Nutricionista autônomo',
    location: 'Fortaleza, CE',
    initials: 'FS',
  },
]

export default function Testimonials() {
  return (
    <section className="testimonials" id="depoimentos" aria-label="Depoimentos">
      <div className="testimonials__background">
        <div className="testimonials__blob" />
        <div className="testimonials__blob testimonials__blob--alt" />
      </div>

      <div className="testimonials__inner">
        <header className="testimonials__header">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="testimonials__badge-wrapper"
          >
            <span className="testimonials__badge">Social Proof</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="testimonials__title"
          >
            Nutricionistas que elevam o <br />
            <span>padrão da clínica</span> com NutriSaaS
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="testimonials__subtitle"
          >
            Junte-se a milhares de profissionais que transformaram a gestão do consultório <br />
            em uma experiência premium para seus pacientes.
          </motion.p>
        </header>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="testimonials__carousel-container"
        >
          <div className="testimonials__carousel-group">
            {TESTIMONIALS.map((t, i) => (
              <article
                key={`g1-${i}`}
                className={`testimonials__card ${t.featured ? 'testimonials__card--featured' : ''}`}
              >
                <div className="testimonials__card-header">
                  <div className="testimonials__stars">
                    {[...Array(t.stars)].map((_, i) => (
                      <Star key={i} weight="fill" />
                    ))}
                  </div>
                  <Quotes weight="fill" className="testimonials__quote-icon" />
                </div>

                <blockquote className="testimonials__quote">
                  {t.quote}
                </blockquote>

                <footer className="testimonials__card-footer">
                  <div className="testimonials__avatar-group">
                    <div className="testimonials__avatar">
                      {t.initials}
                    </div>
                    <div className="testimonials__verified">
                      <CheckCircle weight="fill" />
                    </div>
                  </div>
                  
                  <div className="testimonials__author-info">
                    <cite className="testimonials__name">{t.name}</cite>
                    <span className="testimonials__role">
                      {t.role} 
                      <span className="testimonials__location">• {t.location}</span>
                    </span>
                  </div>
                </footer>
              </article>
            ))}
          </div>
          
          {/* Duplicate group for infinite scroll */}
          <div className="testimonials__carousel-group" aria-hidden="true">
            {TESTIMONIALS.map((t, i) => (
              <article
                key={`g2-${i}`}
                className={`testimonials__card ${t.featured ? 'testimonials__card--featured' : ''}`}
              >
                <div className="testimonials__card-header">
                  <div className="testimonials__stars">
                    {[...Array(t.stars)].map((_, i) => (
                      <Star key={i} weight="fill" />
                    ))}
                  </div>
                  <Quotes weight="fill" className="testimonials__quote-icon" />
                </div>

                <blockquote className="testimonials__quote">
                  {t.quote}
                </blockquote>

                <footer className="testimonials__card-footer">
                  <div className="testimonials__avatar-group">
                    <div className="testimonials__avatar">
                      {t.initials}
                    </div>
                    <div className="testimonials__verified">
                      <CheckCircle weight="fill" />
                    </div>
                  </div>
                  
                  <div className="testimonials__author-info">
                    <cite className="testimonials__name">{t.name}</cite>
                    <span className="testimonials__role">
                      {t.role} 
                      <span className="testimonials__location">• {t.location}</span>
                    </span>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="testimonials__footer-note"
        >
        </motion.div>
      </div>
    </section>
  )
}
