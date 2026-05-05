import { useState, useEffect } from 'react'
import './Navbar.scss'

const NAV_LINKS = [
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Funcionalidades', href: '#funcionalidades' },
  { label: 'Benefícios', href: '#beneficios' },
  { label: 'Preços', href: '#precos' },
  { label: 'FAQ', href: '#faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleLinkClick = () => setMenuOpen(false)

  return (
    <>
      <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} role="banner">
        <div className="navbar__inner">
          {/* Logo */}
          <a href="#" className="navbar__logo" aria-label="NutriSaaS — Página inicial">
            <div className="navbar__logo-mark">N</div>
            <span className="navbar__logo-text">Nutri<span>SaaS</span></span>
          </a>

          {/* Desktop nav */}
          <nav className="navbar__menu" aria-label="Navegação principal">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="navbar__link">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="navbar__actions">
            <a href="#" className="navbar__btn-login">Entrar</a>
            <a href="#teste-gratis" className="navbar__btn-cta" id="navbar-cta-btn">
              Teste Grátis →
            </a>
          </div>

          {/* Hamburger */}
          <button
            className={`navbar__hamburger${menuOpen ? ' navbar__hamburger--open' : ''}`}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <nav
        className={`navbar__mobile${menuOpen ? ' navbar__mobile--open' : ''}`}
        aria-label="Menu mobile"
      >
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} className="navbar__mobile-link" onClick={handleLinkClick}>
            {link.label}
          </a>
        ))}
        <div className="navbar__mobile-footer">
          <a href="#" className="navbar__mobile-btn navbar__mobile-btn--login" onClick={handleLinkClick}>
            Entrar
          </a>
          <a href="#teste-gratis" className="navbar__mobile-btn navbar__mobile-btn--cta" onClick={handleLinkClick}>
            Teste Grátis — É gratuito
          </a>
        </div>
      </nav>
    </>
  )
}
