import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/'], // Mengunci rute CMS
    },
    sitemap: 'https://www.studiogigih.com/sitemap.xml',
  };
}