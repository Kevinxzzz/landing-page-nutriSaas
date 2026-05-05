import './CTAFinal.scss'

const TRUST = ['✅ 14 dias grátis', '🔒 Sem cartão de crédito', '⚡ Setup em minutos', '❌ Cancele quando quiser']

export default function CTAFinal() {
  return (
    <section className="cta-final" id="teste-gratis" aria-label="CTA final — começar teste grátis">
      <div className="cta-final__bg-glow" aria-hidden="true" />
      <div className="cta-final__inner">
        <div className="cta-final__box">
          <span className="cta-final__badge">Comece hoje</span>
          <h2 className="cta-final__title">
            Pronto para organizar sua clínica <em>de verdade?</em>
          </h2>
          <p className="cta-final__subtitle">
            Junte-se a mais de 500 nutricionistas que já transformaram seus atendimentos
            com o NutriSaaS. Comece gratuitamente agora.
          </p>
          <div className="cta-final__actions">
            <a href="#" className="cta-final__btn-primary" id="cta-final-primary">
              Criar conta grátis →
            </a>
            <a href="#faq" className="cta-final__btn-secondary">
              Ver perguntas frequentes
            </a>
          </div>
          <div className="cta-final__trust" aria-label="Garantias">
            {TRUST.map((item) => (
              <span key={item} className="cta-final__trust-item">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
