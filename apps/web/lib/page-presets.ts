import type { DesignSpecInput } from '@designed/schema';

import { newId } from './fields';
import { comp, createSectionFromPreset, makeColumn, makeRow, makeSection } from './section-presets';
import { uniquePagePath } from './pages';

/**
 * Page presets: complete ready-made pages the user can add to any design
 * (multi-page builder). Each preset ships real content built from the
 * section-preset catalog plus a tailored hero, with globally unique ids —
 * adding the same page twice must stay valid (parseDesignSpec enforces it).
 */

type SectionInput = DesignSpecInput['sections'][number];

export interface PagePreset {
  id: string;
  label: string;
  icon: string;
  description: string;
  /** Default public path (deduplicated against existing pages on creation). */
  path: string;
  build: () => { name: string; sections: SectionInput[] };
}

/** Centered hero used as the opener of most page presets. */
function hero(title: string, text: string, badge?: string): SectionInput {
  return makeSection(
    'hero',
    [
      makeRow([
        makeColumn(
          [
            ...(badge ? [comp('badge', newId('badge'), { label: badge, tone: 'accent' })] : []),
            comp('heading', newId('titulo'), {
              level: 1,
              text: title,
              size: 'display',
              align: 'center',
              animation: { entrance: { type: 'fade-in', delayMs: 100 } },
            }),
            comp('text', newId('texto'), {
              text,
              align: 'center',
              maxWidthPx: 560,
            }),
          ],
          12,
          'center',
        ),
      ]),
    ],
    {
      animation: { entrance: { type: 'fade-in' } },
    },
  );
}

/** Pulls sections from the shared catalog (unknown ids are skipped safely). */
function fromPresets(ids: string[]): SectionInput[] {
  return ids
    .map((id) => createSectionFromPreset(id))
    .filter((section): section is SectionInput => section !== null);
}

