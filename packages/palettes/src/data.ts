import type { PaletteColors } from './contrast';

/**
 * The palette catalog:51 curated palettes of exactly5 colors.
 *
 * Backgrounds and surfaces are deliberately TINTED with the palette's own
 * hue (not plain white/black) so choosing a palette visibly changes the
 * mood of the page. Every entry is validated in tests against WCAG
 * (level AA minimum) and tagged by style + light/dark mode.
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
      background: '#EFF6FF',
      surface: '#DBEAFE',
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
      background: '#F0F9FF',
      surface: '#E0F2FE',
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
      background: '#EEF2FF',
      surface: '#E0E7FF',
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
      background: '#F8FAFC',
      surface: '#FFFFFF',
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
      surface: '#E0F2FE',
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
      background: '#FFF0F4',
      surface: '#FFE4E6',
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
      background: '#FFF7ED',
      surface: '#FFEDD5',
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
      background: '#FFF4E6',
      surface: '#FFEAD5',
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
      background: '#FEF2F2',
      surface: '#FEE2E2',
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
      surface: '#CCFBF1',
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
      surface: '#DCFCE7',
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
      surface: '#CFFAFE',
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
      background: '#FAF5FF',
      surface: '#F3E8FF',
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
      background: '#FDF2F8',
      surface: '#FCE7F3',
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
      background: '#F3E8FF',
      surface: '#E9D5FF',
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
      background: '#F7FEE7',
      surface: '#ECFCCB',
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
      background: '#EFFDF5',
      surface: '#D1FAE5',
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
      background: '#FFF8ED',
      surface: '#FEF3C7',
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
      background: '#FFFBEB',
      surface: '#FEF3C7',
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
      background: '#FFFBEB',
      surface: '#FEF3C7',
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
      background: '#FFF4EF',
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
      background: '#FDF4FF',
      surface: '#FAE8FF',
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
      background: '#F0FFFB',
      surface: '#CFFAFE',
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
      background: '#F0F3FF',
      surface: '#C7D2FE',
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
      background: '#0B1B3A',
      surface: '#12274F',
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
      background: '#0A1633',
      surface: '#12224B',
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
      background: '#101A33',
      surface: '#1A2748',
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
      background: '#2E0C0C',
      surface: '#451515',
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
      background: '#2B1C05',
      surface: '#402C0B',
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
      background: '#33150B',
      surface: '#4A2312',
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
      background: '#04321F',
      surface: '#0A4A2F',
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
      background: '#053A35',
      surface: '#0B5049',
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
      background: '#0C2748',
      surface: '#14355C',
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
      background: '#22103F',
      surface: '#331B5C',
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
      background: '#330F2E',
      surface: '#4A1B43',
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
      background: '#171445',
      surface: '#221D66',
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
      background: '#07381B',
      surface: '#0C4A26',
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
      background: '#23300A',
      surface: '#334512',
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
      background: '#0C3A2C',
      surface: '#134D3B',
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
      background: '#2B2410',
      surface: '#3E351A',
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
      background: '#300D16',
      surface: '#481724',
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
      background: '#30113A',
      surface: '#461E54',
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
      background: '#331C08',
      surface: '#4A2B0F',
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
      background: '#141C4A',
      surface: '#1F2A66',
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
      background: '#063442',
      surface: '#0B4A5E',
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
      background: '#072240',
      surface: '#0E3159',
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
      background: '#063D1A',
      surface: '#0B5224',
    },
  },
];
