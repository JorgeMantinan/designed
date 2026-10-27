import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { exampleDesignSpec, minimalDesignSpec } from '@designed/schema/fixtures';

import { DesignRenderer } from './DesignRenderer';
import { SpecRenderer } from './renderer';
import { mustParse } from './test-helpers';

const exampleSpec = mustParse(exampleDesignSpec);
const minimalSpec = mustParse(minimalDesignSpec);

/** Flattens every component in the example design. */
const exampleComponents = exampleSpec.sections.flatMap((section) =>
  section.rows.flatMap((row) => row.columns.flatMap((column) => column.components)),
);

describe('SpecRenderer', () => {
  it('el diseño de ejemplo cubre los15 tipos del catálogo', () => {
    const types = new Set(exampleComponents.map((component) => component.type));

    expect(exampleComponents.length).toBeGreaterThanOrEqual(15);
    expect(types.size).toBe(15);
  });

  it('renderiza los15 tipos sin excepciones', () => {
    for (const spec of exampleComponents) {
      const html = renderToStaticMarkup(<SpecRenderer spec={spec} />);
      expect(html.length, spec.type).toBeGreaterThan(0);
    }
  });

  it('devuelve null con un tipo desconocido', () => {
    const html = renderToStaticMarkup(
      <SpecRenderer spec={{ type: 'holograma', id: 'x' } as never} />,
    );
    expect(html).toBe('');
  });
});

describe('DesignRenderer', () => {
  const html = renderToStaticMarkup(<DesignRenderer spec={exampleSpec} />);

  it('renderiza la página completa: header + secciones + footer', () => {
    expect(html).toContain('class="dsg-root"');
    expect((html.match(/<section/g) ?? []).length).toBe(8);
    expect(html).toContain('<header');
    expect(html).toContain('<footer');
    expect(html).toContain('<main');
  });

  it('inyecta el tema como CSS custom properties', () => {
    expect(html).toContain('--color-primary');
    expect(html).toContain('#6C5CE7');
    expect(html).toContain('--container-max');
    expect(html).toContain('--space-section-y');
  });

  it('renderiza el contenido del ejemplo (Nébula Studio)', () => {
    expect(html).toContain('Nébula Studio');
    expect(html).toContain('Diseña tu web sin límites');
    expect(html).toContain('data-layout="angled"');
    expect(html).toContain('data-effect="spotlight"');
    expect(html).toContain('© 2026 Nébula Studio');
  });

  it('renderiza overlays y carrusel del ejemplo', () => {
    expect(html).toContain('dsg-overlay--to-bottom-right');
    expect(html).toContain('aria-roledescription="carrusel"');
    expect(html).toContain('Diapositiva siguiente');
  });

  it('renderiza el spec mínimo con defaults', () => {
    const minimalHtml = renderToStaticMarkup(<DesignRenderer spec={minimalSpec} />);

    expect(minimalHtml).toContain('Hola, mundo');
    expect(minimalHtml).toContain('data-layout="top"');
    expect(minimalHtml).toContain('--color-primary');
  });
});
