import { describe, expect, it } from 'vitest';

import { SECTION_KINDS, parseDesignSpec } from '@designed/schema';

import { SECTION_PRESETS, createSectionFromPreset } from './section-presets';

const PALETTE = {
  primary: '#6C5CE7',
  secondary: '#00CEC9',
  accent: '#FD79A8',
  background: '#FFFFFF',
  surface: '#F5F5F7',
};

function parseWithSections(sections: unknown[]) {
  const result = parseDesignSpec({
    version: 1,
    meta: { name: 'Test' },
    theme: { palette: PALETTE },
    sections,
  });
  if (!result.success) throw new Error(result.errors.join('\n'));
  return result.data;
}

function countComponents(section: {
  rows: Array<{ columns: Array<{ components: unknown[] }> }>;
}): number {
  return section.rows.reduce(
    (total, row) => total + row.columns.reduce((sum, column) => sum + column.components.length, 0),
    0,
  );
}

describe('SECTION_PRESETS', () => {
  it('cubre todos los tipos de sección del schema (superset: puede haber extras)', () => {
    const presetIds = SECTION_PRESETS.map((preset) => preset.id);
    for (const kind of SECTION_KINDS) {
      expect(presetIds, kind).toContain(kind);
    }
    // Preset extra más allá de los kinds: fondo interactivo (issue del usuario).
    expect(presetIds).toContain('fondo-interactivo');
    // Sin duplicados en el catálogo.
    expect(new Set(presetIds).size).toBe(presetIds.length);
  });

  it('cada preset genera una sección válida con contenido y animación de entrada', () => {
    for (const preset of SECTION_PRESETS) {
      const section = preset.build();
      const spec = parseWithSections([section]);

      // El id del preset puede ser libre (extras como 'fondo-interactivo');
      // cuando coincide con un kind del schema, la sección debe usarlo.
      if ((SECTION_KINDS as readonly string[]).includes(preset.id)) {
        expect(spec.sections[0]?.kind, preset.id).toBe(preset.id);
      }
      expect(countComponents(section), preset.id).toBeGreaterThanOrEqual(1);
      // Todos los presets traen animación de entrada (sección o componente).
      expect(JSON.stringify(section), preset.id).toContain('"entrance"');
      expect(section.animation?.entrance ?? section.rows.length, preset.id).toBeTruthy();
    }
  });

  it('el mismo preset dos veces conserva ids únicos (son globales)', () => {
    const first = createSectionFromPreset('features');
    const second = createSectionFromPreset('features');

    expect(first).not.toBeNull();
    expect(first!.id).not.toBe(second!.id);

    // parseDesignSpec rechazaría ids duplicados: esto prueba la unicidad global.
    const spec = parseWithSections([first, second]);
    expect(spec.sections).toHaveLength(2);
  });

  it('los presets de varias filas/columnas mantienen la estructura', () => {
    const stats = createSectionFromPreset('stats');
    expect(stats?.rows[0]?.columns).toHaveLength(4);
    expect(stats?.background?.type).toBe('interactive');

    const gallery = createSectionFromPreset('gallery');
    expect(gallery?.rows).toHaveLength(2);

    const pricing = createSectionFromPreset('pricing');
    expect(pricing?.rows[0]?.columns.every((column) => column.span === 4)).toBe(true);
  });

  it('createSectionFromPreset devuelve null con ids desconocidos', () => {
    expect(createSectionFromPreset('no-existe')).toBeNull();
  });
});
