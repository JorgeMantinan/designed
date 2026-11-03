import { describe, expect, it } from 'vitest';

import { PALETTES } from '@designed/palettes';
import { parseDesignSpec } from '@designed/schema';

import { builderReducer, createInitialState } from './store-core';
import type { BuilderState } from './store-core';

import { buildBlankDesign, buildTemplate, TEMPLATES } from './templates';

const spec = buildTemplate('landing-clasica', PALETTES[0]!);

/** Diseño con una página extra válida (ids propios, no chocan con la portada). */
const multiPageSpec = (() => {
  const result = parseDesignSpec({
    ...spec,
    pages: [
      {
        id: 'pagina-tienda',
        name: 'Tienda',
        path: '/tienda',
        sections: [
          {
            id: 'seccion-tienda',
            rows: [
              {
                id: 'fila-tienda',
                columns: [
                  {
                    id: 'columna-tienda',
                    components: [{ type: 'heading', id: 'titulo-tienda', text: 'Tienda' }],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });
  if (!result.success) throw new Error(result.errors.join('\n'));
  return result.data;
})();

describe('templates', () => {
  it('las8 plantillas generan specs válidos con cualquier paleta', () => {
    expect(TEMPLATES).toHaveLength(8);

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

describe('multi-página (store)', () => {
  it('arranca en la portada con la página activa vacía', () => {
    const state = createInitialState(multiPageSpec);
    expect(state.activePageId).toBeNull();
    expect(state.selection).toEqual({ kind: 'global' });
  });

  it('cambia de página y resetea la selección', () => {
    const initial = createInitialState(multiPageSpec);
    const withSelection = builderReducer(initial, {
      type: 'select',
      selection: { kind: 'section', id: 'hero' },
    });
    const onPage = builderReducer(withSelection, { type: 'page', pageId: 'pagina-tienda' });

    expect(onPage.activePageId).toBe('pagina-tienda');
    expect(onPage.selection).toEqual({ kind: 'page', id: 'pagina-tienda' });

    const backHome = builderReducer(onPage, { type: 'page', pageId: null });
    expect(backHome.activePageId).toBeNull();
    expect(backHome.selection).toEqual({ kind: 'global' });
  });

  it('vuelve a la portada si la página activa se elimina', () => {
    let state = builderReducer(createInitialState(multiPageSpec), {
      type: 'page',
      pageId: 'pagina-tienda',
    });
    state = builderReducer(state, {
      type: 'update',
      mutate: (draft) => {
        draft.pages = [];
      },
    });

    expect(state.spec.pages).toHaveLength(0);
    expect(state.activePageId).toBeNull();
  });

  it('permite añadir páginas nuevas (y las re-valida)', () => {
    const state = builderReducer(createInitialState(multiPageSpec), {
      type: 'update',
      mutate: (draft) => {
        draft.pages.push({
          id: 'pagina-blog',
          name: 'Blog',
          path: '/blog',
          sections: [
            {
              id: 'seccion-blog',
              rows: [
                {
                  id: 'fila-blog',
                  columns: [
                    {
                      id: 'columna-blog',
                      components: [{ type: 'heading', id: 'titulo-blog', text: 'Blog' }],
                    },
                  ],
                },
              ],
            },
          ],
        } as (typeof draft.pages)[number]);
      },
    });

    expect(state.spec.pages).toHaveLength(2);
    expect(state.spec.pages[1]?.path).toBe('/blog');
  });

  it('rechaza en silencio una página con ruta duplicada', () => {
    const before = createInitialState(multiPageSpec);
    const after = builderReducer(before, {
      type: 'update',
      mutate: (draft) => {
        draft.pages.push({
          id: 'pagina-duplicada',
          name: 'Otra',
          path: '/tienda',
          sections: [
            {
              id: 'seccion-duplicada',
              rows: [
                {
                  id: 'fila-duplicada',
                  columns: [
                    {
                      id: 'columna-duplicada',
                      components: [{ type: 'heading', id: 'titulo-duplicada', text: 'X' }],
                    },
                  ],
                },
              ],
            },
          ],
        } as (typeof draft.pages)[number]);
      },
    });

    expect(after).toBe(before);
    expect(after.spec.pages).toHaveLength(1);
  });
});
