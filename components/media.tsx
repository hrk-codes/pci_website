import { mediaUrl, type MediaAsset } from '@/lib/media'

export function MediaImage({
  media,
  alt,
  className = '',
  eager = false,
  size = 'original',
}: {
  media?: MediaAsset | null
  alt?: string
  className?: string
  eager?: boolean
  size?: 'original' | 'card' | 'hero'
}) {
  if (!media?.url) return <div className={`media-placeholder ${className}`} aria-hidden="true" />

  const src = mediaUrl(media, size)

  return (
    // Payload serves the imported files from this app; preserving their original dimensions avoids cropping diagrams.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || media.alt || media.title || ''}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
    />
  )
}
