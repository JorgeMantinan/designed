import { describe, expect, it } from 'vitest';

import { parseDesignSpec } from '@designed/schema';

import {
  COMPONENT_FIELDS,
  FOOTER_FIELDS,
  HEADER_MENU_FIELDS,
  createDefaultComponent,
  getPath,
  reassignIds,
  setPath,
} from './fields';

describe('reassignIds', () => {
  it('regenera ids profundamente (incluidos los anidados como botones)', () => {
    const section = {
      id: 'seccion-1',
      kind: 'generic',
      width: 'contained',
      rows: [
        {
          id: 'fila-1',
          stackBelow: 'mobile',
          columns: [
            {
              id: 'columna-1',
              span: 12,
              hideOn: [],
              verticalAlign: 'start',
              contentAlign: 'stretch',
              components: [
                {
                  type: 'buttonGroup',
                  id: 'botones-1',
                  align: 'center',
                  buttons: [
                    { id: 'cta-1', label: 'Uno', href: '#', variant: 'solid' },
                    { id: 'cta-2', label: 'Dos', href: '#', variant: 'outline' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    reassignIds(section);

    // Todos los ids cambiaron y siguen siendo kebab-case.
    expect(section.id).not.toBe('seccion-1');
    expect(section.rows[0]?.id).not.toBe('fila-1');
    expect(section.rows[0]?.columns[0]?.id).not.toBe('columna-1');
    const group = section.rows[0]?.columns[0]?.components[0];
    expect(group?.id).not.toBe('botones-1');
    expect(group?.buttons[0]?.id).not.toBe('cta-1');
    expect(group?.buttons[1]?.id).not.toBe('cta-2');
    for (const id of [section.id, group?.id, group?.buttons[0]?.id]) {
      expect(id).toMatch(/^[a-z0-9-]+$/);
    }

    // El contenido NO cambia (solo los ids).
    expect(group?.buttons[0]?.label).toBe('Uno');

    // Y la duplicación pasa el validador global de unicidad.
    const original = {
      version: 1,
      meta: { name: 'Test' },
      theme: {
        palette: {
          primary: '#6C5CE7',
          secondary: '#00CEC9',
          accent: '#FD79A8',
          background: '#FFFFFF',
          surface: '#F5F5F7',
        },
      },
      sections: [section],
    };
    const result = parseDesignSpec(original);
    expect(result.success, result.success ? '' : result.errors.join('\n')).toBe(true);
  });

  it('es seguro con arrays, null y valores primitivos', () => {
    const tree: { id: string; nested: unknown[] } = {
      id: 'a',
      nested: [{ id: 'b' }, null, 42, 'texto'],
    };
    reassignIds(tree);

    expect(tree.id).not.toBe('a');
    expect((tree.nested[0] as { id: string }).id).not.toBe('b');
    expect(tree.nested[1]).toBeNull();
    expect(tree.nested[2]).toBe(42);
    expect(tree.nested[3]).toBe('texto');
  });
});

describe('setPath / getPath', () => {
  it('asigna rutas planas y anidadas', () => {
    const target = { overlay: { color: '#000000', intensity: 0.5 } };
    const next = setPath(target, 'overlay.intensity', 0.8) as typeof target;

    expect(getPath(next, 'overlay.intensity')).toBe(0.8);
    expect(getPath(next, 'overlay.color')).toBe('#000000');
  });

  it('soporta índices de lista: buttons[1].label', () => {
    const target = { buttons: [{ label: 'Uno' }, { label: 'Dos' }] };
    const next = setPath(target, 'buttons[1].label', 'Tres') as typeof target;

    expect(next.buttons[1]?.label).toBe('Tres');
    expect(next.buttons[0]?.label).toBe('Uno');
  });

  it('crea la estructura intermedia cuando falta', () => {
    const next = setPath({}, 'a.b.c', 1) as Record<string, unknown>;
    expect(getPath(next, 'a.b.c')).toBe(1);
  });

  it('no muta el objetivo original', () => {
    const target = { value: 1 };
    setPath(target, 'value', 2);
    expect(target.value).toBe(1);
  });
});

describe('createDefaultComponent', () => {
  it('crea instancias válidas para los15 tipos', () => {
    const types = Object.keys(COMPONENT_FIELDS);
    expect(types).toHaveLength(15);

    for (const type of types) {
      const component = createDefaultComponent(
        type as Parameters<typeof createDefaultComponent>[0],
      );
      expect(component.type).toBe(type);
      expect(component.id).toMatch(/^[a-z0-9][a-z0-9-]*$/);
    }
  });

  it('los botones por defecto llevan id (requerido por el schema)', () => {
    const group = createDefaultComponent('buttonGroup');
    expect(group.type).toBe('buttonGroup');
    if (group.type === 'buttonGroup') {
      expect(group.buttons[0]?.id).toMatch(/^[a-z0-9-]+$/);
    }
  });
});

describe('HEADER_MENU_FIELDS / FOOTER_FIELDS', () => {
  it('el menú crea items con id y submenú anidado', () => {
    const list = HEADER_MENU_FIELDS[0];
    expect(list?.kind).toBe('list');
    if (list?.kind !== 'list') return;

    const item = list.createItem() as Record<string, unknown>;
    expect(item.id).toMatch(/^[a-z0-9-]+$/);
    expect(list.itemFields.some((field) => field.key === 'children' && field.kind === 'list')).toBe(
      true,
    );
  });

  it('el footer crea columnas con enlaces y redes válidas', () => {
    const columns = FOOTER_FIELDS.find((field) => field.key === 'columns');
    const social = FOOTER_FIELDS.find((field) => field.key === 'social');
    expect(columns?.kind).toBe('list');
    expect(social?.kind).toBe('list');

    if (columns?.kind === 'list') {
      const column = columns.createItem() as Record<string, unknown>;
      expect(column.id).toMatch(/^[a-z0-9-]+$/);
      expect(column.title).toBeTruthy();
    }
    if (social?.kind === 'list') {
      expect(social.createItem()).toEqual({ platform: 'github', href: 'https://github.com/' });
    }
  });
});
