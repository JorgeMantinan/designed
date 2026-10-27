/**
 * Catálogo de animaciones: transiciones de botones, menús, entradas de
 * sección, estados hover y fondos interactivos (spotlight, malla de gradiente,
 * partículas, parallax...).
 *
 * Se divide en dos familias:
 *  - CSS: keyframes + clases exportadas al proyecto del cliente (portables).
 *  - JS: hooks React con Motion/canvas para efectos interactivos.
 */

/** Familias de animación del catálogo. */
export const ANIMATION_FAMILIES = [
  'entrance', // Al aparecer en pantalla (fade, slide, zoom, reveal...)
  'hover', // Al pasar el ratón (botones, menús, cards)
  'background', // Fondos interactivos (spotlight, malla, blobs, partículas)
  'scroll', // Ligadas al scroll (parallax, sticky reveals)
  'ambient', // Continuas de ambiente (marquee, float, pulse)
] as const;

export type AnimationFamily = (typeof ANIMATION_FAMILIES)[number];
