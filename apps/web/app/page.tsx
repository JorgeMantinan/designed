import Link from 'next/link';

const FEATURES = [
  {
    icon: '🧩',
    title: 'Componentes reales',
    text: 'Cada sección se exporta como TSX + SCSS separado: cards, sections, panels, header...',
  },
  {
    icon: '🎨',
    title: '51 paletas con WCAG',
    text: 'Paletas de 5 colores validadas en contraste AA/AAA, con semáforo visible.',
  },
  {
    icon: '✨',
    title: 'Animaciones por doquier',
    text: 'Entradas, hovers y7 fondos interactivos (spotlight, malla, partículas...).',
  },
  {
    icon: '📦',
    title: 'Export como proyecto real',
    text: 'ZIP con estructura profesional: components/, hooks/, styles/ y pnpm dev funcionando.',
  },
];

export default function HomePage() {
  return (
    <main className="landing">
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

      <footer className="landing__footer">
        <p>MIT © 2026 designed · Sin IA: solo diseño y código limpio.</p>
      </footer>
    </main>
  );
}
