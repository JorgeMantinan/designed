/**
 * @designed/palettes — catalog of 5-color palettes + WCAG contrast engine.
 *
 * Every palette is validated in tests (level AA minimum) so the builder can
 * offer an accessibility semaphore next to each swatch.
 */

// Roles of a 5-color palette (product decision).
export const PALETTE_ROLES = [
  'primary', // Color principal: botones, enlaces, acentos
  'secondary', // Color secundario: apoyos, badges
  'accent', // Acento vivo: highlights, hover states
  'background', // Fondo de página
  'surface', // Fondo de tarjetas, paneles y secciones
] as const;

export type PaletteRole = (typeof PALETTE_ROLES)[number];

/** Number of colors per palette. */
export const PALETTE_SIZE = PALETTE_ROLES.length;

export * from './contrast';
export * from './catalog';
