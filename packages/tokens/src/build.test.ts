import { describe, expect, it } from 'vitest';

import { createTheme, flattenTokens, CONTAINER_MAX_WIDTH } from './build';

const palette = {
  primary: '#6C5CE7',
  secondary: '#00CEC9',
  accent: '#FD79A8',
  background: '#FFFFFF',
  surface: '#F5F5F7',
};

const EXPECTED_KEYS = [
  'color-accent',
  'color-background',
  'color-on-primary',
  'color-primary',
  'color-primary-text',
  'color-secondary',
  'color-surface',
  'color-text',
  'color-text-muted',
  'container-max',
  'font-body',
  'font-heading',
  'radius-lg',
  'radius-md',
  'radius-pill',
  'radius-sm',
  'shadow-lg',
  'shadow-md',
  'shadow-sm',
  'space-lg',
  'space-md',
  'space-section-x',
  'space-section-y',
  'space-sm',
  'space-xl',
  'space-xxl',
  'space-xs',
  'text-base',
  'text-display',
  'text-h1',
  'text-h2',
  'text-h3',
  'text-h4',
  'text-small',
  'weight-body',
  'weight-heading',
].sort();

describe('createTheme', () => {
  it('construye un tema completo desde una paleta', () => {
    const theme = createTheme(palette);

    expect(theme.palette.primary).toBe('#6C5CE7');
    expect(theme.typography.scale).toBe('normal');
    expect(theme.spacing.sectionYPx).toBe(64);
    expect(theme.radius.pill).toBe(999);
  });
});

describe('flattenTokens', () => {
  it('genera los36 tokens esperados', () => {
    const theme = createTheme(palette);
    expect(Object.keys(flattenTokens(theme)).sort()).toEqual(EXPECTED_KEYS);
  });

  it('mapea la paleta a los colores', () => {
    const tokens = flattenTokens(createTheme(palette));

    expect(tokens['color-primary']).toBe('#6C5CE7');
    expect(tokens['color-secondary']).toBe('#00CEC9');
    expect(tokens['color-accent']).toBe('#FD79A8');
    expect(tokens['color-background']).toBe('#FFFFFF');
    expect(tokens['color-surface']).toBe('#F5F5F7');
  });

  it('deriva texto legible cuando la paleta no lo define', () => {
    const tokens = flattenTokens(createTheme(palette));

    expect(tokens['color-text']).toBe('#000000');
    expect(tokens['color-text-muted']).toBe('#404040');
    expect(tokens['color-text']).not.toBe(tokens['color-text-muted']);
  });

  it('garantiza etiquetas legibles sobre el primario y texto primario legible', () => {
    const tokens = flattenTokens(createTheme(palette));

    // #6C5CE7 on white is ~5:1 → primary is usable as text
    expect(tokens['color-on-primary']).toBe('#FFFFFF');
    expect(tokens['color-primary-text']).toBe('#6C5CE7');

    // A pastel primary on white fails AA as text → falls back to text color
    const pastel = flattenTokens(
      createTheme({ ...palette, primary: '#FDE68A', background: '#FFFFFF' }),
    );
    expect(pastel['color-primary-text']).toBe('#000000');
  });

  it('respeta los overrides explícitos de texto', () => {
    const tokens = flattenTokens(createTheme({ ...palette, text: '#1D4ED8' }));
    expect(tokens['color-text']).toBe('#1D4ED8');
  });

  it('deriva texto claro sobre fondos oscuros', () => {
    const tokens = flattenTokens(
      createTheme({ ...palette, background: '#0B0B10', surface: '#14141C' }),
    );

    expect(tokens['color-text']).toBe('#FFFFFF');
    expect(tokens['color-text-muted']).not.toBe('#FFFFFF');
  });

  it('la escala tipográfica afecta a los tamaños', () => {
    const normal = flattenTokens(createTheme(palette));
    expect(normal['text-base']).toBe('1rem');
    expect(normal['text-display']).toBe('3.5rem');
    expect(normal['text-h2']).toBe('2rem');

    const large = flattenTokens(createTheme(palette, { typography: { scale: 'large' } }));
    expect(large['text-display']).toBe('3.938rem');

    const compact = flattenTokens(createTheme(palette, { typography: { scale: 'compact' } }));
    expect(compact['text-display']).toBe('3.15rem');
  });

  it('emite medidas en px y sombras como box-shadow', () => {
    const tokens = flattenTokens(createTheme(palette));

    expect(tokens['space-md']).toBe('16px');
    expect(tokens['space-section-y']).toBe('64px');
    expect(tokens['radius-pill']).toBe('999px');
    expect(tokens['shadow-lg']).toContain('12px');
    expect(tokens['container-max']).toBe(CONTAINER_MAX_WIDTH);
  });
});
