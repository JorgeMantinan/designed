import { z } from 'zod';

/**
 * Shared primitives used across the whole DesignSpec.
 *
 * Every rule here is a product decision expressed as code: what counts as a
 * valid color, URL, id, pixel value... The builder UI and the codegen both
 * trust this file as the single source of truth for validation.
 */

/** Kebab-case identifier, unique across the whole design spec. */
export const idSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9][a-z0-9-]*$/, 'must be kebab-case (a-z, 0-9 and -), e.g. "hero-title"');

/** Hex color: #RGB, #RRGGBB or #RRGGBBAA. */
export const hexColorSchema = z
  .string()
  .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, 'must be a hex color like #6C5CE7');

/** URL usable in `src`/`href`: http(s), relative path, data:image URI, mailto/tel or a fragment. */
export const cssUrlSchema = z
  .string()
  .min(1)
  .max(2048)
  .refine(
    (value) => /^(https?:\/\/|\/|\.\/|\.\.\/|data:image\/|mailto:|tel:|#)/.test(value),
    'must be an http(s) URL, a relative path, a data:image URI, mailto/tel or a fragment (#...)',
  );

/** Length in pixels (integer). */
export const pxSchema = z.number().int().min(0).max(1000);

/** Unit intensity between 0 and 1 (opacity-like). */
export const intensitySchema = z.number().min(0).max(1);

/** Percentage between 0 and 100. */
export const percentSchema = z.number().min(0).max(100);

/** Duration in milliseconds. */
export const durationMsSchema = z.number().int().min(0).max(10000);

/** Horizontal text alignment. */
export const alignSchema = z.enum(['left', 'center', 'right']);

/** Vertical alignment inside a grid cell. */
export const verticalAlignSchema = z.enum(['start', 'center', 'end']);

/** CSS timing function. */
export const easingSchema = z.enum(['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out']);

export type Id = z.infer<typeof idSchema>;
export type HexColor = z.infer<typeof hexColorSchema>;
export type Align = z.infer<typeof alignSchema>;
export type VerticalAlign = z.infer<typeof verticalAlignSchema>;
export type Easing = z.infer<typeof easingSchema>;
