import { describe, expect, it } from 'vitest';

import { mergeDeep, normalizeAnimation, normalizeEntrance, normalizeHover } from './normalize';

describe('normalizeEntrance / normalizeHover', () => {
  it('rellena los defaults del esquema', () => {
    expect(normalizeEntrance({ type: 'slide-up' })).toEqual({
      type: 'slide-up',
      durationMs: 600,
      delayMs: 0,
      easing: 'ease-out',
      trigger: 'scroll',
      once: true,
    });

    expect(normalizeHover({ type: 'glow' })).toEqual({
      type: 'glow',
      durationMs: 200,
      easing: 'ease',
      intensity: 0.5,
    });
  });

  it('devuelve undefined sin entrada', () => {
    expect(normalizeEntrance(undefined)).toBeUndefined();
    expect(normalizeHover(undefined)).toBeUndefined();
    expect(normalizeAnimation(undefined)).toBeUndefined();
    expect(normalizeAnimation({})).toBeUndefined();
  });

  it('combina entrada y hover', () => {
    const result = normalizeAnimation({
      entrance: { type: 'fade-in' },
      hover: { type: 'lift', intensity: 0.8 },
    });

    expect(result?.entrance?.type).toBe('fade-in');
    expect(result?.hover?.intensity).toBe(0.8);
  });
});

describe('mergeDeep', () => {
  it('fusiona parciales sin perder defaults', () => {
    const target = {
      type: 'image',
      src: 'a.jpg',
      overlay: { type: 'gradient', direction: 'to-right', color: '#000000', intensity: 0.7 },
    };

    const result = mergeDeep(target, { overlay: { direction: 'to-bottom' } });

    expect(result.overlay.direction).toBe('to-bottom');
    expect(result.overlay.color).toBe('#000000');
    expect(result.overlay.intensity).toBe(0.7);
    expect(result.src).toBe('a.jpg');
  });

  it('el undefined elimina la clave (limpiar campos opcionales)', () => {
    const result = mergeDeep({ href: '#x', icon: 'zap' }, { icon: undefined });

    expect(result.href).toBe('#x');
    expect('icon' in result).toBe(false);
  });

  it('reemplaza arrays por completo', () => {
    const result = mergeDeep({ items: ['a', 'b'] }, { items: ['c'] });

    expect(result.items).toEqual(['c']);
  });

  it('no muta el objetivo original', () => {
    const target = { nested: { value: 1 } };
    mergeDeep(target, { nested: { value: 2 } });

    expect(target.nested.value).toBe(1);
  });
});
