import { describe, expect, it } from 'vitest';

import { flattenTokens } from './build';
import { toCssVariables } from './css';
import { toScssVariables } from './scss';
import { toTsConstants } from './ts';
import { createTheme } from './build';

const theme = createTheme({
  primary: '#6C5CE7',
  secondary: '#00CEC9',
  accent: '#FD79A8',
  background: '#0B0B10',
  surface: '#14141C',
});

describe('toCssVariables', () => {
  const css = toCssVariables(theme);

  it('genera un bloque :root con todas las variables', () => {
    expect(css.startsWith(':root {\n')).toBe(true);
    expect(css.trimEnd().endsWith('}')).toBe(true);

    for (const name of Object.keys(flattenTokens(theme))) {
      expect(css).toContain(`--${name}:`);
    }
  });

  it('incluye los valores del tema', () => {
    expect(css).toContain('--color-primary: #6C5CE7;');
    expect(css).toContain('--color-text: #FFFFFF;');
    expect(css).toContain('--text-display: 3.5rem;');
    expect(css).toContain('--radius-pill: 999px;');
  });
});

describe('toScssVariables', () => {
  const scss = toScssVariables(theme);

  it('declara variables SCSS con guiones bajos', () => {
    expect(scss).toContain('$color_primary: #6C5CE7;');
    expect(scss).toContain('$space_section_y: 64px;');
    expect(scss).toContain('$radius_pill: 999px;');
  });

  it('alimenta el bloque :root desde las variables SCSS', () => {
    expect(scss).toContain('--color-primary: #{$color_primary};');
    expect(scss).toContain('--space-section-y: #{$space_section_y};');
  });

  it('documenta que es un archivo generado', () => {
    expect(scss).toContain('Generado por designed');
  });

  it('genera las mismas variables que el emisor CSS', () => {
    const cssNames = [...scss.matchAll(/ {2}--([a-z0-9-]+):/g)].map((match) => match[1]).sort();
    expect(cssNames).toEqual(Object.keys(flattenTokens(theme)).sort());
  });
});

describe('toTsConstants', () => {
  const source = toTsConstants(theme);

  it('exporta un objeto const con los tokens', () => {
    expect(source).toContain('export const tokens = {');
    expect(source).toContain('as const;');
    expect(source).toContain('"color-primary": "#6C5CE7"');
  });

  it('el objeto embebido es JSON válido', () => {
    const start = source.indexOf('{');
    const end = source.lastIndexOf('}');
    const parsed = JSON.parse(source.slice(start, end + 1)) as Record<string, string>;

    expect(parsed['color-background']).toBe('#0B0B10');
    expect(Object.keys(parsed)).toHaveLength(Object.keys(flattenTokens(theme)).length);
  });
});
