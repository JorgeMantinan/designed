import { describe, expect, it } from 'vitest';
import type { z } from 'zod';

import {
  DESIGN_SPEC_VERSION,
  collectIds,
  type designSpecSchema,
  findDuplicateIds,
  parseDesignSpec,
} from './design-spec';
import { exampleDesignSpec, minimalDesignSpec } from './fixtures';

type DesignSpecInput = z.input<typeof designSpecSchema>;

/** Deep clone typed as a mutable spec input (defaults become optional props). */
function cloneMinimal(): DesignSpecInput {
  return JSON.parse(JSON.stringify(minimalDesignSpec)) as DesignSpecInput;
}

function cloneExample(): DesignSpecInput {
  return JSON.parse(JSON.stringify(exampleDesignSpec)) as DesignSpecInput;
}

describe('DESIGN_SPEC_VERSION', () => {
  it('es 1', () => {
    expect(DESIGN_SPEC_VERSION).toBe(1);
  });
});

describe('parseDesignSpec', () => {
  it('acepta el diseño de ejemplo completo', () => {
    const result = parseDesignSpec(exampleDesignSpec);

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data.sections).toHaveLength(8);
    expect(result.data.header.layout).toBe('angled');
    expect(result.data.meta.name).toBe('Nébula Studio');
  });

  it('rellena todos los defaults del spec mínimo', () => {
    const result = parseDesignSpec(minimalDesignSpec);

    expect(result.success).toBe(true);
    if (!result.success) return;

    const spec = result.data;
    expect(spec.meta.lang).toBe('es');
    expect(spec.header.layout).toBe('top');
    expect(spec.header.sticky).toBe(true);
    expect(spec.header.brand.name).toBe('My site');
    expect(spec.header.itemAnimation).toEqual({
      type: 'underline',
      durationMs: 200,
      easing: 'ease',
      intensity: 0.5,
    });
    expect(spec.footer.newsletter).toBe(false);
    expect(spec.theme.typography.scale).toBe('normal');
    expect(spec.theme.spacing.sectionYPx).toBe(64);
    expect(spec.sections[0]?.kind).toBe('generic');
    expect(spec.sections[0]?.width).toBe('contained');

    const heading = spec.sections[0]?.rows[0]?.columns[0]?.components[0];
    expect(heading?.type).toBe('heading');
    if (heading?.type === 'heading') {
      expect(heading.level).toBe(2);
      expect(heading.align).toBe('left');
      expect(heading.tone).toBe('default');
    }
  });

  it('aplica defaults a los botones anidados', () => {
    const result = parseDesignSpec(exampleDesignSpec);

    expect(result.success).toBe(true);
    if (!result.success) return;

    const pricing = result.data.sections.find((section) => section.id === 'precios');
    const card = pricing?.rows[0]?.columns[0]?.components[0];
    expect(card?.type).toBe('pricingCard');
    if (card?.type !== 'pricingCard' || !card.cta) throw new Error('pricingCard sin cta');

    expect(card.cta.href).toBe('#');
    expect(card.cta.size).toBe('md');
    expect(card.cta.newTab).toBe(false);
    expect(card.highlighted).toBe(false);
    expect(card.currency).toBe('$');
  });

  it('rechaza una versión desconocida', () => {
    const result = parseDesignSpec({ ...minimalDesignSpec, version: 2 });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors[0]).toContain('version');
  });

  it('rechaza colores que no son hex y señala la ruta', () => {
    const invalid = cloneMinimal();
    invalid.theme.palette.primary = 'rojo';

    const result = parseDesignSpec(invalid);

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors[0]).toContain('theme.palette.primary');
  });

  it('rechaza componentes de tipo desconocido', () => {
    const invalid = cloneMinimal();
    const first = invalid.sections[0]?.rows[0]?.columns[0]?.components[0];
    if (first) (first as { type: string }).type = 'holograma';

    const result = parseDesignSpec(invalid);

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors[0]).toContain('components.0.type');
  });

  it('rechaza secciones vacías', () => {
    const result = parseDesignSpec({ ...minimalDesignSpec, sections: [] });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors[0]).toContain('sections');
  });

  it('rechaza spans fuera del rango 1-12', () => {
    const invalid = cloneMinimal();
    const column = invalid.sections[0]?.rows[0]?.columns[0];
    if (column) column.span = 13;

    const result = parseDesignSpec(invalid);

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors[0]).toContain('columns.0.span');
  });

  it('detecta ids duplicados en todo el árbol', () => {
    const invalid = cloneExample();
    const features = invalid.sections.find((section) => section.id === 'servicios');
    const firstCard = features?.rows[0]?.columns[0]?.components[0];
    if (firstCard) firstCard.id = 'hero-titulo';

    const result = parseDesignSpec(invalid);

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors.some((error) => error.includes('hero-titulo'))).toBe(true);
  });

  it('rechaza un documento basura sin lanzar excepción', () => {
    for (const input of [null, undefined, 42, 'texto', [], {}]) {
      const result = parseDesignSpec(input);
      expect(result.success).toBe(false);
    }
  });
});

describe('collectIds', () => {
  it('recorre arrays y objetos anidados', () => {
    expect(collectIds({ id: 'a', nested: { id: 'b' }, list: [{ id: 'c' }] })).toEqual([
      'a',
      'b',
      'c',
    ]);
  });

  it('ignora los valores que no son ids', () => {
    expect(collectIds({ name: 'sin-id', nested: { label: 'tampoco' } })).toEqual([]);
  });
});

describe('findDuplicateIds', () => {
  it('devuelve los ids repetidos ordenados', () => {
    const spec = { a: { id: 'y' }, b: [{ id: 'x' }, { id: 'y' }], c: { id: 'x' } };
    expect(findDuplicateIds(spec)).toEqual(['x', 'y']);
  });

  it('devuelve una lista vacía sin duplicados', () => {
    expect(findDuplicateIds({ a: { id: 'x' }, b: { id: 'y' } })).toEqual([]);
  });
});
