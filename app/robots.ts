import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://pcicablesindustries.com').replace(/\/$/, '')
  return { rules: { userAgent: '*', allow: ['/', '/api/media/file/'], disallow: ['/admin/', '/api/'] }, sitemap: `${origin}/sitemap.xml` }
}
