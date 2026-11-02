import nextEnv from '@next/env'
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'
import { getPayload } from 'payload'
import fs from 'node:fs/promises'
import path from 'node:path'
import sanitizeHtml from 'sanitize-html'
import { editorial, excludedLegacySlugs } from '../content/editorial'

nextEnv.loadEnvConfig(process.cwd())

const { default: config } = await import('../payload.config')
const payload = await getPayload({ config })
const editorConfig = await editorConfigFactory.default({ config: payload.config })
const source = (process.env.WORDPRESS_IMPORT_URL || 'https://www.pcicablesindustries.com/wp-json/').replace(/\/?$/, '/')
const localUploads = process.env.WORDPRESS_UPLOADS_DIR || 'C:/htdocs/pcicables/wp-content/uploads'
const temporaryDirectory = path.resolve('data/import-tmp')

type WPMedia = {
  id: number
  slug: string
  mime_type: string
  source_url: string
  alt_text: string
  title: { rendered: string }
  media_details?: { sizes?: Record<string, { source_url?: string }> }
}

type WPEntry = {
  id: number
  slug: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt?: { rendered: string }
  featured_media?: number
  date?: string
}

type ImportedMedia = { id: number; url?: string | null; mimeType: string; sourceUrl: string; slug: string }

function plainText(html: string) {
  return new JSDOM(`<body>${html}</body>`).window.document.body.textContent?.replace(/\s+/g, ' ').trim() || ''
}

function sourcePath(url: string) {
  try {
    return decodeURIComponent(new URL(url, 'https://www.pcicablesindustries.com').pathname)
  } catch {
    return ''
  }
}

async function listWordPress<T>(resource: string): Promise<T[]> {
  const result: T[] = []
  for (let page = 1; ; page += 1) {
    const url = new URL(`wp/v2/${resource}`, source)
    url.searchParams.set('per_page', '100')
    url.searchParams.set('page', String(page))
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) })
    if (!response.ok) throw new Error(`WordPress ${resource} page ${page}: HTTP ${response.status}`)
    result.push(...(await response.json() as T[]))
    if (page >= Number(response.headers.get('x-wp-totalpages') || 1)) break
  }
  return result
}

