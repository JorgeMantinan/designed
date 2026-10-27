import type { MetadataRoute } from 'next';

import { repoUrl, siteUrl } from '../lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/builder`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/llms.txt`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.4,
    },
    {
      url: repoUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];
}
