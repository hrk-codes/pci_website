import type { MediaAsset } from '@/lib/site-data'

export function MediaImage({
  media,
  alt,
  className = '',
  eager = false,
}: {
  media?: MediaAsset | null
  alt?: string
  className?: string
  eager?: boolean
}) {
  if (!media?.url) return <div className={`media-placeholder ${className}`} aria-hidden="true" />

  return (
    // Payload serves the imported files from this app; preserving their original dimensions avoids cropping diagrams.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={media.url}
      alt={alt || media.alt || media.title || ''}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}
