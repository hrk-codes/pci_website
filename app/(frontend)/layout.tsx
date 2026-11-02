import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { cms, mediaValue } from '@/lib/site-data'
import { MediaImage } from '@/components/media'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'PCI Cables Industries', template: '%s | PCI Cables Industries' },
  description: 'Cable and conductor solutions from PCI Cables Industries.',
}

const navigation = [
  { label: 'Company', links: [
    ['About us', '/about-us/'], ['Management', '/management/'], ['Certificates', '/certificates/'],
    ['Clients', '/clients/'], ['Achievements', '/achievements/'], ['Turnover', '/turnover/'],
  ] },
  { label: 'Products', links: [
    ['Overview', '/products/'], ['Cables', '/cables/'], ['Conductors', '/conductors/'], ['Earth wire', '/earth-wire/'],
  ] },
  { label: 'Capabilities', links: [
    ['Testing facilities', '/testing/'], ['EPC & turnkey', '/epc/'], ['Gallery', '/gallery/'],
  ] },
  { label: 'Updates', links: [
    ['News', '/news/'], ['Blog', '/blog/'], ['Press releases', '/press-releases/'],
  ] },
] as const

async function Brand() {
  const payload = await cms()
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
  const logo = mediaValue(settings.logo as Parameters<typeof mediaValue>[0])

  return (
    <Link href="/" className="brand" aria-label="PCI Cables home">
      <span className="brand-mark">
        <MediaImage media={logo} alt="" eager />
      </span>
      <span className="brand-name"><strong>PCI Cables</strong><small>Industries Pvt Ltd</small></span>
    </Link>
  )
}

function Navigation({ mobile = false }: { mobile?: boolean }) {
  return (
    <nav aria-label={mobile ? 'Mobile navigation' : 'Main navigation'} className={mobile ? 'mobile-nav-links' : 'desktop-nav'}>
      {navigation.map((group) => (
        <details className="nav-group" key={group.label}>
          <summary>{group.label}<span aria-hidden="true">⌄</span></summary>
          <div className="nav-dropdown">
            {group.links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
          </div>
        </details>
      ))}
      {mobile && <><Link href="/career/">Careers</Link><Link href="/vendor-registration/">Vendor registration</Link><Link href="/contact-us/">Contact</Link></>}
    </nav>
  )
}

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="shell header-inner">
            <Brand />
            <Navigation />
            <Link className="header-contact" href="/contact-us/">Let’s talk <span aria-hidden="true">↗</span></Link>
            <details className="mobile-nav">
              <summary aria-label="Open menu"><span></span><span></span><span></span></summary>
              <Navigation mobile />
            </details>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="shell footer-grid">
            <div>
              <p className="eyebrow">PCI Cables Industries</p>
              <h2>Powering what comes next.</h2>
              <p>Cable and conductor solutions for electrical infrastructure.</p>
              <Link className="text-link" href="/contact-us/">Start a conversation <span aria-hidden="true">↗</span></Link>
            </div>
            <div><h3>Explore</h3><Link href="/products/">Products</Link><Link href="/about-us/">About us</Link><Link href="/testing/">Testing facilities</Link><Link href="/news/">News</Link></div>
            <div><h3>Connect</h3><Link href="/contact-us/">Contact us</Link><Link href="/vendor-registration/">Vendor registration</Link><Link href="/career/">Careers</Link><a href="mailto:info@pcicablesindustries.com">info@pcicablesindustries.com</a></div>
          </div>
          <div className="shell footer-bottom"><span>© {new Date().getFullYear()} PCI Cables Industries Pvt Ltd</span><span>Built for clarity, performance and access.</span></div>
        </footer>
      </body>
    </html>
  )
}

