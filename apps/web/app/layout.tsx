import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '@designed/animations/styles.css';
import '@designed/components/styles.css';
import './globals.scss';

export const metadata: Metadata = {
  title: 'designed — Constructor visual de webs que exporta React real',
  description:
    'Diseña tu web con plantillas avanzadas, paletas con contraste WCAG, animaciones y fondos interactivos, y descarga un proyecto React + TypeScript modular listo para pnpm dev.',
  keywords: [
    'constructor web',
    'generador de webs',
    'React',
    'TypeScript',
    'plantillas',
    'diseño web sin código',
  ],
  openGraph: {
    title: 'designed — Constructor visual de webs que exporta React real',
    description:
      'Diseña, previsualiza y descarga un proyecto React + TypeScript modular con un clic.',
    type: 'website',
    locale: 'es_ES',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
