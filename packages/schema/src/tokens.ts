import { z } from 'zod';

import { hexColorSchema, pxSchema } from './common';

/**
 * Design tokens: centralized design variables (colors, typography, spacing,
 * radii, shadows).
 *
 * NOTE: "tokens" here does NOT mean AI. These are design variables in the
 * Material/Shopify/Figma sense, compiled to SCSS + CSS custom properties so a
 * single token change restyles the whole exported website.
 */

/**
 * Palette of 5 colors — the product decision: every palette has exactly these
 * roles. Text colors are optional overrides; when absent, the palette package
 * derives them from `background` with WCAG-aware contrast.
 */
export const paletteSchema = z.object({
  /** Buttons, links, accents. */
  primary: hexColorSchema,
  /** Secondary supports, badges. */
  secondary: hexColorSchema,
  /** Vivid accent: highlights, hover states. */
  accent: hexColorSchema,
  /** Page background. */
  background: hexColorSchema,
  /** Cards, panels, alternate sections. */
  surface: hexColorSchema,
  /** Body text override. Derived from `background` when omitted. */
  text: hexColorSchema.optional(),
  /** Muted text override. Derived from `background` when omitted. */
  textMuted: hexColorSchema.optional(),
});

const FONT_STACK = "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export const typographySchema = z.object({
  headingFont: z.string().min(1).max(300).default(FONT_STACK),
  bodyFont: z.string().min(1).max(300).default(FONT_STACK),
  baseFontSizePx: z.number().int().min(12).max(32).default(16),
  headingWeight: z.number().int().min(100).max(900).default(700),
  bodyWeight: z.number().int().min(100).max(900).default(400),
  scale: z.enum(['compact', 'normal', 'large']).default('normal'),
});

export const spacingSchema = z.object({
  xs: pxSchema.default(4),
  sm: pxSchema.default(8),
  md: pxSchema.default(16),
  lg: pxSchema.default(24),
  xl: pxSchema.default(40),
  xxl: pxSchema.default(64),
  /** Default vertical padding of sections. */
  sectionYPx: pxSchema.default(64),
  /** Default horizontal padding of sections. */
  sectionXPx: pxSchema.default(16),
});

export const radiusSchema = z.object({
  sm: pxSchema.default(4),
  md: pxSchema.default(8),
  lg: pxSchema.default(16),
  /** Rounded pill (999px reads as a full radius for any box size). */
  pill: pxSchema.default(999),
});

export const shadowSchema = z.object({
  sm: z.string().min(1).max(200).default('0 1px 2px rgb(0 0 0 / 0.08)'),
  md: z.string().min(1).max(200).default('0 4px 12px rgb(0 0 0 / 0.10)'),
  lg: z.string().min(1).max(200).default('0 12px 32px rgb(0 0 0 / 0.14)'),
});

export const DEFAULT_TYPOGRAPHY = {
  headingFont: FONT_STACK,
  bodyFont: FONT_STACK,
  baseFontSizePx: 16,
  headingWeight: 700,
  bodyWeight: 400,
  scale: 'normal',
} as const satisfies z.input<typeof typographySchema>;

export const DEFAULT_SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  xxl: 64,
  sectionYPx: 64,
  sectionXPx: 16,
} as const satisfies z.input<typeof spacingSchema>;

export const DEFAULT_RADIUS = {
  sm: 4,
  md: 8,
  lg: 16,
  pill: 999,
} as const satisfies z.input<typeof radiusSchema>;

export const DEFAULT_SHADOW = {
  sm: '0 1px 2px rgb(0 0 0 / 0.08)',
  md: '0 4px 12px rgb(0 0 0 / 0.10)',
  lg: '0 12px 32px rgb(0 0 0 / 0.14)',
} as const satisfies z.input<typeof shadowSchema>;

/** Global theme of a design. Only `palette` is mandatory. */
export const themeSchema = z.object({
  palette: paletteSchema,
  typography: typographySchema.default({ ...DEFAULT_TYPOGRAPHY }),
  spacing: spacingSchema.default({ ...DEFAULT_SPACING }),
  radius: radiusSchema.default({ ...DEFAULT_RADIUS }),
  shadow: shadowSchema.default({ ...DEFAULT_SHADOW }),
});

export type PaletteSpec = z.infer<typeof paletteSchema>;
export type TypographySpec = z.infer<typeof typographySchema>;
export type SpacingSpec = z.infer<typeof spacingSchema>;
export type RadiusSpec = z.infer<typeof radiusSchema>;
export type ShadowSpec = z.infer<typeof shadowSchema>;
export type ThemeSpec = z.infer<typeof themeSchema>;
