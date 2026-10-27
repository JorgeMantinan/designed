/**
 * Design tokens: variables centralizadas del diseño (colores, espaciados,
 * radios, sombras, gradientes, tipografía).
 *
 * NOTA: "tokens" aquí NO significa IA. Son las variables de diseño al estilo
 * Material/Shopify/Figma, que se compilan a SCSS + CSS custom properties.
 */

/** Categorías de tokens que soporta el sistema. */
export const TOKEN_CATEGORIES = [
  'color',
  'typography',
  'spacing',
  'radius',
  'shadow',
  'gradient',
  'motion',
  'zIndex',
] as const;

export type TokenCategory = (typeof TOKEN_CATEGORIES)[number];
