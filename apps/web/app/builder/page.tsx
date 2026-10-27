import type { Metadata } from 'next';

import { BuilderApp } from './BuilderApp';

export const metadata: Metadata = {
  title: 'Editor — designed',
  description:
    'Elige plantilla y paleta, ajusta secciones, animaciones y fondos, y descarga un proyecto React real.',
};

/** Server wrapper for metadata; the editor itself is fully client-side. */
export default function BuilderPage() {
  return <BuilderApp />;
}
