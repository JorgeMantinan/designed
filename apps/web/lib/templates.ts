import type { Palette } from '@designed/palettes';
import { PALETTES } from '@designed/palettes';
import { parseDesignSpec } from '@designed/schema';
import type { ComponentType, DesignSpec, DesignSpecInput } from '@designed/schema';

/**
 * Template gallery: the designs offered the moment the user opens the
 * builder, filtered by preference tags (4×2 grid, vertical story, top menu,
 * angled menu...). Each template is structure-only — the palette is applied
 * when the user picks it, so any template works with any of the51 palettes.
 */

type Spec = DesignSpecInput;
type SectionInput = Spec['sections'][number];
type RowInput = SectionInput['rows'][number];
type ColumnInput = RowInput['columns'][number];
type ComponentInput = ColumnInput['components'][number];

function comp(type: ComponentType, id: string, props: Record<string, unknown>): ComponentInput {
  return { type, id, ...props } as ComponentInput;
}

function section(
  id: string,
  kind: SectionInput['kind'],
  rows: RowInput[],
  extra: Partial<SectionInput> = {},
): SectionInput {
  return { id, kind, rows, ...extra };
}

function row(id: string, columns: ColumnInput[], extra: Partial<RowInput> = {}): RowInput {
  return { id, columns, ...extra };
}

function col(
  id: string,
  components: ComponentInput[],
  span = 12,
  extra: Partial<ColumnInput> = {},
): ColumnInput {
  return { id, components, span, ...extra };
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  /** Preference tags used by the gallery filters. */
  tags: string[];
  build: (palette: Palette) => Spec;
}

function withTheme(palette: Palette, spec: Omit<Spec, 'theme'>): Spec {
  return { ...spec, theme: { palette: { ...palette.colors } } };
}

// ── Shared blocks ────────────────────────────────────────────────────────────

function footer(copyright: string, newsletter = false): Spec['footer'] {
  return {
    columns: [
      {
        id: 'footer-producto',
        title: 'Producto',
        links: [
          { label: 'Funciones', href: '#funciones' },
          { label: 'Precios', href: '#precios' },
          { label: 'Novedades', href: '#novedades' },
        ],
      },
      {
        id: 'footer-recursos',
        title: 'Recursos',
        links: [
          { label: 'Documentación', href: '#docs' },
          { label: 'Soporte', href: '#soporte' },
        ],
      },
    ],
    newsletter,
    copyright,
  };
}

// ── Templates ────────────────────────────────────────────────────────────────

