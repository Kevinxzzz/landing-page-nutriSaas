import './Benefits.scss'

const BENEFITS = [
  { emoji: '⏱️', title: 'Menos tempo em burocracia', desc: 'Prontuários digitais, agendamentos automáticos e histórico centralizado eliminam o retrabalho.' },
  { emoji: '📊', title: 'Decisões baseadas em dados', desc: 'Dashboard com métricas reais da clínica para você tomar decisões com segurança e agilidade.' },
  { emoji: '🔒', title: 'Segurança e privacidade', desc: 'Dados dos pacientes protegidos com isolamento multitenancy. Cada clínica tem acesso somente aos seus dados.' },
  { emoji: '🤝', title: 'Equipe integrada', desc: 'Nutricionistas, secretárias e gestores com permissões distintas, trabalhando em sincronia.' },
]

const STATS = [
  { value: '3x', label: 'Mais produtividade', sub: 'média reportada' },
  { value: '98%', label: 'Satisfação', sub: 'dos usuários ativos' },
  { value: '80%', label: 'Menos papelada', sub: 'relatado em 30 dias' },
  { value: '+500', label: 'Clínicas', sub: 'em todo o Brasil' },
]

export default function Benefits() {
  return (
    <section className="benefits" id="beneficios" aria-label="Benefícios">
      <div className="benefits__inner">
        <div className="benefits__content">
          <span className="benefits__badge">Benefícios</span>
          <h2 className="benefits__title">
            Trabalhe com mais{' '}
            <em>eficiência e clareza</em>
          </h2>
          <p className="benefits__lead">
            O NutriSaaS foi desenhado para resolver os maiores gargalos de clínicas
            de nutrição: burocracia excessiva, dados dispersos e falta de visibilidade.
          </p>
          <ul className="benefits__list" aria-label="Lista de benefícios">
            {BENEFITS.map((b) => (
              <li key={b.title} className="benefits__item">
                <div className="benefits__item-icon">
                  <span className="benefits__item-emoji">{b.emoji}</span>
                </div>
                <div className="benefits__item-body">
                  <h3 className="benefits__item-title">{b.title}</h3>
                  <p className="benefits__item-desc">{b.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="benefits__stats" aria-label="Estatísticas">
          {STATS.map((s) => (
            <div key={s.label} className="benefits__stat-card">
              <span className="benefits__stat-value">{s.value}</span>
              <span className="benefits__stat-label">{s.label}</span>
              <span className="benefits__stat-sub">{s.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
