/**
 * @designed/tokens — design tokens pipeline: ThemeSpec → CSS variables,
 * SCSS partial and TS constants.
 *
 * NOTE: "tokens" here does NOT mean AI. These are design variables
 * (colors, typography, spacing, radii, shadows) in the Material/Shopify/Figma
 * sense, centralized so a single change restyles the whole exported website.
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

export * from './build';
export * from './css';
export * from './scss';
export * from './ts';
