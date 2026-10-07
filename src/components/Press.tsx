import { Img, delayStyle } from './Primitives'
import { ArrowIcon } from './Icons'

const items = [
  {
    source: 'Diario Crítico',
    quote:
      'La lucha extrema por sobrevivir cada día en las favelas de São Paulo se hace visible en escena.',
    label: 'Leer el artículo',
    href: 'https://www.diariocritico.com/teatro/hambre-critica',
  },
  {
    source: 'En Platea',
    quote:
      'Una pieza teatral que lleva la voz de Carolina María de Jesús a la escena con fuerza y urgencia.',
    label: 'Leer el artículo',
    href: 'https://enplatea.com/?p=45852',
  },
  {
    source: 'Revista Tarántula · Luis Muñoz Díez',
    quote:
      '“Una intérprete de “presencia incontestable” que sostiene con solvencia el peso del personaje.”',
    label: 'Leer la crítica',
    href: 'https://revistatarantula.com/critica-hambre-lopez-doynel-lleva-a-escena-la-voz-de-carolina-maria-de-jesus/',
  },
  {
    source: 'Instagram · Difusión',
    quote:
      'Publicación de difusión del proyecto Hambre, compartiendo la obra y su contexto.',
    label: 'Ver la publicación',
    href: 'https://www.instagram.com/p/DVRLAbfCPFh/?igsh=c3BxN2tjMm92amdt',
  },
  {
    source: 'Prensa Social',
    quote:
      'Los diarios de Carolina María de Jesús saltan al escenario del Umbral de Primavera.',
    label: 'Leer el artículo',
    href: 'https://prensasocial.es/teatro-hambre-basada-en-los-diarios-de-carolina-maria-de-jesus-de-claudia-coelho-y-emanuela-lamieri-y-viviana-lopez-doynel/',
  },
]

export function Press() {
  return (
    <section className="press" id="prensa">
      <figure className="press-photo reveal">
        <Img
          src="/media/img/Txaro_Kendler_1.webp"
          alt="Txaro Kandler como Carolina María de Jesús en Hambre"
        />
      </figure>
      <div className="press-body">
        <p className="section-label reveal">Prensa</p>
        <h2 className="section-title reveal" style={delayStyle(100)}>
          Lo que dice la crítica
        </h2>
        <div className="press-grid">
          {items.map((it, i) => (
            <article
              key={it.source}
              className="press-card reveal"
              style={delayStyle(200 + i * 60)}
            >
              <p className="press-source">{it.source}</p>
              <blockquote className="press-quote">{it.quote}</blockquote>
              <a className="press-link" href={it.href} target="_blank" rel="noopener">
                {it.label}
                <ArrowIcon size={12} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}