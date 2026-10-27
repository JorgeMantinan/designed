/**
 * @designed/animations — motion engine: entrance + hover slots for every
 * component, plus (in the next phase) interactive backgrounds and the
 * animation catalog for the picker UI.
 *
 * Load the global styles once per app:
 *   import '@designed/animations/styles.css';
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

export * from './motion';
