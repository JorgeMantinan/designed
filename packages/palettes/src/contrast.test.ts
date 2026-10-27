import { describe, expect, it } from 'vitest';

import {
  READABILITY_THRESHOLD,
  bestTextColor,
  contrastRatio,
  deriveTextColors,
  hexToRgb,
  isDarkColor,
  mixColors,
  relativeLuminance,
  validatePaletteColors,
  wcagLevel,
} from './contrast';

describe('hexToRgb', () => {
  it('parsea hex de6 y3 dígitos', () => {
    expect(hexToRgb('#FF0000')).toEqual([255, 0, 0]);
    expect(hexToRgb('#fff')).toEqual([255, 255, 255]);
    expect(hexToRgb('#0B0B10')).toEqual([11, 11, 16]);
  });

  it('ignora el canal alfa de8 dígitos', () => {
    expect(hexToRgb('#FF000080')).toEqual([255, 0, 0]);
  });

  it('lanza un error con entradas basura', () => {
    expect(() => hexToRgb('rojo')).toThrow('no válido');
    expect(() => hexToRgb('#12345')).toThrow('no válido');
  });
});

describe('relativeLuminance', () => {
  it('blanco =1 y negro =0', () => {
    expect(relativeLuminance('#FFFFFF')).toBeCloseTo(1, 5);
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 5);
  });

  it('colores planos conocidos', () => {
    expect(relativeLuminance('#FF0000')).toBeCloseTo(0.2126, 3);
    expect(relativeLuminance('#00FF00')).toBeCloseTo(0.7152, 3);
    expect(relativeLuminance('#0000FF')).toBeCloseTo(0.0722, 3);
  });
});

describe('contrastRatio', () => {
  it('negro vs blanco =21 (el máximo)', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
  });

  it('un color consigo mismo =1', () => {
    expect(contrastRatio('#6C5CE7', '#6C5CE7')).toBeCloseTo(1, 5);
  });

  it('es simétrico', () => {
    expect(contrastRatio('#1D4ED8', '#FFFFFF')).toBeCloseTo(contrastRatio('#FFFFFF', '#1D4ED8'), 5);
  });

  it('cumple el valor publicado de #767676 sobre blanco (4.54:1)', () => {
    expect(contrastRatio('#767676', '#FFFFFF')).toBeCloseTo(4.54, 1);
  });
});

describe('wcagLevel', () => {
  it('clasifica los umbrales de texto normal', () => {
    expect(wcagLevel(21)).toBe('AAA');
    expect(wcagLevel(7)).toBe('AAA');
    expect(wcagLevel(4.6)).toBe('AA');
    expect(wcagLevel(4.5)).toBe('AA');
    expect(wcagLevel(3.2)).toBe('AA-large');
    expect(wcagLevel(1.5)).toBe('fail');
  });

  it('usa umbrales de texto grande cuando aplica', () => {
    expect(wcagLevel(4.5, true)).toBe('AAA');
    expect(wcagLevel(3.2, true)).toBe('AA');
    expect(wcagLevel(2, true)).toBe('fail');
  });
});

describe('isDarkColor / bestTextColor', () => {
  it('detecta fondos oscuros y claros', () => {
    expect(isDarkColor('#0B0B10')).toBe(true);
    expect(isDarkColor('#FFFFFF')).toBe(false);
    expect(isDarkColor('#111111')).toBe(true);
  });

  it('elige texto legible según el fondo', () => {
    expect(bestTextColor('#FFFFFF')).toBe('#000000');
    expect(bestTextColor('#0B0B10')).toBe('#FFFFFF');
  });

  it('en el umbral exacto ambos textos superan4.5:1', () => {
    const thresholdColor = '#2E2E2E';
    expect(relativeLuminance(thresholdColor)).toBeGreaterThan(READABILITY_THRESHOLD - 0.2);
    expect(contrastRatio(bestTextColor(thresholdColor), thresholdColor)).toBeGreaterThanOrEqual(
      4.5,
    );
  });
});

describe('mixColors / deriveTextColors', () => {
  it('mezcla en ambos extremos', () => {
    expect(mixColors('#000000', '#FFFFFF', 0)).toBe('#000000');
    expect(mixColors('#000000', '#FFFFFF', 1)).toBe('#ffffff');
    expect(mixColors('#000000', '#FFFFFF', 0.5)).toBe('#808080');
  });

  it('deriva texto y texto atenuado legibles sobre fondo claro', () => {
    const { text, textMuted } = deriveTextColors('#FFFFFF');
    expect(text).toBe('#000000');
    expect(contrastRatio(text, '#FFFFFF')).toBeGreaterThanOrEqual(7);
    expect(contrastRatio(textMuted, '#FFFFFF')).toBeGreaterThanOrEqual(4.5);
  });

  it('deriva texto y texto atenuado legibles sobre fondo oscuro', () => {
    const { text, textMuted } = deriveTextColors('#0B0B10');
    expect(text).toBe('#FFFFFF');
    expect(contrastRatio(text, '#0B0B10')).toBeGreaterThanOrEqual(7);
    expect(contrastRatio(textMuted, '#0B0B10')).toBeGreaterThanOrEqual(4.5);
  });
});

describe('validatePaletteColors', () => {
  const accessible = {
    primary: '#1E3A8A',
    secondary: '#0EA5E9',
    accent: '#F59E0B',
    background: '#FFFFFF',
    surface: '#F1F5F9',
  };

  it('acepta una paleta accesible y ejecuta7 comprobaciones en AAA', () => {
    const report = validatePaletteColors(accessible);
    expect(report.checks).toHaveLength(7);
    expect(report.pass).toBe(true);
    expect(report.level).toBe('AAA');
  });

  it('marca AA cuando algún check no llega a AAA', () => {
    const report = validatePaletteColors({ ...accessible, primary: '#1D4ED8' });
    expect(report.pass).toBe(true);
    expect(report.level).toBe('AA');
  });

  it('detecta texto ilegible sobre el fondo', () => {
    const report = validatePaletteColors({ ...accessible, text: '#EEEEEE' });
    expect(report.pass).toBe(false);
    expect(report.level).toBe('fail');
    const failed = report.checks.find((check) => check.id === 'texto-fondo');
    expect(failed?.passAA).toBe(false);
    expect(failed?.ratio).toBeLessThan(4.5);
  });

  it('detecta un primario demasiado claro sobre fondo claro', () => {
    const report = validatePaletteColors({ ...accessible, primary: '#FDE68A' });
    expect(report.pass).toBe(false);
    const failed = report.checks.find((check) => check.id === 'primario-fondo');
    expect(failed?.passAA).toBe(false);
  });

  it('respeta los overrides explícitos de texto', () => {
    const report = validatePaletteColors({
      ...accessible,
      text: '#1D4ED8',
      textMuted: '#334155',
    });
    const textCheck = report.checks.find((check) => check.id === 'texto-fondo');
    expect(textCheck?.foreground).toBe('#1D4ED8');
    expect(report.pass).toBe(true);
  });
});
