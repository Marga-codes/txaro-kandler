// Se importa por ruta concreta y no desde el barril raiz: el barril arrastra
// los 1500 iconos del paquete y dispara el bundle a 188 kB.
import { ArrowRight as ArrowRightGlyph } from '@phosphor-icons/react/dist/csr/ArrowRight'
import { CaretLeft as CaretLeftGlyph } from '@phosphor-icons/react/dist/csr/CaretLeft'
import { CaretRight as CaretRightGlyph } from '@phosphor-icons/react/dist/csr/CaretRight'
import { FileText } from '@phosphor-icons/react/dist/csr/FileText'
import { FilmSlate } from '@phosphor-icons/react/dist/csr/FilmSlate'
import { InstagramLogo } from '@phosphor-icons/react/dist/csr/InstagramLogo'
import { WhatsappLogo } from '@phosphor-icons/react/dist/csr/WhatsappLogo'
import { X as CloseGlyph } from '@phosphor-icons/react/dist/csr/X'
import type { Icon } from '@phosphor-icons/react'
import type { IconProps } from '@phosphor-icons/react'

/** Un solo grosor de linea en toda la pagina, no uno por icono. */
const base = { size: 18, weight: 'light' as const, color: 'currentColor' }

export const ArrowRight = (p: IconProps) => <ArrowRightGlyph {...base} {...p} />
export const ChevronLeft = (p: IconProps) => <CaretLeftGlyph {...base} {...p} />
export const ChevronRight = (p: IconProps) => <CaretRightGlyph {...base} {...p} />
export const CloseIcon = (p: IconProps) => <CloseGlyph {...base} {...p} />

const ICONS: Record<string, Icon> = {
  instagram: InstagramLogo,
  whatsapp: WhatsappLogo,
  film: FilmSlate,
  file: FileText,
}

export function ContactIcon({ name, ...rest }: { name: string } & IconProps) {
  const Cmp = ICONS[name] ?? FilmSlate
  return <Cmp {...base} {...rest} />
}