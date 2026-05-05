import './Footer.scss'

const FOOTER_COLS = [
  {
    title: 'Produto',
    links: [
      { label: 'Funcionalidades', href: '#funcionalidades' },
      { label: 'Como funciona', href: '#como-funciona' },
      { label: 'Preços', href: '#precos' },
      { label: 'Atualizações', href: '#' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre nós', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Carreiras', href: '#' },
      { label: 'Contato', href: '#' },
    ],
  },
  {
    title: 'Suporte',
    links: [
      { label: 'Central de ajuda', href: '#' },
      { label: 'Documentação', href: '#' },
      { label: 'Status do sistema', href: '#' },
      { label: 'Segurança', href: '#' },
    ],
  },
]

const SOCIAL = [
  { icon: '𝕏', href: '#', label: 'Twitter/X' },
  { icon: 'in', href: '#', label: 'LinkedIn' },
  { icon: '▶', href: '#', label: 'YouTube' },
  { icon: '📷', href: '#', label: 'Instagram' },
]

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__main">
        {/* Brand column */}
        <div className="footer__brand">
          <a href="#" className="footer__logo" aria-label="NutriSaaS">
            <div className="footer__logo-mark">N</div>
            <span className="footer__logo-text">Nutri<span>SaaS</span></span>
          </a>
          <p className="footer__tagline">
            Plataforma completa para gestão de clínicas de nutrição.
            Prontuários, agenda, exames e muito mais — tudo em um só lugar.
          </p>
          <nav className="footer__social" aria-label="Redes sociais">
            {SOCIAL.map((s) => (
              <a key={s.label} href={s.href} className="footer__social-link" aria-label={s.label}>
                {s.icon}
              </a>
            ))}
          </nav>
        </div>

        {/* Nav columns */}
        {FOOTER_COLS.map((col) => (
          <nav key={col.title} className="footer__col" aria-label={col.title}>
            <h3 className="footer__col-title">{col.title}</h3>
            {col.links.map((link) => (
              <a key={link.label} href={link.href} className="footer__col-link">
                {link.label}
              </a>
            ))}
          </nav>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <p className="footer__copyright">
          © {new Date().getFullYear()} NutriSaaS. Todos os direitos reservados.
        </p>
        <nav className="footer__bottom-links" aria-label="Links legais">
          <a href="#" className="footer__bottom-link">Privacidade</a>
          <a href="#" className="footer__bottom-link">Termos de uso</a>
          <a href="#" className="footer__bottom-link">Cookies</a>
        </nav>
      </div>
    </footer>
  )
}
