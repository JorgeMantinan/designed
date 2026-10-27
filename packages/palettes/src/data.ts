import type { PaletteColors } from './contrast';

/**
 * The palette catalog: 51 curated palettes of exactly 5 colors.
 *
 * Every entry is validated in tests against WCAG (level AA minimum) and
 * tagged by style + light/dark mode so the builder can filter them.
 */

export type PaletteTag =
  | 'corporativa'
  | 'calida'
  | 'fria'
  | 'vibrante'
  | 'natural'
  | 'elegante'
  | 'divertida'
  | 'tecnologica'
  | 'neutra'
  | 'clara'
  | 'oscura';

export interface Palette {
  /** Kebab-case unique id. */
  id: string;
  /** Display name shown in the builder (Spanish). */
  name: string;
  tags: PaletteTag[];
  colors: PaletteColors;
}

export const PALETTES: readonly Palette[] = [
  // ── Corporativas claras ───────────────────────────────────────────────
  {
    id: 'azul-corporativo',
    name: 'Azul corporativo',
    tags: ['corporativa', 'clara'],
    colors: {
      primary: '#1D4ED8',
      secondary: '#0EA5E9',
      accent: '#F59E0B',
      background: '#FFFFFF',
      surface: '#F1F5F9',
    },
  },
  {
    id: 'azul-confianza',
    name: 'Azul confianza',
    tags: ['corporativa', 'clara'],
    colors: {
      primary: '#2563EB',
      secondary: '#38BDF8',
      accent: '#F43F5E',
      background: '#F8FAFC',
      surface: '#FFFFFF',
    },
  },
  {
    id: 'azul-profundo',
    name: 'Azul profundo',
    tags: ['corporativa', 'clara'],
    colors: {
      primary: '#1E40AF',
      secondary: '#60A5FA',
      accent: '#FBBF24',
      background: '#EFF6FF',
      surface: '#FFFFFF',
    },
  },
  {
    id: 'gris-tecnico',
    name: 'Gris técnico',
    tags: ['corporativa', 'neutra', 'clara'],
    colors: {
      primary: '#334155',
      secondary: '#64748B',
      accent: '#0EA5E9',
      background: '#FFFFFF',
      surface: '#F8FAFC',
    },
  },
  {
    id: 'petroleo',
    name: 'Petróleo',
    tags: ['corporativa', 'fria', 'clara'],
    colors: {
      primary: '#0E7490',
      secondary: '#06B6D4',
      accent: '#FB923C',
      background: '#F0F9FF',
      surface: '#FFFFFF',
    },
  },
  {
    id: 'bordeos',
    name: 'Bordeos ejecutivo',
    tags: ['corporativa', 'calida', 'clara'],
    colors: {
      primary: '#9F1239',
      secondary: '#E11D48',
      accent: '#F59E0B',
      background: '#FFF1F2',
      surface: '#FFFFFF',
    },
  },

  // ── Cálidas claras ────────────────────────────────────────────────────
  {
    id: 'naranja-vibrante',
    name: 'Naranja vibrante',
    tags: ['calida', 'clara'],
    colors: {
      primary: '#C2410C',
      secondary: '#F97316',
      accent: '#FACC15',
      background: '#FFFBF5',
      surface: '#FFF1E6',
    },
  },
  {
    id: 'terracota',
    name: 'Terracota',
    tags: ['calida', 'natural', 'clara'],
    colors: {
      primary: '#B45309',
      secondary: '#F59E0B',
      accent: '#FB7185',
      background: '#FFFBF5',
      surface: '#FFF7ED',
    },
  },
  {
    id: 'rojo-pasion',
    name: 'Rojo pasión',
    tags: ['calida', 'vibrante', 'clara'],
    colors: {
      primary: '#B91C1C',
      secondary: '#EF4444',
      accent: '#FBBF24',
      background: '#FFF5F5',
      surface: '#FEF2F2',
    },
  },

  // ── Frías claras ──────────────────────────────────────────────────────
  {
    id: 'teal-claro',
    name: 'Teal claro',
    tags: ['fria', 'clara'],
    colors: {
      primary: '#0F766E',
      secondary: '#14B8A6',
      accent: '#3B82F6',
      background: '#F0FDFA',
      surface: '#FFFFFF',
    },
  },
  {
    id: 'esmeralda',
    name: 'Esmeralda',
    tags: ['fria', 'natural', 'clara'],
    colors: {
      primary: '#047857',
      secondary: '#10B981',
      accent: '#F59E0B',
      background: '#F0FDF4',
      surface: '#FFFFFF',
    },
  },
  {
    id: 'turquesa-playa',
    name: 'Turquesa playa',
    tags: ['fria', 'clara'],
    colors: {
      primary: '#0E7490',
      secondary: '#06B6D4',
      accent: '#F472B6',
      background: '#ECFEFF',
      surface: '#FFFFFF',
    },
  },

  // ── Vibrantes claras ──────────────────────────────────────────────────
  {
    id: 'violeta-electrico',
    name: 'Violeta eléctrico',
    tags: ['vibrante', 'clara'],
    colors: {
      primary: '#7C3AED',
      secondary: '#DB2777',
      accent: '#22D3EE',
      background: '#FFFFFF',
      surface: '#F5F3FF',
    },
  },
  {
    id: 'fucsia-neon',
    name: 'Fucsia neón',
    tags: ['vibrante', 'clara'],
    colors: {
      primary: '#BE185D',
      secondary: '#EC4899',
      accent: '#8B5CF6',
      background: '#FFF5F8',
      surface: '#FFFFFF',
    },
  },
  {
    id: 'morado-creativo',
    name: 'Morado creativo',
    tags: ['vibrante', 'clara'],
    colors: {
      primary: '#6D28D9',
      secondary: '#A855F7',
      accent: '#22D3EE',
      background: '#FAF5FF',
      surface: '#FFFFFF',
    },
  },

  // ── Naturales claras ──────────────────────────────────────────────────
  {
    id: 'oliva-suave',
    name: 'Oliva suave',
    tags: ['natural', 'clara'],
    colors: {
      primary: '#3F6212',
      secondary: '#65A30D',
      accent: '#CA8A04',
      background: '#FAFAF7',
      surface: '#F0F2EB',
    },
  },
  {
    id: 'musgo',
    name: 'Musgo',
    tags: ['natural', 'clara'],
    colors: {
      primary: '#166534',
      secondary: '#22C55E',
      accent: '#EA580C',
      background: '#F7FDF9',
      surface: '#ECFDF5',
    },
  },
  {
    id: 'arena',
    name: 'Arena',
    tags: ['natural', 'calida', 'clara'],
    colors: {
      primary: '#92400E',
      secondary: '#D97706',
      accent: '#0D9488',
      background: '#FFFBF5',
      surface: '#F5F0E6',
    },
  },

  // ── Elegantes claras ──────────────────────────────────────────────────
  {
    id: 'negro-dorado',
    name: 'Negro y dorado',
    tags: ['elegante', 'clara'],
    colors: {
      primary: '#171717',
      secondary: '#737373',
      accent: '#D97706',
      background: '#FFFFFF',
      surface: '#F7F7F5',
    },
  },
  {
    id: 'marfil-oro',
    name: 'Marfil y oro',
    tags: ['elegante', 'clara'],
    colors: {
      primary: '#713F12',
      secondary: '#A16207',
      accent: '#D97706',
      background: '#FFFDF7',
      surface: '#F7F3EA',
    },
  },
  {
    id: 'plomo-elegante',
    name: 'Plomo elegante',
    tags: ['elegante', 'neutra', 'clara'],
    colors: {
      primary: '#3F3F46',
      secondary: '#71717A',
      accent: '#E11D48',
      background: '#FAFAFA',
      surface: '#F4F4F5',
    },
  },

  // ── Divertidas claras ─────────────────────────────────────────────────
  {
    id: 'ambar-alegre',
    name: 'Ámbar alegre',
    tags: ['divertida', 'calida', 'clara'],
    colors: {
      primary: '#C2600F',
      secondary: '#F59E0B',
      accent: '#EC4899',
      background: '#FFFDF7',
      surface: '#FFF7ED',
    },
  },
  {
    id: 'coral-vida',
    name: 'Coral vida',
    tags: ['divertida', 'calida', 'clara'],
    colors: {
      primary: '#EA580C',
      secondary: '#F43F5E',
      accent: '#22D3EE',
      background: '#FFF7F5',
      surface: '#FFEDEA',
    },
  },
  {
    id: 'morado-juego',
    name: 'Morado juego',
    tags: ['divertida', 'vibrante', 'clara'],
    colors: {
      primary: '#9333EA',
      secondary: '#F472B6',
      accent: '#22D3EE',
      background: '#FAF5FF',
      surface: '#FFFFFF',
    },
  },

  // ── Tecnológicas claras ───────────────────────────────────────────────
  {
    id: 'cian-claro',
    name: 'Cian claro',
    tags: ['tecnologica', 'fria', 'clara'],
    colors: {
      primary: '#0891B2',
      secondary: '#06B6D4',
      accent: '#8B5CF6',
      background: '#ECFEFF',
      surface: '#FFFFFF',
    },
  },
  {
    id: 'indigo-ia',
    name: 'Índigo digital',
    tags: ['tecnologica', 'clara'],
    colors: {
      primary: '#4F46E5',
      secondary: '#7C3AED',
      accent: '#06B6D4',
      background: '#EEF2FF',
      surface: '#FFFFFF',
    },
  },
  {
    id: 'slate-digital',
    name: 'Slate digital',
    tags: ['tecnologica', 'corporativa', 'clara'],
    colors: {
      primary: '#0F172A',
      secondary: '#64748B',
      accent: '#22D3EE',
      background: '#FFFFFF',
      surface: '#F8FAFC',
    },
  },

  // ── Corporativas oscuras ──────────────────────────────────────────────
  {
    id: 'azul-oscuro',
    name: 'Azul oscuro',
    tags: ['corporativa', 'oscura'],
    colors: {
      primary: '#60A5FA',
      secondary: '#38BDF8',
      accent: '#FBBF24',
      background: '#0B1120',
      surface: '#111827',
    },
  },
  {
    id: 'navy-electrico',
    name: 'Navy eléctrico',
    tags: ['corporativa', 'tecnologica', 'oscura'],
    colors: {
      primary: '#3B82F6',
      secondary: '#22D3EE',
      accent: '#F472B6',
      background: '#0A0F1E',
      surface: '#131A2E',
    },
  },
  {
    id: 'azul-estudio',
    name: 'Azul estudio',
    tags: ['corporativa', 'oscura'],
    colors: {
      primary: '#818CF8',
      secondary: '#38BDF8',
      accent: '#34D399',
      background: '#0D1117',
      surface: '#161B22',
    },
  },

  // ── Cálidas oscuras ───────────────────────────────────────────────────
  {
    id: 'lava',
    name: 'Lava',
    tags: ['calida', 'vibrante', 'oscura'],
    colors: {
      primary: '#F87171',
      secondary: '#FB923C',
      accent: '#FACC15',
      background: '#1C0A0A',
      surface: '#2A1212',
    },
  },
  {
    id: 'ambar-noche',
    name: 'Ámbar noche',
    tags: ['calida', 'oscura'],
    colors: {
      primary: '#FBBF24',
      secondary: '#FB923C',
      accent: '#F472B6',
      background: '#1A1206',
      surface: '#26190A',
    },
  },
  {
    id: 'sunset-oscuro',
    name: 'Sunset oscuro',
    tags: ['calida', 'oscura'],
    colors: {
      primary: '#FB923C',
      secondary: '#F472B6',
      accent: '#FBBF24',
      background: '#1F0F0A',
      surface: '#2E1810',
    },
  },

  // ── Frías oscuras ─────────────────────────────────────────────────────
  {
    id: 'bosque-noche',
    name: 'Bosque noche',
    tags: ['fria', 'natural', 'oscura'],
    colors: {
      primary: '#34D399',
      secondary: '#22D3EE',
      accent: '#FBBF24',
      background: '#05201A',
      surface: '#0B2B23',
    },
  },
  {
    id: 'jade-profundo',
    name: 'Jade profundo',
    tags: ['fria', 'oscura'],
    colors: {
      primary: '#2DD4BF',
      secondary: '#60A5FA',
      accent: '#FB7185',
      background: '#071A17',
      surface: '#0E2622',
    },
  },
  {
    id: 'hielo',
    name: 'Hielo',
    tags: ['fria', 'oscura'],
    colors: {
      primary: '#7DD3FC',
      secondary: '#A5B4FC',
      accent: '#34D399',
      background: '#071522',
      surface: '#0E2133',
    },
  },

  // ── Vibrantes oscuras ─────────────────────────────────────────────────
  {
    id: 'violeta-noche',
    name: 'Violeta noche',
    tags: ['vibrante', 'oscura'],
    colors: {
      primary: '#A855F7',
      secondary: '#EC4899',
      accent: '#22D3EE',
      background: '#12081F',
      surface: '#1B1030',
    },
  },
  {
    id: 'neon-magenta',
    name: 'Neón magenta',
    tags: ['vibrante', 'oscura'],
    colors: {
      primary: '#F472B6',
      secondary: '#A78BFA',
      accent: '#34D399',
      background: '#1A0A1E',
      surface: '#27122B',
    },
  },
  {
    id: 'ultravioleta',
    name: 'Ultravioleta',
    tags: ['vibrante', 'tecnologica', 'oscura'],
    colors: {
      primary: '#818CF8',
      secondary: '#E879F9',
      accent: '#22D3EE',
      background: '#0B0A1F',
      surface: '#141230',
    },
  },

  // ── Naturales oscuras ─────────────────────────────────────────────────
  {
    id: 'selva',
    name: 'Selva',
    tags: ['natural', 'oscura'],
    colors: {
      primary: '#4ADE80',
      secondary: '#2DD4BF',
      accent: '#FBBF24',
      background: '#0A1A0F',
      surface: '#12261A',
    },
  },
  {
    id: 'tierra-noche',
    name: 'Tierra noche',
    tags: ['natural', 'calida', 'oscura'],
    colors: {
      primary: '#A3E635',
      secondary: '#FBBF24',
      accent: '#FB923C',
      background: '#14180C',
      surface: '#1F2514',
    },
  },
  {
    id: 'niebla-verde',
    name: 'Niebla verde',
    tags: ['natural', 'fria', 'oscura'],
    colors: {
      primary: '#86EFAC',
      secondary: '#67E8F9',
      accent: '#FDBA74',
      background: '#0C1512',
      surface: '#14211D',
    },
  },

  // ── Elegantes oscuras ─────────────────────────────────────────────────
  {
    id: 'onix',
    name: 'Ónix',
    tags: ['elegante', 'oscura'],
    colors: {
      primary: '#E5E5E5',
      secondary: '#A3A3A3',
      accent: '#F59E0B',
      background: '#0A0A0A',
      surface: '#171717',
    },
  },
  {
    id: 'champagne',
    name: 'Champagne',
    tags: ['elegante', 'oscura'],
    colors: {
      primary: '#EAB308',
      secondary: '#A16207',
      accent: '#EC4899',
      background: '#12100A',
      surface: '#1E1B12',
    },
  },
  {
    id: 'vino-noche',
    name: 'Vino noche',
    tags: ['elegante', 'calida', 'oscura'],
    colors: {
      primary: '#F43F5E',
      secondary: '#A855F7',
      accent: '#FBBF24',
      background: '#180A0E',
      surface: '#241016',
    },
  },

  // ── Divertidas oscuras ────────────────────────────────────────────────
  {
    id: 'chicle',
    name: 'Chicle',
    tags: ['divertida', 'vibrante', 'oscura'],
    colors: {
      primary: '#F472B6',
      secondary: '#A855F7',
      accent: '#FDE047',
      background: '#1A0F1F',
      surface: '#271730',
    },
  },
  {
    id: 'caramelo',
    name: 'Caramelo',
    tags: ['divertida', 'calida', 'oscura'],
    colors: {
      primary: '#FB923C',
      secondary: '#F472B6',
      accent: '#A3E635',
      background: '#1C1108',
      surface: '#2A1A0D',
    },
  },
  {
    id: 'arcoiris',
    name: 'Arcoíris',
    tags: ['divertida', 'oscura'],
    colors: {
      primary: '#60A5FA',
      secondary: '#F472B6',
      accent: '#FDE047',
      background: '#0C1024',
      surface: '#151B33',
    },
  },

  // ── Tecnológicas oscuras ──────────────────────────────────────────────
  {
    id: 'cian-noche',
    name: 'Cian noche',
    tags: ['tecnologica', 'oscura'],
    colors: {
      primary: '#22D3EE',
      secondary: '#818CF8',
      accent: '#F472B6',
      background: '#05070F',
      surface: '#0B1021',
    },
  },
  {
    id: 'cyber-noche',
    name: 'Cyber noche',
    tags: ['tecnologica', 'oscura'],
    colors: {
      primary: '#38BDF8',
      secondary: '#A78BFA',
      accent: '#34D399',
      background: '#060B18',
      surface: '#0E1526',
    },
  },
  {
    id: 'hacker-verde',
    name: 'Hacker verde',
    tags: ['tecnologica', 'natural', 'oscura'],
    colors: {
      primary: '#4ADE80',
      secondary: '#22D3EE',
      accent: '#FDE047',
      background: '#07130B',
      surface: '#0E2015',
    },
  },
];
