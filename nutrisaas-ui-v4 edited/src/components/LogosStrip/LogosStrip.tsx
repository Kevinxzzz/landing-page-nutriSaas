import './LogosStrip.scss'

const CLINICS = [
  { icon: '🏥', name: 'Clinica Nutri SP' },
  { icon: '🥗', name: 'NutriVida RJ' },
  { icon: '💚', name: 'Verde Saúde BH' },
  { icon: '🏋️', name: 'Sport Nutri' },
  { icon: '🩺', name: 'Saúde Integral' },
  { icon: '🌿', name: 'NutriCare Plus' },
  { icon: '⚕️', name: 'ClinicaFit' },
  { icon: '🥦', name: 'Nutrição Ativa' },
]

const ITEMS = [...CLINICS, ...CLINICS] // duplicate for seamless loop

export default function LogosStrip() {
  return (
    <section className="logos-strip" aria-label="Clínicas que usam o NutriSaaS">
      <div className="logos-strip__inner">
        <p className="logos-strip__label">Confiado por mais de 500 clínicas em todo o Brasil</p>
        <div className="logos-strip__track-wrapper">
          <div className="logos-strip__track" aria-hidden="true">
            {ITEMS.map((item, i) => (
              <div key={i} className="logos-strip__item">
                <span className="logos-strip__item-icon">{item.icon}</span>
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
