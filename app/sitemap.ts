import type { MetadataRoute } from 'next';
import { locations } from '@/data/locations';

const baseUrl = 'https://marsianin.online';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1
    },
    {
      url: `${baseUrl}/menu`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9
    },
    ...locations.map((location) => ({
      url: `${baseUrl}/menu/${location.id}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8
    }))
  ];
}
