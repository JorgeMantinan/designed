import { describe, expect, it } from 'vitest';

import { buildShadow, DEFAULT_SHADOW_PARTS, parseShadow } from './shadow';

describe('parseShadow', () => {
  it('interpreta el formato rgb moderno de los presets', () => {
    expect(parseShadow('0 2px 6px rgb(0 0 0 / 0.08)')).toEqual({
      x: 0,
      y: 2,
      blur: 6,
      spread: 0,
      color: '#000000',
      opacity: 0.08,
    });
  });

  it('interpreta rgba clásico, hex corto y sombras con spread', () => {
    expect(parseShadow('4px 8px 20px rgba(255, 0, 0, 0.5)')).toEqual({
      x: 4,
      y: 8,
      blur: 20,
      spread: 0,
      color: '#ff0000',
      opacity: 0.5,
    });
    expect(parseShadow('0 1px 2px #abc')).toEqual({
      x: 0,
      y: 1,
      blur: 2,
      spread: 0,
      color: '#aabbcc',
      opacity: 1,
    });
    expect(parseShadow('0 8px 24px 4px rgb(10 20 30 / 25%)')?.spread).toBe(4);
    expect(parseShadow('0 8px 24px 4px rgb(10 20 30 / 25%)')?.opacity).toBe(0.25);
  });

  it('devuelve null con none, vacío o basura', () => {
    expect(parseShadow('none')).toBeNull();
    expect(parseShadow('')).toBeNull();
    expect(parseShadow(undefined)).toBeNull();
    expect(parseShadow('inset 0 0 10px black')).toBeNull();
  });
});

describe('buildShadow', () => {
  it('construye CSS válido y hace ida y vuelta con parseShadow', () => {
    const parts = { x: -2, y: 10, blur: 30, spread: 2, color: '#6c5ce7', opacity: 0.42 };
    const css = buildShadow(parts);

    expect(css).toBe('-2px 10px 30px 2px rgb(108 92 231 / 0.42)');
    expect(parseShadow(css)).toEqual(parts);
  });

  it('recorta la opacidad al rango 0-1', () => {
    expect(buildShadow({ ...DEFAULT_SHADOW_PARTS, opacity: 1.8 })).toContain('rgb(0 0 0 / 1)');
  });
});
