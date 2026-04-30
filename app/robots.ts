import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/'
    },
    sitemap: 'https://marsianin.online/sitemap.xml',
    host: 'https://marsianin.online'
  };
}
