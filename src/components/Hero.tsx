import { hero } from '../content'
import { Img } from './Primitives'

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-media">
        <Img
          src="/media/img/hambre-retrato.webp"
          alt="Txaro Kandler en escena como Carolina María de Jesús"
          priority
        />
      </div>
      <div className="hero-inner shell">
        <div className="reveal">
          <p className="hero-eyebrow">{hero.eyebrow}</p>
          <h1 className="hero-name">
            Txaro
            <br />
            <em>Kandler</em>
          </h1>
          <p className="hero-sub">{hero.subtitle}</p>
          <a className="hero-cta" href="#credits">
            Ver trabajos
          </a>
        </div>
      </div>
    </section>
  )
}