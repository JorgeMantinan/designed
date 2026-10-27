import { describe, expect, it } from 'vitest';

import { hoverAttribute, motionClassName, motionStyle } from './motion';

const entrance = {
  type: 'slide-up' as const,
  durationMs: 700,
  delayMs: 120,
  easing: 'ease-out' as const,
  trigger: 'scroll' as const,
  once: true,
};
const hover = { type: 'glow' as const, durationMs: 300, easing: 'ease' as const, intensity: 0.8 };

describe('motionClassName', () => {
  it('devuelve undefined sin animación de entrada', () => {
    expect(motionClassName(undefined, false)).toBeUndefined();
    expect(motionClassName({ hover }, false)).toBeUndefined();
  });

  it('construye las clases de entrada con y sin revelar', () => {
    expect(motionClassName({ entrance }, false)).toBe('dsg-reveal dsg-entrance--slide-up');
    expect(motionClassName({ entrance }, true)).toBe(
      'dsg-reveal dsg-entrance--slide-up is-revealed',
    );
  });
});

describe('motionStyle', () => {
  it('expone las variables de entrada como CSS custom properties', () => {
    const style = motionStyle({ entrance });

    expect(style).toEqual({
      '--entrance-duration': '700ms',
      '--entrance-delay': '120ms',
      '--entrance-easing': 'ease-out',
    });
  });

  it('expone duración, easing e intensidad del hover', () => {
    const style = motionStyle({ hover });

    expect(style).toEqual({
      '--hover-duration': '300ms',
      '--hover-easing': 'ease',
      '--hover-intensity': '0.8',
    });
  });

  it('combina entrada y hover', () => {
    const style = motionStyle({ entrance, hover }) as Record<string, string>;

    expect(style['--entrance-duration']).toBe('700ms');
    expect(style['--hover-intensity']).toBe('0.8');
  });

  it('ignora hover tipo none y slots vacíos', () => {
    expect(motionStyle({ hover: { ...hover, type: 'none' } })).toBeUndefined();
    expect(motionStyle({})).toBeUndefined();
    expect(motionStyle(undefined)).toBeUndefined();
  });
});

describe('hoverAttribute', () => {
  it('devuelve el tipo de hover o undefined', () => {
    expect(hoverAttribute({ hover })).toBe('glow');
    expect(hoverAttribute({ hover: { ...hover, type: 'none' } })).toBeUndefined();
    expect(hoverAttribute({ entrance })).toBeUndefined();
    expect(hoverAttribute(undefined)).toBeUndefined();
  });
});
