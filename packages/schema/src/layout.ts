import { z } from 'zod';

import { animationSchema } from './animation';
import { backgroundSchema } from './background';
import { componentSchema } from './components';
import { idSchema, pxSchema, verticalAlignSchema } from './common';

/**
 * Layout tree: sections → rows → columns → components.
 *
 * This structure is what enables the flagship templates:
 *  - "4 rows × 2 columns" = a section with 4 rows, each with 2 columns
 *  - "1 column × 3 rows"  = a section with 3 rows of 1 column
 * Columns use a 12-unit span grid so6/6, 4/4/4, 3×4... all express cleanly.
 */

/** Semantic section kind: drives the renderer, defaults and template gallery. */
export const SECTION_KINDS = [
  'hero',
  'features',
  'pricing',
  'testimonials',
  'faq',
  'cta',
  'logos',
  'stats',
  'carousel',
  'gallery',
  'team',
  'blog',
  'contact',
  'generic',
] as const;

export const columnSchema = z.object({
  id: idSchema,
  /** Width in a 12-unit grid: 6 = half, 4 = third, 12 = full. */
  span: z.number().int().min(1).max(12).default(6),
  components: z.array(componentSchema).min(1).max(30),
  /** Hide this column entirely on smaller breakpoints. */
  hideOn: z.array(z.enum(['tablet', 'mobile'])).default([]),
  verticalAlign: verticalAlignSchema.default('start'),
});

export const rowSchema = z.object({
  id: idSchema,
  columns: z.array(columnSchema).min(1).max(6),
  /** Gap between columns (px). Falls back to theme spacing when omitted. */
  gapPx: pxSchema.optional(),
  /** Breakpoint below which columns stack vertically. */
  stackBelow: z.enum(['never', 'tablet', 'mobile']).default('mobile'),
});

export const sectionPaddingSchema = z.object({
  /** Vertical padding override (px). */
  topBottomPx: pxSchema.max(300).optional(),
  /** Horizontal padding override (px). */
  leftRightPx: pxSchema.max(300).optional(),
});

export const sectionSchema = z.object({
  id: idSchema,
  kind: z.enum(SECTION_KINDS).default('generic'),
  rows: z.array(rowSchema).min(1).max(12),
  /** Defaults to the page background when omitted. */
  background: backgroundSchema.optional(),
  padding: sectionPaddingSchema.optional(),
  /** `full` removes the max-width container (full-bleed heroes, carousels...). */
  width: z.enum(['contained', 'full']).default('contained'),
  /** Entrance animation applied to the whole section. */
  animation: animationSchema.optional(),
});

export type SectionKind = (typeof SECTION_KINDS)[number];
export type ColumnSpec = z.infer<typeof columnSchema>;
export type RowSpec = z.infer<typeof rowSchema>;
export type SectionPadding = z.infer<typeof sectionPaddingSchema>;
export type SectionSpec = z.infer<typeof sectionSchema>;
