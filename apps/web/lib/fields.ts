import type { ComponentSpec, ComponentType } from '@designed/schema';

/**
 * Declarative field descriptors: each component type declares its editable
 * fields here and a single generic editor renders the form. Adding a field =
 * one descriptor, no new form components.
 */

export type FieldDescriptor =
  | { key: string; kind: 'text'; label: string; placeholder?: string }
  | { key: string; kind: 'textarea'; label: string; rows?: number }
  | { key: string; kind: 'number'; label: string; min?: number; max?: number; step?: number }
  | { key: string; kind: 'color'; label: string }
  | {
      key: string;
      kind: 'select';
      label: string;
      options: { value: string; label: string }[];
    }
  | { key: string; kind: 'checkbox'; label: string }
  | {
      key: string;
      kind: 'list';
      label: string;
      itemFields: FieldDescriptor[];
      addLabel: string;
      maxItems?: number;
      /** List of plain strings rendered as a single text field per item. */
      itemKind?: 'text';
      createItem: () => Record<string, unknown> | string;
    }
  | {
      key: string;
      kind: 'optional-object';
      label: string;
      create: () => Record<string, unknown>;
      fields: FieldDescriptor[];
    };

type SelectOption = { value: string; label: string };

const ALIGN_OPTIONS: SelectOption[] = [
  { value: 'left', label: 'Izquierda' },
  { value: 'center', label: 'Centro' },
  { value: 'right', label: 'Derecha' },
];

const TONE_OPTIONS: SelectOption[] = [
  { value: 'default', label: 'Normal' },
  { value: 'primary', label: 'Primario' },
  { value: 'muted', label: 'Apagado' },
  { value: 'inverse', label: 'Inverso' },
];

const OVERLAY_DIRECTIONS: SelectOption[] = [
  { value: 'to-right', label: 'Lateral →' },
  { value: 'to-left', label: '← Lateral' },
  { value: 'to-bottom', label: 'Vertical ↓' },
  { value: 'to-top', label: '↑ Vertical' },
  { value: 'to-bottom-right', label: 'Diagonal ↘' },
  { value: 'to-bottom-left', label: 'Diagonal ↙' },
  { value: 'to-top-right', label: 'Diagonal ↗' },
  { value: 'to-top-left', label: 'Diagonal ↖' },
  { value: 'center', label: 'Radial' },
];

const OVERLAY_FIELDS: FieldDescriptor[] = [
  {
    key: 'overlay.type',
    kind: 'select',
    label: 'Tipo',
    options: [
      { value: 'gradient', label: 'Degradado' },
      { value: 'duotone', label: 'Duotono' },
      { value: 'vignette', label: 'Viñeta' },
    ],
  },
  { key: 'overlay.direction', kind: 'select', label: 'Dirección', options: OVERLAY_DIRECTIONS },
  { key: 'overlay.color', kind: 'color', label: 'Color' },
  { key: 'overlay.colorTo', kind: 'color', label: 'Color secundario' },
  { key: 'overlay.intensity', kind: 'number', label: 'Intensidad', min: 0, max: 1, step: 0.05 },
];

/**
 * Descriptors for editing the header menu (items + nested submenu) and the
 * footer (columns with links, social networks) with the generic FieldsForm.
 */
export const HEADER_MENU_FIELDS: FieldDescriptor[] = [
  {
    key: 'items',
    kind: 'list',
    label: 'Elementos del menú',
    addLabel: 'Añadir elemento',
    maxItems: 10,
    createItem: () => ({ id: newId('nav'), label: 'Nuevo enlace', href: '#' }),
    itemFields: [
      { key: 'label', kind: 'text', label: 'Texto' },
      { key: 'href', kind: 'text', label: 'Enlace', placeholder: '#seccion' },
      {
        key: 'children',
        kind: 'list',
        label: 'Submenú',
        addLabel: 'Añadir subelemento',
        maxItems: 8,
        createItem: () => ({ id: newId('nav-sub'), label: 'Subenlace', href: '#' }),
        itemFields: [
          { key: 'label', kind: 'text', label: 'Texto' },
          { key: 'href', kind: 'text', label: 'Enlace' },
          { key: 'badge', kind: 'text', label: 'Etiqueta (opcional)' },
        ],
      },
    ],
  },
];

