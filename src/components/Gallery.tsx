import { useCallback, useEffect, useRef, useState } from 'react'
import { gallery } from '../content'
import { url } from '../media'
import { ChevronLeft, ChevronRight, CloseIcon } from './Icons'
import { Img, Reveal } from './Primitives'

export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const lastFocused = useRef<HTMLElement | null>(null)

  const close = useCallback(() => setOpenIndex(null), [])

  const step = useCallback(
    (delta: number) =>
      setOpenIndex(i =>
        i === null ? i : (i + delta + gallery.length) % gallery.length
      ),
    []
  )

  // Escape cierra, flechas navegan. El foco vuelve a la miniatura de origen.
  useEffect(() => {
    if (openIndex === null) return

    lastFocused.current = document.activeElement as HTMLElement
    document.body.classList.add('no-scroll')
    closeRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') step(-1)
      if (e.key === 'ArrowRight') step(1)
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('no-scroll')
      lastFocused.current?.focus()
    }
  }, [openIndex, close, step])

  const active = openIndex === null ? null : gallery[openIndex]

  return (
    <section className="section gallery" id="gallery">
      <div className="shell">
        <div className="section-head reveal">
          <h2 className="section-title">Retratos y momentos</h2>
          <p className="section-intro">
            Rodaje, escenario y retrato. Fragmentos del oficio entre la cámara
            y las tablas.
          </p>
        </div>

        <div className="gallery-grid">
          {gallery.map((g, i) => (
            <Reveal key={g.src} delay={i * 60} className={`gallery-item g${i + 1}`}>
              <button
                type="button"
                className="gallery-button"
                onClick={() => setOpenIndex(i)}
                aria-label={`Ampliar: ${g.alt}`}
              >
                <Img src={g.src} alt={g.alt} />
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <div
        className={`lightbox${openIndex !== null ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Visor de imagen"
        aria-hidden={openIndex === null}
      >
        <button
          ref={closeRef}
          type="button"
          className="lightbox-btn lightbox-close"
          onClick={close}
          aria-label="Cerrar"
          tabIndex={openIndex === null ? -1 : 0}
        >
          <CloseIcon size={24} />
        </button>

        <button
          type="button"
          className="lightbox-btn lightbox-prev"
          onClick={() => step(-1)}
          aria-label="Imagen anterior"
          tabIndex={openIndex === null ? -1 : 0}
        >
          <ChevronLeft size={26} />
        </button>

        <figure className="lightbox-figure">
          {active && <img src={url(active.src)} alt={active.alt} />}
          {active && <figcaption className="lightbox-caption">{active.alt}</figcaption>}
        </figure>

        <button
          type="button"
          className="lightbox-btn lightbox-next"
          onClick={() => step(1)}
          aria-label="Imagen siguiente"
          tabIndex={openIndex === null ? -1 : 0}
        >
          <ChevronRight size={26} />
        </button>
      </div>
    </section>
  )
}