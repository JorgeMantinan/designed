import type { DesignSpecInput } from '@designed/schema';

import { newId } from './fields';

/**
 * Section presets: rich defaults created when the user adds a section.
 *
 * Every preset ships real content — multiple components, entrance animations
 * and (where it makes sense) hover animations or backgrounds — so a
 * non-technical client starts from a designed block instead of a blank
 * heading. Ids are generated per instance: adding the same preset twice must
 * keep ids globally unique (enforced by parseDesignSpec).
 */

type SectionInput = DesignSpecInput['sections'][number];
type RowInput = SectionInput['rows'][number];
type ColumnInput = RowInput['columns'][number];
type ComponentInput = ColumnInput['components'][number];

function comp(type: ComponentTypeLike, id: string, props: Record<string, unknown>): ComponentInput {
  return { type, id, ...props } as ComponentInput;
}

type ComponentTypeLike = ComponentInput['type'];

function makeSection(
  kind: SectionInput['kind'],
  rows: RowInput[],
  extra: Partial<SectionInput> = {},
): SectionInput {
  return { id: newId('seccion'), kind, width: 'contained', rows, ...extra };
}

function makeRow(columns: ColumnInput[], extra: Partial<RowInput> = {}): RowInput {
  return { id: newId('fila'), stackBelow: 'mobile', columns, ...extra };
}

function makeColumn(
  components: ComponentInput[],
  span = 12,
  contentAlign: 'stretch' | 'start' | 'center' | 'end' = 'stretch',
): ColumnInput {
  return {
    id: newId('columna'),
    span,
    hideOn: [],
    verticalAlign: 'start',
    contentAlign,
    components,
  };
}

export interface SectionPreset {
  /** Preset id (chips, lookup). May exceed the section-kind list. */
  id: string;
  label: string;
  description: string;
  icon: string;
  build: () => SectionInput;
}

function featureCard(title: string, text: string, icon: string): ComponentInput {
  return comp('featureCard', newId('tarjeta'), {
    icon,
    title,
    text,
    animation: { hover: { type: 'lift', intensity: 0.6 } },
  });
}

function testimonial(quote: string, author: string, role: string): ComponentInput {
  return comp('testimonialCard', newId('testimonio'), {
    quote,
    author,
    role,
    rating: 5,
    animation: { hover: { type: 'tilt', intensity: 0.4 } },
  });
}

