import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Los paquetes del monorepo se consumen en TypeScript fuente (sin build previo)
  transpilePackages: [
    '@designed/schema',
    '@designed/tokens',
    '@designed/palettes',
    '@designed/animations',
    '@designed/components',
    '@designed/codegen',
  ],
};

export default nextConfig;
