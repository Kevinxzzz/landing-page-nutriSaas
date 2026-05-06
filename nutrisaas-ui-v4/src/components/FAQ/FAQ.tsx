import { useState } from 'react'
import './FAQ.scss'

const FAQS = [
  { q: 'O NutriSaaS funciona para clínicas com mais de um nutricionista?', a: 'Sim. A plataforma suporta múltiplos usuários com perfis distintos (Admin, Nutricionista, Secretaria) e diferentes níveis de permissão. Cada profissional acessa apenas o que é relevante para sua função.' },
  { q: 'Posso testar antes de assinar?', a: 'Sim. Todos os planos incluem 14 dias de teste gratuito, sem necessidade de cartão de crédito. Você tem acesso completo a todas as funcionalidades do plano escolhido durante o período de teste.' },
  { q: 'Meus dados e os dos pacientes ficam seguros?', a: 'Sim. Utilizamos arquitetura multitenancy onde os dados de cada clínica ficam completamente isolados. O acesso é controlado por autenticação e os dados são criptografados em repouso e em trânsito.' },
  { q: 'É possível migrar dados de outro sistema?', a: 'Entramos em contato para entender seu cenário e oferecer o suporte necessário na migração. Para situações mais simples, temos guias de importação disponíveis na documentação.' },
  { q: 'O sistema funciona em tablet e celular?', a: 'A interface é responsiva e funciona em qualquer navegador moderno, incluindo tablets. Para dispositivos móveis, a experiência é otimizada para visualização e registro rápido de dados em atendimentos.' },
  { q: 'Os questionários podem ser personalizados?', a: 'Sim. O módulo de questionários permite criar avaliações completamente personalizadas, divididas em módulos e seções. Cada resposta pode ter pontuação e o sistema calcula o score automaticamente com base nas regras definidas.' },
  { q: 'Preciso de um servidor ou instalação local?', a: 'Não. O NutriSaaS é 100% cloud. Você acessa pelo navegador, de qualquer dispositivo, sem instalar nada. Atualizações e backups são automáticos.' },
  { q: 'O suporte é incluído no plano?', a: 'Sim. Todos os planos incluem suporte por chat e e-mail. Planos Clínica e Enterprise contam com suporte prioritário e onboarding assistido.' },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="faq" id="faq" aria-label="Perguntas frequentes">
      <div className="faq__inner">
        <header className="faq__header">
          <span className="faq__badge">Dúvidas Frequentes</span>
          <h2 className="faq__title">
            Tudo sobre o <em>software para nutricionistas</em>
          </h2>
        </header>

        <div className="faq__layout">
          {/* Left sidebar */}
          <div className="faq__side">
            <h3 className="faq__side-title">Ainda tem dúvidas?</h3>
            <p className="faq__side-desc">
              Nossa equipe está disponível para responder qualquer pergunta sobre o
              NutriSaaS, ajudar no onboarding ou agendar uma demonstração.
            </p>
            <a href="mailto:suporte@nutrisaas.com.br" className="faq__side-cta">
              Falar com suporte →
            </a>
          </div>

          {/* FAQ accordion */}
          <ul className="faq__list" role="list">
            {FAQS.map((item, i) => {
              const isOpen = openIndex === i
              return (
                <li key={i} className={`faq__item${isOpen ? ' faq__item--open' : ''}`}>
                  <button
                    className="faq__question"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    id={`faq-q-${i}`}
                  >
                    <span className="faq__question-text">{item.q}</span>
                    <i className={`faq__chevron${isOpen ? ' faq__chevron--open' : ''}`}>▾</i>
                  </button>
                  <div
                    className={`faq__answer${isOpen ? ' faq__answer--open' : ''}`}
                    role="region"
                    aria-labelledby={`faq-q-${i}`}
                  >
                    <p className="faq__answer-text">{item.a}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
