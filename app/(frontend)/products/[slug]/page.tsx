import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHero, RichContent } from '@/components/site-pages'
import { MediaImage } from '@/components/media'
import { mediaUrl, mediaValue, productBySlug } from '@/lib/site-data'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await productBySlug(slug)
  return product ? { title: product.title, description: product.summary || undefined, alternates: { canonical: `/products/${slug}/` } } : {}
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await productBySlug(slug)
  if (!product) notFound()
  const datasheet = mediaValue(product.datasheet)
  return <main id="main-content"><PageHero title={product.title} eyebrow={product.category.replace('-', ' ')} summary={product.summary} media={mediaValue(product.image)} />
    <div className="product-anchor-nav"><div className="shell"><a href="#overview">Overview</a>{datasheet && <a href="#datasheet">Datasheet</a>}<a href="#enquire">Enquire</a></div></div>
    <section className="page-section section-pad" id="overview"><div className="shell product-detail-grid"><div className="product-detail-image"><MediaImage media={mediaValue(product.image)} alt={product.title} size="hero" /></div><div className="product-detail-copy"><p className="kicker">{product.category.replace('-', ' ')}</p><h2>Built for dependable connections.</h2>{product.summary && <p className="product-summary">{product.summary}</p>}<RichContent value={product.body} summary={product.summary} /><div className="product-detail-actions"><Link href="/contact-us/" className="button button-accent">Request a quote ↗</Link><Link href={`/${product.category}/`} className="text-link">More {product.category.replace('-', ' ')} ↗</Link></div></div></div></section>
    {datasheet && <section className="datasheet-section section-pad" id="datasheet"><div className="shell datasheet-inner"><div><p className="kicker">Technical resource</p><h2>Need the product datasheet?</h2><p>Open the PCI Cables document for available product details.</p></div><a href={mediaUrl(datasheet) || '#'} target="_blank" rel="noreferrer" className="button button-dark">Open datasheet ↗</a></div></section>}
    <section className="product-enquiry section-pad" id="enquire"><div className="shell product-enquiry-inner"><div><p className="kicker light">Talk to the team</p><h2>Looking for this product?</h2><p>Share your requirements and PCI Cables will review your enquiry.</p></div><Link href="/contact-us/" className="button button-accent">Contact PCI Cables ↗</Link></div></section>
  </main>
}
