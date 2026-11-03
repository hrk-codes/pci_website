import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHero, RichContent } from '@/components/site-pages'
import { cms, mediaValue, type PostRecord } from '@/lib/site-data'

type Props = { params: Promise<{ slug: string }> }

async function postBySlug(slug: string): Promise<PostRecord | null> {
  const payload = await cms()
  const result = await payload.find({ collection: 'posts', where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] }, limit: 1, depth: 1 })
  return result.docs[0] as unknown as PostRecord || null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await postBySlug(slug)
  return post ? { title: post.title, description: post.summary || undefined, alternates: { canonical: `/news/${slug}/` } } : {}
}

export default async function NewsPost({ params }: Props) {
  const { slug } = await params
  const post = await postBySlug(slug)
  if (!post) notFound()
  return <main id="main-content"><PageHero title={post.title} eyebrow="PCI update" summary={post.summary} media={mediaValue(post.heroMedia)} /><section className="page-section section-pad"><div className="shell content-layout"><RichContent value={post.body} summary={post.summary} /><aside className="content-aside"><h3>More from PCI</h3><Link href="/news/">All news ↗</Link><Link href="/products/">Products ↗</Link><Link href="/contact-us/">Contact us ↗</Link></aside></div></section></main>
}
