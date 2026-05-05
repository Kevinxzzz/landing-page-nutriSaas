import './HowItWorks.scss'
import InteractiveTechBackground from '../InteractiveTechBackground/InteractiveTechBackground'

const STEPS = [
  {
    n: '01',
    emoji: '🏥',
    title: 'Configure sua clínica',
    desc: 'Cadastre sua clínica, adicione usuários com perfis de Nutricionista, Admin ou Secretaria e personalize o ambiente em minutos.',
  },
  {
    n: '02',
    emoji: '👤',
    title: 'Adicione seus pacientes',
    desc: 'Registre dados pessoais, histórico social, convênios e crie a ficha completa de cada paciente de forma rápida e segura.',
  },
  {
    n: '03',
    emoji: '📋',
    title: 'Gerencie atendimentos',
    desc: 'Crie prontuários, evolua consultas, registre medidas antropométricas e acompanhe a jornada de saúde de cada paciente.',
  },
]

export default function HowItWorks() {
  return (
    <section className="how-it-works" id="como-funciona" aria-label="Como funciona">
      <InteractiveTechBackground />
      <div className="how-it-works__inner">
        <header className="how-it-works__header">
          <span className="how-it-works__badge">Como funciona</span>
          <h2 className="how-it-works__title">
            Simples de usar.{' '}
            <em>Poderoso nos resultados.</em>
          </h2>
          <p className="how-it-works__subtitle">
            Em apenas três passos, você tem uma clínica organizada, pacientes
            bem atendidos e mais tempo para o que realmente importa.
          </p>
        </header>

        <div className="how-it-works__steps">
          {STEPS.map((step) => (
            <article key={step.n} className="how-it-works__step">
              <span className="how-it-works__step-number">{step.n}</span>
              <div className="how-it-works__step-icon">
                <span className="how-it-works__step-icon-emoji">{step.emoji}</span>
              </div>
              <div className="how-it-works__step-content">
                <h3 className="how-it-works__step-title">{step.title}</h3>
                <p className="how-it-works__step-desc">{step.desc}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="how-it-works__cta-row">
          <a href="#teste-gratis" className="how-it-works__cta-btn" id="hiw-cta-btn">
            Começar Agora — É Grátis →
          </a>
        </div>
      </div>
    </section>
  )
}
