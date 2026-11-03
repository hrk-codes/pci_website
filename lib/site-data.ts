import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import type { MediaAsset } from '@/lib/media'
export { mediaValue, mediaUrl, assetUrl } from '@/lib/media'
export type { MediaAsset } from '@/lib/media'

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

export function richTextHtml(value?: SerializedEditorState | null, summary?: string | null) {
  if (!value) return ''
  try {
    const data = structuredClone(value)
    const text = (node: unknown): string => {
      if (!node || typeof node !== 'object') return ''
      const value = node as { text?: unknown; children?: unknown }
      if (typeof value.text === 'string') return value.text
      return Array.isArray(value.children) ? value.children.map(text).join(' ') : ''
    }
    const nodes = data.root.children
    const navigationStart = nodes.findIndex((node) => node.type === 'heading' && text(node).trim() === 'About Company')
    const content = (navigationStart >= 0 ? nodes.slice(0, navigationStart) : nodes).filter((node) => !(node.type === 'heading' && text(node).trim() === 'Details'))
    if (summary && content[0]?.type === 'paragraph' && text(content[0]).trim() === summary.trim()) content.shift()
    data.root.children = content
    return convertLexicalToHTML({ data })
  } catch {
    return ''
  }
}
