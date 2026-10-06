import { press } from '../content'
import { ArrowRight } from './Icons'
import { Img, Reveal } from './Primitives'

export function Press() {
  return (
    <section className="section press" id="prensa">
      <div className="shell">
        <Reveal as="figure">
          <div className="press-figure">
            <Img
              src="/media/img/Txaro_Kendler_1.webp"
              alt="Txaro Kandler en escena como Carolina María de Jesús"
            />
          </div>
        </Reveal>

        <div className="press-body">
          <div className="section-head">
            <p className="section-label">Prensa</p>
            <h2 className="section-title">Lo que dice la crítica</h2>
          </div>

          <div className="press-grid">
            {press.map((p, i) => (
              <Reveal
                as="article"
                key={p.href}
                delay={i * 60}
                className="press-card"
              >
                <p className="press-source">{p.source}</p>
                <blockquote className="press-quote">{p.quote}</blockquote>
                <a
                  className="press-link"
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Leer el artículo
                  <ArrowRight size={13} />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}