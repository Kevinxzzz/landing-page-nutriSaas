import './Differentials.scss'

const FEATURED_ITEMS = [
  'Multitenancy real: dados completamente isolados por clínica',
  'Questionários dinâmicos com scoring automático',
  'Controle de exames com valores de referência integrados',
  'Perfis de acesso granular: Admin, Nutricionista, Secretaria',
  'Onboarding rápido: clínica ativa em menos de 1 hora',
]

const CARDS = [
  { emoji: '🔐', title: 'Segurança nível enterprise', desc: 'Dados isolados por tenant. Cada clínica acessa somente suas próprias informações.' },
  { emoji: '📱', title: 'Interface pensada pelo nutricionista', desc: 'Projetado com base em feedbacks reais de profissionais em atividade clínica.' },
  { emoji: '⚡', title: 'Setup em minutos', desc: 'Do cadastro ao primeiro atendimento em menos de uma hora. Sem consultoria necessária.' },
  { emoji: '📊', title: 'Dados em tempo real', desc: 'Dashboard com métricas atualizadas continuamente para gestão ativa da clínica.' },
]

export default function Differentials() {
  return (
    <section className="differentials" id="diferenciais" aria-label="Diferenciais">
      <div className="differentials__inner">
        <header className="differentials__header">
          <span className="differentials__badge">Diferenciais</span>
          <h2 className="differentials__title">
            Por que nutricionistas{' '}
            <em>escolhem o NutriSaaS</em>
          </h2>
        </header>

        <div className="differentials__layout">
          {/* Featured card */}
          <div className="differentials__featured">
            <span className="differentials__featured-badge">Plataforma completa</span>
            <h3 className="differentials__featured-title">
              Tudo que você precisa, <em>sem o que você não precisa.</em>
            </h3>
            <p className="differentials__featured-desc">
              O NutriSaaS foi construído especificamente para clínicas de nutrição,
              eliminando funcionalidades desnecessárias e focando no que gera resultado.
            </p>
            <ul className="differentials__featured-list">
              {FEATURED_ITEMS.map((item) => (
                <li key={item} className="differentials__featured-item">
                  <span className="differentials__featured-check">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right cards */}
          <div className="differentials__cards">
            {CARDS.map((c) => (
              <article key={c.title} className="differentials__card">
                <div className="differentials__card-icon">{c.emoji}</div>
                <div className="differentials__card-body">
                  <h3 className="differentials__card-title">{c.title}</h3>
                  <p className="differentials__card-desc">{c.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
