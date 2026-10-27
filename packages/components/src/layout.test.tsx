import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import type { FooterSpec, HeaderSpec, SectionSpec } from '@designed/schema';

import { Footer } from './footer/Footer';
import { Header } from './header/Header';
import { Section } from './sections/Section';
import { mustParse } from './test-helpers';

const PALETTE = {
  primary: '#6C5CE7',
  secondary: '#00CEC9',
  accent: '#FD79A8',
  background: '#FFFFFF',
  surface: '#F5F5F7',
};

const DEFAULT_SECTIONS = [
  {
    id: 'seccion',
    rows: [
      {
        id: 'fila',
        columns: [
          { id: 'columna', components: [{ type: 'heading', id: 'titulo', text: 'Sección' }] },
        ],
      },
    ],
  },
];

/** Parses a spec document (like the builder does) and returns its section. */
function parseSection(section: Record<string, unknown>): SectionSpec {
  const spec = mustParse({
    version: 1,
    meta: { name: 'Test' },
    theme: { palette: PALETTE },
    sections: [section],
  });
  return spec.sections[0]!;
}

function parseHeader(header: Record<string, unknown>): HeaderSpec {
  const spec = mustParse({
    version: 1,
    meta: { name: 'Test' },
    theme: { palette: PALETTE },
    header,
    sections: DEFAULT_SECTIONS,
  });
  return spec.header;
}

function parseFooter(footer: Record<string, unknown>): FooterSpec {
  const spec = mustParse({
    version: 1,
    meta: { name: 'Test' },
    theme: { palette: PALETTE },
    footer,
    sections: DEFAULT_SECTIONS,
  });
  return spec.footer;
}

describe('Section', () => {
  it('renderiza filas, columnas con sus span y componentes', () => {
    const section = parseSection({
      id: 'precios',
      kind: 'pricing',
      rows: [
        {
          id: 'fila-1',
          stackBelow: 'tablet',
          columns: [
            {
              id: 'col-1',
              span: 4,
              components: [{ type: 'heading', id: 'h-1', text: 'Sección' }],
            },
            {
              id: 'col-2',
              span: 8,
              components: [{ type: 'text', id: 't-1', text: 'Columna ancha' }],
            },
          ],
        },
      ],
    });

    const html = renderToStaticMarkup(<Section {...section} />);

    expect(html).toContain('<section');
    expect(html).toContain('id="precios"');
    expect(html).toContain('data-kind="pricing"');
    expect(html).toContain('grid-column:span 4');
    expect(html).toContain('grid-column:span 8');
    expect(html).toContain('data-stack="tablet"');
    expect(html).toContain('Sección');
    expect(html).toContain('Columna ancha');
    expect((html.match(/<section/g) ?? []).length).toBe(1);
  });

  it('pinta el fondo de color y el degradado', () => {
    const colorHtml = renderToStaticMarkup(
      <Section
        {...parseSection({
          id: 's1',
          background: { type: 'color', color: '#14141C' },
          rows: [
            {
              id: 'r',
              columns: [{ id: 'c', components: [{ type: 'heading', id: 'h', text: 'Hola' }] }],
            },
          ],
        })}
      />,
    );
    expect(colorHtml).toContain('background-color:#14141C');

    const gradientHtml = renderToStaticMarkup(
      <Section
        {...parseSection({
          id: 's2',
          kind: 'hero',
          background: {
            type: 'gradient',
            gradient: {
              stops: [{ color: '#000000' }, { color: '#FFFFFF', position: 100 }],
            },
          },
          rows: [
            {
              id: 'r',
              columns: [{ id: 'c', components: [{ type: 'heading', id: 'h', text: 'Hero' }] }],
            },
          ],
        })}
      />,
    );
    expect(gradientHtml).toContain('linear-gradient');
    expect(gradientHtml).toContain('#000000');
    expect(gradientHtml).toContain('#FFFFFF');
  });

  it('marca el efecto interactivo para la fase de fondos', () => {
    const html = renderToStaticMarkup(
      <Section
        {...parseSection({
          id: 'spot',
          kind: 'features',
          background: { type: 'interactive', effect: 'spotlight' },
          rows: [
            {
              id: 'r',
              columns: [{ id: 'c', components: [{ type: 'heading', id: 'h', text: 'Servicios' }] }],
            },
          ],
        })}
      />,
    );

    expect(html).toContain('data-effect="spotlight"');
  });

  it('aplica padding personalizado cuando se define', () => {
    const html = renderToStaticMarkup(
      <Section
        {...parseSection({
          id: 'pad',
          padding: { topBottomPx: 120 },
          rows: [
            {
              id: 'r',
              columns: [{ id: 'c', components: [{ type: 'heading', id: 'h', text: 'Pad' }] }],
            },
          ],
        })}
      />,
    );

    expect(html).toContain('padding-top:120px');
    expect(html).toContain('padding-bottom:120px');
  });

  it('oculta columnas según breakpoint con data-hide', () => {
    const html = renderToStaticMarkup(
      <Section
        {...parseSection({
          id: 'hide',
          rows: [
            {
              id: 'r',
              columns: [
                {
                  id: 'c1',
                  hideOn: ['tablet'],
                  components: [{ type: 'heading', id: 'h1', text: 'Visible' }],
                },
                {
                  id: 'c2',
                  hideOn: ['tablet', 'mobile'],
                  components: [{ type: 'heading', id: 'h2', text: 'Oculta' }],
                },
              ],
            },
          ],
        })}
      />,
    );

    expect(html).toContain('data-hide="tablet"');
    expect(html).toContain('data-hide="tablet mobile"');
  });
});