export const FOOTER_FIELDS: FieldDescriptor[] = [
  { key: 'newsletter', kind: 'checkbox', label: 'Mostrar formulario de newsletter' },
  { key: 'brandText', kind: 'textarea', label: 'Texto de la marca', rows: 2 },
  { key: 'copyright', kind: 'text', label: 'Copyright', placeholder: '© 2026 Mi web' },
  {
    key: 'columns',
    kind: 'list',
    label: 'Columnas de enlaces',
    addLabel: 'Añadir columna',
    maxItems: 6,
    createItem: () => ({ id: newId('footer-col'), title: 'Nueva columna', links: [] }),
    itemFields: [
      { key: 'title', kind: 'text', label: 'Título' },
      {
        key: 'links',
        kind: 'list',
        label: 'Enlaces',
        addLabel: 'Añadir enlace',
        maxItems: 12,
        createItem: () => ({ label: 'Enlace', href: '#' }),
        itemFields: [
          { key: 'label', kind: 'text', label: 'Texto' },
          { key: 'href', kind: 'text', label: 'Destino' },
        ],
      },
    ],
  },
  {
    key: 'social',
    kind: 'list',
    label: 'Redes sociales',
    addLabel: 'Añadir red',
    maxItems: 8,
    createItem: () => ({ platform: 'github', href: 'https://github.com/' }),
    itemFields: [
      {
        key: 'platform',
        kind: 'select',
        label: 'Red',
        options: [
          { value: 'x', label: 'X (Twitter)' },
          { value: 'github', label: 'GitHub' },
          { value: 'instagram', label: 'Instagram' },
          { value: 'linkedin', label: 'LinkedIn' },
          { value: 'youtube', label: 'YouTube' },
          { value: 'tiktok', label: 'TikTok' },
          { value: 'discord', label: 'Discord' },
          { value: 'facebook', label: 'Facebook' },
        ],
      },
      { key: 'href', kind: 'text', label: 'Enlace' },
    ],
  },
];

const BUTTON_ITEM_FIELDS: FieldDescriptor[] = [
  { key: 'label', kind: 'text', label: 'Texto' },
  { key: 'href', kind: 'text', label: 'Enlace', placeholder: '#seccion' },
  {
    key: 'variant',
    kind: 'select',
    label: 'Estilo',
    options: [
      { value: 'solid', label: 'Sólido' },
      { value: 'outline', label: 'Contorno' },
      { value: 'ghost', label: 'Fantasma' },
      { value: 'gradient', label: 'Degradado' },
    ],
  },
  { key: 'icon', kind: 'text', label: 'Icono (p. ej. arrow-right)' },
];

