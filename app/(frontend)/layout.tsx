import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/site-header'
import { MediaImage } from '@/components/media'
import { cms, mediaValue } from '@/lib/site-data'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pcicablesindustries.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'PCI Cables Industries | Cables & Conductors', template: '%s | PCI Cables Industries' },
  description: 'PCI Cables Industries manufactures cables, overhead conductors and earth wire for electrical infrastructure in India and overseas.',
  openGraph: { type: 'website', siteName: 'PCI Cables Industries', title: 'PCI Cables Industries', description: 'Cables and conductors for the networks that power progress.' },
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const payload = await cms()
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
  const logo = mediaValue(settings.logo as Parameters<typeof mediaValue>[0])
  const email = settings.contactEmail || 'info@pcicablesindustries.com'

  return <html lang="en"><body id="top">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <SiteHeader logo={logo} />
    {children}
    <footer className="site-footer">
      <div className="shell footer-top">
        <div className="footer-intro"><Link href="/" className="footer-brand"><span><MediaImage media={logo} alt="" size="card" /></span><strong>PCI Cables</strong></Link><p>Cable and conductor solutions for the power networks people depend on.</p><a href={`mailto:${email}`} className="footer-email">{email} ↗</a></div>
        <div className="footer-links"><h3>Company</h3><Link href="/about-us/">About us</Link><Link href="/management/">Management</Link><Link href="/clients/">Clients</Link><Link href="/achievements/">Achievements</Link><Link href="/certificates/">Certificates</Link><Link href="/turnover/">Turnover</Link></div>
        <div className="footer-links"><h3>Explore</h3><Link href="/products/">All products</Link><Link href="/cables/">Cables</Link><Link href="/conductors/">Conductors</Link><Link href="/earth-wire/">Earth wire</Link><Link href="/testing/">Testing facilities</Link><Link href="/epc/">EPC & turnkey</Link></div>
        <div className="footer-links"><h3>Connect</h3><Link href="/contact-us/">Contact us</Link><Link href="/vendor-registration/">Vendor registration</Link><Link href="/career/">Careers</Link><Link href="/news/">News</Link><Link href="/gallery/">Gallery</Link><a href="tel:+919062207003">+91 90622 07003</a></div>
      </div>
      <div className="shell footer-address"><span>Registered office & works</span><p>Om Complex, Monber Sastitala, Beneras Road, PO-Mrigola, Dankuni, Hooghly 712311, West Bengal, India.</p></div>
      <div className="shell footer-bottom"><span>© {new Date().getFullYear()} PCI Cables Industries Pvt Ltd</span><span>Designed for connection.</span></div>
    </footer>
    <div className="floating-actions"><Link href="/contact-us/" aria-label="Contact PCI Cables">Enquire <span aria-hidden="true">↗</span></Link><a href="#top" aria-label="Back to top">↑</a></div>
  </body></html>
}
