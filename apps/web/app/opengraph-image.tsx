import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt = 'designed — Constructor visual de webs que exporta React real';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Fuente local estática (SIL Open Font License) empaquetada con la app: sin
// dependencia de CDNs y dentro del límite de500KB de ImageResponse.
// Nota: satori solo admite ttf/otf/woff estáticos — nunca woff2 ni fuentes
// variables (no soporta tablas gvar).
const jetBrainsMono = await readFile(join(process.cwd(), 'assets/JetBrainsMono-Bold.ttf'));

/**
 * Dynamic OpenGraph image (1200×630). The try/catch matches the official
 * pattern: any rendering error degrades to a clean503 for crawlers.
 */
export default async function OpengraphImage() {
  try {
    return new ImageResponse(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 28,
          background: 'linear-gradient(135deg, #0B0B10 20%, #2B1D6B 100%)',
          color: '#F5F5F7',
          fontFamily: 'JetBrains Mono',
          padding: 80,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 34,
            fontWeight: 700,
            color: '#A78BFA',
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          Constructor visual · Exporta React real
        </div>
        <div style={{ display: 'flex', fontSize: 120, fontWeight: 700, letterSpacing: -4 }}>
          designed
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 40,
            fontWeight: 400,
            color: '#C9C9D4',
            maxWidth: 900,
          }}
        >
          Diseña tu web y descarga un proyecto React + TypeScript modular listo para pnpm dev
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            fontWeight: 700,
            color: '#FFFFFF',
            background: '#6C5CE7',
            borderRadius: 14,
            padding: '14px 36px',
          }}
        >
          51 paletas WCAG · 16 animaciones · 12 fondos interactivos
        </div>
      </div>,
      {
        ...size,
        fonts: [{ name: 'JetBrains Mono', data: jetBrainsMono, weight: 700, style: 'normal' }],
      },
    );
  } catch {
    return new Response('Image unavailable', { status: 503 });
  }
}
