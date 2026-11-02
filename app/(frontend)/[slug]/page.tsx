import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageBody } from '@/components/site-pages'
import { allMedia, pageBySlug, productsByCategory, recentPosts } from '@/lib/site-data'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await pageBySlug(slug)
  return page ? { title: page.title, description: page.summary || undefined } : {}
}

export default async function LegacyPage({ params }: Props) {
  const { slug } = await params
  const page = await pageBySlug(slug)
  if (!page) notFound()
  const category = ['cables', 'conductors', 'earth-wire'].includes(slug) ? slug as 'cables' | 'conductors' | 'earth-wire' : undefined
  const products = ['products', 'cables', 'conductors', 'earth-wire'].includes(slug) ? await productsByCategory(category) : undefined
  const posts = ['news', 'blog', 'press-releases'].includes(slug) ? await recentPosts() : undefined
  const archiveMedia = ['gallery', 'certificates', 'clients', 'press-releases'].includes(slug) ? await allMedia() : undefined
  return <main><PageBody page={page} products={products} posts={posts} archiveMedia={archiveMedia} /></main>
}
