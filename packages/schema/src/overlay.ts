import { z } from 'zod';

import { hexColorSchema, intensitySchema } from './common';

/**
 * Image overlays: the shading layer applied over photos, carousels and image
 * backgrounds (lateral, diagonal, vertical...), as requested by the product.
 *
 * Rendered as a CSS gradient/blend layer on top of the image; intensity maps
 * to the alpha of the gradient stops.
 */

/** Direction of the shading. `center` is used by radial/vignette overlays. */
export const OVERLAY_DIRECTIONS = [
  'to-right',
  'to-left',
  'to-bottom',
  'to-top',
  'to-bottom-right',
  'to-bottom-left',
  'to-top-right',
  'to-top-left',
  'center',
] as const;

export const imageOverlaySchema = z.object({
  /** `gradient` = directional shading, `duotone` = two-color tint, `vignette` = dark edges. */
  type: z.enum(['gradient', 'duotone', 'vignette']).default('gradient'),
  direction: z.enum(OVERLAY_DIRECTIONS).default('to-right'),
  /** Main shading color (usually black or white). */
  color: hexColorSchema.default('#000000'),
  /** Second color for duotones / gradient end. When omitted, `color` fades to transparent. */
  colorTo: hexColorSchema.optional(),
  /** 0 = no shading, 1 = full shading. */
  intensity: intensitySchema.default(0.5),
});

export type ImageOverlaySpec = z.infer<typeof imageOverlaySchema>;
export type OverlayDirection = (typeof OVERLAY_DIRECTIONS)[number];
export type OverlayType = z.infer<typeof imageOverlaySchema>['type'];
/** Partial-friendly input variant for hand-built overlays. */
export type ImageOverlayInput = z.input<typeof imageOverlaySchema>;
