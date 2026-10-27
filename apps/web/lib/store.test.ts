import { describe, expect, it } from 'vitest';

import { PALETTES } from '@designed/palettes';

import { builderReducer, createInitialState } from './store-core';
import type { BuilderState } from './store-core';

import { buildBlankDesign, buildTemplate, TEMPLATES } from './templates';

const spec = buildTemplate('landing-clasica', PALETTES[0]!);

describe('templates', () => {
  it('las6 plantillas generan specs válidos con cualquier paleta', () => {
    expect(TEMPLATES).toHaveLength(6);

    const palettes = [PALETTES[0]!, PALETTES.find((item) => item.id === 'onix')!];

    for (const template of TEMPLATES) {
      for (const palette of palettes) {
        const built = buildTemplate(template.id, palette);
        expect(built.version, template.id).toBe(1);
        expect(built.sections.length, template.id).toBeGreaterThan(0);
        expect(built.theme.palette.primary).toBe(palette.colors.primary);
      }
    }
  });

  it('lanza con plantillas desconocidas', () => {
    expect(() => buildTemplate('no-existe', PALETTES[0]!)).toThrow('desconocida');
  });

  it('el diseño en blanco es válido', () => {
    const blank = buildBlankDesign();
    expect(blank.sections).toHaveLength(1);
    expect(blank.meta.name).toBe('Mi web');
  });

  it('cada plantilla tiene tags y descripción', () => {
    for (const template of TEMPLATES) {
      expect(template.tags.length, template.id).toBeGreaterThan(0);
      expect(template.description.length, template.id).toBeGreaterThan(10);
    }
  });
});

describe('builderReducer', () => {
  let state: BuilderState;

  it('update guarda en el historial y valida', () => {
    state = createInitialState(spec);

    const next = builderReducer(state, {
      type: 'update',
      mutate: (draft) => {
        draft.meta.name = 'Cambiado';
      },
    });

    expect(next.spec.meta.name).toBe('Cambiado');
    expect(next.past).toHaveLength(1);
    expect(next.future).toHaveLength(0);
    expect(state.spec.meta.name).toBe('Landing clásica');
  });

  it('rechaza mutaciones que invalidan el spec', () => {
    state = createInitialState(spec);

    const next = builderReducer(state, {
      type: 'update',
      mutate: (draft) => {
        draft.version = 99 as unknown as 1;
      },
    });

    expect(next).toBe(state);
    expect(next.past).toHaveLength(0);
  });

  it('undo/redo recorren el historial', () => {
    state = createInitialState(spec);
    const step1 = builderReducer(state, {
      type: 'update',
      mutate: (draft) => void (draft.meta.name = 'Uno'),
    });
    const step2 = builderReducer(step1, {
      type: 'update',
      mutate: (draft) => void (draft.meta.name = 'Dos'),
    });
    expect(step2.spec.meta.name).toBe('Dos');

    const undone = builderReducer(step2, { type: 'undo' });
    expect(undone.spec.meta.name).toBe('Uno');

    const redone = builderReducer(undone, { type: 'redo' });
    expect(redone.spec.meta.name).toBe('Dos');

    const undoneTwice = builderReducer(builderReducer(step2, { type: 'undo' }), { type: 'undo' });
    expect(undoneTwice.spec.meta.name).toBe('Landing clásica');
  });

  it('undo sin historial no cambia nada', () => {
    state = createInitialState(spec);
    expect(builderReducer(state, { type: 'undo' })).toBe(state);
    expect(builderReducer(state, { type: 'redo' })).toBe(state);
  });

  it('update limpia el futuro (rama nueva)', () => {
    state = createInitialState(spec);
    const step1 = builderReducer(state, {
      type: 'update',
      mutate: (draft) => void (draft.meta.name = 'Uno'),
    });
    const undone = builderReducer(step1, { type: 'undo' });
    const branched = builderReducer(undone, {
      type: 'update',
      mutate: (draft) => void (draft.meta.name = 'Otra rama'),
    });

    expect(branched.future).toHaveLength(0);
    expect(branched.spec.meta.name).toBe('Otra rama');
  });

  it('select y replay actualizan sin tocar el spec', () => {
    state = createInitialState(spec);
    const selected = builderReducer(state, {
      type: 'select',
      selection: { kind: 'section', id: 'hero' },
    });
    expect(selected.selection).toEqual({ kind: 'section', id: 'hero' });
    expect(selected.spec).toBe(state.spec);

    const replayed = builderReducer(selected, { type: 'replay' });
    expect(replayed.previewKey).toBe(1);
  });
});
