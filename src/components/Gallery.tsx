import { useCallback, useEffect, useState } from 'react'
import { url } from '../media'
import { Img, delayStyle } from './Primitives'
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from './Icons'

const items = [
  {
    letter: 'g-a',
    src: '/media/img/Txaro_Moaba_CinemaTv.webp',
    alt: 'Txaro Kandler durante un rodaje para Moaba Cinema TV',
    cap: 'Moaba Cinema TV',
    capEm: 'Rodaje',
  },
  {
    letter: 'g-b',
    src: '/media/img/Txaro_Kandler_2.webp',
    alt: 'Txaro Kandler — fotografía',
    cap: 'Archivo',
    capEm: '',
  },
  {
    letter: 'g-c',
    src: '/media/img/txaro-hero.webp',
    alt: 'Txaro Kandler — retrato',
    cap: 'Retrato',
    capEm: '',
  },
  {
    letter: 'g-d',
    src: '/media/img/ig-profile/txaro-teatro-2020.webp',
    alt: 'Txaro Kandler en escena teatral, 2020',
    cap: 'Teatro',
    capEm: '2020',
  },
  {
    letter: 'g-e',
    src: '/media/img/ig-profile/txaro-accionactores-2025.webp',
    alt: 'Txaro Kandler — AccionActores, 2025',
    cap: 'AccionActores',
    capEm: '2025',
  },
  {
    letter: 'g-f',
    src: '/media/img/ig-profile/txaro-backstage-2017.webp',
    alt: 'Txaro Kandler backstage, 2017',
    cap: 'Backstage',
    capEm: '2017',
  },
  {
    letter: 'g-g',
    src: '/media/img/ig-profile/txaro-retrato-2020.webp',
    alt: 'Txaro Kandler — retrato, 2020',
    cap: 'Retrato',
    capEm: '2020',
  },
  {
    letter: 'g-h',
    src: '/media/img/ig-profile/txaro-pop-happy-mondays-2024.webp',
    alt: 'Txaro Kandler — Happy Mondays, 2024',
    cap: 'Happy Mondays',
    capEm: '2024',
  },
]

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null)

  const close = useCallback(() => setOpen(null), [])
  const step = useCallback(
    (delta: number) =>
      setOpen(i => (i === null ? i : (i + delta + items.length) % items.length)),
    []
  )

  useEffect(() => {
    if (open === null) return
    document.body.classList.add('no-scroll')
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') step(-1)
      if (e.key === 'ArrowRight') step(1)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('no-scroll')
    }
  }, [open, close, step])

  const active = open === null ? null : items[open]

  return (
    <section className="gallery-section" id="gallery">
      <div className="gallery-head">
        <div>
          <p className="section-label reveal">Galería</p>
          <h2 className="section-title reveal" style={delayStyle(100)}>
            Retratos y momentos
          </h2>
        </div>
        <p className="gallery-intro reveal" style={delayStyle(200)}>
          Rodaje, escenario y retrato: fragmentos del oficio de Txaro entre la
          cámara y las tablas.
        </p>
      </div>

      <div className="g-cascade">
        {items.map((it, i) => (
          <figure
            key={it.src}
            className={`g-item ${it.letter} reveal`}
            style={delayStyle(i * 70)}
            onClick={() => setOpen(i)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setOpen(i)
              }
            }}
            tabIndex={0}
            aria-label={`Ampliar: ${it.alt}`}
          >
            <div className="g-frame">
              <Img src={it.src} alt={it.alt} priority={i === 0} />
            </div>
            <span className="g-tag" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <figcaption className="g-cap">
              <span>{it.cap}</span>
              {it.capEm && <em>{it.capEm}</em>}
            </figcaption>
          </figure>
        ))}

        <div className="g-note reveal" style={delayStyle(210)} aria-hidden="true">
          <p className="g-word">presencia</p>
          <p className="g-lorem">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>

      <div
        className={`lightbox${open !== null ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Visor de imagen"
        onClick={e => {
          if (e.target === e.currentTarget) close()
        }}
      >
        <button
          type="button"
          className="lightbox-btn lightbox-close"
          id="lightbox-close"
          aria-label="Cerrar"
          onClick={close}
          tabIndex={open === null ? -1 : 0}
        >
          <CloseIcon size={28} />
        </button>
        <button
          type="button"
          className="lightbox-btn lightbox-prev"
          id="lightbox-prev"
          aria-label="Imagen anterior"
          onClick={() => step(-1)}
          tabIndex={open === null ? -1 : 0}
        >
          <ChevronLeftIcon size={28} />
        </button>
        <figure className="lightbox-figure">
          {active && (
            <img src={url(active.src)} alt={active.alt} loading="eager" decoding="sync" />
          )}
          {active && <figcaption className="lightbox-caption">{active.alt}</figcaption>}
        </figure>
        <button
          type="button"
          className="lightbox-btn lightbox-next"
          id="lightbox-next"
          aria-label="Imagen siguiente"
          onClick={() => step(1)}
          tabIndex={open === null ? -1 : 0}
        >
          <ChevronRightIcon size={28} />
        </button>
      </div>
    </section>
  )
}