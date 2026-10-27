/**
 * Canonical site URL, resolved from NEXT_PUBLIC_SITE_URL.
 *
 * Set it in production (see .env.example) so sitemap, robots, JSON-LD and
 * OpenGraph absolute URLs point to the real domain. Falls back to
 * localhost during development.
 */

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
  /\/+$/,
  '',
);

export const siteName = 'designed';

export const siteDescription =
  'Constructor visual de webs que exporta proyectos React + TypeScript reales y modulares. ' +
  'Plantillas, paletas con contraste WCAG, animaciones y fondos interactivos; descarga un ZIP ' +
  'listo para pnpm dev.';

export const repoUrl = 'https://github.com/JorgeMantinan/designed';
