import { useRef, useState } from 'react'
import { url } from '../media'
import { Img, delayStyle } from './Primitives'
import { PlayIcon } from './Icons'

const posters = [
  {
    src: '/media/img/WhatsApp-Image-2026-08-23-at-13-48-08.webp',
    alt: 'Hambre',
    category: 'teatro',
    title: 'Hambre',
    meta: '2026 · Teatro · Carolina María de Jesús',
  },
  {
    src: '/media/img/el-hoyo-2-poster.webp',
    alt: 'El Hoyo 2',
    category: 'cine',
    title: 'El Hoyo 2',
    meta: '2024 · Película · Bárbara',
  },
  {
    src: '/media/img/santuario-poster.webp',
    alt: 'Santuario',
    category: 'television',
    title: 'Santuario',
    meta: '2024 · Serie de TV · HBO Max',
  },
]

const publicidad = [
  {
    src: '/media/Txaro_Fotos/txaro-kandler-actriz-en-barco-01.webp',
    alt: 'Txaro Kandler — actriz en barco 01',
    tag: '01',
    cap: 'Campaña · 01',
  },
  {
    src: '/media/Txaro_Fotos/txaro-kandler-actriz-en-barco-02.webp',
    alt: 'Txaro Kandler — actriz en barco 02',
    tag: '02',
    cap: 'Campaña · 02',
  },
  {
    src: '/media/Txaro_Fotos/txaro-kandler-actriz-en-barco-03.webp',
    alt: 'Txaro Kandler — actriz en barco 03',
    tag: '03',
    cap: 'Campaña · 03',
  },
  {
    src: '/media/Txaro_Fotos/txaro-kandler-actriz-en-barco-04.webp',
    alt: 'Txaro Kandler — actriz en barco 04',
    tag: '04',
    cap: 'Campaña · 04',
  },
]

/** Tira de video estilo pelicula: clic (o Enter/espacio) para reproducir. */
function ShowreelVideo({ src, label }: { src: string; label: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  const play = () => {
    const v = videoRef.current
    if (!v || playing) return
    v.controls = true
    void v.play()
    setPlaying(true)
  }

  return (
    <div
      className={`showreel-video reveal${playing ? ' playing' : ''}`}
      style={delayStyle(120)}
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={play}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          play()
        }
      }}
    >
      <video ref={videoRef} src={url(src)} preload="metadata" playsInline muted />
      <div className="play-btn" aria-hidden="true">
        <PlayIcon size={18} />
      </div>
    </div>
  )
}

const cineLorem = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
]

function CineText() {
  return (
    <div className="cine-text reveal" style={delayStyle(200)}>
      <h3 className="cine-title">
        Lorem ipsum <em>dolor sit amet</em>
      </h3>
      {cineLorem.map(t => (
        <p key={t} className="cine-desc">
          {t}
        </p>
      ))}
    </div>
  )
}

export function Credits() {
  return (
    <section className="credits" id="credits">
      <div className="credits-header reveal">
        <div>
          <p className="section-label">Trabajos</p>
          <h2 className="section-title">Trabajos destacados</h2>
        </div>
      </div>

      <div className="credits-group">
        <p className="credits-group-label reveal">Cartelera</p>
        <div className="credits-grid">
          {posters.map((p, i) => (
            <div
              key={p.alt}
              className="credit-card reveal"
              style={i ? delayStyle(240 + (i - 1) * 120) : undefined}
              data-category={p.category}
            >
              <Img src={p.src} alt={p.alt} />
              <div className="credit-card-overlay">
                <p className="credit-card-title">{p.title}</p>
                <p className="credit-card-meta">{p.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="credits-group credits-group--publicidad">
        <p className="credits-group-label reveal">Publicidad</p>
        <div className="publicidad-gallery">
          {publicidad.map((item, i) => (
            <figure
              key={item.tag}
              className={`pub-item pub-photo reveal${i === 3 ? ' pub-photo--fill' : ''}`}
              style={delayStyle(120 + i * 60)}
            >
              <div className="pub-frame">
                <Img src={item.src} alt={item.alt} />
              </div>
              <span className="pub-tag" aria-hidden="true">
                {item.tag}
              </span>
              <figcaption className="pub-cap">
                <span>Actriz</span>
                <em>{item.cap}</em>
              </figcaption>
            </figure>
          ))}

          <figure className="pub-item pub-video reveal" style={delayStyle(380)}>
            <div className="pub-frame">
              <video
                src={url('/Txaro_videos/publicidad_video_Txaro_Kandler.mp4')}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                controls
              />
            </div>
            <span className="pub-tag" aria-hidden="true">
              05
            </span>
            <figcaption className="pub-cap">
              <span>Actriz</span>
              <em>Campaña · Vídeo</em>
            </figcaption>
          </figure>
        </div>
      </div>

      <div className="credits-group credits-group--cine">
        <p className="credits-group-label reveal">Cine</p>
        <div className="cine-gallery">
          <figure className="pub-item pub-video reveal" style={delayStyle(120)}>
            <div className="pub-frame">
              <video
                src={url('/Txaro_videos/Cine_actriz-txaro-kandler-02.mp4')}
                playsInline
                muted
                loop
                preload="metadata"
                controls
              />
            </div>
            <span className="pub-tag" aria-hidden="true">
              01
            </span>
            <figcaption className="pub-cap">
              <span>Actriz</span>
              <em>Cine · Vídeo</em>
            </figcaption>
          </figure>
          <CineText />
        </div>
      </div>

      <div className="credits-group credits-group--backstage">
        <p className="credits-group-label reveal">Backstage</p>
        <div className="backstage-gallery">
          <CineText />
          <ShowreelVideo src="/Txaro_videos/Backstage-actriz-txaro-kandler.mp4" label="Reproducir backstage" />
        </div>
      </div>
    </section>
  )
}