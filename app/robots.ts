import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/signup'],
      },
    ],
    sitemap: 'https://getservice.2xg.in/sitemap.xml',
  }
}
