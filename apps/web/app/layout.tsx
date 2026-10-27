import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '@designed/animations/styles.css';
import '@designed/components/styles.css';
import './globals.scss';

import { siteDescription, siteName, siteUrl } from '../lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Constructor visual de webs que exporta React real`,
    template: '%s · designed',
  },
  description: siteDescription,
  keywords: [
    'constructor web',
    'generador de webs',
    'React',
    'TypeScript',
    'plantillas',
    'diseño web sin código',
    'exportar código react',
  ],
  applicationName: siteName,
  authors: [{ name: 'Jorge Mantinán Montero', url: 'https://github.com/JorgeMantinan' }],
  category: 'design',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName,
    title: `${siteName} — Constructor visual de webs que exporta React real`,
    description: siteDescription,
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} — Constructor visual de webs que exporta React real`,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
