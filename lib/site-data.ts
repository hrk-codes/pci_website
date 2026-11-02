import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { getPayload, type Where } from 'payload'
import config from '@payload-config'

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
}

export type PageRecord = {
  id: number
  title: string
  slug: string
  eyebrow?: string | null
  summary?: string | null
  body?: SerializedEditorState | null
  heroMedia?: MediaAsset | number | null
  gallery?: Array<MediaAsset | number> | null
}

export type ProductRecord = {
  id: number
  title: string
  slug: string
  category: 'cables' | 'conductors' | 'earth-wire'
  summary?: string | null
  body?: SerializedEditorState | null
  image?: MediaAsset | number | null
  datasheet?: MediaAsset | number | null
}

export type PostRecord = {
  id: number
  title: string
  slug: string
  summary?: string | null
  body?: SerializedEditorState | null
  publishedAt?: string | null
  heroMedia?: MediaAsset | number | null
}

export async function cms() {
  return getPayload({ config })
}

export async function pageBySlug(slug: string): Promise<PageRecord | null> {
  const payload = await cms()
  const result = await payload.find({
    collection: 'pages',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 1,
  })
  return (result.docs[0] as unknown as PageRecord) || null
}

export async function productBySlug(slug: string): Promise<ProductRecord | null> {
  const payload = await cms()
  const result = await payload.find({
    collection: 'products',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 1,
  })
  return (result.docs[0] as unknown as ProductRecord) || null
}

export async function productsByCategory(category?: ProductRecord['category']): Promise<ProductRecord[]> {
  const payload = await cms()
  const conditions: Where[] = [{ _status: { equals: 'published' } }]
  if (category) conditions.push({ category: { equals: category } })
  const result = await payload.find({ collection: 'products', where: { and: conditions }, limit: 100, sort: 'title', depth: 1 })
  return result.docs as unknown as ProductRecord[]
}

export async function recentPosts(): Promise<PostRecord[]> {
  const payload = await cms()
  const result = await payload.find({ collection: 'posts', where: { _status: { equals: 'published' } }, limit: 12, sort: '-publishedAt', depth: 1 })
  return result.docs as unknown as PostRecord[]
}

export async function allMedia(): Promise<MediaAsset[]> {
  const payload = await cms()
  const result = await payload.find({ collection: 'media', limit: 300, depth: 0, sort: '-createdAt' })
  return result.docs as unknown as MediaAsset[]
}

export function mediaValue(value?: MediaAsset | number | null): MediaAsset | null {
  return value && typeof value === 'object' && value.url ? value : null
}

export function richTextHtml(value?: SerializedEditorState | null) {
  if (!value) return ''
  try {
    return convertLexicalToHTML({ data: value })
  } catch {
    return ''
  }
}
