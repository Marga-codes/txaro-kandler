import { useEffect, useRef } from 'react'

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Marca los elementos como visibles cuando entran en pantalla. Usa
 * IntersectionObserver en lugar de un listener de scroll, que se dispara en
 * cada frame y provoca jank en movil.
 */
export function useReveal<T extends HTMLElement = HTMLElement>(
  selector = '.reveal'
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const nodes = Array.from(root.querySelectorAll<HTMLElement>(selector))
    if (!nodes.length) return

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      nodes.forEach(n => n.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )

    nodes.forEach(n => observer.observe(n))
    return () => observer.disconnect()
  }, [selector])

  return ref
}

/**
 * Marca el nav como scrolled cuando un centinela entra por arriba. Evita el
 * listener de scroll del sitio anterior.
 */
export function useNavScrolled(sentinelId = 'nav-sentinel') {
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>('.nav')
    const sentinel = document.getElementById(sentinelId)
    if (!nav) return

    if (!sentinel || !('IntersectionObserver' in window)) {
      nav.classList.add('is-scrolled')
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        nav.classList.toggle('is-scrolled', !entries[0].isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [sentinelId])
}