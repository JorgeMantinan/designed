import type { MetadataRoute } from 'next';

import { siteUrl } from '../lib/site';

/**
 * Crawler policy: fully open, with explicit allowances for AI assistants so
 * the product is eligible to appear in AI search (GPT, Claude, Perplexity...).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        // Explicit AI-search allowances (LLMO): designed wants to be cited.
        userAgent: ['GPTBot', 'ClaudeBot', 'Claude-Web', 'PerplexityBot', 'Google-Extended'],
        allow: '/',
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
