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
                col(
                  'cta-col',
                  [
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
                        {
                          id: 'cta-cta-1',
                          label: 'Abrir el editor',
                          href: '#',
                          variant: 'gradient',
                        },
                      ],
                      align: 'center',
                    }),
                  ],
                  12,
                  { contentAlign: 'center' },
                ),
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
              col(
                'info-col',
                [
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
                ],
                12,
                { contentAlign: 'center' },
              ),
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
                col(
                  'historia-col-1',
                  [
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
                  ],
                  12,
                  { contentAlign: 'center' },
                ),
              ]),
              row('historia-fila-2', [
                col(
                  'historia-col-2',
                  [
                    comp('image', 'historia-imagen', {
                      src: 'https://placehold.co/1200x600',
                      alt: 'Escena de la historia',
                      ratio: '16:9',
                      radius: 'lg',
                      overlay: { direction: 'to-bottom', intensity: 0.45 },
                    }),
                  ],
                  12,
                  { contentAlign: 'center' },
                ),
              ]),
              row('historia-fila-3', [
                col(
                  'historia-col-3',
                  [
                    comp('heading', 'historia-cierre', {
                      level: 2,
                      text: 'El siguiente capítulo es tuyo',
                      align: 'center',
                    }),
                    comp('buttonGroup', 'historia-ctas', {
                      buttons: [
                        {
                          id: 'historia-cta-1',
                          label: 'Continuar',
                          href: '#',
                          variant: 'gradient',
                        },
                        {
                          id: 'historia-cta-2',
                          label: 'Empezar de cero',
                          href: '#',
                          variant: 'outline',
                        },
                      ],
                      align: 'center',
                    }),
                  ],
                  12,
                  { contentAlign: 'center' },
                ),
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
              col(
                'hero-col',
                [
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
                ],
                12,
                { contentAlign: 'center' },
              ),
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
  {
    id: 'tienda-online',
    name: 'Tienda online',
    description: 'Producto, ventajas, tres productos con precio, opiniones y FAQ.',
    tags: ['menu-superior', 'hero-centrado', 'pricing'],
    build: (palette) =>
      withTheme(palette, {
        version: 1,
        meta: { name: 'Mi tienda' },
        header: {
          layout: 'top',
          brand: { name: 'Mi tienda', href: '/' },
          items: [
            { id: 'nav-productos', label: 'Productos', href: '#productos' },
            { id: 'nav-opiniones', label: 'Opiniones', href: '#testimonios' },
            { id: 'nav-faq', label: 'FAQ', href: '#faq' },
          ],
          cta: { id: 'nav-cta', label: 'Comprar', href: '#productos', variant: 'gradient' },
        },
        sections: [
          section('t-hero', 'hero', [
            row('t-hero-fila', [
              col(
                't-hero-col',
                [
                  comp('badge', 't-hero-badge', {
                    label: 'Envío gratis desde 30 €',
                    tone: 'accent',
                  }),
                  comp('heading', 't-hero-titulo', {
                    level: 1,
                    text: 'Tu tienda, lista para vender',
                    size: 'display',
                    align: 'center',
                    animation: { entrance: { type: 'fade-in', delayMs: 100 } },
                  }),
                  comp('text', 't-hero-texto', {
                    text: 'Producto de calidad, pago seguro y devoluciones sin líos durante30 días.',
                    align: 'center',
                    maxWidthPx: 560,
                  }),
                  comp('buttonGroup', 't-hero-botones', {
                    buttons: [
                      {
                        id: 't-cta-1',
                        label: 'Ver productos',
                        href: '#productos',
                        variant: 'gradient',
                      },
                      {
                        id: 't-cta-2',
                        label: 'Cómo funciona',
                        href: '#servicios',
                        variant: 'outline',
                      },
                    ],
                    align: 'center',
                  }),
                ],
                12,
                { contentAlign: 'center' },
              ),
            ]),
          ]),
          section(
            't-servicios',
            'features',
            [
              row('t-servicios-fila', [
                col(
                  't-servicios-col-1',
                  [
                    comp('featureCard', 't-servicio-envio', {
                      icon: 'zap',
                      title: 'Envío en 48 horas',
                      text: 'Seguimiento en tiempo real desde el almacén hasta tu puerta.',
                      animation: { hover: { type: 'lift', intensity: 0.6 } },
                    }),
                  ],
                  4,
                ),
                col(
                  't-servicios-col-2',
                  [
                    comp('featureCard', 't-servicio-pagos', {
                      icon: 'shield',
                      title: 'Pagos seguros',
                      text: 'Tarjeta, PayPal y bizum con cifrado de extremo a extremo.',
                      animation: { hover: { type: 'lift', intensity: 0.6 } },
                    }),
                  ],
                  4,
                ),
                col(
                  't-servicios-col-3',
                  [
                    comp('featureCard', 't-servicio-devolucion', {
                      icon: 'check',
                      title: 'Devoluciones fáciles',
                      text: '30 días para cambiar de opinión, con etiqueta prepagada.',
                      animation: { hover: { type: 'lift', intensity: 0.6 } },
                    }),
                  ],
                  4,
                ),
              ]),
            ],
            { animation: { entrance: { type: 'slide-up' } } },
          ),
          section(
            't-productos',
            'pricing',
            [
              row('t-productos-fila', [
                col(
                  't-prod-col-1',
                  [
                    comp('pricingCard', 't-prod-1', {
                      planName: 'Esencial',
                      price: '19',
                      currency: '€',
                      period: '',
                      features: ['Material premium', 'Envío en 48 h'],
                      cta: { id: 't-prod-1-cta', label: 'Añadir al carrito', variant: 'outline' },
                    }),
                  ],
                  4,
                ),
                col(
                  't-prod-col-2',
                  [
                    comp('pricingCard', 't-prod-2', {
                      planName: 'Pro',
                      price: '39',
                      currency: '€',
                      period: '',
                      highlighted: true,
                      features: ['Todo lo esencial', 'Personalización', 'Soporte prioritario'],
                      cta: { id: 't-prod-2-cta', label: 'Añadir al carrito', variant: 'gradient' },
                    }),
                  ],
                  4,
                ),
                col(
                  't-prod-col-3',
                  [
                    comp('pricingCard', 't-prod-3', {
                      planName: 'Pack completo',
                      price: '89',
                      currency: '€',
                      period: '',
                      features: ['3 unidades', 'Ahorro del 20%'],
                      cta: { id: 't-prod-3-cta', label: 'Añadir al carrito', variant: 'solid' },
                    }),
                  ],
                  4,
                ),
              ]),
            ],
            { animation: { entrance: { type: 'fade-in' } } },
          ),
          section(
            't-testimonios',
            'testimonials',
            [
              row('t-testimonios-fila', [
                col(
                  't-testi-col-1',
                  [
                    comp('testimonialCard', 't-testi-1', {
                      quote: 'Pedí un martes y lo tenía el jueves. Precios perfectos.',
                      author: 'Laura Pérez',
                      role: 'Cliente verificada',
                      rating: 5,
                    }),
                  ],
                  6,
                ),
                col(
                  't-testi-col-2',
                  [
                    comp('testimonialCard', 't-testi-2', {
                      quote: 'La devolución fue un juego de niños: etiqueta en el correo y listo.',
                      author: 'Marcos Díaz',
                      role: 'Cliente verificado',
                      rating: 5,
                    }),
                  ],
                  6,
                ),
              ]),
            ],
            { animation: { entrance: { type: 'slide-up' } } },
          ),
          section(
            't-faq',
            'faq',
            [
              row('t-faq-fila', [
                col('t-faq-col', [
                  comp('heading', 't-faq-titulo', {
                    level: 2,
                    text: 'Preguntas frecuentes',
                    align: 'center',
                  }),
                  comp('faqList', 't-faq-lista', {
                    items: [
                      {
                        question: '¿Cuánto tarda el envío?',
                        answer: 'Entre 24 y 48 horas laborables.',
                      },
                      {
                        question: '¿Puedo devolverlo?',
                        answer: 'Sí,30 días con etiqueta prepagada.',
                      },
                      {
                        question: '¿Qué métodos de pago aceptáis?',
                        answer: 'Tarjeta, PayPal y bizum.',
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
        footer: footer('© 2026 Mi tienda'),
      }),
  },
  {
    id: 'negocio-local',
    name: 'Negocio local',
    description: 'Servicios, ubicación con mapa, opiniones y contacto directo.',
    tags: ['menu-superior', 'hero-centrado', 'contacto'],
    build: (palette) =>
      withTheme(palette, {
        version: 1,
        meta: { name: 'Mi negocio' },
        header: {
          layout: 'floating',
          brand: { name: 'Mi negocio', href: '/' },
          items: [
            { id: 'nav-servicios', label: 'Servicios', href: '#servicios' },
            { id: 'nav-ubicacion', label: 'Ubicación', href: '#ubicacion' },
            { id: 'nav-contacto', label: 'Contacto', href: '#contacto' },
          ],
          cta: { id: 'nav-cta', label: 'Reservar', href: '#contacto', variant: 'solid' },
        },
        sections: [
          section('n-hero', 'hero', [
            row('n-hero-fila', [
              col(
                'n-hero-col',
                [
                  comp('badge', 'n-hero-badge', { label: 'Atención personal', tone: 'primary' }),
                  comp('heading', 'n-hero-titulo', {
                    level: 1,
                    text: 'Tu negocio de barrio, también online',
                    size: 'display',
                    align: 'center',
                    animation: { entrance: { type: 'fade-in', delayMs: 100 } },
                  }),
                  comp('text', 'n-hero-texto', {
                    text: 'Reserva cita en un minuto, consulta el horario y encuentra en un clic.',
                    align: 'center',
                    maxWidthPx: 560,
                  }),
                  comp('buttonGroup', 'n-hero-botones', {
                    buttons: [
                      {
                        id: 'n-cta-1',
                        label: 'Reservar cita',
                        href: '#contacto',
                        variant: 'gradient',
                      },
                      {
                        id: 'n-cta-2',
                        label: 'Cómo llegar',
                        href: '#ubicacion',
                        variant: 'outline',
                      },
                    ],
                    align: 'center',
                  }),
                ],
                12,
                { contentAlign: 'center' },
              ),
            ]),
          ]),
          section(
            'n-servicios',
            'features',
            [
              row('n-servicios-fila', [
                col(
                  'n-servicios-col-1',
                  [
                    comp('featureCard', 'n-servicio-1', {
                      icon: 'sparkles',
                      title: 'Primera visita',
                      text: 'Presupuesto detallado sin compromiso antes de empezar.',
                      animation: { hover: { type: 'lift', intensity: 0.6 } },
                    }),
                  ],
                  4,
                ),
                col(
                  'n-servicios-col-2',
                  [
                    comp('featureCard', 'n-servicio-2', {
                      icon: 'star',
                      title: 'Horario flexible',
                      text: 'Citas tempranas y tardes hasta las20:00 de lunes a viernes.',
                      animation: { hover: { type: 'lift', intensity: 0.6 } },
                    }),
                  ],
                  4,
                ),
                col(
                  'n-servicios-col-3',
                  [
                    comp('featureCard', 'n-servicio-3', {
                      icon: 'users',
                      title: 'Equipo de confianza',
                      text: 'Profesionales con más de10 años de experiencia.',
                      animation: { hover: { type: 'lift', intensity: 0.6 } },
                    }),
                  ],
                  4,
                ),
              ]),
            ],
            { animation: { entrance: { type: 'slide-up' } } },
          ),
          section(
            'n-ubicacion',
            'generic',
            [
              row('n-ubicacion-fila', [
                col(
                  'n-ubicacion-col-mapa',
                  [
                    comp('image', 'n-mapa', {
                      src: 'https://placehold.co/800x520?text=Mapa',
                      alt: 'Mapa de la ubicación',
                      radius: 'lg',
                      shadow: 'md',
                      animation: { entrance: { type: 'reveal-up' } },
                    }),
                  ],
                  6,
                ),
                col(
                  'n-ubicacion-col-texto',
                  [
                    comp('heading', 'n-ubicacion-titulo', {
                      level: 2,
                      text: 'Dónde estamos',
                      animation: { entrance: { type: 'fade-in' } },
                    }),
                    comp('text', 'n-ubicacion-texto', {
                      text: 'Calle Mayor 12,28013 Madrid. A2 minutos del metro y con parking en la misma calle.',
                    }),
                    comp('buttonGroup', 'n-ubicacion-botones', {
                      buttons: [
                        {
                          id: 'n-cta-mapa',
                          label: 'Cómo llegar',
                          href: 'https://maps.google.com/?q=Calle+Mayor+12+Madrid',
                          variant: 'gradient',
                          icon: 'map-pin',
                        },
                        {
                          id: 'n-cta-llamar',
                          label: 'Llamar',
                          href: 'tel:+34910000000',
                          variant: 'outline',
                          icon: 'phone',
                        },
                      ],
                    }),
                  ],
                  6,
                ),
              ]),
            ],
            { animation: { entrance: { type: 'fade-in' } } },
          ),
          section(
            'n-opiniones',
            'testimonials',
            [
              row('n-opiniones-fila', [
                col(
                  'n-testi-col-1',
                  [
                    comp('testimonialCard', 'n-testi-1', {
                      quote: 'Me atendieron el mismo día y el trato fue excelente.',
                      author: 'Carmen Ruiz',
                      role: 'Vecina del barrio',
                      rating: 5,
                    }),
                  ],
                  6,
                ),
                col(
                  'n-testi-col-2',
                  [
                    comp('testimonialCard', 'n-testi-2', {
                      quote: 'Reservé desde el móvil en dos toques. Impecable.',
                      author: 'Javier Nieto',
                      role: 'Cliente habitual',
                      rating: 5,
                    }),
                  ],
                  6,
                ),
              ]),
            ],
            { animation: { entrance: { type: 'slide-up' } } },
          ),
          section(
            'n-contacto',
            'contact',
            [
              row('n-contacto-fila', [
                col(
                  'n-contacto-col',
                  [
                    comp('heading', 'n-contacto-titulo', {
                      level: 2,
                      text: 'Pide tu cita',
                      align: 'center',
                      animation: { entrance: { type: 'fade-in' } },
                    }),
                    comp('text', 'n-contacto-texto', {
                      text: 'Escríbenos y te confirmamos la hora en menos de24 horas.',
                      align: 'center',
                    }),
                    comp('buttonGroup', 'n-contacto-botones', {
                      buttons: [
                        {
                          id: 'n-cta-mail',
                          label: 'Escríbenos',
                          href: 'mailto:hola@ejemplo.com',
                          variant: 'solid',
                          icon: 'mail',
                        },
                      ],
                      align: 'center',
                    }),
                  ],
                  12,
                  { contentAlign: 'center' },
                ),
              ]),
            ],
            { animation: { entrance: { type: 'blur-in' } } },
          ),
        ],
        footer: footer('© 2026 Mi negocio'),
      }),
  },
  {
    id: 'restaurante',
    name: 'Restaurante',
    description: 'Hero sobre foto, carta en tres bloques, opiniones y reservas.',
    tags: ['menu-superior', 'hero-centrado', 'contacto'],
    build: (palette) =>
      withTheme(palette, {
        version: 1,
        meta: { name: 'La Mesa' },
        header: {
          layout: 'top',
          brand: { name: 'La Mesa', href: '/' },
          items: [
            { id: 'nav-carta', label: 'La carta', href: '#carta' },
            { id: 'nav-opiniones', label: 'Opiniones', href: '#opiniones' },
            { id: 'nav-reservas', label: 'Reservas', href: '#reservas' },
          ],
          cta: { id: 'nav-cta', label: 'Reservar', href: '#reservas', variant: 'solid' },
        },
        sections: [
          section(
            'r-hero',
            'hero',
            [
              row('r-hero-fila', [
                col(
                  'r-hero-col',
                  [
                    comp('badge', 'r-hero-badge', { label: 'Cocina de temporada', tone: 'accent' }),
                    comp('heading', 'r-hero-titulo', {
                      level: 1,
                      text: 'Comer bien es un placer sencillo',
                      size: 'display',
                      align: 'center',
                      animation: { entrance: { type: 'fade-in', delayMs: 100 } },
                    }),
                    comp('text', 'r-hero-texto', {
                      text: 'Producto local, carta corta que cambia cada semana y un servicio que hace sentir en casa.',
                      align: 'center',
                      maxWidthPx: 560,
                    }),
                    comp('buttonGroup', 'r-hero-botones', {
                      buttons: [
                        {
                          id: 'r-cta-1',
                          label: 'Ver la carta',
                          href: '#carta',
                          variant: 'gradient',
                        },
                        {
                          id: 'r-cta-2',
                          label: 'Reservar mesa',
                          href: '#reservas',
                          variant: 'outline',
                        },
                      ],
                      align: 'center',
                    }),
                  ],
                  12,
                  { contentAlign: 'center' },
                ),
              ]),
            ],
            {
              background: {
                type: 'image',
                src: 'https://placehold.co/1600x900?text=Restaurante',
                overlay: { direction: 'to-bottom', color: '#000000', intensity: 0.62 },
                size: 'cover',
                position: 'center',
              },
              animation: { entrance: { type: 'fade-in' } },
            },
          ),
          section(
            'r-carta',
            'features',
            [
              row('r-carta-fila', [
                col(
                  'r-carta-col-1',
                  [
                    comp('featureCard', 'r-carta-entrantes', {
                      icon: 'zap',
                      title: 'Para empezar',
                      text: 'Croquetas de la casa, ensalada de temporada y producto de la lonja.',
                      animation: { hover: { type: 'lift', intensity: 0.6 } },
                    }),
                  ],
                  4,
                ),
                col(
                  'r-carta-col-2',
                  [
                    comp('featureCard', 'r-carta-principales', {
                      icon: 'star',
                      title: 'Platos principales',
                      text: 'Arroces, pescado del día y carnes a la brasa con guarnición de mercado.',
                      animation: { hover: { type: 'lift', intensity: 0.6 } },
                    }),
                  ],
                  4,
                ),
                col(
                  'r-carta-col-3',
                  [
                    comp('featureCard', 'r-carta-postres', {
                      icon: 'sparkles',
                      title: 'Postres caseros',
                      text: 'Tarta de queso, turrón helado y una selección de quesos con miel.',
                      animation: { hover: { type: 'lift', intensity: 0.6 } },
                    }),
                  ],
                  4,
                ),
              ]),
            ],
            { animation: { entrance: { type: 'slide-up' } } },
          ),
          section(
            'r-opiniones',
            'testimonials',
            [
              row('r-opiniones-fila', [
                col(
                  'r-testi-col-1',
                  [
                    comp('testimonialCard', 'r-testi-1', {
                      quote:
                        'El mejor arroz que he probado fuera de casa. Volveremos el mes que viene.',
                      author: 'Lucía Marín',
                      role: 'Comensal habitual',
                      rating: 5,
                    }),
                  ],
                  6,
                ),
                col(
                  'r-testi-col-2',
                  [
                    comp('testimonialCard', 'r-testi-2', {
                      quote: 'Reservamos para seis y el servicio fue impecable de principio a fin.',
                      author: 'Pablo Serra',
                      role: 'Cena de empresa',
                      rating: 5,
                    }),
                  ],
                  6,
                ),
              ]),
            ],
            {
              background: { type: 'color', color: palette.colors.surface },
              animation: { entrance: { type: 'slide-up' } },
            },
          ),
          section(
            'r-reservas',
            'contact',
            [
              row('r-reservas-fila', [
                col(
                  'r-reservas-col',
                  [
                    comp('heading', 'r-reservas-titulo', {
                      level: 2,
                      text: 'Reserva tu mesa',
                      align: 'center',
                      animation: { entrance: { type: 'fade-in' } },
                    }),
                    comp('text', 'r-reservas-texto', {
                      text: 'Martes a domingo, de 13:00 a 16:00 y de 20:00 a 23:30. También aceptamos grupos.',
                      align: 'center',
                    }),
                    comp('buttonGroup', 'r-reservas-botones', {
                      buttons: [
                        {
                          id: 'r-cta-llamar',
                          label: 'Llamar ahora',
                          href: 'tel:+34910000000',
                          variant: 'solid',
                          icon: 'phone',
                        },
                        {
                          id: 'r-cta-mail',
                          label: 'Reservar por email',
                          href: 'mailto:reservas@ejemplo.com',
                          variant: 'outline',
                          icon: 'mail',
                        },
                      ],
                      align: 'center',
                    }),
                  ],
                  12,
                  { contentAlign: 'center' },
                ),
              ]),
            ],
            { animation: { entrance: { type: 'blur-in' } } },
          ),
        ],
        footer: footer('© 2026 La Mesa'),
      }),
  },
  {
    id: 'curso-online',
    name: 'Curso online',
    description: 'Convocatoria, temario, planes, opiniones y FAQ de venta.',
    tags: ['menu-superior', 'pricing', 'faq'],
    build: (palette) =>
      withTheme(palette, {
        version: 1,
        meta: { name: 'Aula Nova' },
        header: {
          layout: 'top',
          brand: { name: 'Aula Nova', href: '/' },
          items: [
            { id: 'nav-temario', label: 'Temario', href: '#temario' },
            { id: 'nav-precio', label: 'Precio', href: '#precio' },
            { id: 'nav-faq', label: 'FAQ', href: '#faq' },
          ],
          cta: { id: 'nav-cta', label: 'Inscribirme', href: '#precio', variant: 'gradient' },
        },
        sections: [
          section('c-hero', 'hero', [
            row('c-hero-fila', [
              col(
                'c-hero-col',
                [
                  comp('badge', 'c-hero-badge', { label: 'Próxima convocatoria', tone: 'primary' }),
                  comp('heading', 'c-hero-titulo', {
                    level: 1,
                    text: 'Aprende a tu ritmo, con resultados reales',
                    size: 'display',
                    align: 'center',
                    animation: { entrance: { type: 'fade-in', delayMs: 100 } },
                  }),
                  comp('text', 'c-hero-texto', {
                    text: 'Vídeo lecciones, ejercicios prácticos y tutorías en directo. Acceso de por vida.',
                    align: 'center',
                    maxWidthPx: 560,
                  }),
                  comp('buttonGroup', 'c-hero-botones', {
                    buttons: [
                      {
                        id: 'c-cta-1',
                        label: 'Ver el temario',
                        href: '#temario',
                        variant: 'gradient',
                      },
                      { id: 'c-cta-2', label: 'Precios', href: '#precio', variant: 'outline' },
                    ],
                    align: 'center',
                  }),
                ],
                12,
                { contentAlign: 'center' },
              ),
            ]),
          ]),
          section(
            'c-temario',
            'generic',
            [
              row('c-temario-titulo-fila', [
                col(
                  'c-temario-titulo-col',
                  [
                    comp('heading', 'c-temario-titulo', {
                      level: 2,
                      text: 'Qué vas a aprender',
                      align: 'center',
                      animation: { entrance: { type: 'fade-in' } },
                    }),
                  ],
                  12,
                  { contentAlign: 'center' },
                ),
              ]),
              row('c-temario-fila', [
                col(
                  'c-temario-col',
                  [
                    comp('featureList', 'c-temario-lista', {
                      items: [
                        {
                          icon: 'check',
                          title: 'Módulo 1 · Fundamentos',
                          text: 'Bases sólidas con ejercicios guiados.',
                        },
                        {
                          icon: 'check',
                          title: 'Módulo 2 · Práctica',
                          text: 'Proyecto real paso a paso.',
                        },
                        {
                          icon: 'check',
                          title: 'Módulo 3 · Profundización',
                          text: 'Técnicas avanzadas y atajos.',
                        },
                        {
                          icon: 'check',
                          title: 'Módulo 4 · Portfolio',
                          text: 'Termina con un proyecto para enseñar.',
                        },
                        {
                          icon: 'check',
                          title: 'Tutorías en directo',
                          text: 'Sesiones mensuales en vivo y grabadas.',
                        },
                        {
                          icon: 'check',
                          title: 'Comunidad',
                          text: 'Canal privado con el resto de alumnado.',
                        },
                      ],
                      columns: 3,
                    }),
                  ],
                  12,
                ),
              ]),
            ],
            { animation: { entrance: { type: 'slide-up' } } },
          ),
          section(
            'c-precio',
            'pricing',
            [
              row('c-precio-fila', [
                col(
                  'c-precio-col-1',
                  [
                    comp('pricingCard', 'c-precio-auto', {
                      planName: 'Autoformativo',
                      price: '49',
                      currency: '€',
                      period: ' único',
                      features: ['Vídeos para siempre', 'Ejercicios', 'Certificado'],
                      cta: { id: 'c-precio-1-cta', label: 'Empezar', variant: 'outline' },
                    }),
                  ],
                  4,
                ),
                col(
                  'c-precio-col-2',
                  [
                    comp('pricingCard', 'c-precio-tutoria', {
                      planName: 'Con tutoría',
                      price: '99',
                      currency: '€',
                      period: ' único',
                      highlighted: true,
                      features: [
                        'Todo lo anterior',
                        'Tutorías en directo',
                        'Revisión de proyectos',
                      ],
                      cta: { id: 'c-precio-2-cta', label: 'Inscribirme', variant: 'gradient' },
                    }),
                  ],
                  4,
                ),
                col(
                  'c-precio-col-3',
                  [
                    comp('pricingCard', 'c-precio-equipo', {
                      planName: 'Equipos',
                      price: '299',
                      currency: '€',
                      period: ' /5 personas',
                      features: ['5 accesos', 'Panel de progreso', 'Factura única'],
                      cta: { id: 'c-precio-3-cta', label: 'Hablar con ventas', variant: 'solid' },
                    }),
                  ],
                  4,
                ),
              ]),
            ],
            { animation: { entrance: { type: 'fade-in' } } },
          ),
          section(
            'c-opiniones',
            'testimonials',
            [
              row('c-opiniones-fila', [
                col(
                  'c-testi-col-1',
                  [
                    comp('testimonialCard', 'c-testi-1', {
                      quote:
                        'En dos semanas ya tenía mi primer proyecto funcionando en producción.',
                      author: 'Elena Vidal',
                      role: 'Alumna, promoción marzo',
                      rating: 5,
                    }),
                  ],
                  6,
                ),
                col(
                  'c-testi-col-2',
                  [
                    comp('testimonialCard', 'c-testi-2', {
                      quote:
                        'Las tutorías en directo marcan la diferencia: resuelven todo en el momento.',
                      author: 'Diego Campos',
                      role: 'Alumno, promoción mayo',
                      rating: 5,
                    }),
                  ],
                  6,
                ),
              ]),
            ],
            {
              background: { type: 'color', color: palette.colors.surface },
              animation: { entrance: { type: 'slide-up' } },
            },
          ),
          section(
            'c-faq',
            'faq',
            [
              row('c-faq-fila', [
                col('c-faq-col', [
                  comp('heading', 'c-faq-titulo', {
                    level: 2,
                    text: 'Preguntas frecuentes',
                    align: 'center',
                  }),
                  comp('faqList', 'c-faq-lista', {
                    items: [
                      {
                        question: '¿Cuánto tiempo tengo acceso?',
                        answer: 'De por vida, incluidas las actualizaciones.',
                      },
                      {
                        question: '¿Hay certificado?',
                        answer: 'Sí, al completar todos los módulos.',
                      },
                      { question: '¿Puedo pedir devolución?', answer: '30 días sin preguntas.' },
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
        footer: footer('© 2026 Aula Nova'),
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
