import './Features.scss'

const FEATURES = [
  { emoji: '👤', title: 'Gestão de Pacientes', desc: 'Cadastro completo com dados pessoais, histórico social, endereço e convênios. Ficha centralizada por paciente.', link: 'Prontuário' },
  { emoji: '📅', title: 'Agenda e Agendamentos', desc: 'Crie consultas, gerencie encaixes e acompanhe o ciclo de vida de cada atendimento com status em tempo real.', link: 'Agenda' },
  { emoji: '📋', title: 'Prontuário Eletrônico', desc: 'Evolução clínica contínua: histórico digestivo, antecedentes mórbidos, medicações em uso e histórico completo.', link: 'Clínica' },
  { emoji: '📏', title: 'Antropometria e Medidas', desc: 'Registre peso, altura, circunferências e IMC. Acompanhe a evolução corporal dos pacientes ao longo do tratamento.', link: 'Evolução', highlight: true },
  { emoji: '📊', title: 'Avaliações e Questionários', desc: 'Construtor de questionários dinâmicos com pontuação automática, regras de classificação e avaliações personalizadas.', link: 'Avaliação' },
  { emoji: '🔬', title: 'Controle de Exames', desc: 'Solicite exames laboratoriais, lance resultados e acompanhe parâmetros bioquímicos baseados em valores de referência.', link: 'Laboratório' },
  { emoji: '🏥', title: 'Gestão de Convênios', desc: 'Cadastre operadoras de saúde, ANS e logomarcas. Vincule pacientes e organize o faturamento de consultas.', link: 'Convênios' },
  { emoji: '📈', title: 'Dashboard e Relatórios', desc: 'Métricas de atendimento, histórico de agendamentos e relatórios gerenciais para decisões estratégicas.', link: 'Relatórios' },
  { emoji: '🔐', title: 'Multitenancy e Perfis', desc: 'Suporte a múltiplas clínicas com dados isolados. Controle granular com perfis Admin, Nutricionista e Secretaria.', link: 'Segurança' },
]

export default function Features() {
  return (
    <section className="features" id="funcionalidades" aria-label="Funcionalidades">
      <div className="features__inner">
        <header className="features__header">
          <span className="features__badge">Funcionalidades</span>
          <h2 className="features__title">
            Tudo que sua clínica precisa{' '}
            <em>em uma plataforma</em>
          </h2>
          <p className="features__subtitle">
            Desenvolvido com base nas reais necessidades de nutricionistas —
            funcionalidades que fazem diferença no dia a dia clínico.
          </p>
        </header>

        <div className="features__grid">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className={`features__card${f.highlight ? ' features__card--highlight' : ''}`}
            >
              <div className="features__card-icon">
                <span className="features__card-icon-emoji">{f.emoji}</span>
              </div>
              <h3 className="features__card-title">{f.title}</h3>
              <p className="features__card-desc">{f.desc}</p>
              <span className="features__card-link">
                + {f.link} →
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