export const TEMPLATES: readonly TemplateDefinition[] = [
  {
    id: 'landing-clasica',
    name: 'Landing clásica',
    description: 'Menú superior, hero centrado, funciones, precios y testimonios.',
    tags: ['menu-superior', 'hero-centrado', 'pricing'],
    build: (palette) =>
      withTheme(palette, {
        version: 1,
        meta: { name: 'Landing clásica' },
        header: {
          layout: 'top',
          brand: { name: 'Mi startup', href: '/' },
          items: [
            { id: 'nav-funciones', label: 'Funciones', href: '#funciones' },
            { id: 'nav-precios', label: 'Precios', href: '#precios' },
            { id: 'nav-testimonios', label: 'Testimonios', href: '#testimonios' },
          ],
          cta: { id: 'nav-cta', label: 'Empezar', href: '#cta', variant: 'solid' },
        },
        sections: [
          section(
            'hero',
            'hero',
            [
              row('hero-fila', [
                col(
                  'hero-col',
                  [
                    comp('badge', 'hero-badge', { label: 'Nuevo', tone: 'accent' }),
                    comp('heading', 'hero-titulo', {
                      level: 1,
                      text: 'Tu idea merece una web increíble',
                      size: 'display',
                      align: 'center',
                      animation: { entrance: { type: 'fade-in' } },
                    }),
                    comp('text', 'hero-subtitulo', {
                      text: 'Elige una plantilla, ajústala a tu gusto y descarga un proyecto React real listo para producción.',
                      align: 'center',
                      maxWidthPx: 560,
                    }),
                    comp('buttonGroup', 'hero-ctas', {
                      buttons: [
                        {
                          id: 'hero-cta-1',
                          label: 'Empezar gratis',
                          href: '#cta',
                          variant: 'gradient',
                        },
                        {
                          id: 'hero-cta-2',
                          label: 'Ver precios',
                          href: '#precios',
                          variant: 'outline',
                        },
                      ],
                      align: 'center',
                    }),
                  ],
                  12,
                ),
              ]),
            ],
            {
              background: {
                type: 'gradient',
                gradient: {
                  angle: 135,
                  stops: [
                    { color: palette.colors.primary },
                    { color: palette.colors.accent, position: 100 },
                  ],
                },
              },
              animation: { entrance: { type: 'fade-in' } },
            },
          ),
          section(
            'funciones',
            'features',
            [
              row('funciones-fila', [
                col(
                  'funciones-col-1',
                  [
                    comp('featureCard', 'funcion-1', {
                      icon: 'zap',
                      title: 'Rápido',
                      text: 'Plantillas ligeras y optimizadas desde el primer render.',
                      animation: { hover: { type: 'lift' } },
                    }),
                  ],
                  4,
                ),
                col(
                  'funciones-col-2',
                  [
                    comp('featureCard', 'funcion-2', {
                      icon: 'component',
                      title: 'Modular',
                      text: 'Cada sección se exporta como componente TSX y SCSS aparte.',
                      animation: { hover: { type: 'lift' } },
                    }),
                  ],
                  4,
                ),
                col(
                  'funciones-col-3',
                  [
                    comp('featureCard', 'funcion-3', {
                      icon: 'shield',
                      title: 'Accesible',
                      text: 'Paletas validadas con contraste WCAG AA/AAA.',
                      animation: { hover: { type: 'lift' } },
                    }),
                  ],
                  4,
                ),
              ]),
            ],
            { animation: { entrance: { type: 'slide-up' } } },
          ),
          section('precios', 'pricing', [
            row('precios-fila', [
              col(
                'precio-col-1',
                [
                  comp('pricingCard', 'precio-basic', {
                    planName: 'Basic',
                    price: '0',
                    features: ['1 diseño', 'Export estándar'],
                    cta: { id: 'precio-basic-cta', label: 'Empezar', variant: 'outline' },
                  }),
                ],
                4,
              ),
              col(
                'precio-col-2',
                [
                  comp('pricingCard', 'precio-pro', {
                    planName: 'Pro',
                    price: '19',
                    highlighted: true,
                    features: ['Diseños ilimitados', 'Export con hooks', 'Paletas premium'],
                    cta: { id: 'precio-pro-cta', label: 'Elegir Pro', variant: 'gradient' },
                  }),
                ],
                4,
              ),
              col(
                'precio-col-3',
                [
                  comp('pricingCard', 'precio-team', {
                    planName: 'Team',
                    price: '49',
                    features: ['Todo lo de Pro', '5 asientos'],
                    cta: { id: 'precio-team-cta', label: 'Hablar con ventas', variant: 'solid' },
                  }),
                ],
                4,
              ),
            ]),
          ]),
          section('testimonios', 'testimonials', [
            row('testimonios-fila', [
              col(
                'testimonio-col-1',
                [
                  comp('testimonialCard', 'testimonio-1', {
                    quote: 'En una tarde tenía la web lista para publicar.',
                    author: 'Ana Ruiz',
                    role: 'Founder',
                    rating: 5,
                  }),
                ],
                4,
              ),
              col(
                'testimonio-col-2',
                [
                  comp('testimonialCard', 'testimonio-2', {
                    quote: 'El código exportado se lee mejor que el mío.',
                    author: 'Luis Gómez',
                    role: 'Desarrollador',
                    rating: 5,
                  }),
                ],
                4,
              ),
              col(
                'testimonio-col-3',
                [
                  comp('testimonialCard', 'testimonio-3', {
                    quote: 'Las paletas con contraste validado nos salvaron.',
                    author: 'Marta López',
                    role: 'CTO',
                    rating: 5,
                  }),
                ],
                4,
              ),
            ]),
          ]),
          section(
            'cta',
            'cta',
            [
              row('cta-fila', [
                col('cta-col', [
                  comp('heading', 'cta-titulo', {
                    level: 2,
                    text: 'Crea tu web hoy',
                    align: 'center',
                  }),
                  comp('text', 'cta-texto', {
                    text: 'Sin instalar nada. Diseña, previsualiza y descarga.',
                    align: 'center',
                  }),
                  comp('buttonGroup', 'cta-botones', {
                    buttons: [
                      { id: 'cta-cta-1', label: 'Abrir el editor', href: '#', variant: 'gradient' },
                    ],
                    align: 'center',
                  }),
                ]),
              ]),
            ],
            {
              background: {
                type: 'gradient',
                gradient: {
                  angle: 135,
                  stops: [
                    { color: palette.colors.accent },
                    { color: palette.colors.primary, position: 100 },
                  ],
                },
              },
              animation: { entrance: { type: 'zoom-in' } },
            },
          ),
        ],
        footer: footer('© 2026 Landing clásica', true),
      }),
  },

  {
    id: 'menu-esquinado',
    name: 'Menú esquinado',
    description: 'Cabecera diagonal con hover, hero partido y fondo spotlight.',
    tags: ['menu-esquinado', 'grid', 'spotlight'],
    build: (palette) =>
      withTheme(palette, {
        version: 1,
        meta: { name: 'Menú esquinado' },
        header: {
          layout: 'angled',
          brand: { name: 'Estudio Diagonal', href: '/' },
          items: [
            { id: 'nav-trabajos', label: 'Trabajos', href: '#trabajos' },
            { id: 'nav-servicios', label: 'Servicios', href: '#servicios' },
            { id: 'nav-equipo', label: 'Equipo', href: '#equipo' },
          ],
          cta: { id: 'nav-cta', label: 'Contactar', href: '#contacto', variant: 'gradient' },
          itemAnimation: { type: 'shine', intensity: 0.6 },
        },
        sections: [
          section(
            'hero',
            'hero',
            [
              row('hero-fila', [
                col('hero-copy', [
                  comp('badge', 'hero-badge', { label: 'Estudio creativo', tone: 'primary' }),
                  comp('heading', 'hero-titulo', {
                    level: 1,
                    text: 'Diseños que se salen de la norma',
                    size: 'display',
                    animation: { entrance: { type: 'slide-up' } },
                  }),
                  comp('text', 'hero-subtitulo', {
                    text: 'Identidad, producto digital y movimiento para marcas que no quieren pasar desapercibidas.',
                    maxWidthPx: 480,
                  }),
                  comp('buttonGroup', 'hero-ctas', {
                    buttons: [
                      {
                        id: 'hero-cta-1',
                        label: 'Ver trabajos',
                        href: '#trabajos',
                        variant: 'gradient',
                      },
                      {
                        id: 'hero-cta-2',
                        label: 'Nuestro método',
                        href: '#servicios',
                        variant: 'ghost',
                      },
                    ],
                  }),
                ]),
                col('hero-media', [
                  comp('image', 'hero-imagen', {
                    src: 'https://placehold.co/900x650',
                    alt: 'Proyecto destacado',
                    ratio: '4:3',
                    radius: 'lg',
                    shadow: 'lg',
                    overlay: { direction: 'to-bottom-right', intensity: 0.4 },
                  }),
                ]),
              ]),
            ],
            { animation: { entrance: { type: 'fade-in' } } },
          ),
          section(
            'servicios',
            'features',
            [
              row('servicios-fila-1', [
                col(
                  'servicio-1',
                  [
                    comp('featureCard', 'servicio-card-1', {
                      icon: 'palette',
                      title: 'Identidad',
                      text: 'Sistemas visuales coherentes de la tarjeta a la web.',
                      animation: { hover: { type: 'tilt', intensity: 0.6 } },
                    }),
                  ],
                  6,
                ),
                col(
                  'servicio-2',
                  [
                    comp('featureCard', 'servicio-card-2', {
                      icon: 'layout',
                      title: 'Producto digital',
                      text: 'Interfaces claras con animación al servicio del contenido.',
                      animation: { hover: { type: 'tilt', intensity: 0.6 } },
                    }),
                  ],
                  6,
                ),
              ]),
              row('servicios-fila-2', [
                col(
                  'servicio-3',
                  [
                    comp('featureCard', 'servicio-card-3', {
                      icon: 'sparkles',
                      title: 'Movimiento',
                      text: 'Transiciones y microinteracciones con intención.',
                      animation: { hover: { type: 'tilt', intensity: 0.6 } },
                    }),
                  ],
                  6,
                ),
                col(
                  'servicio-4',
                  [
                    comp('featureCard', 'servicio-card-4', {
                      icon: 'code',
                      title: 'Desarrollo',
                      text: 'Front-end limpio, accesible y rendidor.',
                      animation: { hover: { type: 'tilt', intensity: 0.6 } },
                    }),
                  ],
                  6,
                ),
              ]),
            ],
            {
              background: { type: 'interactive', effect: 'spotlight', intensity: 0.6, speed: 0.4 },
              animation: { entrance: { type: 'slide-up' } },
            },
          ),
          section('cifras', 'stats', [
            row('cifras-fila', [
              col(
                'stat-1',
                [comp('stat', 'stat-proyectos', { value: '120', label: 'Proyectos' })],
                3,
              ),
              col('stat-2', [comp('stat', 'stat-clientes', { value: '80', label: 'Clientes' })], 3),
              col('stat-3', [comp('stat', 'stat-premios', { value: '14', label: 'Premios' })], 3),
              col('stat-4', [comp('stat', 'stat-anos', { value: '9', label: 'Años' })], 3),
            ]),
          ]),
        ],
        footer: footer('© 2026 Estudio Diagonal'),
      }),
  },

  {
    id: 'grid-cuatro-dos',
    name: 'Cuatro filas × dos columnas',
    description: 'Rejilla clásica de8 tarjetas en4 filas de2 columnas.',
    tags: ['grid', '4x2', 'menu-superior'],
    build: (palette) =>
      withTheme(palette, {
        version: 1,
        meta: { name: 'Rejilla 4×2' },
        header: {
          layout: 'top',
          brand: { name: 'Rejilla', href: '/' },
          items: [
            { id: 'nav-grid', label: 'Rejilla', href: '#rejilla' },
            { id: 'nav-info', label: 'Información', href: '#info' },
          ],
        },
        sections: [
          section(
            'rejilla',
            'features',
            [
              row('rejilla-fila-1', [
                col(
                  'rejilla-c1',
                  [
                    comp('featureCard', 'rejilla-1', {
                      icon: 'zap',
                      title: 'Velocidad',
                      text: 'Rendimiento extremo en cada página.',
                    }),
                  ],
                  6,
                ),
                col(
                  'rejilla-c2',
                  [
                    comp('featureCard', 'rejilla-2', {
                      icon: 'shield',
                      title: 'Seguridad',
                      text: 'Prácticas seguras por defecto.',
                    }),
                  ],
                  6,
                ),
              ]),
              row('rejilla-fila-2', [
                col(
                  'rejilla-c3',
                  [
                    comp('featureCard', 'rejilla-3', {
                      icon: 'palette',
                      title: 'Estilo',
                      text: 'Paletas cuidadas hasta el último pixel.',
                    }),
                  ],
                  6,
                ),
                col(
                  'rejilla-c4',
                  [
                    comp('featureCard', 'rejilla-4', {
                      icon: 'component',
                      title: 'Componentes',
                      text: 'Piezas reutilizables y tipadas.',
                    }),
                  ],
                  6,
                ),
              ]),
              row('rejilla-fila-3', [
                col(
                  'rejilla-c5',
                  [
                    comp('featureCard', 'rejilla-5', {
                      icon: 'sparkles',
                      title: 'Animación',
                      text: 'Movimiento con criterio, no por relleno.',
                    }),
                  ],
                  6,
                ),
                col(
                  'rejilla-c6',
                  [
                    comp('featureCard', 'rejilla-6', {
                      icon: 'users',
                      title: 'Equipos',
                      text: 'Pensado para colaborar sin fricción.',
                    }),
                  ],
                  6,
                ),
              ]),
              row('rejilla-fila-4', [
                col(
                  'rejilla-c7',
                  [
                    comp('featureCard', 'rejilla-7', {
                      icon: 'code',
                      title: 'Código limpio',
                      text: 'Exporta estructura que da gusto leer.',
                    }),
                  ],
                  6,
                ),
                col(
                  'rejilla-c8',
                  [
                    comp('featureCard', 'rejilla-8', {
                      icon: 'external',
                      title: 'Sin ataduras',
                      text: 'El proyecto es tuyo desde el minuto cero.',
                    }),
                  ],
                  6,
                ),
              ]),
            ],
            { animation: { entrance: { type: 'slide-up' } } },
          ),
          section('info', 'cta', [
            row('info-fila', [
              col('info-col', [
                comp('heading', 'info-titulo', {
                  level: 2,
                  text: 'Ocho razones, un solo clic',
                  align: 'center',
                }),
                comp('buttonGroup', 'info-botones', {
                  buttons: [
                    { id: 'info-cta', label: 'Probar el editor', href: '#', variant: 'gradient' },
                  ],
                  align: 'center',
                }),
              ]),
            ]),
          ]),
        ],
        footer: footer('© 2026 Rejilla 4×2'),
      }),
  },

  {
    id: 'historia-vertical',
    name: 'Historia vertical (1×3)',
    description: 'Una sola columna con tres filas: texto, imagen y acción.',
    tags: ['vertical', '1x3', 'hero-centrado'],
    build: (palette) =>
      withTheme(palette, {
        version: 1,
        meta: { name: 'Historia vertical' },
        header: {
          layout: 'minimal',
          brand: { name: 'Relato', href: '/' },
          items: [{ id: 'nav-historia', label: 'Historia', href: '#historia' }],
        },
        sections: [
          section(
            'historia',
            'generic',
            [
              row('historia-fila-1', [
                col('historia-col-1', [
                  comp('badge', 'historia-badge', { label: 'Capítulo uno', tone: 'secondary' }),
                  comp('heading', 'historia-titulo', {
                    level: 1,
                    text: 'Una columna. Tres momentos.',
                    size: 'display',
                    align: 'center',
                  }),
                  comp('text', 'historia-texto', {
                    text: 'A veces menos es más: una idea por fila, avanzando hacia la acción final.',
                    align: 'center',
                    maxWidthPx: 520,
                  }),
                ]),
              ]),
              row('historia-fila-2', [
                col('historia-col-2', [
                  comp('image', 'historia-imagen', {
                    src: 'https://placehold.co/1200x600',
                    alt: 'Escena de la historia',
                    ratio: '16:9',
                    radius: 'lg',
                    overlay: { direction: 'to-bottom', intensity: 0.45 },
                  }),
                ]),
              ]),
              row('historia-fila-3', [
                col('historia-col-3', [
                  comp('heading', 'historia-cierre', {
                    level: 2,
                    text: 'El siguiente capítulo es tuyo',
                    align: 'center',
                  }),
                  comp('buttonGroup', 'historia-ctas', {
                    buttons: [
                      { id: 'historia-cta-1', label: 'Continuar', href: '#', variant: 'gradient' },
                      {
                        id: 'historia-cta-2',
                        label: 'Empezar de cero',
                        href: '#',
                        variant: 'outline',
                      },
                    ],
                    align: 'center',
                  }),
                ]),
              ]),
            ],
            { animation: { entrance: { type: 'fade-in' } } },
          ),
        ],
        footer: footer('© 2026 Relato'),
      }),
  },

  {
    id: 'portfolio-carrusel',
    name: 'Portfolio con carrusel',
    description: 'Tema oscuro con hero partido, carrusel de proyectos y logos.',
    tags: ['carrusel', 'oscuro', 'menu-superior'],
    build: (palette) =>
      withTheme(palette, {
        version: 1,
        meta: { name: 'Portfolio carrusel' },
        header: {
          layout: 'top',
          brand: { name: 'Portafolio', href: '/' },
          items: [
            { id: 'nav-proyectos', label: 'Proyectos', href: '#proyectos' },
            { id: 'nav-clientes', label: 'Clientes', href: '#clientes' },
          ],
          cta: { id: 'nav-cta', label: 'Contratar', href: '#contacto', variant: 'outline' },
        },
        sections: [
          section(
            'hero',
            'hero',
            [
              row('hero-fila', [
                col('hero-copy', [
                  comp('heading', 'hero-titulo', {
                    level: 1,
                    text: 'Proyectos que hablan solos',
                    size: 'display',
                    animation: { entrance: { type: 'slide-right' } },
                  }),
                  comp('text', 'hero-texto', {
                    text: 'Selección reciente de trabajo para marcas nacionales e internacionales.',
                    maxWidthPx: 460,
                  }),
                  comp('buttonGroup', 'hero-ctas', {
                    buttons: [
                      {
                        id: 'hero-cta-1',
                        label: 'Ver proyectos',
                        href: '#proyectos',
                        variant: 'gradient',
                      },
                    ],
                  }),
                ]),
                col('hero-media', [
                  comp('image', 'hero-imagen', {
                    src: 'https://placehold.co/900x700',
                    alt: 'Proyecto destacado',
                    ratio: '4:3',
                    radius: 'lg',
                    overlay: { direction: 'to-left', intensity: 0.5 },
                  }),
                ]),
              ]),
            ],
            { animation: { entrance: { type: 'fade-in' } } },
          ),
          section(
            'proyectos',
            'carousel',
            [
              row('proyectos-fila', [
                col('proyectos-col', [
                  comp('carousel', 'proyectos-carrusel', {
                    slides: [
                      {
                        src: 'https://placehold.co/1200x675',
                        alt: 'Proyecto uno',
                        title: 'Rediseño e-commerce',
                      },
                      {
                        src: 'https://placehold.co/1200x675',
                        alt: 'Proyecto dos',
                        title: 'Landing SaaS',
                      },
                      {
                        src: 'https://placehold.co/1200x675',
                        alt: 'Proyecto tres',
                        title: 'Web corporativa',
                      },
                    ],
                    overlay: { direction: 'to-bottom', intensity: 0.55 },
                  }),
                ]),
              ]),
            ],
            { width: 'full', animation: { entrance: { type: 'slide-up' } } },
          ),
          section('clientes', 'logos', [
            row('clientes-fila', [
              col('clientes-col', [
                comp('logoCloud', 'clientes-logos', {
                  logos: [
                    { src: 'https://placehold.co/120x40?text=Uno', alt: 'Uno' },
                    { src: 'https://placehold.co/120x40?text=Dos', alt: 'Dos' },
                    { src: 'https://placehold.co/120x40?text=Tres', alt: 'Tres' },
                    { src: 'https://placehold.co/120x40?text=Cuatro', alt: 'Cuatro' },
                  ],
                }),
              ]),
            ]),
          ]),
          section('resenas', 'testimonials', [
            row('resenas-fila', [
              col(
                'resena-1',
                [
                  comp('testimonialCard', 'resena-card-1', {
                    quote: 'Entregaron antes de tiempo y el resultado superó el brief.',
                    author: 'Carla Díaz',
                    role: 'Marketing, Vela',
                    rating: 5,
                  }),
                ],
                6,
              ),
              col(
                'resena-2',
                [
                  comp('testimonialCard', 'resena-card-2', {
                    quote: 'Un equipo que discute el detalle hasta que encaja.',
                    author: 'Diego Peña',
                    role: 'Producto, Kito',
                    rating: 5,
                  }),
                ],
                6,
              ),
            ]),
          ]),
        ],
        footer: footer('© 2026 Portafolio'),
      }),
  },

  {
    id: 'pricing-faq',
    name: 'Precios + FAQ',
    description: 'Enfocada en conversión: hero corto, tabla de precios y preguntas.',
    tags: ['pricing', 'faq', 'menu-superior'],
    build: (palette) =>
      withTheme(palette, {
        version: 1,
        meta: { name: 'Precios y FAQ' },
        header: {
          layout: 'top',
          brand: { name: 'Planes', href: '/' },
          items: [
            { id: 'nav-precios', label: 'Precios', href: '#precios' },
            { id: 'nav-faq', label: 'FAQ', href: '#faq' },
          ],
          cta: { id: 'nav-cta', label: 'Probar gratis', href: '#precios', variant: 'solid' },
        },
        sections: [
          section('hero', 'hero', [
            row('hero-fila', [
              col('hero-col', [
                comp('heading', 'hero-titulo', {
                  level: 1,
                  text: 'Precios simples, sin sorpresas',
                  size: 'xl',
                  align: 'center',
                }),
                comp('text', 'hero-texto', {
                  text: 'Elige el plan que encaje contigo. Cambia o cancela cuando quieras.',
                  align: 'center',
                  maxWidthPx: 520,
                }),
              ]),
            ]),
          ]),
          section('precios', 'pricing', [
            row('precios-fila', [
              col(
                'precio-col-1',
                [
                  comp('pricingCard', 'precio-gratis', {
                    planName: 'Gratis',
                    price: '0',
                    features: ['1 diseño', 'Export estándar'],
                    cta: { id: 'precio-gratis-cta', label: 'Empezar', variant: 'outline' },
                  }),
                ],
                4,
              ),
              col(
                'precio-col-2',
                [
                  comp('pricingCard', 'precio-pro', {
                    planName: 'Pro',
                    price: '12',
                    highlighted: true,
                    features: ['Diseños ilimitados', 'Export completo', 'Soporte prioritario'],
                    cta: { id: 'precio-pro-cta', label: 'Elegir Pro', variant: 'gradient' },
                  }),
                ],
                4,
              ),
              col(
                'precio-col-3',
                [
                  comp('pricingCard', 'precio-empresa', {
                    planName: 'Empresa',
                    price: '39',
                    features: ['Todo lo de Pro', 'Marca blanca', 'SLA'],
                    cta: { id: 'precio-empresa-cta', label: 'Contactar', variant: 'solid' },
                  }),
                ],
                4,
              ),
            ]),
          ]),
          section(
            'faq',
            'faq',
            [
              row('faq-fila', [
                col('faq-col', [
                  comp('heading', 'faq-titulo', {
                    level: 2,
                    text: 'Preguntas frecuentes',
                    align: 'center',
                  }),
                  comp('divider', 'faq-separador', { animated: true }),
                  comp('faqList', 'faq-lista', {
                    items: [
                      {
                        question: '¿Puedo cancelar cuando quiera?',
                        answer: 'Sí, sin permanencia ni preguntas.',
                      },
                      {
                        question: '¿El código es mío?',
                        answer: 'Sí, la descarga es tuya para siempre.',
                      },
                      {
                        question: '¿Hay descuento anual?',
                        answer: 'Sí, dos meses gratis pagando por adelantado.',
                      },
                    ],
                  }),
                ]),
              ]),
            ],
            {
              background: { type: 'color', color: palette.colors.surface },
              animation: { entrance: { type: 'fade-in' } },
            },
          ),
        ],
        footer: footer('© 2026 Planes'),
      }),
  },
];

