import { z } from 'zod';

import { cssUrlSchema, hexColorSchema, intensitySchema, percentSchema } from './common';
import { imageOverlaySchema } from './overlay';

/**
 * Section backgrounds: flat color, gradient, image (with overlay) or
 * interactive effect that reacts to the mouse (spotlight, gradient mesh,
 * particles, blobs...).
 */

export const gradientStopSchema = z.object({
  color: hexColorSchema,
  /** Position along the gradient (0-100). Omit to distribute evenly. */
  position: percentSchema.optional(),
});

export const gradientSchema = z.object({
  type: z.enum(['linear', 'radial', 'conic']).default('linear'),
  /** Angle in degrees for linear gradients. */
  angle: z.number().min(0).max(360).default(135),
  stops: z.array(gradientStopSchema).min(2).max(6),
});

/**
 * Interactive backgrounds that react to pointer movement.
 * The12 effects that render correctly in the builder (canvas-driven ones
 * plus pointer/SVG/CSS layers that have been visually verified).
 */
export const INTERACTIVE_BACKGROUND_EFFECTS = [
  'spotlight',
  'particles',
  'dots',
  'waves',
  'retro-grid',
  'ripples',
  'rain',
  'constellation',
  'grid-glow',
  'matrix',
  'confetti',
  'snow',
  'aurora-curtains',
  'fire',
  'sparks',
  'shooting-stars',
  'equalizer',
  'shapes',
] as const;

export const backgroundSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('color'),
    color: hexColorSchema,
  }),
  z.object({
    type: z.literal('gradient'),
    gradient: gradientSchema,
  }),
  z.object({
    type: z.literal('image'),
    src: cssUrlSchema,
    overlay: imageOverlaySchema.optional(),
    size: z.enum(['cover', 'contain']).default('cover'),
    position: z.string().min(1).max(64).default('center'),
    /** Parallax-style fixed attachment. */
    fixed: z.boolean().default(false),
  }),
  z.object({
    type: z.literal('interactive'),
    effect: z.enum(INTERACTIVE_BACKGROUND_EFFECTS),
    /** Fallback color painted behind the effect. */
    baseColor: hexColorSchema.optional(),
    /** Color of the light/particles/dots. Defaults to the palette accent at render time. */
    effectColor: hexColorSchema.optional(),
    /** Strength of the effect (0-1). */
    intensity: intensitySchema.default(0.5),
    /** Speed of the ambient motion (0-1). */
    speed: z.number().min(0).max(1).default(0.5),
  }),
]);

export type BackgroundSpec = z.infer<typeof backgroundSchema>;
export type GradientSpec = z.infer<typeof gradientSchema>;
export type InteractiveBackgroundEffect = (typeof INTERACTIVE_BACKGROUND_EFFECTS)[number];
/** The interactive member of the background union (effect layer config). */
export type InteractiveBackgroundSpec = Extract<BackgroundSpec, { type: 'interactive' }>;