function cleanHtml(html: string, mediaByPath: Map<string, ImportedMedia>) {
  let withLocalLinks = html.replace(/https?:\/\/(?:www\.)?pcicablesindustries\.com\//gi, '/')
  withLocalLinks = withLocalLinks.replace(/(?:https?:\/\/(?:www\.)?pcicablesindustries\.com)?\/wp-content\/uploads\/[^"'\s<>]+/gi, (value) => {
    const media = mediaByPath.get(sourcePath(value))
    return media?.url || value
  })
  return sanitizeHtml(withLocalLinks, {
    allowedTags: ['p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'a', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'br', 'hr'],
    allowedAttributes: { a: ['href', 'title', 'target', 'rel'], th: ['colspan', 'rowspan'], td: ['colspan', 'rowspan'] },
    allowedSchemes: ['http', 'https', 'mailto'],
  })
}

function toLexical(html: string) {
  try {
    return convertHTMLToLexical({ editorConfig, html, JSDOM })
  } catch (error) {
    console.warn('Rich text conversion simplified:', error instanceof Error ? error.message : error)
    return convertHTMLToLexical({ editorConfig, html: `<p>${sanitizeHtml(plainText(html), { allowedTags: [] })}</p>`, JSDOM })
  }
}

async function mediaFile(media: WPMedia): Promise<{ filePath: string; temporary: boolean }> {
  const relative = sourcePath(media.source_url).replace(/^\/wp-content\/uploads\//, '')
  const root = path.resolve(localUploads)
  const local = path.resolve(root, relative)
  if (relative && local.startsWith(root + path.sep)) {
    try {
      await fs.access(local)
      return { filePath: local, temporary: false }
    } catch { /* Fetch from WordPress below. */ }
  }

  const response = await fetch(media.source_url, { signal: AbortSignal.timeout(60000) })
  if (!response.ok) throw new Error(`Media ${media.id}: HTTP ${response.status}`)
  await fs.mkdir(temporaryDirectory, { recursive: true })
  const filename = `${media.id}-${path.basename(sourcePath(media.source_url)) || 'asset'}`
  const filePath = path.join(temporaryDirectory, filename)
  await fs.writeFile(filePath, Buffer.from(await response.arrayBuffer()))
  return { filePath, temporary: true }
}

const wpMedia = await listWordPress<WPMedia>('media')
const wpPages = await listWordPress<WPEntry>('pages')
const wpPosts = await listWordPress<WPEntry>('posts')
const mediaByPath = new Map<string, ImportedMedia>()
const mediaByLegacyId = new Map<number, ImportedMedia>()

console.log(`WordPress source: ${wpPages.length} pages, ${wpPosts.length} posts, ${wpMedia.length} media`)

for (const [index, media] of wpMedia.entries()) {
  try {
    const existing = await payload.find({ collection: 'media', where: { legacyId: { equals: media.id } }, limit: 1, depth: 0 })
    let document = existing.docs[0]
    if (!document) {
      const file = await mediaFile(media)
      try {
        document = await payload.create({
          collection: 'media',
          data: { title: plainText(media.title.rendered) || media.slug, alt: media.alt_text || '', legacyId: media.id, sourceUrl: media.source_url },
          filePath: file.filePath,
        })
      } finally {
        if (file.temporary) await fs.unlink(file.filePath).catch(() => undefined)
      }
    }
    const imported: ImportedMedia = { id: Number(document.id), url: document.url, mimeType: media.mime_type, sourceUrl: media.source_url, slug: media.slug }
    mediaByLegacyId.set(media.id, imported)
    mediaByPath.set(sourcePath(media.source_url), imported)
    for (const size of Object.values(media.media_details?.sizes || {})) {
      if (size.source_url) mediaByPath.set(sourcePath(size.source_url), imported)
    }
    if ((index + 1) % 25 === 0) console.log(`Media: ${index + 1}/${wpMedia.length}`)
  } catch (error) {
    console.error(`Media ${media.id} (${media.slug}) failed:`, error instanceof Error ? error.message : error)
  }
}

function referencedMedia(html: string): number[] {
  const document = new JSDOM(html).window.document
  const ids = new Set<number>()
  for (const image of document.querySelectorAll('img')) {
    const url = image.getAttribute('src') || image.getAttribute('data-src') || ''
    const media = mediaByPath.get(sourcePath(url))
    if (media) ids.add(media.id)
  }
  return [...ids]
}

function bodyFor(entry: WPEntry) {
  const lead = editorial[entry.slug]?.lead
  const detail = cleanHtml(entry.content.rendered, mediaByPath)
  const full = `${lead ? `<p>${lead}</p>` : ''}${detail ? `<h2>Details</h2>${detail}` : ''}`
  return toLexical(full || `<p>${plainText(entry.title.rendered)}</p>`)
}

for (const entry of wpPages) {
  if (excludedLegacySlugs.has(entry.slug)) continue
  const existing = await payload.find({ collection: 'pages', where: { legacyId: { equals: entry.id } }, limit: 1, depth: 0 })
  const images = referencedMedia(entry.content.rendered)
  if (entry.slug === 'gallery' && images.length === 0) {
    images.push(...[...mediaByLegacyId.values()].filter((media) => media.mimeType.startsWith('image/') && /gallery|factory|plant|product|cable|conductor/i.test(media.slug)).slice(0, 40).map((media) => media.id))
  }
  const data = {
    title: plainText(entry.title.rendered),
    slug: entry.slug,
    eyebrow: editorial[entry.slug]?.eyebrow || 'PCI Cables',
    summary: editorial[entry.slug]?.summary || plainText(entry.content.rendered).slice(0, 220),
    body: bodyFor(entry),
    heroMedia: mediaByLegacyId.get(entry.featured_media || 0)?.id || images[0],
    gallery: images,
    sourceHtml: entry.content.rendered,
    legacyId: entry.id,
    _status: 'published' as const,
  }
  if (existing.docs[0]) await payload.update({ collection: 'pages', id: existing.docs[0].id, data })
  else await payload.create({ collection: 'pages', data })
  console.log(`Page: ${entry.slug}`)
}

for (const entry of wpPosts) {
  const existing = await payload.find({ collection: 'posts', where: { legacyId: { equals: entry.id } }, limit: 1, depth: 0 })
  const data = {
    title: plainText(entry.title.rendered),
    slug: entry.slug,
    summary: plainText(entry.excerpt?.rendered || entry.content.rendered).slice(0, 240),
    body: toLexical(cleanHtml(entry.content.rendered, mediaByPath)),
    publishedAt: entry.date,
    heroMedia: mediaByLegacyId.get(entry.featured_media || 0)?.id || referencedMedia(entry.content.rendered)[0],
    legacyId: entry.id,
    _status: 'published' as const,
  }
  if (existing.docs[0]) await payload.update({ collection: 'posts', id: existing.docs[0].id, data })
  else await payload.create({ collection: 'posts', data })
  console.log(`Post: ${entry.slug}`)
}

for (const category of ['cables', 'conductors', 'earth-wire'] as const) {
  const page = wpPages.find((item) => item.slug === category)
  if (!page) continue
  const document = new JSDOM(page.content.rendered).window.document
  for (const heading of document.querySelectorAll('h2, h3, h4')) {
    const title = heading.textContent?.replace(/\s+/g, ' ').trim() || ''
    if (!title || /about company|products|related/i.test(title)) continue
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    if (!slug) continue
    const existing = await payload.find({ collection: 'products', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
    const fragments: string[] = []
    let sibling = heading.nextElementSibling
    while (sibling && !/^H[2-4]$/.test(sibling.tagName) && fragments.length < 8) {
      fragments.push(sibling.outerHTML)
      sibling = sibling.nextElementSibling
    }
    const html = fragments.join('')
    const image = referencedMedia(html)[0]
    const pdfLink = new JSDOM(html).window.document.querySelector('a[href$=".pdf"]')?.getAttribute('href') || ''
    const data = {
      title,
      slug,
      category,
      summary: plainText(html).slice(0, 280) || editorial[category].summary,
      body: toLexical(cleanHtml(html, mediaByPath) || `<p>${editorial[category].lead}</p>`),
      image,
      datasheet: mediaByPath.get(sourcePath(pdfLink))?.id,
      _status: 'published' as const,
    }
    if (existing.docs[0]) await payload.update({ collection: 'products', id: existing.docs[0].id, data })
    else await payload.create({ collection: 'products', data })
    console.log(`Product: ${slug}`)
  }
}

const logo = wpMedia.find((media) => sourcePath(media.source_url).endsWith('/2024/01/logo.png'))
await payload.updateGlobal({
  slug: 'site-settings',
  data: { logo: logo ? mediaByLegacyId.get(logo.id)?.id : undefined },
})

console.log('WordPress import complete. Run it again to update existing entries without duplicates.')
process.exit(0)
