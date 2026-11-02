import Link from 'next/link'
import { MediaImage } from '@/components/media'
import { Reveal } from '@/components/reveal'
import { allMedia, recentPosts, type MediaAsset } from '@/lib/site-data'

function pickMedia(media: MediaAsset[], filename: string) {
  return media.find((item) => item.filename?.toLowerCase() === filename.toLowerCase()) || null
}

export default async function Home() {
  const [media, posts] = await Promise.all([allMedia(), recentPosts()])
  const hero = pickMedia(media, 'product1.jpg')
  const cable = pickMedia(media, 'cables-1.jpg') || hero
  const conductor = pickMedia(media, 'conductors-2.jpg')
  const earth = pickMedia(media, 'GI-Earth-Wire.jpg') || pickMedia(media, 'testing.jpg')
  const testing = pickMedia(media, 'testing.jpg')

  return <main>
    <section className="hero">
      <MediaImage media={hero} alt="PCI cable products" className="hero-photo" eager />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-orbit" aria-hidden="true" />
      <div className="shell hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">PCI Cables Industries Pvt Ltd</p>
          <h1 className="display">Built to carry <span>progress.</span></h1>
          <p className="hero-lead">Cable, conductor and earth wire solutions for the electrical networks people depend on.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/products/">Explore products <span aria-hidden="true">↗</span></Link>
            <Link className="button button-ghost" href="/about-us/">Discover PCI <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <div className="hero-index">Engineered for connection / 01</div>
      </div>
    </section>
    <div className="ticker"><div className="shell ticker-inner"><span>Cables</span><span>Conductors</span><span>Earth wire</span><span>Testing</span><span>Infrastructure</span></div></div>
    <section className="section" id="products"><div className="shell">
      <Reveal className="section-head"><div><p className="eyebrow">What we make</p><h2 className="section-title">Solutions for every connection.</h2></div><p className="lead">Browse the product families PCI Cables supplies for power infrastructure and distribution.</p></Reveal>
      <div className="product-grid">
        {([
          { title: 'Cables', slug: 'cables', image: cable, description: 'Power, control, aerial bunched and service cable ranges.' },
          { title: 'Conductors', slug: 'conductors', image: conductor, description: 'Overhead conductor families for transmission and distribution.' },
          { title: 'Earth wire', slug: 'earth-wire', image: earth, description: 'GI earth wire information for overhead line applications.' },
        ] as const).map((item, index) => <Reveal key={item.slug} delay={index * 90}><Link href={`/${item.slug}/`} className="product-card"><MediaImage media={item.image} alt={item.title} /><div className="product-card-content"><span className="eyebrow">0{index + 1} / Product family</span><h3>{item.title}</h3><p>{item.description}</p><span className="arrow-circle" aria-hidden="true">↗</span></div></Link></Reveal>)}
      </div>
    </div></section>
    <section className="section section-light"><div className="shell feature-split">
      <Reveal className="feature-visual"><MediaImage media={testing} alt="PCI testing facilities" /></Reveal>
      <Reveal className="feature-copy"><p className="eyebrow">Inside PCI</p><h2 className="section-title">Made with purpose. Checked with care.</h2><p className="lead">Explore the facilities and testing capabilities behind PCI Cables&apos; products, alongside the certificates published by the company.</p><ul className="feature-list"><li><span>01</span> Product focused manufacturing</li><li><span>02</span> Testing and quality checks</li><li><span>03</span> Documentation and certifications</li></ul><div className="button-row"><Link href="/testing/" className="button button-dark">Explore facilities <span aria-hidden="true">↗</span></Link><Link href="/certificates/" className="button">View certificates <span aria-hidden="true">↗</span></Link></div></Reveal>
    </div></section>
    <section className="section section-dark"><div className="shell"><Reveal><p className="eyebrow">Our company</p><h2 className="section-title">Connected to the work that moves us forward.</h2><p className="lead">From electrical networks to public infrastructure, PCI Cables shares its product range, clients and company milestones in one place.</p></Reveal><div className="proof-grid"><div className="proof-item"><span>01 / COMPANY</span><h3>Our story</h3><p>Discover the people and background of PCI Cables Industries.</p><Link href="/about-us/" className="text-link">About us ↗</Link></div><div className="proof-item"><span>02 / WORK</span><h3>Our clients</h3><p>Explore organizations and sectors featured in PCI&apos;s records.</p><Link href="/clients/" className="text-link">View clients ↗</Link></div><div className="proof-item"><span>03 / PROGRESS</span><h3>Our milestones</h3><p>Follow the developments recorded by the company.</p><Link href="/achievements/" className="text-link">See achievements ↗</Link></div></div></div></section>
    {posts.length > 0 && <section className="section"><div className="shell"><div className="section-head"><div><p className="eyebrow">From PCI</p><h2 className="section-title">The latest connections.</h2></div><Link href="/news/" className="text-link">All updates ↗</Link></div><div className="updates-grid">{posts.slice(0, 3).map((post) => <Link href={`/news/${post.slug}/`} className="update-card" key={post.id}><p className="eyebrow">Company update</p><h3>{post.title}</h3><p>{post.summary}</p><span className="arrow-circle" aria-hidden="true">↗</span></Link>)}</div></div></section>}
    <section className="cta-band"><div className="shell cta-band-inner"><div><p className="eyebrow" style={{ color: '#543212' }}>Let&apos;s connect</p><h2 className="section-title">Have a project in mind? Let&apos;s talk.</h2></div><Link className="button button-dark" href="/contact-us/">Contact PCI Cables <span aria-hidden="true">↗</span></Link></div></section>
  </main>
}

