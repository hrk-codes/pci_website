'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { MediaAsset } from '@/lib/media'
import { MediaImage } from '@/components/media'

const groups = [
  { label: 'Company', links: [['About PCI', '/about-us/'], ['Management', '/management/'], ['Clients', '/clients/'], ['Achievements', '/achievements/'], ['Certificates', '/certificates/'], ['Turnover', '/turnover/']] },
  { label: 'Products', links: [['All products', '/products/'], ['Cables', '/cables/'], ['Conductors', '/conductors/'], ['Earth wire', '/earth-wire/']] },
  { label: 'Capabilities', links: [['Testing facilities', '/testing/'], ['EPC & turnkey', '/epc/'], ['Gallery', '/gallery/']] },
  { label: 'Updates', links: [['News', '/news/'], ['Blog', '/blog/'], ['Press releases', '/press-releases/'], ['Careers', '/career/']] },
] as const

export function SiteHeader({ logo }: { logo: MediaAsset | null }) {
  const [open, setOpen] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  useEffect(() => {
    function close(event: KeyboardEvent) { if (event.key === 'Escape') { setOpen(null); setMobileOpen(false) } }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  return <header className="site-header">
    <div className="utility-bar"><div className="shell utility-inner"><span>PCI Cables Industries Pvt Ltd · Established 2013</span><div><a href="mailto:info@pcicablesindustries.com">info@pcicablesindustries.com</a><span aria-hidden="true">|</span><a href="tel:+919062207003">+91 90622 07003</a></div></div></div>
    <div className="shell header-inner">
      <Link href="/" className="brand" aria-label="PCI Cables home" onClick={() => setMobileOpen(false)}><span className="brand-mark"><MediaImage media={logo} alt="" eager size="card" /></span><span className="brand-name"><strong>PCI Cables</strong><small>Industries Pvt Ltd</small></span></Link>
      <nav className="desktop-nav" aria-label="Main navigation" onMouseLeave={() => setOpen(null)} onClick={(event) => { if ((event.target as HTMLElement).closest('a')) setOpen(null) }}>
        <Link className="nav-direct" href="/">Home</Link>
        {groups.map((group) => <div className={`nav-item${open === group.label ? ' is-open' : ''}`} key={group.label} onMouseEnter={() => setOpen(group.label)}>
          <button type="button" aria-expanded={open === group.label} aria-controls={`nav-${group.label}`} onClick={() => setOpen(open === group.label ? null : group.label)}>{group.label}<span aria-hidden="true">⌄</span></button>
          <div className="nav-dropdown" id={`nav-${group.label}`} hidden={open !== group.label}>{group.links.map(([label, href]) => <Link href={href} key={href}>{label}<span aria-hidden="true">↗</span></Link>)}</div>
        </div>)}
        <Link className="nav-direct" href="/contact-us/">Contact</Link>
      </nav>
      <Link href="/contact-us/" className="header-cta">Request a quote <span aria-hidden="true">↗</span></Link>
      <button type="button" className={`menu-toggle${mobileOpen ? ' is-open' : ''}`} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} aria-controls="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)}><span /><span /><span /></button>
    </div>
    <nav className="mobile-menu" id="mobile-menu" aria-label="Mobile navigation" hidden={!mobileOpen} onClick={(event) => { if ((event.target as HTMLElement).closest('a')) setMobileOpen(false) }}>
      <Link href="/">Home</Link>
      {groups.map((group) => <details key={group.label}><summary>{group.label}<span aria-hidden="true">⌄</span></summary>{group.links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</details>)}
      <Link href="/contact-us/">Contact us</Link><Link href="/vendor-registration/">Vendor registration</Link>
    </nav>
  </header>
}
