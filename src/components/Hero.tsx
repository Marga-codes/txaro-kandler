import { Img } from './Primitives'
import { ArrowIcon } from './Icons'

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true">
        <Img src="/media/img/hambre-retrato.webp" alt="" priority />
      </div>
      <div className="hero-content">
        <p className="hero-eyebrow">Actriz | Madrid</p>
        <h1 className="hero-name">
          Txaro
          <br />
          <em>Kandler</em>
        </h1>
        <p className="hero-subtitle">
          Actriz de cine, televisión y teatro. Conocida por El Hoyo 2, Santuario
          y Hambre. Formada con los maestros Rubens Correa, Lorenzo Quinteros y
          Silvia Vladimivsky.
        </p>
        <a href="#credits" className="hero-cta">
          Ver trabajos
          <ArrowIcon size={14} />
        </a>
      </div>
    </section>
  )
}