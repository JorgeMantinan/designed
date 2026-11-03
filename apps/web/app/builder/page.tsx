import type { Metadata } from 'next';

import { BuilderApp } from './BuilderApp';

export const metadata: Metadata = {
  title: 'Editor — designed',
  description:
    'Elige plantilla y paleta, ajusta secciones, animaciones y fondos, y descarga un proyecto React real.',
};

interface BuilderPageProps {
  /** Arranque directo desde la landing: /builder?start=ecommerce */
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/** Server wrapper for metadata + query de arranque; el editor es client-side. */
export default async function BuilderPage({ searchParams }: BuilderPageProps) {
  const { start } = await searchParams;
  return <BuilderApp starterId={typeof start === 'string' ? start : null} />;
}
