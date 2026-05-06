import { useState } from 'react'
import { CheckCircle, Sparkle, ArrowRight } from '@phosphor-icons/react'
import InteractiveTechBackground from '../InteractiveTechBackground/InteractiveTechBackground'
import './Pricing.scss'

const PLAN = {
  name: 'Acesso Completo',
  monthly: 197,
  annually: 157,
  desc: 'Tudo o que o nutricionista e a clínica precisam para escalar, sem letras miúdas ou limites.',
  features: [
    'Pacientes ilimitados',
    'Usuários e equipe ilimitada',
    'Prontuário eletrônico completo',
    'Agenda e gestão de consultas',
    'Avaliações e questionários dinâmicos',
    'Controle de exames e bioquímicos',
    'Dashboard de gestão e relatórios',
    'Suporte prioritário via WhatsApp',
  ],
  cta: 'Começar teste grátis',
}

export default function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <section className="pricing-v2" id="precos" aria-label="Preços">
      <div id="teste-gratis" style={{ position: 'absolute', top: '-100px' }} />
      <InteractiveTechBackground
        className="pricing-v2__bg"
        bgColor={[249, 250, 251]} 
        primaryColor={[34, 197, 94]} 
        accentColor={[16, 185, 129]} 
        cellSize={5}
        clusterCount={12}
        gridOpacity={0.02}
        sweepOpacity={0.03}
        noiseIntensity={0.008}
        intensity={1.0}
      />
      
      <div className="pricing-v2__inner">
        <header className="pricing-v2__header">
          <span className="pricing-v2__badge">
            <Sparkle weight="fill" />
            Preço Transparente
          </span>
          <h2 className="pricing-v2__title">
            Plano único para <em>sua evolução</em>
          </h2>
          <p className="pricing-v2__subtitle">
            Acesso total a todas as funcionalidades do NutriSaaS. 
            Sem limites de pacientes, usuários ou dados.
          </p>

          {/* Toggle */}
          <div className="pricing-v2__toggle" role="group" aria-label="Frequência de cobrança">
            <button
              className={`pricing-v2__toggle-btn${!annual ? ' pricing-v2__toggle-btn--active' : ''}`}
              onClick={() => setAnnual(false)}
            >
              Mensal
            </button>
            <button
              className={`pricing-v2__toggle-btn${annual ? ' pricing-v2__toggle-btn--active' : ''}`}
              onClick={() => setAnnual(true)}
            >
              Anual
              {annual && (
                <span className="pricing-v2__save-badge">
                  <span>Economize 20%</span>
                </span>
              )}
            </button>
          </div>
        </header>

        <div className="pricing-v2__single-grid">
          <div className="pricing-v2__plan pricing-v2__plan--single">
            <div className="pricing-v2__plan-popular-tag">
              ⭐ Oferta Recomendada
            </div>
            
            <div className="pricing-v2__plan-layout">
              <div className="pricing-v2__plan-left">
                <div className="pricing-v2__plan-header">
                  <span className="pricing-v2__plan-name">{PLAN.name}</span>
                  <div className="pricing-v2__plan-price-row">
                    <span className="pricing-v2__plan-currency">R$</span>
                    <span className="pricing-v2__plan-price">
                      {annual ? PLAN.annually : PLAN.monthly}
                    </span>
                    <span className="pricing-v2__plan-period">/mês</span>
                  </div>
                  <p className="pricing-v2__plan-desc">{PLAN.desc}</p>
                </div>
                
                <button className="pricing-v2__plan-cta pricing-v2__plan-cta--primary">
                  {PLAN.cta} <ArrowRight weight="bold" />
                </button>
                <p className="pricing-v2__plan-trial">14 dias grátis • Sem cartão necessário</p>
              </div>

              <div className="pricing-v2__plan-divider-vertical" />

              <div className="pricing-v2__plan-right">
                <span className="pricing-v2__plan-features-label">O que está incluso:</span>
                <ul className="pricing-v2__plan-features">
                  {PLAN.features.map((f) => (
                    <li key={f} className="pricing-v2__plan-feature">
                      <span className="pricing-v2__plan-check">
                        <CheckCircle weight="fill" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <p className="pricing-v2__footer-note">
          Precisa de uma solução para rede de clínicas? <a href="#contato">Fale com vendas</a>.
        </p>
      </div>
    </section>
  )
}
