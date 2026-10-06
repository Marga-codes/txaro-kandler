import { social } from '../content'

export function Showreel() {
  return (
    <section className="section showreel" id="showreel">
      <div className="shell">
        <div className="section-head reveal">
          <h2 className="section-title">Showreel</h2>
          <p className="section-intro">
            Una selección de escenas de cine, televisión y teatro.
          </p>
        </div>
        <div className="showreel-frame reveal">
          <iframe
            src="https://www.youtube-nocookie.com/embed/QD3NjjCMb_w?rel=0&modestbranding=1&playsinline=1"
            title="Showreel de Txaro Kandler"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer shell">
      <p>© 2026 Txaro Kandler. Todos los derechos reservados.</p>
      <div className="footer-links">
        {social.slice(0, 2).map(s => (
          <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">
            {s.label}
          </a>
        ))}
      </div>
    </footer>
  )
}