export const SECTION_PRESETS: readonly SectionPreset[] = [
  {
    id: 'hero',
    label: 'Hero con degradado',
    description: 'Antetítulo, gran titular, texto y dos botones sobre degradado.',
    icon: '🦸',
    build: () =>
      makeSection(
        'hero',
        [
          makeRow([
            makeColumn(
              [
                comp('badge', newId('badge'), { label: 'Nuevo', tone: 'accent' }),
                comp('heading', newId('titulo'), {
                  level: 1,
                  text: 'Un titular que engancha',
                  size: 'display',
                  align: 'center',
                  animation: { entrance: { type: 'fade-in', delayMs: 100 } },
                }),
                comp('text', newId('texto'), {
                  text: 'Describe en una frase el valor de tu producto para quien te visita.',
                  align: 'center',
                  maxWidthPx: 560,
                }),
                comp('buttonGroup', newId('botones'), {
                  buttons: [
                    { id: newId('cta'), label: 'Empezar', href: '#', variant: 'gradient' },
                    { id: newId('cta'), label: 'Saber más', href: '#', variant: 'outline' },
                  ],
                  align: 'center',
                }),
              ],
              12,
              'center',
            ),
          ]),
        ],
        {
          background: {
            type: 'gradient',
            gradient: {
              type: 'linear',
              angle: 135,
              stops: [{ color: '#6C5CE7' }, { color: '#FD79A8', position: 100 }],
            },
          },
          animation: { entrance: { type: 'fade-in' } },
        },
      ),
  },
  {
    id: 'features',
    label: 'Funciones (3 columnas)',
    description: 'Tres tarjetas con icono y efecto de elevación al pasar el ratón.',
    icon: '🧩',
    build: () =>
      makeSection(
        'features',
        [
          makeRow([
            makeColumn(
              [
                featureCard('Velocidad', 'Carga inmediata y scroll suave.', 'zap'),
                featureCard('Seguridad', 'Prácticas seguras por defecto.', 'shield'),
                featureCard('Diseño', 'Componentes cuidados al píxel.', 'palette'),
              ],
              4,
            ),
          ]),
        ],
        { animation: { entrance: { type: 'slide-up' } } },
      ),
  },
  {
    id: 'pricing',
    label: 'Precios (3 planes)',
    description: 'Tres planes con el destacado elevado y zoom de entrada.',
    icon: '💰',
    build: () =>
      makeSection(
        'pricing',
        [
          makeRow([
            makeColumn(
              [
                comp('pricingCard', newId('precio'), {
                  planName: 'Básico',
                  price: '0',
                  features: ['1 diseño', 'Export estándar'],
                  cta: { id: newId('cta'), label: 'Empezar', variant: 'outline' },
                }),
              ],
              4,
            ),
            makeColumn(
              [
                comp('pricingCard', newId('precio'), {
                  planName: 'Pro',
                  price: '19',
                  highlighted: true,
                  features: ['Ilimitado', 'Export completo', 'Soporte'],
                  cta: { id: newId('cta'), label: 'Elegir Pro', variant: 'gradient' },
                }),
              ],
              4,
            ),
            makeColumn(
              [
                comp('pricingCard', newId('precio'), {
                  planName: 'Empresa',
                  price: '49',
                  features: ['Todo lo de Pro', 'Marca blanca'],
                  cta: { id: newId('cta'), label: 'Contactar', variant: 'solid' },
                }),
              ],
              4,
            ),
          ]),
        ],
        { animation: { entrance: { type: 'zoom-in' } } },
      ),
  },
  {
    id: 'testimonials',
    label: 'Testimonios (3 tarjetas)',
    description: 'Tres citas con valoración y inclinación 3D al hover.',
    icon: '💬',
    build: () =>
      makeSection(
        'testimonials',
        [
          makeRow([
            makeColumn(
              [
                testimonial(
                  'Cambiaron por completo nuestra presencia online.',
                  'Ana Ruiz',
                  'Founder',
                ),
                testimonial('El mejor equipo con el que hemos trabajado.', 'Luis Gómez', 'CTO'),
                testimonial('Entregaron antes de lo prometido.', 'Marta López', 'Marketing'),
              ],
              4,
            ),
          ]),
        ],
        { animation: { entrance: { type: 'slide-left' } } },
      ),
  },
  {
    id: 'faq',
    label: 'Preguntas frecuentes',
    description: 'Acordeón nativo con separador animado y desenfoque de entrada.',
    icon: '❓',
    build: () =>
      makeSection(
        'faq',
        [
          makeRow([
            makeColumn([
              comp('heading', newId('titulo'), {
                level: 2,
                text: 'Preguntas frecuentes',
                align: 'center',
              }),
              comp('divider', newId('separador'), { animated: true }),
              comp('faqList', newId('faq'), {
                items: [
                  { question: '¿Puedo cancelar cuando quiera?', answer: 'Sí, sin permanencia.' },
                  { question: '¿El código es mío?', answer: 'Sí, la descarga es tuya.' },
                  { question: '¿Hay soporte?', answer: 'Sí, por correo y comunidad.' },
                ],
              }),
            ]),
          ]),
        ],
        { animation: { entrance: { type: 'blur-in' } } },
      ),
  },
  {
    id: 'cta',
    label: 'Llamada a la acción',
    description: 'Bloque de conversión con degradado y entrada de cortina.',
    icon: '📣',
    build: () =>
      makeSection(
        'cta',
        [
          makeRow([
            makeColumn(
              [
                comp('heading', newId('titulo'), {
                  level: 2,
                  text: '¿Listo para empezar?',
                  align: 'center',
                }),
                comp('text', newId('texto'), {
                  text: 'Prueba gratis hoy, sin tarjeta de crédito.',
                  align: 'center',
                }),
                comp('buttonGroup', newId('botones'), {
                  buttons: [{ id: newId('cta'), label: 'Crear mi cuenta', variant: 'gradient' }],
                  align: 'center',
                }),
              ],
              12,
              'center',
            ),
          ]),
        ],
        {
          background: {
            type: 'gradient',
            gradient: {
              type: 'linear',
              angle: 90,
              stops: [{ color: '#FD79A8' }, { color: '#6C5CE7', position: 100 }],
            },
          },
          animation: { entrance: { type: 'reveal-up' } },
        },
      ),
  },
  {
    id: 'logos',
    label: 'Nube de logos',
    description: 'Cuatro logos en escala de grises que recuperan color al hover.',
    icon: '🏷️',
    build: () =>
      makeSection(
        'logos',
        [
          makeRow([
            makeColumn([
              comp('logoCloud', newId('logos'), {
                logos: [
                  { src: 'https://placehold.co/120x40?text=Uno', alt: 'Uno' },
                  { src: 'https://placehold.co/120x40?text=Dos', alt: 'Dos' },
                  { src: 'https://placehold.co/120x40?text=Tres', alt: 'Tres' },
                  { src: 'https://placehold.co/120x40?text=Cuatro', alt: 'Cuatro' },
                ],
              }),
            ]),
          ]),
        ],
        { animation: { entrance: { type: 'fade-in' } } },
      ),
  },
  {
    id: 'stats',
    label: 'Cifras con spotlight',
    description: 'Cuatro números sobre un fondo interactivo que sigue al ratón.',
    icon: '🔢',
    build: () =>
      makeSection(
        'stats',
        [
          makeRow([
            makeColumn([comp('stat', newId('cifra'), { value: '98%', label: 'Satisfacción' })], 3),
            makeColumn([comp('stat', newId('cifra'), { value: '240', label: 'Proyectos' })], 3),
            makeColumn([comp('stat', newId('cifra'), { value: '15', label: 'Países' })], 3),
            makeColumn([comp('stat', newId('cifra'), { value: '10', label: 'Años' })], 3),
          ]),
        ],
        {
          background: { type: 'interactive', effect: 'spotlight', intensity: 0.5, speed: 0.5 },
          animation: { entrance: { type: 'slide-down' } },
        },
      ),
  },
  {
    id: 'carousel',
    label: 'Carrusel de proyectos',
    description: 'Tres diapositivas con sombreado, autoplay y flechas.',
    icon: '🎠',
    build: () =>
      makeSection(
        'carousel',
        [
          makeRow([
            makeColumn([
              comp('carousel', newId('carrusel'), {
                slides: [
                  { src: 'https://placehold.co/1200x675?text=Proyecto+1', alt: 'Proyecto 1' },
                  { src: 'https://placehold.co/1200x675?text=Proyecto+2', alt: 'Proyecto 2' },
                  { src: 'https://placehold.co/1200x675?text=Proyecto+3', alt: 'Proyecto 3' },
                ],
                overlay: { direction: 'to-bottom', intensity: 0.5 },
                autoplay: true,
              }),
            ]),
          ]),
        ],
        { width: 'full', animation: { entrance: { type: 'slide-up' } } },
      ),
  },
  {
    id: 'gallery',
    label: 'Galería de imágenes',
    description: 'Cuatro imágenes en rejilla con sombreados en diagonal.',
    icon: '🖼️',
    build: () => {
      const image = (label: string, direction: string): ComponentInput =>
        comp('image', newId('imagen'), {
          src: `https://placehold.co/600x400?text=${encodeURIComponent(label)}`,
          alt: label,
          radius: 'md',
          shadow: 'md',
          overlay: { direction, intensity: 0.45 },
          animation: { entrance: { type: 'reveal-up' } },
        });

      return makeSection(
        'gallery',
        [
          makeRow([
            makeColumn([image('Foto uno', 'to-bottom-right')], 6),
            makeColumn([image('Foto dos', 'to-left')], 6),
          ]),
          makeRow([
            makeColumn([image('Foto tres', 'to-top')], 6),
            makeColumn([image('Foto cuatro', 'to-bottom')], 6),
          ]),
        ],
        { animation: { entrance: { type: 'fade-in' } } },
      );
    },
  },
  {
    id: 'team',
    label: 'Equipo (3 perfiles)',
    description: 'Tres miembros con icono y escala sutil al hover.',
    icon: '👥',
    build: () =>
      makeSection(
        'team',
        [
          makeRow([
            makeColumn(
              [
                featureCard('Ana Ruiz', 'Diseño de producto y dirección de arte.', 'users'),
                comp('featureCard', newId('persona'), {
                  icon: 'users',
                  title: 'Luis Gómez',
                  text: 'Desarrollo front-end y animación.',
                  animation: { hover: { type: 'scale', intensity: 0.5 } },
                }),
                comp('featureCard', newId('persona'), {
                  icon: 'users',
                  title: 'Marta López',
                  text: 'Estrategia y contenido.',
                  animation: { hover: { type: 'scale', intensity: 0.5 } },
                }),
              ],
              4,
            ),
          ]),
        ],
        { animation: { entrance: { type: 'slide-up' } } },
      ),
  },
  {
    id: 'blog',
    label: 'Artículos (3 entradas)',
    description: 'Tres tarjetas de contenido enlazadas con elevación al hover.',
    icon: '📰',
    build: () =>
      makeSection(
        'blog',
        [
          makeRow([
            makeColumn(
              [
                comp('featureCard', newId('articulo'), {
                  icon: 'layout',
                  title: 'Cómo elegir tu paleta',
                  text: 'Contraste, emociones y marca en5 pasos.',
                  href: '#',
                  animation: { hover: { type: 'lift', intensity: 0.6 } },
                }),
                comp('featureCard', newId('articulo'), {
                  icon: 'sparkles',
                  title: 'Animaciones con criterio',
                  text: 'Movimiento que acompaña al contenido, nunca lo distrae.',
                  href: '#',
                  animation: { hover: { type: 'lift', intensity: 0.6 } },
                }),
                comp('featureCard', newId('articulo'), {
                  icon: 'code',
                  title: 'Exportar sin sorpresas',
                  text: 'Qué mirar en el ZIP antes de desplegar.',
                  href: '#',
                  animation: { hover: { type: 'lift', intensity: 0.6 } },
                }),
              ],
              4,
            ),
          ]),
        ],
        { animation: { entrance: { type: 'slide-up' } } },
      ),
  },
  {
    id: 'contact',
    label: 'Bloque de contacto',
    description: 'Antetítulo, mensaje y botón con icono de correo.',
    icon: '📮',
    build: () =>
      makeSection(
        'contact',
        [
          makeRow([
            makeColumn(
              [
                comp('badge', newId('badge'), { label: 'Hablemos', tone: 'primary' }),
                comp('heading', newId('titulo'), {
                  level: 2,
                  text: 'Cuéntanos tu proyecto',
                  align: 'center',
                  animation: { entrance: { type: 'fade-in' } },
                }),
                comp('text', newId('texto'), {
                  text: 'Respondemos en menos de24 horas laborables.',
                  align: 'center',
                }),
                comp('buttonGroup', newId('botones'), {
                  buttons: [
                    {
                      id: newId('cta'),
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
              'center',
            ),
          ]),
        ],
        { animation: { entrance: { type: 'blur-in' } } },
      ),
  },
  {
    id: 'fondo-interactivo',
    label: 'Fondo interactivo',
    description:
      'Sección con malla de gradiente que sigue al ratón. Cambia el efecto en «Fondo de la sección».',
    icon: '🌈',
    build: () =>
      makeSection(
        'generic',
        [
          makeRow([
            makeColumn(
              [
                comp('heading', newId('titulo'), {
                  level: 2,
                  text: 'Contenido sobre un fondo que se mueve',
                  align: 'center',
                  animation: { entrance: { type: 'fade-in' } },
                }),
                comp('text', newId('texto'), {
                  text: 'Pasa el ratón por la sección: la malla de gradiente te sigue. Elige otro efecto (spotlight, partículas, ondas…) en el panel de fondo.',
                  align: 'center',
                  maxWidthPx: 560,
                }),
                comp('buttonGroup', newId('botones'), {
                  buttons: [{ id: newId('cta'), label: 'Probar el efecto', variant: 'gradient' }],
                  align: 'center',
                }),
              ],
              12,
              'center',
            ),
          ]),
        ],
        {
          background: { type: 'interactive', effect: 'gradient-mesh', intensity: 0.6, speed: 0.5 },
          animation: { entrance: { type: 'fade-in' } },
        },
      ),
  },
  {
    id: 'generic',
    label: 'Sección simple',
    description: 'Título, texto y separador animado como punto de partida neutro.',
    icon: '✏️',
    build: () =>
      makeSection(
        'generic',
        [
          makeRow([
            makeColumn(
              [
                comp('heading', newId('titulo'), {
                  level: 2,
                  text: 'Nueva sección',
                  align: 'center',
                  animation: { entrance: { type: 'slide-up' } },
                }),
                comp('text', newId('texto'), {
                  text: 'Escribe aquí el contenido de esta sección.',
                  align: 'center',
                }),
                comp('divider', newId('separador'), { animated: true }),
              ],
              12,
              'center',
            ),
          ]),
        ],
        { animation: { entrance: { type: 'slide-up' } } },
      ),
  },
];

/** Builds a fresh section for a preset id (null when unknown). */
export function createSectionFromPreset(id: string): SectionInput | null {
  return SECTION_PRESETS.find((preset) => preset.id === id)?.build() ?? null;
}
