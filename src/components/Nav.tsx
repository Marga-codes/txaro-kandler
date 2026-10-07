import { useEffect, useRef, useState } from 'react'

const links = [
  ['#about', 'Sobre mí'],
  ['#credits', 'Trabajos'],
  ['#showreel', 'Showreel'],
  ['#gallery', 'Galería'],
  ['#contact', 'Contacto'],
] as const

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('no-scroll', open)
    return () => document.body.classList.remove('no-scroll')
  }, [open])

  const className = [scrolled && 'scrolled', open && 'open'].filter(Boolean).join(' ')
  const cls = className ? ` ${className}` : ''
  const toggleCls = open ? ' open' : ''

  return (
    <>
      <nav id="nav" className={cls}>
        <a
          href="#"
          className="nav-logo"
          onClick={e => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
            if (open) setOpen(false)
          }}
        >
          Txaro Kandler
        </a>
        <ul className="nav-links">
          {links.map(([href, label]) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
        <button
          ref={toggleRef}
          className={`nav-toggle${toggleCls}`}
          id="nav-toggle"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(o => !o)}
        >
          <span />
          <span />
        </button>
      </nav>

      <div className={`mobile-menu${open ? ' open' : ''}`} id="mobile-menu">
        <ul>
          {links.map(([href, label], i) => (
            <li key={href} style={{ '--i': i } as React.CSSProperties}>
              <a href={href} onClick={() => setOpen(false)}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}