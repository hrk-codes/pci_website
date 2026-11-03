import Link from 'next/link'
import { ClientShowcase } from '@/components/client-showcase'
import { HeroCarousel, type HeroSlide } from '@/components/hero-carousel'
import { MediaImage } from '@/components/media'
import { MilestoneTimeline } from '@/components/milestone-timeline'
import { Reveal } from '@/components/reveal'
import { SubmissionForm } from '@/components/submission-form'
import { allMedia, mediaUrl, mediaValue, pageBySlug, productsByCategory, recentPosts } from '@/lib/site-data'
import { clientGroups, contentParagraphs, findMedia, milestonesFromContent } from '@/lib/presentation'

const featuredSlugs = ['eco-panther-conductor', 'lt-xlpe-cable', 'aerial-bunched-cable-ab-cable']
const rangeSlugs = ['lt-xlpe-cable', 'aluminium-conductor-steel-reinforced-acsr', 'aerial-bunched-cable-ab-cable', 'control-cable', 'pvc-power-cable', 'all-aluminium-aloy-conductor-aaac', 'gi-earth-wire', 'eco-panther-conductor']

export default async function Home() {
  const [media, products, posts, about, achievements, clients, testing] = await Promise.all([
    allMedia(), productsByCategory(), recentPosts(), pageBySlug('about-us'), pageBySlug('achievements'), pageBySlug('clients'), pageBySlug('testing'),
  ])
  const find = (filename: string) => findMedia(media, filename)
  const slides: HeroSlide[] = [
    { image: mediaUrl(find('product1.jpg'), 'hero') || '', label: 'PCI Cables Industries', title: 'The power behind every connection.', description: 'Cables and overhead conductors for the electrical networks that move India forward.', href: '/products/', action: 'Explore our products' },
    { image: mediaUrl(find('image-03.jpg'), 'hero') || '', label: 'Made in West Bengal', title: 'Built with purpose. Made to perform.', description: about?.summary || 'Discover the people, facilities and standards behind PCI Cables.', href: '/about-us/', action: 'Discover PCI' },
    { image: mediaUrl(find('front.jpg'), 'hero') || '', label: 'Power infrastructure', title: 'Engineered for what comes next.', description: 'Explore cables, conductors and earth wire for distribution and transmission.', href: '/testing/', action: 'See our capabilities' },
  ].filter((slide) => Boolean(slide.image))
  const aboutParagraphs = contentParagraphs(about?.body)
  const aboutIntro = aboutParagraphs.find((line) => line.startsWith('PCI Cables is one of the leading')) || about?.summary || ''
  const milestones = milestonesFromContent(achievements?.body)
  const featured = featuredSlugs.map((slug) => products.find((product) => product.slug === slug)).filter((product) => Boolean(product))
  const range = rangeSlugs.map((slug) => products.find((product) => product.slug === slug)).filter((product) => Boolean(product))
  const groups = clientGroups(media)
  const video = media.find((item) => item.filename?.startsWith('INDIAS-LEADING-CABLE-CONDUCTOR-MANUFACTURER'))
  const videoPoster = find('image-03.jpg')
  const families = new Set(products.map((product) => product.category)).size

  return <main id="main-content">
    <HeroCarousel slides={slides} />

    <section className="intro-section section-pad"><div className="shell intro-grid">
      <Reveal className="intro-visual"><div className="intro-frame"><MediaImage media={find('image-03.jpg')} alt="Inside the PCI Cables manufacturing facility" size="hero" /></div><span className="intro-caption">Manufacturing in West Bengal, India</span></Reveal>
      <Reveal className="intro-copy" delay={100}><p className="kicker">About PCI Cables</p><h2>Building confidence into every connection<span>.</span></h2><p className="intro-lead">{about?.summary}</p><p>{aboutIntro.length > 460 ? `${aboutIntro.slice(0, 457).trimEnd()}…` : aboutIntro}</p><Link href="/about-us/" className="button button-outline">Our story <span aria-hidden="true">↗</span></Link></Reveal>
    </div></section>

    <section className="spotlight-section section-pad"><div className="shell"><div className="center-heading"><p className="kicker">From our product range</p><h2>Featured solutions</h2><p>Explore selected products from PCI&apos;s cable and conductor portfolio.</p></div><div className="spotlight-grid">{featured.map((product, index) => product && <Reveal key={product.id} delay={index * 70}><Link href={`/products/${product.slug}/`} className="spotlight-card"><span className="spotlight-image"><MediaImage media={mediaValue(product.image)} alt={product.title} size="card" /></span><span className="spotlight-body"><small>0{index + 1} / {product.category.replace('-', ' ')}</small><strong>{product.title}</strong><span className="card-link">View product ↗</span></span></Link></Reveal>)}</div></div></section>

    <section className="reach-section section-pad"><div className="shell reach-grid"><div className="reach-copy"><p className="kicker light">Our reach</p><h2>From West Bengal to wider horizons.</h2><p>{achievements?.summary}</p><div className="reach-locations"><span>India</span><span>Uganda</span><span>Nepal</span></div><Link href="/achievements/" className="text-link light">Explore our milestones <span aria-hidden="true">↗</span></Link></div><div className="globe-stage" role="img" aria-label="Illustrated globe showing PCI Cables' India base and export milestones in Uganda and Nepal"><div className="globe-halo" /><div className="globe-sphere"><i className="globe-lat lat-one" /><i className="globe-lat lat-two" /><i className="globe-lat lat-three" /><i className="globe-meridian meridian-one" /><i className="globe-meridian meridian-two" /><i className="globe-meridian meridian-three" /><span className="globe-pin pin-india">India</span><span className="globe-pin pin-uganda">Uganda</span><span className="globe-pin pin-nepal">Nepal</span></div><div className="globe-orbit" /></div></div></section>

    <section className="range-section section-pad"><div className="shell"><div className="section-heading"><div><p className="kicker">What we make</p><h2>Explore the range<span>.</span></h2></div><p>From power and control cables to overhead conductors, each product has a purpose in the network.</p></div><div className="range-grid">{range.map((product) => product && <Link href={`/products/${product.slug}/`} className="range-card" key={product.id}><div className="range-image"><MediaImage media={mediaValue(product.image)} alt={product.title} size="card" /></div><div className="range-label"><span>{product.title}</span><span aria-hidden="true">↗</span></div></Link>)}</div><div className="center-action"><Link href="/products/" className="button button-accent">View all {products.length} products <span aria-hidden="true">↗</span></Link></div></div></section>

    <section className="facts-section section-pad"><div className="shell"><div className="center-heading"><p className="kicker">PCI at a glance</p><h2>Built on steady progress.</h2></div><div className="facts-grid"><div><strong>2013</strong><span>Our journey began</span></div><div><strong>{products.length}</strong><span>Products in the catalog</span></div><div><strong>{families}</strong><span>Core product families</span></div><div><strong>2</strong><span>Recorded export milestones</span></div></div></div></section>

    <section className="clients-section section-pad"><div className="shell"><div className="center-heading"><p className="kicker">Where our work connects</p><h2>Our clients and partners.</h2><p>{clients?.summary}</p></div><ClientShowcase groups={groups} /><div className="center-action"><Link href="/clients/" className="text-link">Explore all clients <span aria-hidden="true">↗</span></Link></div></div></section>

    <section className="quality-section section-pad"><div className="shell quality-grid"><div className="quality-image"><MediaImage media={find('testing.jpg')} alt="PCI Cables testing equipment" size="hero" /></div><div className="quality-copy"><p className="kicker">Quality at every stage</p><h2>Tested with care. Ready for the real world.</h2><p>{testing?.summary}</p><div className="quality-links"><Link href="/testing/" className="button button-accent">Testing facilities <span aria-hidden="true">↗</span></Link><Link href="/certificates/" className="text-link">View certificates ↗</Link></div></div></div></section>

    {milestones.length > 0 && <section className="milestones-section section-pad"><div className="shell"><div className="center-heading"><p className="kicker">Our journey</p><h2>Milestones that move us.</h2><p>{achievements?.summary}</p></div><MilestoneTimeline milestones={milestones} /><div className="center-action"><Link href="/achievements/" className="text-link">View the full story ↗</Link></div></div></section>}

    {video?.url && <section className="video-section"><div className="shell video-grid"><div><p className="kicker light">Inside PCI</p><h2>See the work behind the wires.</h2><p>Get a closer look at PCI Cables through a video from the company archive.</p><Link href="/gallery/" className="text-link light">Explore the gallery ↗</Link></div><video controls preload="none" playsInline poster={mediaUrl(videoPoster, 'hero')} aria-label={video.title || 'PCI Cables company video'}><source src={mediaUrl(video)} type="video/mp4" />Your browser does not support HTML video.</video></div></section>}

    {posts.length > 0 && <section className="news-section section-pad"><div className="shell"><div className="section-heading"><div><p className="kicker">Latest from PCI</p><h2>News & updates<span>.</span></h2></div><Link href="/news/" className="text-link">View all news ↗</Link></div><div className="news-grid">{posts.slice(0, 3).map((post) => <Link href={`/news/${post.slug}/`} className="news-card" key={post.id}><div className="news-image"><MediaImage media={mediaValue(post.heroMedia)} alt={post.title} size="card" /></div><div className="news-copy"><span>{post.publishedAt ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(post.publishedAt)) : 'PCI update'}</span><h3>{post.title}</h3><span className="card-link">Read story ↗</span></div></Link>)}</div></div></section>}

    <section className="inquiry-section section-pad"><div className="shell inquiry-grid"><div className="inquiry-copy"><p className="kicker light">Start a conversation</p><h2>Have a cable or conductor requirement?</h2><p>Tell the PCI team about your project and your enquiry will be saved for review.</p><div className="inquiry-contact"><span>Email</span><a href="mailto:info@pcicablesindustries.com">info@pcicablesindustries.com</a><span>Sales & marketing</span><a href="tel:+919062207003">+91 90622 07003</a></div></div><SubmissionForm type="contact" compact /></div></section>
  </main>
}