describe('Header', () => {
  const items = [
    { id: 'nav-1', label: 'Inicio', href: '#inicio' },
    {
      id: 'nav-2',
      label: 'Servicios',
      href: '#servicios',
      children: [{ id: 'nav-2a', label: 'Diseño', href: '#diseno' }],
    },
  ];

  it('renderiza marca, navegación y menú hamburguesa', () => {
    const header = parseHeader({
      layout: 'top',
      brand: { name: 'Mi web', href: '/' },
      items,
      mobileMenu: 'hamburger-overlay',
    });

    const html = renderToStaticMarkup(<Header {...header} />);

    expect(html).toContain('<header');
    expect(html).toContain('data-layout="top"');
    expect(html).toContain('data-mobile="hamburger-overlay"');
    expect(html).toContain('Mi web');
    expect(html).toContain('href="#inicio"');
    expect(html).toContain('aria-label="Abrir menú"');
  });

  it('marca el layout angled y pinta el submenu', () => {
    const header = parseHeader({
      layout: 'angled',
      sticky: false,
      transparentOnTop: false,
      brand: { name: 'Estudio', href: '/' },
      items,
      mobileMenu: 'hidden',
    });

    const html = renderToStaticMarkup(<Header {...header} />);

    expect(html).toContain('data-layout="angled"');
    expect(html).toContain('Diseño');
    expect(html).not.toContain('aria-label="Abrir menú"');
  });

  it('aplica data-hover y variables a los items con animación', () => {
    const header = parseHeader({
      layout: 'top',
      brand: { name: 'X', href: '/' },
      items,
      mobileMenu: 'hidden',
      itemAnimation: { type: 'shine', intensity: 0.6 },
    });

    const html = renderToStaticMarkup(<Header {...header} />);

    expect(html).toContain('data-hover="shine"');
    expect(html).toContain('--hover-intensity:0.6');
  });

  it('renderiza el CTA del header como botón', () => {
    const header = parseHeader({
      layout: 'top',
      brand: { name: 'X', href: '/' },
      items,
      cta: { id: 'nav-cta', label: 'Empieza ya', href: '#contacto', variant: 'gradient' },
    });

    const html = renderToStaticMarkup(<Header {...header} />);

    expect(html).toContain('Empieza ya');
    expect(html).toContain('href="#contacto"');
  });
});

describe('Footer', () => {
  it('renderiza columnas, redes, newsletter y copyright', () => {
    const footer = parseFooter({
      columns: [
        { id: 'c1', title: 'Producto', links: [{ label: 'Precios', href: '#p' }] },
        { id: 'c2', title: 'Recursos', links: [{ label: 'Docs', href: '#d' }] },
      ],
      brandText: 'Constructor visual',
      social: [
        { platform: 'github', href: 'https://github.com/x' },
        { platform: 'x', href: 'https://x.com/x' },
      ],
      newsletter: true,
      copyright: '© 2026 Mi web',
    });

    const html = renderToStaticMarkup(<Footer {...footer} />);

    expect(html).toContain('<footer');
    expect(html).toContain('Producto');
    expect(html).toContain('Recursos');
    expect(html).toContain('type="email"');
    expect(html).toContain('aria-label="github"');
    expect(html).toContain('© 2026 Mi web');
    expect((html.match(/<nav/g) ?? []).length).toBe(2);
  });

  it('renderiza un footer con defaults sin errores', () => {
    const footer = parseFooter({});
    const html = renderToStaticMarkup(<Footer {...footer} />);

    expect(html).toContain('<footer');
  });
});
