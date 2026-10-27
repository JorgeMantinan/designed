/**
 * Catálogo de paletas de 5 colores con validación de contraste WCAG.
 *
 * Cada paleta define 5 roles semánticos y se valida automáticamente para
 * garantizar legibilidad AA/AAA antes de ofrecerla en el builder.
 */

/** Roles semánticos de una paleta de 5 colores. */
export const PALETTE_ROLES = [
  'primary', // Color principal: botones, enlaces, acentos
  'secondary', // Color secundario: apoyos, badges
  'accent', // Acento vivo: highlights, hover states
  'background', // Fondo de página
  'surface', // Fondo de tarjetas, paneles y secciones
] as const;

export type PaletteRole = (typeof PALETTE_ROLES)[number];

/** Número de colores por paleta (decisión de producto: 5). */
export const PALETTE_SIZE = PALETTE_ROLES.length;