/** Editable fields for every component type of the union. */
export const COMPONENT_FIELDS: Record<ComponentType, FieldDescriptor[]> = {
  heading: [
    { key: 'level', kind: 'number', label: 'Nivel (1-6)', min: 1, max: 6, step: 1 },
    { key: 'text', kind: 'textarea', label: 'Texto', rows: 2 },
    {
      key: 'size',
      kind: 'select',
      label: 'Tamaño visual',
      options: [
        { value: '', label: 'Automático' },
        { value: 'display', label: 'Display' },
        { value: 'xl', label: 'XL' },
        { value: 'lg', label: 'L' },
        { value: 'md', label: 'M' },
        { value: 'sm', label: 'S' },
      ],
    },
    { key: 'align', kind: 'select', label: 'Alineación', options: ALIGN_OPTIONS },
    { key: 'tone', kind: 'select', label: 'Color', options: TONE_OPTIONS },
  ],
  text: [
    { key: 'text', kind: 'textarea', label: 'Texto', rows: 4 },
    { key: 'align', kind: 'select', label: 'Alineación', options: ALIGN_OPTIONS },
    { key: 'tone', kind: 'select', label: 'Color', options: TONE_OPTIONS },
    { key: 'maxWidthPx', kind: 'number', label: 'Ancho máx. (px)', min: 100, max: 1200 },
  ],
  buttonGroup: [
    {
      key: 'buttons',
      kind: 'list',
      label: 'Botones',
      itemFields: BUTTON_ITEM_FIELDS,
      createItem: () => ({ id: newId('boton'), label: 'Nuevo botón', href: '#', variant: 'solid' }),
      addLabel: 'Añadir botón',
      maxItems: 5,
    },
    {
      key: 'direction',
      kind: 'select',
      label: 'Dirección',
      options: [
        { value: 'row', label: 'Horizontal' },
        { value: 'column', label: 'Vertical' },
      ],
    },
    { key: 'align', kind: 'select', label: 'Alineación', options: ALIGN_OPTIONS },
    { key: 'gapPx', kind: 'number', label: 'Separación (px)', min: 0, max: 80 },
  ],
  badge: [
    { key: 'label', kind: 'text', label: 'Texto' },
    {
      key: 'tone',
      kind: 'select',
      label: 'Estilo',
      options: [
        { value: 'primary', label: 'Primario' },
        { value: 'secondary', label: 'Secundario' },
        { value: 'accent', label: 'Acento' },
        { value: 'neutral', label: 'Neutro' },
      ],
    },
  ],
  image: [
    { key: 'src', kind: 'text', label: 'URL de la imagen' },
    { key: 'alt', kind: 'text', label: 'Texto alternativo' },
    {
      key: 'ratio',
      kind: 'select',
      label: 'Proporción',
      options: [
        { value: 'auto', label: 'Automática' },
        { value: '1:1', label: '1:1' },
        { value: '4:3', label: '4:3' },
        { value: '16:9', label: '16:9' },
        { value: '3:4', label: '3:4' },
        { value: '21:9', label: '21:9' },
      ],
    },
    {
      key: 'radius',
      kind: 'select',
      label: 'Esquinas',
      options: [
        { value: 'none', label: 'Sin radio' },
        { value: 'sm', label: 'Pequeño' },
        { value: 'md', label: 'Medio' },
        { value: 'lg', label: 'Grande' },
        { value: 'pill', label: 'Píldora' },
      ],
    },
    {
      key: 'shadow',
      kind: 'select',
      label: 'Sombra',
      options: [
        { value: 'none', label: 'Ninguna' },
        { value: 'sm', label: 'Suave' },
        { value: 'md', label: 'Media' },
        { value: 'lg', label: 'Grande' },
      ],
    },
    ...OVERLAY_FIELDS,
  ],
  featureCard: [
    { key: 'icon', kind: 'text', label: 'Icono (p. ej. zap)' },
    { key: 'title', kind: 'text', label: 'Título' },
    { key: 'text', kind: 'textarea', label: 'Descripción', rows: 3 },
    { key: 'align', kind: 'select', label: 'Alineación', options: ALIGN_OPTIONS },
    { key: 'href', kind: 'text', label: 'Enlace (opcional)' },
  ],
  pricingCard: [
    { key: 'planName', kind: 'text', label: 'Nombre del plan' },
    { key: 'price', kind: 'text', label: 'Precio' },
    { key: 'currency', kind: 'text', label: 'Moneda' },
    { key: 'period', kind: 'text', label: 'Periodo' },
    { key: 'highlighted', kind: 'checkbox', label: 'Destacado' },
    {
      key: 'features',
      kind: 'list',
      label: 'Ventajas',
      itemKind: 'text',
      itemFields: [{ key: 'value', kind: 'text', label: 'Ventaja' }],
      createItem: () => 'Nueva ventaja',
      addLabel: 'Añadir ventaja',
      maxItems: 10,
    },
    {
      key: 'cta',
      kind: 'optional-object',
      label: 'Botón',
      create: () => ({ id: newId('cta'), label: 'Elegir plan', href: '#', variant: 'solid' }),
      fields: BUTTON_ITEM_FIELDS,
    },
  ],
  testimonialCard: [
    { key: 'quote', kind: 'textarea', label: 'Cita', rows: 3 },
    { key: 'author', kind: 'text', label: 'Autor' },
    { key: 'role', kind: 'text', label: 'Cargo' },
    { key: 'avatarUrl', kind: 'text', label: 'URL del avatar' },
    { key: 'rating', kind: 'number', label: 'Valoración (0-5)', min: 0, max: 5, step: 1 },
  ],
  stat: [
    { key: 'value', kind: 'text', label: 'Valor' },
    { key: 'label', kind: 'text', label: 'Etiqueta' },
    { key: 'suffix', kind: 'text', label: 'Sufijo' },
  ],
  featureList: [
    { key: 'columns', kind: 'number', label: 'Columnas (1-3)', min: 1, max: 3, step: 1 },
    {
      key: 'items',
      kind: 'list',
      label: 'Elementos',
      itemFields: [
        { key: 'icon', kind: 'text', label: 'Icono' },
        { key: 'title', kind: 'text', label: 'Título' },
        { key: 'text', kind: 'textarea', label: 'Texto', rows: 2 },
      ],
      createItem: () => ({ title: 'Nuevo título', text: 'Descripción' }),
      addLabel: 'Añadir elemento',
      maxItems: 12,
    },
  ],
  faqList: [
    {
      key: 'items',
      kind: 'list',
      label: 'Preguntas',
      itemFields: [
        { key: 'question', kind: 'text', label: 'Pregunta' },
        { key: 'answer', kind: 'textarea', label: 'Respuesta', rows: 3 },
      ],
      createItem: () => ({ question: 'Nueva pregunta', answer: 'Respuesta' }),
      addLabel: 'Añadir pregunta',
      maxItems: 20,
    },
  ],
  logoCloud: [
    { key: 'grayscale', kind: 'checkbox', label: 'Escala de grises' },
    {
      key: 'logos',
      kind: 'list',
      label: 'Logos',
      itemFields: [
        { key: 'src', kind: 'text', label: 'URL' },
        { key: 'alt', kind: 'text', label: 'Texto alternativo' },
      ],
      createItem: () => ({ src: 'https://placehold.co/120x40', alt: 'Logo' }),
      addLabel: 'Añadir logo',
      maxItems: 24,
    },
  ],
  carousel: [
    { key: 'autoplay', kind: 'checkbox', label: 'Reproducción automática' },
    {
      key: 'intervalMs',
      kind: 'number',
      label: 'Intervalo (ms)',
      min: 2000,
      max: 15000,
      step: 500,
    },
    { key: 'showDots', kind: 'checkbox', label: 'Mostrar puntos' },
    { key: 'showArrows', kind: 'checkbox', label: 'Mostrar flechas' },
    {
      key: 'ratio',
      kind: 'select',
      label: 'Proporción',
      options: [
        { value: '16:9', label: '16:9' },
        { value: '4:3', label: '4:3' },
        { value: '3:2', label: '3:2' },
        { value: '21:9', label: '21:9' },
      ],
    },
    ...OVERLAY_FIELDS,
    {
      key: 'slides',
      kind: 'list',
      label: 'Diapositivas',
      itemFields: [
        { key: 'src', kind: 'text', label: 'URL' },
        { key: 'alt', kind: 'text', label: 'Texto alternativo' },
        { key: 'title', kind: 'text', label: 'Título' },
      ],
      createItem: () => ({ src: 'https://placehold.co/800x450', alt: 'Diapositiva' }),
      addLabel: 'Añadir diapositiva',
      maxItems: 12,
    },
  ],
  divider: [
    { key: 'thicknessPx', kind: 'number', label: 'Grosor (px)', min: 1, max: 10, step: 1 },
    { key: 'animated', kind: 'checkbox', label: 'Animado' },
  ],
  spacer: [
    {
      key: 'size',
      kind: 'select',
      label: 'Tamaño',
      options: [
        { value: 'xs', label: 'XS' },
        { value: 'sm', label: 'SM' },
        { value: 'md', label: 'MD' },
        { value: 'lg', label: 'LG' },
        { value: 'xl', label: 'XL' },
        { value: 'xxl', label: 'XXL' },
      ],
    },
  ],
};

