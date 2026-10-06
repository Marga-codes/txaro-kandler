import { campaign, posters } from '../content'
import { Img, Reveal, Video } from './Primitives'

/** Los cuatro bloques de trabajos, cada uno con su propia seccion y respiro. */
export function Credits() {
  return (
    <>
      <section className="section credits" id="credits">
        <div className="shell">
          <div className="section-head reveal">
            <h2 className="section-title">Cartelera</h2>
            <p className="section-intro">
              Hambre, El Hoyo 2 y Santuario, entre teatro, cine y serie.
            </p>
          </div>
          <Poster />
        </div>
      </section>

      <section className="section credits" id="campana">
        <div className="shell">
          <div className="section-head reveal">
            <h2 className="section-title">Campaña</h2>
            <p className="section-intro">
              Fotografía y vídeo de la sesión de campaña.
            </p>
          </div>
          <Campaign />
        </div>
      </section>

      <section className="section credits" id="cine">
        <div className="shell">
          <div className="section-head reveal">
            <h2 className="section-title">Cine</h2>
          </div>
          <Cine />
        </div>
      </section>

      <section className="section credits" id="backstage">
        <div className="shell">
          <div className="section-head reveal">
            <h2 className="section-title">Backstage</h2>
          </div>
          <Backstage />
        </div>
      </section>
    </>
  )
}

/** Cartelera: proporcion 2:1 en lugar de tres tarjetas iguales. */
function Poster() {
  const [featured, ...rest] = posters
  return (
    <div className="poster-grid">
      <PosterCard {...featured} />
      <div className="poster-stack">
        {rest.map(p => (
          <PosterCard key={p.title} {...p} />
        ))}
      </div>
    </div>
  )
}

function PosterCard({
  title,
  meta,
  src,
  alt,
}: {
  title: string
  meta: string
  src: string
  alt: string
}) {
  return (
    <Reveal as="figure">
      <div className="poster-card">
        <Img src={src} alt={alt} />
      </div>
      <figcaption className="poster-caption">
        <p className="poster-title">{title}</p>
        <p className="poster-meta">{meta}</p>
      </figcaption>
    </Reveal>
  )
}

function Campaign() {
  return (
    <div className="media-grid">
      {campaign.slice(0, 2).map((c, i) => (
        <Reveal key={c.src} delay={i * 80} className={`media-cell cell-${i === 0 ? 'a' : 'b'}`}>
          <Img src={c.src} alt={c.alt} />
        </Reveal>
      ))}

      <Reveal delay={160} className="media-cell cell-c">
        <Video
          src="/Txaro_videos/publicidad_video_Txaro_Kandler.mp4"
          poster="/media/Txaro_Fotos/txaro-kandler-actriz-en-barco-03.webp"
          label="Vídeo de la campaña"
          muted
          loop
          playsInline
          preload="none"
        />
      </Reveal>

      <Reveal delay={240} className="media-cell cell-d">
        <Img src={campaign[3].src} alt={campaign[3].alt} />
      </Reveal>
    </div>
  )
}

function Cine() {
  return (
    <div className="split-media reveal">
      <Video
        src="/Txaro_videos/Cine_actriz-txaro-kandler-02.mp4"
        poster="/media/Txaro_Fotos/txaro-kandler-actriz-en-barco-02.webp"
        label="Fragmento de cine"
        controls
        playsInline
        preload="none"
      />
      <div>
        <h3>
          Trabajar el <em>espacio</em> antes que el gesto
        </h3>
        <p>
          En cine la cámara se mueve y el cuerpo tiene que sostener la escena
          desde el primer fotograma. La preparación en danza y danza-teatro
          marca la diferencia en las tomas largas.
        </p>
        <p>
          El Hoyo 2 y Santuario muestran esa misma disciplina aplicada a
          formatos de terror y thriller.
        </p>
      </div>
    </div>
  )
}

function Backstage() {
  return (
    <div className="split-media reveal split-media--flip">
      <Video
        src="/Txaro_videos/Backstage-actriz-txaro-kandler.mp4"
        poster="/media/img/Txaro_Kandler_2.webp"
        label="Vídeo de backstage"
        controls
        playsInline
        preload="none"
      />
      <div>
        <h3>
          Lo que ocurre <em>fuera del plano</em>
        </h3>
        <p>
          El trabajo de mesa, los ensayos y la concentración previo a cada
          escena. Grabado durante la producción de Hambre en el Umbral de
          Primavera.
        </p>
      </div>
    </div>
  )
}
