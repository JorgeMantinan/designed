import { isDarkColor, validatePaletteColors } from './contrast';
import type { PaletteContrastReport } from './contrast';
import { PALETTES } from './data';
import type { Palette, PaletteTag } from './data';

export type { Palette, PaletteTag } from './data';
export { PALETTES } from './data';

/** All tags used in the catalog, sorted, for building filter UIs. */
export const PALETTE_TAGS: readonly PaletteTag[] = [
  'calida',
  'clara',
  'corporativa',
  'divertida',
  'elegante',
  'fria',
  'metalizado',
  'natural',
  'neon',
  'neutra',
  'oscura',
  'pastel',
  'tecnologica',
  'vibrante',
];

/** Looks up a palette by id. */
export function getPalette(id: string): Palette | undefined {
  return PALETTES.find((palette) => palette.id === id);
}

/** All palettes carrying a given tag (style or light/dark mode). */
export function palettesByTag(tag: PaletteTag): Palette[] {
  return PALETTES.filter((palette) => palette.tags.includes(tag));
}

/** 'dark' when the page background reads as dark, 'light' otherwise. */
export function paletteMode(palette: Palette): 'light' | 'dark' {
  return isDarkColor(palette.colors.background) ? 'dark' : 'light';
}

export interface PaletteReport extends PaletteContrastReport {
  paletteId: string;
}

/** Full WCAG report for a catalog palette (7 checks). */
export function validatePalette(palette: Palette): PaletteReport {
  return { paletteId: palette.id, ...validatePaletteColors(palette.colors) };
}