// ── Path utilities (supports `a.b` and `a[0].b`) ─────────────────────────────

type Draft = Record<string, unknown>;

function parsePath(path: string): Array<string | number> {
  return path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean)
    .map((segment) => (/^\d+$/.test(segment) ? Number(segment) : segment));
}

/** Returns a deep copy of `target` with `path` set to `value`. */
export function setPath(target: unknown, path: string, value: unknown): unknown {
  const draft = structuredClone(target) as Draft;
  const segments = parsePath(path);
  let cursor: Draft = draft;

  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index]!;
    const next = segments[index + 1]!;
    const current = cursor[segment];
    if (current == null || typeof current !== 'object') {
      cursor[segment] = typeof next === 'number' ? [] : {};
    }
    cursor = cursor[segment] as Draft;
  }

  const last = segments[segments.length - 1]!;
  cursor[last] = value;
  return draft;
}

/** Reads a value from a target using a `a.b[0].c` path. */
export function getPath(target: unknown, path: string): unknown {
  let cursor: unknown = target;
  for (const segment of parsePath(path)) {
    if (cursor == null || typeof cursor !== 'object') return undefined;
    cursor = (cursor as Draft)[segment as string | number];
  }
  return cursor;
}

// ── Ids and default instances ────────────────────────────────────────────────

