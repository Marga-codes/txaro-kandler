import { useEffect, useRef, useState } from 'react'
import { nav } from '../content'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // El nav se marca al pasar un centinela, no con un listener de scroll que
  // se ejecuta en cada frame.
  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !('IntersectionObserver' in window)) {
      setScrolled(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.body.classList.toggle('no-scroll', open)
    if (open) panelRef.current?.querySelector<HTMLAnchorElement>('a')?.focus()
    else toggleRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key !== 'Tab') return
      // Trampa de foco: el menu modal no debe dejar escapar el tabulador.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>('a')
      if (!focusables?.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" />

      <nav className={`nav${scrolled ? ' is-scrolled' : ''}`}>
        <a className="nav-logo" href="#top">
          Txaro Kandler
        </a>

        <ul className="nav-links">
          {nav.map(item => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>

        <button
          ref={toggleRef}
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen(v => !v)}
        >
          <span />
          <span />
        </button>
      </nav>

      <div
        id="menu-movil"
        ref={panelRef}
        className={`mobile-menu${open ? ' is-open' : ''}`}
        aria-hidden={!open}
      >
        <ul>
          {nav.map(item => (
            <li key={item.href}>
              <a href={item.href} tabIndex={open ? 0 : -1} onClick={close}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}