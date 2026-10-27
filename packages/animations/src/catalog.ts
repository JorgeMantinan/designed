import { ENTRANCE_ANIMATION_TYPES, HOVER_ANIMATION_TYPES } from '@designed/schema';
import type { InteractiveBackgroundEffect } from '@designed/schema';

/**
 * Animation catalog: human-readable metadata for the builder's picker UI.
 *
 * Every entrance/hover type of the schema and every interactive background
 * effect has exactly one entry here (enforced by tests), with the Spanish
 * label and description shown to the user.
 */

export type CatalogFamily = 'entrance' | 'hover';

export interface AnimationCatalogEntry {
  /** Matches the schema enum value (e.g. 'slide-up'). */
  id: string;
  family: CatalogFamily;
  /** Display name (Spanish). */
  name: string;
  /** One-line explanation shown under the preview. */
  description: string;
}

export const ANIMATION_CATALOG: readonly AnimationCatalogEntry[] = [
  // ── Entradas ───────────────────────────────────────────────────────────────
  {
    id: 'fade-in',
    family: 'entrance',
    name: 'Aparecer',
    description: 'El contenido surge con opacidad.',
  },
  {
    id: 'slide-up',
    family: 'entrance',
    name: 'Deslizar hacia arriba',
    description: 'Entra desde abajo con fundido.',
  },
  {
    id: 'slide-down',
    family: 'entrance',
    name: 'Deslizar hacia abajo',
    description: 'Entra desde arriba con fundido.',
  },
  {
    id: 'slide-left',
    family: 'entrance',
    name: 'Deslizar desde la izquierda',
    description: 'Entra deslizándose desde la izquierda.',
  },
  {
    id: 'slide-right',
    family: 'entrance',
    name: 'Deslizar desde la derecha',
    description: 'Entra deslizándose desde la derecha.',
  },
  {
    id: 'zoom-in',
    family: 'entrance',
    name: 'Zoom de entrada',
    description: 'Crece desde un tamaño ligeramente menor.',
  },
  {
    id: 'blur-in',
    family: 'entrance',
    name: 'Enfoque progresivo',
    description: 'Pasa de desenfocado a nítido.',
  },
  {
    id: 'reveal-up',
    family: 'entrance',
    name: 'Cortina ascendente',
    description: 'Se descubre como una cortina hacia arriba.',
  },

  // ── Hover ──────────────────────────────────────────────────────────────────
  {
    id: 'none',
    family: 'hover',
    name: 'Sin efecto',
    description: 'Sin animación al pasar el ratón.',
  },
  { id: 'lift', family: 'hover', name: 'Elevación', description: 'La pieza se eleva ligeramente.' },
  { id: 'scale', family: 'hover', name: 'Escala', description: 'Crece de tamaño de forma sutil.' },
  {
    id: 'glow',
    family: 'hover',
    name: 'Resplandor',
    description: 'Emite un halo con el color primario.',
  },
  {
    id: 'tilt',
    family: 'hover',
    name: 'Inclinación 3D',
    description: 'Se inclina en perspectiva.',
  },
  {
    id: 'shine',
    family: 'hover',
    name: 'Destello',
    description: 'Un destello cruza la superficie.',
  },
  {
    id: 'underline',
    family: 'hover',
    name: 'Subrayado creciente',
    description: 'El subrayado crece de izquierda a derecha.',
  },
  {
    id: 'border-draw',
    family: 'hover',
    name: 'Borde de acento',
    description: 'Aparece un contorno con el color de acento.',
  },
];

export interface BackgroundEffectEntry {
  id: InteractiveBackgroundEffect;
  /** Display name (Spanish). */
  name: string;
  /** One-line explanation. */
  description: string;
  /** True when the effect reacts to the pointer position. */
  tracksPointer: boolean;
}

/** The12 interactive backgrounds offered in the builder. */
export const BACKGROUND_EFFECTS: readonly BackgroundEffectEntry[] = [
  {
    id: 'spotlight',
    name: 'Spotlight',
    description: 'Luz suave que sigue al ratón.',
    tracksPointer: true,
  },
  {
    id: 'gradient-mesh',
    name: 'Malla de gradiente',
    description: 'Degradados animados en deriva lenta.',
    tracksPointer: false,
  },
  {
    id: 'particles',
    name: 'Partículas',
    description: 'Puntos flotantes ligeros en canvas.',
    tracksPointer: false,
  },
  {
    id: 'blobs',
    name: 'Blobs orgánicos',
    description: 'Formas blandas que se transforman.',
    tracksPointer: false,
  },
  {
    id: 'dots',
    name: 'Rejilla de puntos',
    description: 'Puntos revelados bajo el ratón.',
    tracksPointer: true,
  },
  {
    id: 'noise',
    name: 'Grano',
    description: 'Textura de ruido sutil estilo película.',
    tracksPointer: false,
  },
  {
    id: 'waves',
    name: 'Ondas',
    description: 'Ondas SVG en movimiento perpetuo.',
    tracksPointer: false,
  },
  {
    id: 'aurora',
    name: 'Aurora boreal',
    description: 'Cintas de luz desenfocadas ondeando por el cielo.',
    tracksPointer: false,
  },
  {
    id: 'starfield',
    name: 'Cielo estrellado',
    description: 'Estrellas que titilan y una estrella fugaz de vez en cuando.',
    tracksPointer: false,
  },
  {
    id: 'retro-grid',
    name: 'Cuadrícula retro',
    description: 'Rejilla synthwave en perspectiva que avanza hacia ti.',
    tracksPointer: false,
  },
  {
    id: 'ripples',
    name: 'Ondas expansivas',
    description: 'Anillos que se expanden desde donde mueves el ratón.',
    tracksPointer: true,
  },
  {
    id: 'rain',
    name: 'Lluvia',
    description: 'Gotas cayendo en diagonal a dos profundidades.',
    tracksPointer: false,
  },
];

/** Catalog entries for one family (entrance | hover). */
export function animationsByFamily(family: CatalogFamily): AnimationCatalogEntry[] {
  return ANIMATION_CATALOG.filter((entry) => entry.family === family);
}

/** Looks up one animation entry by its schema id. */
export function getAnimation(id: string): AnimationCatalogEntry | undefined {
  return ANIMATION_CATALOG.find((entry) => entry.id === id);
}

/** Looks up one interactive background effect by id. */
export function getBackgroundEffect(id: string): BackgroundEffectEntry | undefined {
  return BACKGROUND_EFFECTS.find((entry) => entry.id === id);
}

/** Every entrance type declared by the schema (for consistency tests). */
export const SCHEMA_ENTRANCE_TYPES: readonly string[] = ENTRANCE_ANIMATION_TYPES;
/** Every hover type declared by the schema (for consistency tests). */
export const SCHEMA_HOVER_TYPES: readonly string[] = HOVER_ANIMATION_TYPES;
