import { aboutBody, aboutDetails, social } from '../content'
import { Img, Reveal } from './Primitives'

export function About() {
  return (
    <section className="section about" id="about">
      <div className="shell about-inner">
        <Reveal as="figure">
          <div className="about-media">
            <Img
              src="/media/img/about-txaro.webp"
              alt="Retrato de Txaro Kandler"
              />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="section-head">
            <p className="section-label">Sobre mí</p>
            <h2 className="section-title">
              Una actriz de <em>presencia incontestable</em>
            </h2>
          </div>

          <div className="about-body">
            {aboutBody.map(p => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <dl className="about-details">
            {aboutDetails.map(d => (
              <div key={d.label}>
                <dt>{d.label}</dt>
                <dd>{d.value}</dd>
              </div>
            ))}
          </dl>

          <div className="about-social">
            {social.map(s => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}