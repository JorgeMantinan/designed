import type { NextConfig } from 'next';

const isProduction = process.env.NODE_ENV === 'production';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
const isHttps = siteUrl.startsWith('https://');

/**
 * Security headers (OWASP): CSP, clickjacking, sniffing, referrer and
 * permissions. Notes:
 * - `script-src 'unsafe-inline'` is required because Next embeds the RSC
 *   flight payload as inline scripts; the upgrade path is a nonce + middleware.
 * - `unsafe-eval` only in dev (bundlers/HMR), never in production.
 * - HSTS is only emitted for https deployments (never for localhost).
 */
function securityHeaders(): Array<{ key: string; value: string }> {
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isProduction ? '' : " 'unsafe-eval'"}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "media-src 'self' https:",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isHttps ? ['upgrade-insecure-requests'] : []),
  ].join('; ');

  const headers: Array<{ key: string; value: string }> = [
    { key: 'Content-Security-Policy', value: csp },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), payment=()',
    },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    { key: 'X-DNS-Prefetch-Control', value: 'off' },
  ];

  if (isHttps) {
    headers.push({
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains',
    });
  }

  return headers;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // No divulgar el framework en las respuestas.
  poweredByHeader: false,
  // Los paquetes del monorepo se consumen en TypeScript fuente (sin build previo)
  transpilePackages: [
    '@designed/schema',
    '@designed/tokens',
    '@designed/palettes',
    '@designed/animations',
    '@designed/components',
    '@designed/codegen',
  ],
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders() }];
  },
};

export default nextConfig;
