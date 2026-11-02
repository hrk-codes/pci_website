import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageGallery, PageHero, RichContent } from '@/components/site-pages'
import { mediaValue, productBySlug } from '@/lib/site-data'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await productBySlug(slug)
  return product ? { title: product.title, description: product.summary || undefined } : {}
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await productBySlug(slug)
  if (!product) notFound()
  const datasheet = mediaValue(product.datasheet)
  return <main><PageHero title={product.title} eyebrow={product.category.replace('-', ' ')} summary={product.summary} media={mediaValue(product.image)} /><section className="section"><div className="shell content-layout"><div><RichContent value={product.body} />{datasheet && <div className="page-extra"><PageGallery media={[datasheet]} /></div>}</div><aside className="content-aside"><h3>Product enquiries</h3><p>Share your project requirements with PCI Cables.</p><Link href="/contact-us/">Contact us ↗</Link><Link href={`/${product.category}/`}>Explore {product.category.replace('-', ' ')} ↗</Link></aside></div></section></main>
}
