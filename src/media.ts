import manifest from './media-manifest.json'

export type MediaEntry = {
  width: number
  height: number
  bytes: number
  ext: string
}

const table = manifest as Record<string, MediaEntry>

/**
 * GitHub Pages sirve el sitio en /<repo>/. Una ruta absoluta "/media/x.webp"
 * se saltaria ese prefijo y daria 404, asi que todo asset pasa por aqui.
 */
const base = import.meta.env.BASE_URL.replace(/\/$/, '')

export function url(src: string): string {
  return `${base}${src}`
}

/**
 * Devuelve las dimensiones reales del asset para fijarlas en width/height y
 * eliminar el CLS. Si el archivo no esta en el manifiesto, devuelve null y el
 * llamante usa el ratio que ya conoce por CSS.
 */
export function size(src: string): MediaEntry | null {
  return table[src] ?? null
}