let idCounter = 0;

/** Kebab-case unique id, valid for the DesignSpec schema. */
export function newId(prefix: string): string {
  idCounter += 1;
  const suffix = Math.random().toString(36).slice(2, 7);
  // 'buttonGroup' → 'button-group' (los ids deben ser kebab-case).
  const kebabPrefix = prefix
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9-]+/g, '-')
    .toLowerCase();
  return `${kebabPrefix}-${idCounter}-${suffix}`;
}

/** Creates a filled-in instance of any component type (for "add component"). */
export function createDefaultComponent(type: ComponentType): ComponentSpec {
  const id = newId(type);
  const base = { type, id } as Record<string, unknown>;

  const presets: Record<string, Record<string, unknown>> = {
    heading: { level: 2, text: 'Nuevo título' },
    text: { text: 'Escribe aquí el texto de esta sección.' },
    buttonGroup: {
      buttons: [{ id: newId('boton'), label: 'Acción', href: '#', variant: 'solid' }],
    },
    badge: { label: 'Nuevo' },
    image: { src: 'https://placehold.co/800x500', alt: 'Imagen' },
    featureCard: { title: 'Nueva característica', text: 'Describe el beneficio aquí.' },
    pricingCard: { planName: 'Plan', price: '19', features: ['Ventaja'] },
    testimonialCard: { quote: 'Una cita de ejemplo.', author: 'Autor' },
    stat: { value: '100', label: 'Etiqueta' },
    featureList: { items: [{ title: 'Elemento', text: 'Descripción' }] },
    faqList: { items: [{ question: '¿Pregunta?', answer: 'Respuesta.' }] },
    logoCloud: { logos: [{ src: 'https://placehold.co/120x40', alt: 'Logo' }] },
    carousel: { slides: [{ src: 'https://placehold.co/800x450', alt: 'Diapositiva' }] },
    divider: {},
    spacer: {},
  };

  return { ...base, ...presets[type] } as unknown as ComponentSpec;
}
