import { describe, expect, it } from 'vitest';

import {
  PALETTES,
  PALETTE_TAGS,
  getPalette,
  paletteMode,
  palettesByTag,
  validatePalette,
} from './catalog';
import { isDarkColor } from './contrast';

describe('PALETTES', () => {
  it('recoge entre40 y120 paletas (catálogo amplio)', () => {
    expect(PALETTES.length).toBeGreaterThanOrEqual(40);
    expect(PALETTES.length).toBeLessThanOrEqual(120);
  });

  it('tiene ids únicos en kebab-case', () => {
    const ids = PALETTES.map((palette) => palette.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9][a-z0-9-]*$/);
    }
  });

  it('cada paleta define exactamente5 colores válidos', () => {
    const hex = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    for (const palette of PALETTES) {
      const { colors } = palette;
      for (const value of [
        colors.primary,
        colors.secondary,
        colors.accent,
        colors.background,
        colors.surface,
      ]) {
        expect(hex.test(value), `${palette.id}: ${value}`).toBe(true);
      }
    }
  });

  it('cada paleta tiene nombre en español y etiquetas', () => {
    for (const palette of PALETTES) {
      expect(palette.name.length).toBeGreaterThan(2);
      expect(palette.tags.length).toBeGreaterThan(0);
      for (const tag of palette.tags) {
        expect(PALETTE_TAGS).toContain(tag);
      }
    }
  });

  it('la etiqueta clara/oscura es coherente con el fondo', () => {
    for (const palette of PALETTES) {
      const dark = isDarkColor(palette.colors.background);
      expect(palette.tags.includes('oscura'), palette.id).toBe(dark);
      expect(palette.tags.includes('clara'), palette.id).toBe(!dark);
    }
  });

  it('TODAS las paletas superan WCAG AA (semáforo verde garantizado)', () => {
    const failing: string[] = [];
    for (const palette of PALETTES) {
      const report = validatePalette(palette);
      if (!report.pass) {
        const failed = report.checks
          .filter((check) => !check.passAA)
          .map((check) => `${check.id}=${check.ratio}`)
          .join(', ');
        failing.push(`${palette.id} [${failed}]`);
      }
    }
    expect(failing).toEqual([]);
  });

  it('un subconjunto destacado llega a AAA', () => {
    const aaa = PALETTES.filter((palette) => validatePalette(palette).level === 'AAA');
    expect(aaa.length).toBeGreaterThanOrEqual(10);
  });

  it('hay paletas claras y oscuras (mitad y mitad aproximadamente)', () => {
    const dark = palettesByTag('oscura');
    const light = palettesByTag('clara');
    expect(dark.length).toBeGreaterThanOrEqual(15);
    expect(light.length).toBeGreaterThanOrEqual(15);
    expect(dark.length + light.length).toBe(PALETTES.length);
  });

  it('la mayoría de fondos están TEÑIDOS con color (no blanco/negro puro)', () => {
    // Amplitud de canal (max-min):0 = gris puro (#FFFFFF/#000000), ≥12 = tinte visible.
    const channelSpread = (hex: string): number => {
      const value = parseInt(hex.slice(1), 16);
      const channels = [(value >> 16) & 255, (value >> 8) & 255, value & 255];
      return Math.max(...channels) - Math.min(...channels);
    };

    const tinted = PALETTES.filter((palette) => channelSpread(palette.colors.background) >= 12);
    expect(tinted.length).toBeGreaterThanOrEqual(40);

    // Y las superficies (tarjetas) también llevan color en la mayoría.
    const tintedSurfaces = PALETTES.filter(
      (palette) => channelSpread(palette.colors.surface) >= 12,
    );
    expect(tintedSurfaces.length).toBeGreaterThanOrEqual(40);
  });
});

describe('getPalette', () => {
  it('encuentra una paleta por id', () => {
    expect(getPalette('azul-corporativo')?.name).toBe('Azul corporativo');
  });

  it('devuelve undefined con ids inexistentes', () => {
    expect(getPalette('no-existe')).toBeUndefined();
  });
});

describe('palettesByTag', () => {
  it('filtra por estilo', () => {
    const corporativas = palettesByTag('corporativa');
    expect(corporativas.length).toBeGreaterThanOrEqual(5);
    for (const palette of corporativas) {
      expect(palette.tags).toContain('corporativa');
    }
  });

  it('filtra por modo claro/oscuro', () => {
    expect(palettesByTag('oscura').every((palette) => paletteMode(palette) === 'dark')).toBe(true);
    expect(palettesByTag('clara').every((palette) => paletteMode(palette) === 'light')).toBe(true);
  });
});

describe('validatePalette', () => {
  it('incluye el id de la paleta en el informe', () => {
    const report = validatePalette(PALETTES[0]!);
    expect(report.paletteId).toBe('azul-corporativo');
    expect(report.checks).toHaveLength(7);
  });
});
