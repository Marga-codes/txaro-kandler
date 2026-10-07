import type { ReactNode } from 'react'
import { size, url } from '../media'

/** CSSProperties ampliado para variables CSS propias (--reveal-delay...). */
export type StyleVars = React.CSSProperties & Record<`--${string}`, string>

export const delayStyle = (ms: number): StyleVars => ({ '--reveal-delay': `${ms}ms` })

type ImgProps = {
  src: string
  alt: string
  className?: string
  /** Por defecto lazy. El hero debe pasar eager + high. */
  priority?: boolean
  style?: React.CSSProperties
}

export function Img({ src, alt, className, priority, style }: ImgProps) {
  const m = size(src)
  return (
    <img
      src={url(src)}
      alt={alt}
      className={className}
      width={m?.width}
      height={m?.height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      style={style}
    />
  )
}

/** Video con poster opcional. El poster tambien necesita el prefijo base. */
export function Video({
  src,
  poster,
  label,
  ...rest
}: {
  src: string
  poster?: string
  label: string
} & React.VideoHTMLAttributes<HTMLVideoElement>) {
  return (
    <video
      src={url(src)}
      poster={poster ? url(poster) : undefined}
      aria-label={label}
      {...rest}
    />
  )
}

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'figure' | 'article' | 'p'
}) {
  const cls = className ? `reveal ${className}` : 'reveal'
  return (
    <Tag
      className={cls}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}