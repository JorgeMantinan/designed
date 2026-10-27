import { describe, expect, it } from 'vitest';

import { INTERACTIVE_BACKGROUND_EFFECTS } from '@designed/schema';

import {
  ANIMATION_CATALOG,
  BACKGROUND_EFFECTS,
  SCHEMA_ENTRANCE_TYPES,
  SCHEMA_HOVER_TYPES,
  animationsByFamily,
  getAnimation,
  getBackgroundEffect,
} from './catalog';

describe('ANIMATION_CATALOG', () => {
  it('tiene exactamente8 entradas y8 hovers', () => {
    expect(animationsByFamily('entrance')).toHaveLength(8);
    expect(animationsByFamily('hover')).toHaveLength(8);
    expect(ANIMATION_CATALOG).toHaveLength(16);
  });

  it('cubre exactamente los tipos del schema (sin ids huérfanos)', () => {
    const entranceIds = animationsByFamily('entrance')
      .map((entry) => entry.id)
      .sort();
    const hoverIds = animationsByFamily('hover')
      .map((entry) => entry.id)
      .sort();

    expect(entranceIds).toEqual([...SCHEMA_ENTRANCE_TYPES].sort());
    expect(hoverIds).toEqual([...SCHEMA_HOVER_TYPES].sort());
  });

  it('ids únicos en todo el catálogo', () => {
    const ids = ANIMATION_CATALOG.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cada entrada tiene nombre y descripción en español', () => {
    for (const entry of ANIMATION_CATALOG) {
      expect(entry.name.length, entry.id).toBeGreaterThan(2);
      expect(entry.description.length, entry.id).toBeGreaterThan(10);
    }
  });
});

describe('BACKGROUND_EFFECTS', () => {
  it('tiene los7 efectos interactivos del schema', () => {
    expect(BACKGROUND_EFFECTS).toHaveLength(7);

    const effectIds = BACKGROUND_EFFECTS.map((entry) => entry.id).sort();
    expect(effectIds).toEqual([...INTERACTIVE_BACKGROUND_EFFECTS].sort());
  });

  it('marca correctamente los que siguen al puntero', () => {
    expect(getBackgroundEffect('spotlight')?.tracksPointer).toBe(true);
    expect(getBackgroundEffect('dots')?.tracksPointer).toBe(true);
    expect(getBackgroundEffect('particles')?.tracksPointer).toBe(false);
    expect(getBackgroundEffect('waves')?.tracksPointer).toBe(false);
  });

  it('cada efecto tiene nombre y descripción', () => {
    for (const entry of BACKGROUND_EFFECTS) {
      expect(entry.name.length, entry.id).toBeGreaterThan(2);
      expect(entry.description.length, entry.id).toBeGreaterThan(10);
    }
  });
});

describe('getAnimation / getBackgroundEffect', () => {
  it('encuentra entradas por id', () => {
    expect(getAnimation('slide-up')?.name).toBe('Deslizar hacia arriba');
    expect(getAnimation('glow')?.family).toBe('hover');
    expect(getAnimation('no-existe')).toBeUndefined();
  });
});
