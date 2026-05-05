import { useState } from 'react'
import './Pricing.scss'

const PLANS = [
  {
    name: 'Starter',
    monthly: 97,
    annually: 77,
    desc: 'Para nutricionistas autônomos que querem começar com organização.',
    features: ['1 nutricionista', 'Até 50 pacientes', 'Prontuário eletrônico', 'Agenda', 'Antropometria'],
    cta: 'Começar grátis',
    ctaStyle: 'outline',
  },
  {
    name: 'Clínica',
    monthly: 197,
    annually: 157,
    desc: 'Para clínicas com equipe que precisam de controle total.',
    features: ['Até 5 usuários', 'Pacientes ilimitados', 'Tudo do Starter', 'Avaliações e questionários', 'Controle de exames', 'Dashboard e relatórios', 'Gestão de convênios'],
    cta: 'Escolher plano',
    ctaStyle: 'white',
    popular: true,
  },
  {
    name: 'Enterprise',
    monthly: 397,
    annually: 317,
    desc: 'Para redes de clínicas com múltiplas unidades e equipes.',
    features: ['Usuários ilimitados', 'Múltiplas clínicas', 'Tudo do Clínica', 'Multitenancy avançado', 'SLA garantido', 'Suporte prioritário'],
    cta: 'Falar com vendas',
    ctaStyle: 'outline',
  },
]

export default function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <section className="pricing" id="precos" aria-label="Preços">
      <div className="pricing__inner">
        <header className="pricing__header">
          <span className="pricing__badge">Preços</span>
          <h2 className="pricing__title">
            Planos que crescem com <em>sua clínica</em>
          </h2>
          <p className="pricing__subtitle">
            Comece grátis por 14 dias. Sem cartão de crédito. Cancele quando quiser.
          </p>

          {/* Toggle */}
          <div className="pricing__toggle" role="group" aria-label="Frequência de cobrança">
            <button
              className={`pricing__toggle-btn${!annual ? ' pricing__toggle-btn--active' : ''}`}
              onClick={() => setAnnual(false)}
            >
              Mensal
            </button>
            <button
              className={`pricing__toggle-btn${annual ? ' pricing__toggle-btn--active' : ''}`}
              onClick={() => setAnnual(true)}
            >
              Anual
            </button>
            {annual && <span className="pricing__save-badge">Economize 20%</span>}
          </div>
        </header>

        <div className="pricing__grid">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`pricing__plan${plan.popular ? ' pricing__plan--popular' : ''}`}
              style={{ position: 'relative' }}
            >
              {plan.popular && (
                <span className="pricing__plan-popular-tag">⭐ Mais popular</span>
              )}
              <div className="pricing__plan-header">
                <span className="pricing__plan-name">{plan.name}</span>
                <div className="pricing__plan-price-row">
                  <span className="pricing__plan-currency">R$</span>
                  <span className="pricing__plan-price">
                    {annual ? plan.annually : plan.monthly}
                  </span>
                  <span className="pricing__plan-period">/mês</span>
                </div>
                <p className="pricing__plan-desc">{plan.desc}</p>
              </div>
              <div className="pricing__plan-divider" />
              <ul className="pricing__plan-features">
                {plan.features.map((f) => (
                  <li key={f} className="pricing__plan-feature">
                    <span className="pricing__plan-check">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`pricing__plan-cta pricing__plan-cta--${plan.ctaStyle}`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="pricing__footer-note">
          🔒 Todos os planos incluem 14 dias gratuitos · Sem cartão de crédito · Cancele a qualquer momento
        </p>
      </div>
    </section>
  )
}
