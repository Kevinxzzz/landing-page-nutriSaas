import './ForWho.scss'

const PROFILES = [
  {
    emoji: '🥗',
    title: 'Nutricionistas autônomos',
    desc: 'Profissionais liberais que atendem individualmente e precisam de uma ferramenta que organize toda a jornada do paciente sem complexidade.',
    tags: ['Prontuário', 'Agenda', 'Medidas'],
  },
  {
    emoji: '🏥',
    title: 'Clínicas e consultórios',
    desc: 'Estruturas com equipe multidisciplinar que precisam de controle de usuários, múltiplos nutricionistas e visão gerencial da clínica.',
    tags: ['Multitenancy', 'Relatórios', 'Equipe'],
  },
  {
    emoji: '🏋️',
    title: 'Clínicas esportivas',
    desc: 'Nutricionistas que atendem atletas e precisam acompanhar evolução corporal, exames bioquímicos e performance ao longo do tempo.',
    tags: ['Antropometria', 'Exames', 'Evolução'],
  },
  {
    emoji: '👩‍⚕️',
    title: 'Nutricionistas hospitalares',
    desc: 'Profissionais em ambientes clínicos que registram evoluções contínuas, histórico de condições mórbidas e controle de medicações.',
    tags: ['Evolução clínica', 'Histórico'],
  },
  {
    emoji: '📚',
    title: 'Clínicas acadêmicas',
    desc: 'Instituições de ensino que precisam de um sistema robusto para formação de alunos, registros de atendimentos e avaliações padronizadas.',
    tags: ['Questionários', 'Avaliações'],
  },
  {
    emoji: '🌿',
    title: 'Centros de bem-estar',
    desc: 'Espaços de saúde integrativa que combinam nutrição com outras práticas e precisam centralizar as informações de cada paciente.',
    tags: ['Fichas', 'Convênios'],
  },
]

export default function ForWho() {
  return (
    <section className="for-who" id="para-quem" aria-label="Para quem é o NutriSaaS">
      <div className="for-who__inner">
        <header className="for-who__header">
          <span className="for-who__badge">Para quem é</span>
          <h2 className="for-who__title">
            Feito para quem{' '}
            <em>cuida de quem cuida da saúde</em>
          </h2>
          <p className="for-who__subtitle">
            Do consultório individual à rede de clínicas — o NutriSaaS se adapta
            ao seu contexto e escala com o seu crescimento.
          </p>
        </header>

        <div className="for-who__grid">
          {PROFILES.map((p) => (
            <article key={p.title} className="for-who__card">
              <span className="for-who__card-emoji">{p.emoji}</span>
              <h3 className="for-who__card-title">{p.title}</h3>
              <p className="for-who__card-desc">{p.desc}</p>
              <div className="for-who__card-tags">
                {p.tags.map((t) => (
                  <span key={t} className="for-who__card-tag">{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
