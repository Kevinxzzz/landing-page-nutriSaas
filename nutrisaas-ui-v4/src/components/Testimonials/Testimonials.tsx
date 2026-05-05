import './Testimonials.scss'

const TESTIMONIALS = [
  {
    stars: 5,
    quote: 'Antes do NutriSaaS eu perdia horas com planilhas e papelada. Hoje tenho o histórico completo de cada paciente em segundos e a equipe toda trabalhando integrada.',
    name: 'Dra. Camila Rocha',
    role: 'Nutricionista clínica — São Paulo, SP',
    initials: 'CR',
    featured: true,
  },
  {
    stars: 5,
    quote: 'O controle de exames e antropometria finalmente num só lugar. Consigo mostrar a evolução do paciente em gráfico, o que muda completamente a consulta.',
    name: 'Dr. Rafael Mendes',
    role: 'Nutricionista esportivo — Curitiba, PR',
    initials: 'RM',
  },
  {
    stars: 5,
    quote: 'A agenda integrada ao prontuário é exatamente o que faltava. Agora a secretária confirma a consulta e eu já tenho tudo preparado antes de o paciente chegar.',
    name: 'Dra. Juliana Torres',
    role: 'Gestora de clínica — Rio de Janeiro, RJ',
    initials: 'JT',
  },
  {
    stars: 5,
    quote: 'Os questionários dinâmicos com scoring automático poupam 30 minutos por consulta. É uma das funcionalidades que mais surpreendeu a equipe.',
    name: 'Ms. André Lima',
    role: 'Nutricionista hospitalar — Belo Horizonte, MG',
    initials: 'AL',
  },
  {
    stars: 5,
    quote: 'Atendo três clínicas diferentes e o sistema isola tudo perfeitamente. Não precisei de nenhum treinamento especial — é muito intuitivo.',
    name: 'Dra. Priscila Neves',
    role: 'Nutricionista — Porto Alegre, RS',
    initials: 'PN',
  },
  {
    stars: 5,
    quote: 'O onboarding foi absurdamente rápido. Em menos de uma hora já estava cadastrando pacientes e gerando prontuários. Suporte excelente.',
    name: 'Dr. Felipe Santos',
    role: 'Nutricionista autônomo — Fortaleza, CE',
    initials: 'FS',
  },
]

export default function Testimonials() {
  return (
    <section className="testimonials" id="depoimentos" aria-label="Depoimentos">
      <div className="testimonials__inner">
        <header className="testimonials__header">
          <span className="testimonials__badge">Depoimentos</span>
          <h2 className="testimonials__title">
            Nutricionistas que{' '}
            <em>transformaram suas clínicas</em>
          </h2>
          <span className="testimonials__note">⚠️ Exemplos fictícios representativos de perfis reais de usuários</span>
        </header>

        <div className="testimonials__grid">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.name}
              className={`testimonials__card${t.featured ? ' testimonials__card--featured' : ''}`}
            >
              <div className="testimonials__card-stars">
                {'★'.repeat(t.stars)}
              </div>
              <p className="testimonials__card-quote">{t.quote}</p>
              <footer className="testimonials__card-footer">
                <div className="testimonials__card-avatar">{t.initials}</div>
                <div>
                  <div className="testimonials__card-name">{t.name}</div>
                  <div className="testimonials__card-role">{t.role}</div>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
