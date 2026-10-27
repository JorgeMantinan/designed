import { bestTextColor, contrastRatio, deriveTextColors } from '@designed/palettes';
import type { PaletteSpec, ThemeSpec } from '@designed/schema';
import { themeSchema } from '@designed/schema';

/**
 * Token pipeline: ThemeSpec → flat map of design tokens.
 *
 * The flat map is the single source for the three emitters (CSS variables,
 * SCSS partials, TS constants) so they can never drift apart.
 *
 * NOTE: "tokens" are design variables (colors, spacing, shadows...), not AI.
 *
 * Why not Style Dictionary? SD targets static token files compiled at build
 * time, while these tokens are generated per design at runtime (the user
 * changes a color and the preview updates instantly). A small typed emitter
 * covers the same output formats with zero async config; if a static
 * pipeline is ever needed, SD can consume `flattenTokens()` as its source.
 */

/** Max width of the contained layout (px). */
export const CONTAINER_MAX_WIDTH = '1200px';

const SCALE_FACTORS = {
  compact: 0.9,
  normal: 1,
  large: 1.125,
} as const;

/** Type size multipliers over the base font size. */
const SIZE_MULTIPLIERS = {
  display: 3.5,
  h1: 2.5,
  h2: 2,
  h3: 1.5,
  h4: 1.25,
  base: 1,
  small: 0.875,
} as const;

export type TextSizeName = keyof typeof SIZE_MULTIPLIERS;
export type TypeScale = keyof typeof SCALE_FACTORS;

/** Partial token overrides; missing fields fall back to schema defaults. */
export interface ThemeOverrides {
  typography?: Partial<ThemeSpec['typography']>;
  spacing?: Partial<ThemeSpec['spacing']>;
  radius?: Partial<ThemeSpec['radius']>;
  shadow?: Partial<ThemeSpec['shadow']>;
}

/** Builds a full theme from a palette, filling all token defaults. */
export function createTheme(palette: PaletteSpec, overrides: ThemeOverrides = {}): ThemeSpec {
  return themeSchema.parse({ palette, ...overrides });
}

function toRem(px: number, factor: number): string {
  const value = Math.round((px / 16) * factor * 1000) / 1000;
  return `${value}rem`;
}

/**
 * Flattens a theme into CSS custom-property names (without the `--` prefix)
 * mapped to their values. Example: `'color-primary' → '#6C5CE7'`.
 *
 * Text colors are resolved here: explicit palette overrides win, otherwise
 * they are derived from the background with WCAG-aware contrast.
 */
export function flattenTokens(theme: ThemeSpec): Record<string, string> {
  const { palette, typography, spacing, radius, shadow } = theme;
  const derived = deriveTextColors(palette.background);
  const factor = SCALE_FACTORS[typography.scale];
  const base = typography.baseFontSizePx;

  const textTokens: Record<string, string> = {};
  for (const [name, multiplier] of Object.entries(SIZE_MULTIPLIERS)) {
    textTokens[`text-${name}`] = toRem(base * multiplier, factor);
  }

  return {
    'color-primary': palette.primary,
    'color-secondary': palette.secondary,
    'color-accent': palette.accent,
    'color-background': palette.background,
    'color-surface': palette.surface,
    'color-text': palette.text ?? derived.text,
    'color-text-muted': palette.textMuted ?? derived.textMuted,
    // Guaranteed-readable label color ON the primary color (WCAG by construction).
    'color-on-primary': bestTextColor(palette.primary),
    // Primary color for text/links only when it is legible on the page
    // background (AA), otherwise falls back to the regular text color.
    'color-primary-text':
      contrastRatio(palette.primary, palette.background) >= 4.5
        ? palette.primary
        : (palette.text ?? derived.text),
    'font-heading': typography.headingFont,
    'font-body': typography.bodyFont,
    'weight-heading': String(typography.headingWeight),
    'weight-body': String(typography.bodyWeight),
    ...textTokens,
    'space-xs': `${spacing.xs}px`,
    'space-sm': `${spacing.sm}px`,
    'space-md': `${spacing.md}px`,
    'space-lg': `${spacing.lg}px`,
    'space-xl': `${spacing.xl}px`,
    'space-xxl': `${spacing.xxl}px`,
    'space-section-y': `${spacing.sectionYPx}px`,
    'space-section-x': `${spacing.sectionXPx}px`,
    'radius-sm': `${radius.sm}px`,
    'radius-md': `${radius.md}px`,
    'radius-lg': `${radius.lg}px`,
    'radius-pill': `${radius.pill}px`,
    'shadow-sm': shadow.sm,
    'shadow-md': shadow.md,
    'shadow-lg': shadow.lg,
    'container-max': CONTAINER_MAX_WIDTH,
  };
}
