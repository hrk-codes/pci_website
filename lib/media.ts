export type MediaAsset = {
  id: number
  url?: string | null
  alt?: string | null
  title?: string | null
  mimeType?: string | null
  filename?: string | null
  width?: number | null
  height?: number | null
  sourceUrl?: string | null
  sizes?: {
    card?: { url?: string | null } | null
    hero?: { url?: string | null } | null
  } | null
}

export function mediaValue(value?: MediaAsset | number | null): MediaAsset | null {
  return value && typeof value === 'object' && value.url ? value : null
}

export function assetUrl(url?: string | null): string | undefined {
  if (!url) return undefined
  return url.startsWith('/api/media/file/') ? url.replace(/\/$/, '') : url
}

export function mediaUrl(media?: MediaAsset | null, size: 'original' | 'card' | 'hero' = 'original'): string | undefined {
  if (!media) return undefined
  return assetUrl(size === 'original' ? media.url : media.sizes?.[size]?.url || media.url)
}
