import Link from 'next/link'
import { MediaImage } from '@/components/media'
import { SubmissionForm } from '@/components/submission-form'
import { mediaValue, richTextHtml, type MediaAsset, type PageRecord, type PostRecord, type ProductRecord } from '@/lib/site-data'

export function PageHero({ title, eyebrow, summary, media }: { title: string; eyebrow?: string | null; summary?: string | null; media?: MediaAsset | null }) {
  return <section className="page-hero"><MediaImage media={media} alt="" /><div className="shell"><p className="eyebrow">{eyebrow || 'PCI Cables Industries'}</p><h1>{title}</h1>{summary && <p>{summary}</p>}</div></section>
}

export function RichContent({ value }: { value?: PageRecord['body'] }) {
  const html = richTextHtml(value)
  return html ? <div className="rich-content" dangerouslySetInnerHTML={{ __html: html }} /> : null
}

export function ProductListing({ products }: { products: ProductRecord[] }) {
  return <div className="listing-grid">{products.map((product) => <Link href={`/products/${product.slug}/`} className="listing-card" key={product.id}><div className="listing-card-image"><MediaImage media={mediaValue(product.image)} alt={product.title} /></div><div className="listing-card-body"><p className="eyebrow">{product.category.replace('-', ' ')}</p><h3>{product.title}</h3>{product.summary && <p>{product.summary}</p>}<span className="text-link">View details ↗</span></div></Link>)}</div>
}

export function PostListing({ posts }: { posts: PostRecord[] }) {
  return <div className="listing-grid">{posts.map((post) => <Link href={`/news/${post.slug}/`} className="listing-card" key={post.id}><div className="listing-card-image"><MediaImage media={mediaValue(post.heroMedia)} alt={post.title} /></div><div className="listing-card-body"><p className="eyebrow">{post.publishedAt ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(post.publishedAt)) : 'PCI update'}</p><h3>{post.title}</h3>{post.summary && <p>{post.summary}</p>}<span className="text-link">Read update ↗</span></div></Link>)}</div>
}

export function PageGallery({ media, title }: { media: MediaAsset[]; title?: string }) {
  if (!media.length) return null
  return <div className="media-grid">{media.map((item) => <figure className="media-card" key={item.id}>{item.mimeType === 'video/mp4' ? <video controls preload="metadata" src={item.url || undefined} aria-label={item.title || 'PCI video'} /> : item.mimeType === 'application/pdf' ? <a className="download-link" href={item.url || '#'} target="_blank" rel="noreferrer">Open PDF ↗</a> : <MediaImage media={item} alt={item.alt || item.title || title || ''} />}<figcaption>{item.title || item.filename}</figcaption></figure>)}</div>
}

export function PageBody({ page, products, posts, archiveMedia = [] }: { page: PageRecord; products?: ProductRecord[]; posts?: PostRecord[]; archiveMedia?: MediaAsset[] }) {
  let gallery = (page.gallery || []).map((item) => mediaValue(item)).filter((item): item is MediaAsset => Boolean(item))
  if (page.slug === 'gallery') {
    gallery = archiveMedia.filter((item) => /^(image-\d+|media-[1-3]|elecrama-\d+)\.(jpe?g|mp4)$/i.test(item.filename || '') || item.mimeType === 'video/mp4')
  }
  if (page.slug === 'certificates') {
    gallery = archiveMedia.filter((item) => /^ISO-/i.test(item.filename || ''))
  }
  if (page.slug === 'clients') {
    const excluded = /^(ChatGPT|Artboard|ECO|PVC|LT-|AAC|ACSR|ACAR|Aerial|sevice|Blank|logo|KONEXA-1)/i
    gallery = archiveMedia.filter((item) => item.mimeType === 'image/png' && !excluded.test(item.filename || ''))
  }
  if (page.slug === 'press-releases') {
    gallery = archiveMedia.filter((item) => /^EP-Info/i.test(item.filename || ''))
  }
  const isContact = page.slug === 'contact-us'
  const isVendor = page.slug === 'vendor-registration'
  const isProductPage = ['products', 'cables', 'conductors', 'earth-wire'].includes(page.slug)
  const isNews = ['news', 'blog', 'press-releases'].includes(page.slug)

  return <>
    <PageHero title={page.title} eyebrow={page.eyebrow} summary={page.summary} media={mediaValue(page.heroMedia)} />
    <section className="section"><div className="shell">
      {isContact || isVendor ? <>
        <SubmissionForm type={isVendor ? 'vendor-registration' : 'contact'} />
        <div className="contact-details">
          <div className="contact-detail"><h3>Email PCI Cables</h3><p><a href="mailto:info@pcicablesindustries.com">info@pcicablesindustries.com</a></p></div>
          <div className="contact-detail"><h3>{isVendor ? 'Purchase team' : 'Sales & marketing'}</h3><p><a href={isVendor ? 'tel:+919062207005' : 'tel:+919062207003'}>{isVendor ? '+91 90622 07005' : '+91 90622 07003'}</a></p></div>
          <div className="contact-detail"><h3>Registered office & works</h3><p>Om Complex, Monber Sastitala, Beneras Road, PO-Mrigola, Dankuni, Hooghly 712311, West Bengal, India.</p></div>
          <div className="contact-detail"><h3>Explore the company</h3><p><Link href="/about-us/">About PCI Cables ↗</Link></p></div>
        </div>
      </> : <>
        {page.body && <div className="content-layout"><RichContent value={page.body} /><aside className="content-aside"><h3>Explore more</h3><Link href="/products/">Products ↗</Link><Link href="/testing/">Testing facilities ↗</Link><Link href="/contact-us/">Contact us ↗</Link></aside></div>}
        {isProductPage && products && <div className="page-extra"><p className="eyebrow">Product range</p><h2 className="section-title">Explore the range.</h2><ProductListing products={products} /></div>}
        {isNews && posts && <div className="page-extra"><p className="eyebrow">From PCI</p><h2 className="section-title">Recent updates.</h2><PostListing posts={posts} /></div>}
        {gallery.length > 0 && <div className="page-extra"><p className="eyebrow">From the archive</p><h2 className="section-title">{page.slug === 'gallery' ? 'Inside PCI.' : 'Explore further.'}</h2><PageGallery media={gallery} title={page.title} /></div>}
      </>}
    </div></section>
  </>
}
