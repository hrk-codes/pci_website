import type { MetadataRoute } from 'next'
import { cms } from '@/lib/site-data'

const origin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://pcicablesindustries.com').replace(/\/$/, '')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await cms()
  const [pages, products, posts] = await Promise.all([
    payload.find({ collection: 'pages', where: { _status: { equals: 'published' } }, limit: 500, depth: 0 }),
    payload.find({ collection: 'products', where: { _status: { equals: 'published' } }, limit: 500, depth: 0 }),
    payload.find({ collection: 'posts', where: { _status: { equals: 'published' } }, limit: 500, depth: 0 }),
  ])
  return [
    { url: `${origin}/`, changeFrequency: 'weekly', priority: 1 },
    ...pages.docs.map((page) => ({ url: `${origin}/${page.slug}/`, lastModified: new Date(page.updatedAt), changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...products.docs.map((product) => ({ url: `${origin}/products/${product.slug}/`, lastModified: new Date(product.updatedAt), changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...posts.docs.map((post) => ({ url: `${origin}/news/${post.slug}/`, lastModified: new Date(post.updatedAt), changeFrequency: 'monthly' as const, priority: 0.6 })),
  ]
}