/** Parses a template with the chosen palette (throws when invalid). */
export function buildTemplate(templateId: string, palette: Palette): DesignSpec {
  const template = TEMPLATES.find((item) => item.id === templateId);
  if (!template) throw new Error(`Plantilla desconocida: ${templateId}`);

  const result = parseDesignSpec(template.build(palette));
  if (!result.success) {
    throw new Error(`Plantilla inválida "${templateId}":\n${result.errors.join('\n')}`);
  }
  return result.data;
}

/** A fresh blank design (one heading) with the chosen palette. */
export function buildBlankDesign(palette: Palette = PALETTES[0]!): DesignSpec {
  const result = parseDesignSpec({
    version: 1,
    meta: { name: 'Mi web' },
    theme: { palette: { ...palette.colors } },
    sections: [
      {
        id: 'seccion-principal',
        rows: [
          {
            id: 'fila-principal',
            columns: [
              {
                id: 'columna-principal',
                components: [{ type: 'heading', id: 'titulo-principal', text: 'Hola, mundo' }],
              },
            ],
          },
        ],
      },
    ],
  } satisfies DesignSpecInput);

  if (!result.success) throw new Error(result.errors.join('\n'));
  return result.data;
}

/** All preference tags across the catalog (for the gallery filters). */
export const TEMPLATE_TAGS: string[] = [
  ...new Set(TEMPLATES.flatMap((template) => template.tags)),
].sort();
