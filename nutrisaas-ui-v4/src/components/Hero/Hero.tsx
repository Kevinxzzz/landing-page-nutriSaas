import './Hero.scss'

const PATIENTS = [
  { initials: 'AM', name: 'Ana Martins', meta: 'Próxima consulta: 14h', status: 'confirmed', statusLabel: 'Confirmado' },
  { initials: 'JC', name: 'João Carlos', meta: 'Aguardando retorno', status: 'pending', statusLabel: 'Pendente' },
  { initials: 'LF', name: 'Luísa Faria', meta: 'Em atendimento', status: 'present', statusLabel: 'Presente' },
]

const BARS = [40, 55, 35, 70, 60, 85, 95, 75, 65, 90, 50, 80]

const SIDEBAR_ITEMS = [
  { label: 'Início', active: true },
  { label: 'Pacientes' },
  { label: 'Agenda' },
  { label: 'Prontuários' },
]

export default function Hero() {
  return (
    <section className="hero" id="inicio" aria-label="Hero">
      {/* Video background */}
      <video
        className="hero__video-bg"
        src="/hero-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        preload="auto"
      />

      <div className="hero__inner">
        {/* Left: content */}
        <div className="hero__content">
          <div className="hero__eyebrow">
            <span className="hero__badge">
              <span className="hero__badge-dot" />
              Plataforma SaaS para Nutricionistas
            </span>
          </div>

          <h1 className="hero__heading">
            Gerencie sua clínica com{' '}
            <em className="hero__heading-em">inteligência</em>{' '}
            e precisão.
          </h1>

          <p className="hero__subheading">
            Centralize agenda, prontuário eletrônico, anamnese e exames em uma única plataforma. 
            Otimize seus atendimentos e entregue mais resultados para seus pacientes com o NutriSaaS.
          </p>

          <div className="hero__actions">
            <a href="#teste-gratis" className="hero__btn-primary" id="hero-cta-primary">
              Testar Grátis por 14 Dias →
            </a>
            <a href="#como-funciona" className="hero__btn-secondary" id="hero-cta-demo">
              Ver demonstração
            </a>
          </div>

          {/* Social proof */}
          <div className="hero__social-proof">
            <div className="hero__avatars">
              {['AM','JC','LF','RS'].map((i) => (
                <div key={i} className="hero__avatars-item">{i[0]}</div>
              ))}
            </div>
            <div className="hero__social-text">
              <span className="hero__stars">★★★★★</span>
              <span className="hero__review-count">
                <strong>4,9/5</strong> · +500 nutricionistas ativos
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="hero__stats">
            {[
              { value: '+500', label: 'Clínicas ativas' },
              { value: '98%', label: 'Satisfação' },
              { value: '3x', label: 'Mais produtividade' },
            ].map((s, i) => (
              <div key={s.value} className="hero__stats-group" style={{ display: 'contents' }}>
                {i > 0 && <div className="hero__stat-sep" />}
                <div className="hero__stat">
                  <span className="hero__stat-value">{s.value}</span>
                  <span className="hero__stat-label">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: browser mockup */}
        <div className="hero__visual">
          <div className="hero__glow" />
          <div className="hero__browser" role="img" aria-label="Preview do painel NutriSaaS">
            {/* Browser chrome */}
            <div className="hero__browser-bar">
              <div className="hero__browser-dots">
                <span className="hero__dot hero__dot--red" />
                <span className="hero__dot hero__dot--yellow" />
                <span className="hero__dot hero__dot--green" />
              </div>
              <div className="hero__browser-url">app.nutrisaas.com.br/dashboard</div>
            </div>

            {/* App layout */}
            <div className="hero__dashboard">
              {/* Sidebar */}
              <div className="hero__sidebar">
                <span className="hero__sidebar-label">Menu</span>
                {SIDEBAR_ITEMS.map((item) => (
                  <div
                    key={item.label}
                    className={`hero__sidebar-item${item.active ? ' hero__sidebar-item--active' : ''}`}
                  >
                    {item.label}
                  </div>
                ))}
                <span className="hero__sidebar-label">Clínica</span>
                <div className="hero__sidebar-item">Convênios</div>
                <div className="hero__sidebar-item">Relatórios</div>
              </div>

              {/* Main content */}
              <div className="hero__main">
                <div className="hero__main-header">
                  <span className="hero__main-title">Dashboard — Visão Geral</span>
                  <span className="hero__live-badge">
                    <span className="hero__live-dot" />AO VIVO
                  </span>
                </div>

                {/* KPIs */}
                <div className="hero__kpis">
                  {[
                    { label: 'Consultas hoje', value: '12', delta: '↑ 3 semana passada', up: true },
                    { label: 'Pacientes ativos', value: '284', delta: '+ 8 este mês', up: true },
                    { label: 'Avaliações', value: '47', delta: '+ 17% semana', up: true },
                  ].map((k) => (
                    <div key={k.label} className="hero__kpi">
                      <div className="hero__kpi-label">{k.label}</div>
                      <div className="hero__kpi-value">{k.value}</div>
                      <div className={`hero__kpi-delta${k.up ? ' hero__kpi-delta--up' : ''}`}>
                        {k.delta}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div className="hero__chart-area" aria-hidden="true">
                  {BARS.map((h, i) => (
                    <div
                      key={i}
                      className={`hero__bar${h === 95 ? ' hero__bar--peak' : ''}`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>

                {/* Patient list */}
                <div className="hero__patient-list">
                  <div className="hero__patient-head">
                    <span className="hero__patient-head-title">Próximos pacientes</span>
                    <button className="hero__patient-head-btn" type="button">Ver todos</button>
                  </div>
                  {PATIENTS.map((p) => (
                    <div key={p.initials} className="hero__patient-row">
                      <div className="hero__patient-info">
                        <div className="hero__patient-avatar">{p.initials}</div>
                        <div>
                          <div className="hero__patient-name">{p.name}</div>
                          <div className="hero__patient-meta">{p.meta}</div>
                        </div>
                      </div>
                      <span className={`hero__patient-chip hero__patient-chip--${p.status}`}>
                        {p.statusLabel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
