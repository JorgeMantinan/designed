import { describe, expect, it } from 'vitest';

import {
  ENTRANCE_ANIMATION_TYPES,
  HOVER_ANIMATION_TYPES,
  animationSchema,
  entranceAnimationSchema,
  hoverAnimationSchema,
} from './animation';
import { backgroundSchema, gradientSchema } from './background';
import { OVERLAY_DIRECTIONS, imageOverlaySchema } from './overlay';

describe('animationSchema', () => {
  it('cuenta con8 entradas y8 hovers en el catálogo', () => {
    expect(ENTRANCE_ANIMATION_TYPES).toHaveLength(8);
    expect(HOVER_ANIMATION_TYPES).toHaveLength(8);
  });

  it('aplica defaults de entrada', () => {
    const entrance = entranceAnimationSchema.parse({ type: 'slide-up' });
    expect(entrance.durationMs).toBe(600);
    expect(entrance.delayMs).toBe(0);
    expect(entrance.trigger).toBe('scroll');
    expect(entrance.once).toBe(true);
  });

  it('aplica defaults de hover', () => {
    const hover = hoverAnimationSchema.parse({ type: 'glow' });
    expect(hover.durationMs).toBe(200);
    expect(hover.intensity).toBe(0.5);
  });

  it('permite animaciones combinadas o ausentes', () => {
    expect(animationSchema.parse({}).entrance).toBeUndefined();
    const combined = animationSchema.parse({
      entrance: { type: 'fade-in' },
      hover: { type: 'lift' },
    });
    expect(combined.entrance?.type).toBe('fade-in');
    expect(combined.hover?.type).toBe('lift');
  });

  it('rechaza tipos de animación desconocidos', () => {
    expect(entranceAnimationSchema.safeParse({ type: 'explotar' }).success).toBe(false);
  });
});

describe('imageOverlaySchema', () => {
  it('ofrece las9 direcciones de sombreado (lateral, diagonal, vertical...)', () => {
    expect(OVERLAY_DIRECTIONS).toContain('to-right'); // lateral
    expect(OVERLAY_DIRECTIONS).toContain('to-bottom'); // vertical
    expect(OVERLAY_DIRECTIONS).toContain('to-bottom-right'); // diagonal
    expect(OVERLAY_DIRECTIONS).toHaveLength(9);
  });

  it('aplica defaults de overlay', () => {
    const overlay = imageOverlaySchema.parse({});
    expect(overlay.type).toBe('gradient');
    expect(overlay.direction).toBe('to-right');
    expect(overlay.color).toBe('#000000');
    expect(overlay.intensity).toBe(0.5);
  });

  it('valida la intensidad 0-1', () => {
    expect(imageOverlaySchema.safeParse({ intensity: 1.5 }).success).toBe(false);
    expect(imageOverlaySchema.safeParse({ intensity: 0 }).success).toBe(true);
  });

  it('rechaza colores no hex en el overlay', () => {
    expect(imageOverlaySchema.safeParse({ color: 'negro' }).success).toBe(false);
  });
});

describe('backgroundSchema', () => {
  it('acepta los4 tipos de fondo', () => {
    expect(backgroundSchema.safeParse({ type: 'color', color: '#0B0B10' }).success).toBe(true);
    expect(
      backgroundSchema.safeParse({
        type: 'gradient',
        gradient: { stops: [{ color: '#000' }, { color: '#fff' }] },
      }).success,
    ).toBe(true);
    expect(
      backgroundSchema.safeParse({ type: 'image', src: 'https://example.com/fondo.jpg' }).success,
    ).toBe(true);
    expect(backgroundSchema.safeParse({ type: 'interactive', effect: 'spotlight' }).success).toBe(
      true,
    );
  });

  it('rechaza efectos interactivos desconocidos', () => {
    expect(backgroundSchema.safeParse({ type: 'interactive', effect: 'telepatia' }).success).toBe(
      false,
    );
  });

  it('exige al menos2 paradas de gradiente', () => {
    expect(gradientSchema.safeParse({ stops: [{ color: '#000000' }] }).success).toBe(false);
  });

  it('valida ángulos de gradiente 0-360', () => {
    const stops = [{ color: '#000000' }, { color: '#FFFFFF' }];
    expect(gradientSchema.safeParse({ stops, angle: 400 }).success).toBe(false);
    expect(gradientSchema.safeParse({ stops, angle: 90 }).success).toBe(true);
  });
});