export const PAGE_PRESETS: readonly PagePreset[] = [
  {
    id: 'tienda',
    label: 'Tienda',
    icon: '🛍️',
    description: 'Portada de producto, ventajas, galería y llamada a la compra.',
    path: '/tienda',
    build: () => ({
      name: 'Tienda',
      sections: [
        hero(
          'Descubre nuestros productos',
          'Selección cuidada, envío rápido y devoluciones sin líos.',
          'Envío gratis',
        ),
        ...fromPresets(['features', 'gallery', 'cta', 'faq']),
      ],
    }),
  },
  {
    id: 'contacto',
    label: 'Contacto',
    icon: '📮',
    description: 'Formulario, datos de contacto y preguntas típicas.',
    path: '/contacto',
    build: () => ({
      name: 'Contacto',
      sections: [
        hero('Hablemos', 'Escríbenos y te respondemos en menos de 24 horas.'),
        ...fromPresets(['contact', 'faq']),
      ],
    }),
  },
  {
    id: 'sobre-mi',
    label: 'Sobre mí',
    icon: '🙋',
    description: 'Bio, cifras, equipo y lo que dicen de ti.',
    path: '/sobre-mi',
    build: () => ({
      name: 'Sobre mí',
      sections: [
        hero(
          'Quién está detrás',
          'La historia, la experiencia y el equipo que hace posible el proyecto.',
          'Perfil',
        ),
        ...fromPresets(['stats', 'team', 'testimonials']),
      ],
    }),
  },
  {
    id: 'blog',
    label: 'Blog',
    icon: '📝',
    description: 'Listado de artículos y invitación a suscribirse.',
    path: '/blog',
    build: () => ({
      name: 'Blog',
      sections: [
        hero(
          'Nuestro blog',
          'Ideas, novedades y guías para sacar el máximo partido a tu proyecto.',
        ),
        ...fromPresets(['blog', 'cta']),
      ],
    }),
  },
  {
    id: 'galeria',
    label: 'Galería',
    icon: '🖼️',
    description: 'Mosaico de imágenes y carrusel destacado.',
    path: '/galeria',
    build: () => ({
      name: 'Galería',
      sections: [
        hero('Galería', 'Un vistazo a nuestro trabajo imagen a imagen.'),
        ...fromPresets(['gallery', 'carousel']),
      ],
    }),
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    icon: '💼',
    description: 'Proyectos, resultados y testimonios de clientes.',
    path: '/portfolio',
    build: () => ({
      name: 'Portfolio',
      sections: [
        hero(
          'Proyectos que hablan por sí solos',
          'Casos reales, resultados medibles y clientes felices.',
          'Trabajos',
        ),
        ...fromPresets(['gallery', 'testimonials', 'cta']),
      ],
    }),
  },
  {
    id: 'planes',
    label: 'Planes y precios',
    icon: '💰',
    description: 'Tabla de precios, dudas frecuentes y cierre.',
    path: '/planes',
    build: () => ({
      name: 'Planes y precios',
      sections: fromPresets(['pricing', 'faq', 'cta']),
    }),
  },
  {
    id: 'ayuda',
    label: 'Ayuda y FAQ',
    icon: '🆘',
    description: 'Preguntas frecuentes y vías de soporte.',
    path: '/ayuda',
    build: () => ({
      name: 'Ayuda',
      sections: [
        hero('¿Cómo podemos ayudarte?', 'Respuestas rápidas a las dudas más habituales.'),
        ...fromPresets(['faq', 'contact']),
      ],
    }),
  },
  {
    id: 'destinos',
    label: 'Destinos',
    icon: '✈️',
    description: 'Inspiración de viajes: lugares, opiniones y reserva.',
    path: '/destinos',
    build: () => ({
      name: 'Destinos',
      sections: [
        hero(
          'Destinos que enamoran',
          'Rutas seleccionadas, experiencias locales y precios honestos.',
          'Viajes',
        ),
        ...fromPresets(['gallery', 'testimonials', 'cta']),
      ],
    }),
  },
  {
    id: 'reservas',
    label: 'Reservas',
    icon: '📅',
    description: 'Solicitud de cita o reserva con formulario y dudas.',
    path: '/reservas',
    build: () => ({
      name: 'Reservas',
      sections: [
        hero('Reserva tu plaza', 'Elige día y hora en un minuto; te confirmamos al instante.'),
        ...fromPresets(['contact', 'faq']),
      ],
    }),
  },
  {
    id: 'blanco',
    label: 'Página en blanco',
    icon: '📄',
    description: 'Una sola sección vacía para empezar desde cero.',
    path: '/nueva-pagina',
    build: () => ({
      name: 'Página nueva',
      sections: [
        makeSection('generic', [
          makeRow([
            makeColumn(
              [
                comp('heading', newId('titulo'), {
                  level: 1,
                  text: 'Nueva página',
                  animation: { entrance: { type: 'fade-in' } },
                }),
              ],
              12,
              'start',
            ),
          ]),
        ]),
      ],
    }),
  },
  {
    id: 'legales',
    label: 'Aviso legal',
    icon: '⚖️',
    description: 'Texto legal y de privacidad en bloques claros, listo para rellenar.',
    path: '/legales',
    build: () => ({
      name: 'Aviso legal',
      sections: [
        makeSection(
          'generic',
          [
            makeRow([
              makeColumn(
                [
                  comp('heading', newId('titulo'), {
                    level: 1,
                    text: 'Aviso legal y privacidad',
                    animation: { entrance: { type: 'fade-in' } },
                  }),
                  comp('heading', newId('titulo'), {
                    level: 2,
                    text: '1. Responsable del sitio',
                  }),
                  comp('text', newId('texto'), {
                    text: 'Titular del sitio web, NIF/CIF 00000000X, con domicilio en Calle Mayor 12, 28013 Madrid. Contacto: hola@ejemplo.com.',
                  }),
                  comp('heading', newId('titulo'), {
                    level: 2,
                    text: '2. Datos personales',
                  }),
                  comp('text', newId('texto'), {
                    text: 'Los datos que nos facilitas a través de los formularios se tratan para responder a tu consulta. No se ceden a terceros salvo obligación legal. Puedes ejercer tus derechos de acceso, rectificación y supresión escribiendo a nuestro correo.',
                  }),
                  comp('heading', newId('titulo'), {
                    level: 2,
                    text: '3. Propiedad intelectual',
                  }),
                  comp('text', newId('texto'), {
                    text: 'Todos los contenidos de este sitio (textos, imágenes y código) son propiedad de su autor o se usan con licencia. Queda prohibida su reproducción sin permiso.',
                  }),
                  comp('divider', newId('separador'), { animated: true }),
                  comp('text', newId('texto'), {
                    text: 'Última actualización: enero de 2026.',
                    tone: 'muted',
                  }),
                ],
                8,
                'start',
              ),
            ]),
          ],
          { animation: { entrance: { type: 'slide-up' } } },
        ),
      ],
    }),
  },
  {
    id: 'carta',
    label: 'Carta del restaurante',
    icon: '🍽️',
    description: 'Menú en tres bloques (entrantes, principales, postres) con CTA de reserva.',
    path: '/carta',
    build: () => ({
      name: 'La carta',
      sections: [
        hero('Nuestra carta', 'Producto de temporada, cocina honesta y raciones para compartir.'),
        ...fromPresets(['features', 'cta']),
      ],
    }),
  },
];

export interface NewPage {
  id: string;
  name: string;
  path: string;
  sections: SectionInput[];
}

/**
 * Builds a fresh page from a preset with a globally unique id and a path
 * that does not collide with `takenPaths` (`/tienda`, `/tienda-2`…).
 */
export function createPageFromPreset(
  presetId: string,
  takenPaths: readonly string[],
): NewPage | null {
  const preset = PAGE_PRESETS.find((item) => item.id === presetId);
  if (!preset) return null;
  const { name, sections } = preset.build();
  if (sections.length === 0) return null;
  return {
    id: newId('pagina'),
    name,
    path: uniquePagePath(preset.path, takenPaths),
    sections,
  };
}
