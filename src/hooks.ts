import { useEffect } from 'react'

/**
 * Marcado de revelado al hacer scroll, igual que el sitio original:
 * IntersectionObserver sobre `.reveal` anade `.visible`, con `--reveal-delay`
 * por elemento. Respeta `prefers-reduced-motion`.
 */
export function useReveal() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    if (!nodes.length) return

    if (reduced || !('IntersectionObserver' in window)) {
      nodes.forEach(n => n.classList.add('visible'))
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )

    nodes.forEach(n => observer.observe(n))
    return () => observer.disconnect()
  }, [])
}