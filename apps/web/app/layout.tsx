import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.scss';

export const metadata: Metadata = {
  title: 'designed — Constructor visual de webs que exporta React real',
  description:
    'Diseña tu web con plantillas avanzadas, paletas, animaciones y sombreados, y descarga un proyecto React + TypeScript modular listo para pnpm dev.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
