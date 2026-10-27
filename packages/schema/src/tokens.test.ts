import { describe, expect, it } from 'vitest';

import { paletteSchema, themeSchema } from './tokens';

const validPalette = {
  primary: '#6C5CE7',
  secondary: '#00CEC9',
  accent: '#FD79A8',
  background: '#FFFFFF',
  surface: '#F5F5F7',
};

describe('paletteSchema', () => {
  it('exige exactamente los 5 roles de color del producto', () => {
    expect(paletteSchema.safeParse(validPalette).success).toBe(true);
  });

  it('rechaza una paleta incompleta', () => {
    const { accent: _accent, ...incomplete } = validPalette;
    expect(paletteSchema.safeParse(incomplete).success).toBe(false);
  });

  it('rechaza colores que no son hex', () => {
    expect(paletteSchema.safeParse({ ...validPalette, primary: 'purple' }).success).toBe(false);
    expect(paletteSchema.safeParse({ ...validPalette, primary: '#12345' }).success).toBe(false);
  });

  it('permite text y textMuted como opcionales', () => {
    const parsed = paletteSchema.parse(validPalette);
    expect(parsed.text).toBeUndefined();
    expect(paletteSchema.safeParse({ ...validPalette, text: '#111111' }).success).toBe(true);
  });
});

describe('themeSchema', () => {
  it('construye un tema completo solo con la paleta', () => {
    const theme = themeSchema.parse({ palette: validPalette });

    expect(theme.typography.scale).toBe('normal');
    expect(theme.typography.baseFontSizePx).toBe(16);
    expect(theme.spacing.sectionYPx).toBe(64);
    expect(theme.spacing.xs).toBe(4);
    expect(theme.radius.pill).toBe(999);
    expect(theme.shadow.lg).toContain('12px');
  });

  it('permite sobreescribir tokens parciales', () => {
    const theme = themeSchema.parse({
      palette: validPalette,
      spacing: { sectionYPx: 120 },
      radius: { md: 20 },
    });

    expect(theme.spacing.sectionYPx).toBe(120);
    expect(theme.spacing.md).toBe(16); // default intacto
    expect(theme.radius.md).toBe(20);
    expect(theme.radius.sm).toBe(4); // default intacto
  });

  it('rechaza un tamaño de fuente fuera de rango', () => {
    const result = themeSchema.safeParse({
      palette: validPalette,
      typography: { baseFontSizePx: 100 },
    });
    expect(result.success).toBe(false);
  });

  it('rechaza radios negativos', () => {
    const result = themeSchema.safeParse({
      palette: validPalette,
      radius: { sm: -1 },
    });
    expect(result.success).toBe(false);
  });
});
