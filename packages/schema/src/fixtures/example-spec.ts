import { type z } from 'zod';

import { type designSpecSchema } from '../design-spec';

/**
 * Full example design used by tests (and later by the codegen and the
 * template gallery). It intentionally exercises every component type,
 * every background type, the angled header and animation slots.
 *
 * The `satisfies` clause makes TypeScript verify at compile time that this
 * document is a valid input of the DesignSpec.
 */
export const exampleDesignSpec = {
  version: 1,
  meta: {
    name: 'Nébula Studio',
    description: 'Estudio creativo digital',
    lang: 'es',
  },
  theme: {
    palette: {
      primary: '#6C5CE7',
      secondary: '#00CEC9',
      accent: '#FD79A8',
      background: '#0B0B10',
      surface: '#14141C',
      text: '#F5F5F7',
      textMuted: '#A1A1AD',
    },
    typography: {
      scale: 'normal',
    },
  },
  header: {
    layout: 'angled',
    items: [
      { id: 'nav-inicio', label: 'Inicio', href: '#inicio' },
      {
        id: 'nav-servicios',
        label: 'Servicios',
        href: '#servicios',
        children: [
          { id: 'nav-diseno-web', label: 'Diseño web', href: '#diseno-web' },
          { id: 'nav-branding', label: 'Branding', href: '#branding' },
        ],
      },
      { id: 'nav-trabajos', label: 'Trabajos', href: '#trabajos' },
      { id: 'nav-contacto', label: 'Contacto', href: '#contacto' },
    ],
    cta: { id: 'nav-cta', label: 'Empieza ya', href: '#contacto', variant: 'gradient' },
    itemAnimation: { type: 'shine' },
  },
  sections: [
    {
      id: 'hero',
      kind: 'hero',
      width: 'full',
      background: {
        type: 'gradient',
        gradient: {
          type: 'linear',
          angle: 135,
          stops: [{ color: '#6C5CE7' }, { color: '#00CEC9', position: 100 }],
        },
      },
      animation: { entrance: { type: 'fade-in', durationMs: 700 } },
      rows: [
        {
          id: 'hero-fila-principal',
          columns: [
            {
              id: 'hero-copy',
              span: 6,
              components: [
                { type: 'badge', id: 'hero-badge', label: 'Nuevo · v1.0', tone: 'accent' },
                {
                  type: 'heading',
                  id: 'hero-titulo',
                  level: 1,
                  text: 'Diseña tu web sin límites',
                  size: 'display',
                  animation: { entrance: { type: 'slide-up', delayMs: 100 } },
                },
                {
                  type: 'text',
                  id: 'hero-subtitulo',
                  text: 'Elige una plantilla, ajústala a tu gusto y descarga un proyecto React real.',
                  maxWidthPx: 520,
                },
                {
                  type: 'buttonGroup',
                  id: 'hero-ctas',
                  buttons: [
                    {
                      id: 'hero-cta-primario',
                      label: 'Empezar gratis',
                      href: '#contacto',
                      variant: 'gradient',
                      animation: { hover: { type: 'glow', intensity: 0.6 } },
                    },
                    {
                      id: 'hero-cta-secundario',
                      label: 'Ver demos',
                      href: '#trabajos',
                      variant: 'outline',
                    },
                  ],
                },
                { type: 'spacer', id: 'hero-espaciador', size: 'md' },
              ],
            },
            {
              id: 'hero-media',
              span: 6,
              components: [
                {
                  type: 'image',
                  id: 'hero-imagen',
                  src: 'https://images.example.com/hero.jpg',
                  alt: 'Vista previa del editor',
                  ratio: '4:3',
                  radius: 'lg',
                  shadow: 'lg',
                  overlay: { direction: 'to-bottom-right', intensity: 0.35 },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'servicios',
      kind: 'features',
      background: {
        type: 'interactive',
        effect: 'spotlight',
        intensity: 0.6,
        speed: 0.4,
      },
      animation: { entrance: { type: 'fade-in' } },
      rows: [
        {
          id: 'servicios-fila-1',
          columns: [
            {
              id: 'servicios-col-1',
              span: 6,
              components: [
                {
                  type: 'featureCard',
                  id: 'servicio-plantillas',
                  icon: 'layout',
                  title: 'Plantillas avanzadas',
                  text: 'Filas, columnas y secciones listas para combinar.',
                  animation: { hover: { type: 'lift', intensity: 0.6 } },
                },
              ],
            },
            {
              id: 'servicios-col-2',
              span: 6,
              components: [
                {
                  type: 'featureCard',
                  id: 'servicio-componentes',
                  icon: 'component',
                  title: 'Componentes reales',
                  text: 'Cada pieza se exporta como TSX + SCSS separado.',
                  animation: { hover: { type: 'lift', intensity: 0.6 } },
                },
              ],
            },
          ],
        },
        {
          id: 'servicios-fila-2',
          columns: [
            {
              id: 'servicios-col-3',
              span: 6,
              components: [
                {
                  type: 'featureCard',
                  id: 'servicio-paletas',
                  icon: 'palette',
                  title: 'Paletas con contraste',
                  text: '5 colores validados con WCAG AA/AAA.',
                  animation: { hover: { type: 'lift', intensity: 0.6 } },
                },
              ],
            },
            {
              id: 'servicios-col-4',
              span: 6,
              components: [
                {
                  type: 'featureCard',
                  id: 'servicio-animaciones',
                  icon: 'sparkles',
                  title: 'Animaciones por doquier',
                  text: 'Entradas, hovers y fondos interactivos con preview.',
                  animation: { hover: { type: 'lift', intensity: 0.6 } },
                },
              ],
            },
          ],
        },
        {
          id: 'servicios-fila-3',
          columns: [
            {
              id: 'servicios-lista',
              span: 12,
              components: [
                {
                  type: 'featureList',
                  id: 'servicios-lista-detalles',
                  columns: 3,
                  items: [
                    { icon: 'zap', title: 'Export instantáneo', text: 'ZIP listo para pnpm dev.' },
                    { icon: 'shield', title: 'Cero IA', text: 'Solo diseño y código limpio.' },
                    {
                      icon: 'code',
                      title: 'TypeScript',
                      text: 'Tipado estricto de extremo a extremo.',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'cifras',
      kind: 'stats',
      rows: [
        {
          id: 'cifras-fila',
          columns: [
            {
              id: 'cifras-col-1',
              span: 3,
              components: [
                { type: 'stat', id: 'stat-plantillas', value: '40+', label: 'Plantillas' },
              ],
            },
            {
              id: 'cifras-col-2',
              span: 3,
              components: [
                { type: 'stat', id: 'stat-componentes', value: '80', label: 'Componentes' },
              ],
            },
            {
              id: 'cifras-col-3',
              span: 3,
              components: [{ type: 'stat', id: 'stat-paletas', value: '50', label: 'Paletas' }],
            },
            {
              id: 'cifras-col-4',
              span: 3,
              components: [
                {
                  type: 'stat',
                  id: 'stat-export',
                  value: '1',
                  label: 'Click al export',
                  suffix: '⚡',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'precios',
      kind: 'pricing',
      rows: [
        {
          id: 'precios-fila',
          columns: [
            {
              id: 'precio-col-basic',
              span: 4,
              components: [
                {
                  type: 'pricingCard',
                  id: 'precio-basic',
                  planName: 'Basic',
                  price: '0',
                  features: ['1 diseño', 'Export estándar', 'Comunidad'],
                  cta: { id: 'precio-basic-cta', label: 'Empezar', variant: 'outline' },
                },
              ],
            },
            {
              id: 'precio-col-pro',
              span: 4,
              components: [
                {
                  type: 'pricingCard',
                  id: 'precio-pro',
                  planName: 'Pro',
                  price: '19',
                  highlighted: true,
                  features: [
                    'Diseños ilimitados',
                    'Export con hooks',
                    'Paletas premium',
                    'Soporte prioritario',
                  ],
                  cta: { id: 'precio-pro-cta', label: 'Elegir Pro', variant: 'gradient' },
                },
              ],
            },
            {
              id: 'precio-col-team',
              span: 4,
              components: [
                {
                  type: 'pricingCard',
                  id: 'precio-team',
                  planName: 'Team',
                  price: '49',
                  features: ['Todo lo de Pro', '5 asientos', 'Marca blanca'],
                  cta: { id: 'precio-team-cta', label: 'Hablar con ventas', variant: 'solid' },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'testimonios',
      kind: 'testimonials',
      background: {
        type: 'image',
        src: 'https://images.example.com/texturas/grano.jpg',
        overlay: { direction: 'to-bottom', intensity: 0.75, color: '#0B0B10' },
        fixed: true,
      },
      rows: [
        {
          id: 'testimonios-fila',
          columns: [
            {
              id: 'testimonio-col-1',
              span: 4,
              components: [
                {
                  type: 'testimonialCard',
                  id: 'testimonio-ana',
                  quote: 'Exporté mi landing y la tenía en producción el mismo día.',
                  author: 'Ana Ruiz',
                  role: 'Founder, Lumen',
                  rating: 5,
                },
              ],
            },
            {
              id: 'testimonio-col-2',
              span: 4,
              components: [
                {
                  type: 'testimonialCard',
                  id: 'testimonio-luis',
                  quote: 'El menú esquinado con hover me voló la cabeza.',
                  author: 'Luis Gómez',
                  role: 'Diseñador freelance',
                  rating: 5,
                },
              ],
            },
            {
              id: 'testimonio-col-3',
              span: 4,
              components: [
                {
                  type: 'testimonialCard',
                  id: 'testimonio-marta',
                  quote: 'Por fin un constructor que genera código que da gusto leer.',
                  author: 'Marta López',
                  role: 'CTO, Nimbus',
                  rating: 4,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'logos',
      kind: 'logos',
      rows: [
        {
          id: 'logos-fila',
          columns: [
            {
              id: 'logos-col',
              span: 12,
              components: [
                {
                  type: 'logoCloud',
                  id: 'logos-nubes',
                  logos: [
                    { src: 'https://images.example.com/logos/uno.svg', alt: 'Uno' },
                    { src: 'https://images.example.com/logos/dos.svg', alt: 'Dos' },
                    { src: 'https://images.example.com/logos/tres.svg', alt: 'Tres' },
                    { src: 'https://images.example.com/logos/cuatro.svg', alt: 'Cuatro' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'galeria',
      kind: 'carousel',
      width: 'full',
      rows: [
        {
          id: 'galeria-fila',
          columns: [
            {
              id: 'galeria-col',
              span: 12,
              components: [
                {
                  type: 'carousel',
                  id: 'galeria-carrusel',
                  slides: [
                    {
                      src: 'https://images.example.com/portfolio/proyecto-1.jpg',
                      alt: 'Proyecto uno',
                      title: 'Rediseño e-commerce',
                    },
                    {
                      src: 'https://images.example.com/portfolio/proyecto-2.jpg',
                      alt: 'Proyecto dos',
                      title: 'Landing SaaS',
                    },
                    {
                      src: 'https://images.example.com/portfolio/proyecto-3.jpg',
                      alt: 'Proyecto tres',
                      title: 'Web corporativa',
                    },
                  ],
                  overlay: { direction: 'to-left', intensity: 0.6 },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'faq',
      kind: 'faq',
      background: { type: 'color', color: '#14141C' },
      rows: [
        {
          id: 'faq-fila',
          columns: [
            {
              id: 'faq-col',
              span: 12,
              components: [
                { type: 'divider', id: 'faq-separador', animated: true },
                {
                  type: 'faqList',
                  id: 'faq-lista',
                  items: [
                    {
                      question: '¿El código es mío?',
                      answer: 'Sí. Descargas un proyecto con licencia MIT y haz lo que quieras.',
                    },
                    {
                      question: '¿Puedo llevarlo a Angular?',
                      answer:
                        'El diseño vive en un JSON independiente: el emisor puede cambiar sin tocar nada más.',
                    },
                    {
                      question: '¿Usa IA?',
                      answer: 'No. Cero funciones de IA: solo diseño, animaciones y código limpio.',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  footer: {
    columns: [
      {
        id: 'footer-producto',
        title: 'Producto',
        links: [
          { label: 'Plantillas', href: '#plantillas' },
          { label: 'Componentes', href: '#componentes' },
          { label: 'Precios', href: '#precios' },
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
    brandText: 'Constructor visual de webs que exporta React real.',
    social: [
      { platform: 'github', href: 'https://github.com/ejemplo' },
      { platform: 'x', href: 'https://x.com/ejemplo' },
    ],
    newsletter: true,
    copyright: '© 2026 Nébula Studio',
  },
} satisfies z.input<typeof designSpecSchema>;
