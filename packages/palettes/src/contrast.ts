/**
 * WCAG contrast utilities.
 *
 * Everything the palette catalog needs to guarantee accessibility: relative
 * luminance, contrast ratio, AA/AAA levels, text-color derivation and the
 * full validation report for a palette of 5 colors.
 */

// Pure black/white are required for the readability math: with them, the
// threshold below guarantees ≥ 4.5:1 for whichever side is chosen.
const DARK_TEXT = '#000000';
const LIGHT_TEXT = '#FFFFFF';

/**
 * Luminance threshold where black and white text are equally legible.
 * Below → light text, above → dark text (WCAG crossing point ≈ 0.179).
 */
export const READABILITY_THRESHOLD = 0.179;

export type RgbTuple = [number, number, number];

/** Parses #RGB, #RRGGBB or #RRGGBBAA (alpha ignored) into an RGB tuple. */
export function hexToRgb(hex: string): RgbTuple {
  const raw = hex.replace('#', '');
  if (!/^(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(raw)) {
    throw new Error(`Color hex no válido: "${hex}"`);
  }
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((char) => char + char)
          .join('')
      : raw;
  const value = Number.parseInt(full.slice(0, 6), 16);
  if (Number.isNaN(value)) {
    throw new Error(`Color hex no válido: "${hex}"`);
  }
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
}

function channelLuminance(channel: number): number {
  const s = channel / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance (0 = black, 1 = white). */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

/** WCAG contrast ratio between two colors (1 = identical, 21 = black vs white). */
export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

export type WcagLevel = 'AAA' | 'AA' | 'AA-large' | 'fail';

/**
 * Classifies a contrast ratio.
 * - Normal text: AAA ≥ 7, AA ≥ 4.5, AA-large (usable only for big text) ≥ 3
 * - Large text (≥ 24px / 19px bold): AAA ≥ 4.5, AA ≥ 3
 */
export function wcagLevel(ratio: number, large = false): WcagLevel {
  if (large) {
    if (ratio >= 4.5) return 'AAA';
    if (ratio >= 3) return 'AA';
    return 'fail';
  }
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA-large';
  return 'fail';
}

/** True when a color reads as dark (below the readability threshold). */
export function isDarkColor(hex: string): boolean {
  return relativeLuminance(hex) < READABILITY_THRESHOLD;
}

/** Most legible text color for a given background: near-black or near-white. */
export function bestTextColor(background: string): string {
  return isDarkColor(background) ? LIGHT_TEXT : DARK_TEXT;
}

/** Blends `base` toward `mixing` by `ratio` (0 = base, 1 = mixing). */
export function mixColors(base: string, mixing: string, ratio: number): string {
  const [r1, g1, b1] = hexToRgb(base);
  const [r2, g2, b2] = hexToRgb(mixing);
  const t = Math.min(1, Math.max(0, ratio));
  const blend = (a: number, b: number): number => Math.round(a + (b - a) * t);
  const toHex = (value: number): string => value.toString(16).padStart(2, '0');
  return `#${toHex(blend(r1, r2))}${toHex(blend(g1, g2))}${toHex(blend(b1, b2))}`;
}

/**
 * Derives accessible text colors from a background when the palette does not
 * define them: readable text + a muted variant 25% blended toward the
 * background (still AA/AAA readable in both light and dark modes).
 */
export function deriveTextColors(background: string): { text: string; textMuted: string } {
  const text = bestTextColor(background);
  return { text, textMuted: mixColors(text, background, 0.25) };
}

/** The 5 color roles every palette defines. */
export interface PaletteColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  /** Optional overrides; derived from `background` when absent. */
  text?: string;
  textMuted?: string;
}

export interface ContrastCheck {
  id: string;
  label: string;
  foreground: string;
  background: string;
  ratio: number;
  requiredAA: number;
  requiredAAA: number;
  passAA: boolean;
  passAAA: boolean;
}

export interface PaletteContrastReport {
  checks: ContrastCheck[];
  /** 'AAA' if every check passes AAA, 'AA' if every check passes AA, else 'fail'. */
  level: 'AAA' | 'AA' | 'fail';
  /** True when the palette is usable (level AA or better). */
  pass: boolean;
}

interface CheckDefinition {
  id: string;
  label: string;
  foreground: string;
  background: string;
  requiredAA: number;
  requiredAAA: number;
}

/**
 * Validates a palette against WCAG:
 *  1. readable text on the background
 *  2. readable text on cards/panels (surface)
 *  3. muted text on the background
 *  4. muted text on the surface
 *  5. primary color over the background (links, UI — needs 3:1)
 *  6. primary color over the surface (buttons on cards)
 *  7. button label over the primary color
 *
 * Secondary and accent colors are decorative by design and exempt.
 */
export function validatePaletteColors(colors: PaletteColors): PaletteContrastReport {
  const derived = deriveTextColors(colors.background);
  const text = colors.text ?? derived.text;
  const textMuted = colors.textMuted ?? derived.textMuted;

  const definitions: CheckDefinition[] = [
    {
      id: 'texto-fondo',
      label: 'Texto sobre fondo',
      foreground: text,
      background: colors.background,
      requiredAA: 4.5,
      requiredAAA: 7,
    },
    {
      id: 'texto-superficie',
      label: 'Texto sobre superficie',
      foreground: text,
      background: colors.surface,
      requiredAA: 4.5,
      requiredAAA: 7,
    },
    {
      id: 'atenuado-fondo',
      label: 'Texto atenuado sobre fondo',
      foreground: textMuted,
      background: colors.background,
      requiredAA: 4.5,
      requiredAAA: 7,
    },
    {
      id: 'atenuado-superficie',
      label: 'Texto atenuado sobre superficie',
      foreground: textMuted,
      background: colors.surface,
      requiredAA: 4.5,
      requiredAAA: 7,
    },
    {
      id: 'primario-fondo',
      label: 'Primario sobre fondo (UI/enlaces)',
      foreground: colors.primary,
      background: colors.background,
      requiredAA: 3,
      requiredAAA: 4.5,
    },
    {
      id: 'primario-superficie',
      label: 'Primario sobre superficie (botones en tarjetas)',
      foreground: colors.primary,
      background: colors.surface,
      requiredAA: 3,
      requiredAAA: 4.5,
    },
    {
      id: 'etiqueta-boton',
      label: 'Etiqueta de botón sobre el primario',
      foreground: bestTextColor(colors.primary),
      background: colors.primary,
      requiredAA: 4.5,
      requiredAAA: 7,
    },
  ];

  const checks: ContrastCheck[] = definitions.map((definition) => {
    const ratio = contrastRatio(definition.foreground, definition.background);
    return {
      id: definition.id,
      label: definition.label,
      foreground: definition.foreground,
      background: definition.background,
      ratio: Math.round(ratio * 100) / 100,
      requiredAA: definition.requiredAA,
      requiredAAA: definition.requiredAAA,
      passAA: ratio >= definition.requiredAA,
      passAAA: ratio >= definition.requiredAAA,
    };
  });

  const level: PaletteContrastReport['level'] = checks.every((check) => check.passAAA)
    ? 'AAA'
    : checks.every((check) => check.passAA)
      ? 'AA'
      : 'fail';

  return { checks, level, pass: level !== 'fail' };
}
