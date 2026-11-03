import Link from 'next/link';

import { SITE_TYPES } from '../lib/site-types';
import { repoUrl, siteDescription, siteUrl } from '../lib/site';

const FEATURES = [
  {
    icon: '🧩',
    title: 'Componentes reales',
    text: 'Cada sección se exporta como TSX + SCSS separado: cards, sections, panels, header...',
  },
  {
    icon: '🎨',
    title: '93 paletas con WCAG',
    text: 'Paletas de 5 colores validadas en contraste AA/AAA, con semáforo visible.',
  },
  {
    icon: '✨',
    title: 'Animaciones por doquier',
    text: 'Entradas, hovers y 18 fondos interactivos (spotlight, constelación, lluvia...).',
  },
  {
    icon: '📦',
    title: 'Export como proyecto real',
    text: 'ZIP con estructura profesional: components/, hooks/, styles/ y pnpm dev funcionando.',
  },
  {
    icon: '🌐',
    title: 'Web multipágina',
    text: 'Infinitas páginas por diseño, con plantillas listas: tienda, contacto, blog, destinos...',
  },
];

/** Structured data for search engines and AI answer cards (schema.org). */
const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'designed',
  applicationCategory: 'DesignApplication',
  operatingSystem: 'Web',
  description: siteDescription,
  url: siteUrl,
  license: 'https://opensource.org/licenses/MIT',
  inLanguage: 'es',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
  },
  featureList: [
    'Galería de plantillas filtrables',
    '93 paletas con validación WCAG AA/AAA',
    '16 animaciones y 18 fondos interactivos',
    'Web multipágina con páginas predefinidas por tipo de negocio',
    'Export a ZIP: proyecto Vite + React + TypeScript autónomo',
  ],
  codeRepository: repoUrl,
};

export default function HomePage() {
  return (
    <main className="landing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // Escape '<' so no injected string can close the script tag.
          __html: JSON.stringify(softwareJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <header className="landing__nav">
        <span className="landing__brand">designed</span>
        <Link className="landing__cta" href="/builder">
          Abrir el editor
        </Link>
      </header>

      <section className="landing__hero">
        <p className="landing__kicker">Constructor visual · Exporta React real</p>
        <h1 className="landing__title">
          Diseña tu web como en WordPress, <br />
          pero descarga <span>React + TypeScript</span>
        </h1>
        <p className="landing__subtitle">
          Elige plantilla, ajusta cada sección con animaciones, paletas validadas y fondos
          interactivos. Al terminar te descargas un proyecto modular listo para{' '}
          <code>pnpm dev</code>.
        </p>
        <div className="landing__actions">
          <Link className="landing__primary" href="/builder">
            Empezar a diseñar
          </Link>
          <a className="landing__secondary" href="https://github.com/JorgeMantinan/designed">
            Ver en GitHub
          </a>
        </div>
      </section>

      <section className="landing__features">
        {FEATURES.map((feature) => (
          <article key={feature.title} className="landing__card">
            <span className="landing__cardIcon" aria-hidden="true">
              {feature.icon}
            </span>
            <h2 className="landing__cardTitle">{feature.title}</h2>
            <p className="landing__cardText">{feature.text}</p>
          </article>
        ))}
      </section>

      <section className="landing__types">
        <p className="landing__kicker">Empieza con lo básico resuelto</p>
        <h2 className="landing__sectionTitle">Crea tu web por tipo de negocio</h2>
        <p className="landing__sectionText">
          Cada opción abre un proyecto <strong>multi-página completo</strong>: portada + páginas ya
          montadas (tienda, reservas, blog, destinos...) con su menú enlazado. Después editas,
          añades páginas ilimitadas y descargas el ZIP.
        </p>
        <div className="landing__typesGrid">
          {SITE_TYPES.map((site) => (
            <Link key={site.id} className="landing__typeCard" href={`/builder?start=${site.id}`}>
              <span className="landing__typeIcon" aria-hidden="true">
                {site.icon}
              </span>
              <h3 className="landing__typeTitle">{site.label}</h3>
              <p className="landing__typeText">{site.description}</p>
              <span className="landing__typeCta">Crear esta web →</span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="landing__footer">
        <p>MIT © 2026 designed · Sin IA: solo diseño y código limpio.</p>
      </footer>
    </main>
  );
}
