import { describe, expect, it } from 'vitest';

import { parseDesignSpec } from '@designed/schema';

import { PAGE_PRESETS, createPageFromPreset } from './page-presets';
import type { NewPage } from './page-presets';
import { buildBlankDesign } from './templates';

const home = buildBlankDesign();

function parseWithPage(page: NewPage) {
  const result = parseDesignSpec({ ...home, pages: [page] });
  if (!result.success) throw new Error(result.errors.join('\n'));
  return result.data;
}

describe('PAGE_PRESETS', () => {
  it('hay presets variados y sin duplicados', () => {
    expect(PAGE_PRESETS.length).toBeGreaterThanOrEqual(10);
    const ids = PAGE_PRESETS.map((preset) => preset.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const preset of PAGE_PRESETS) {
      expect(preset.path, preset.id).toMatch(/^\/[a-z0-9-]+$/);
      expect(preset.description.length, preset.id).toBeGreaterThan(10);
    }
  });

  it('cada preset crea una página válida dentro de un diseño real', () => {
    for (const preset of PAGE_PRESETS) {
      const page = createPageFromPreset(preset.id, []);
      expect(page, preset.id).not.toBeNull();
      expect(page!.sections.length, preset.id).toBeGreaterThanOrEqual(1);

      // parseDesignSpec rellena defaults y valida ids únicos globales.
      const spec = parseWithPage(page!);
      const created = spec.pages[0];
      expect(created?.name, preset.id).toBe(page!.name);
      expect(created?.path, preset.id).toBe(page!.path);
    }
  });

  it('el mismo preset dos veces conserva ids y rutas únicos', () => {
    const first = createPageFromPreset('tienda', []);
    const second = createPageFromPreset('tienda', [first!.path]);

    expect(second!.path).toBe('/tienda-2');
    expect(second!.id).not.toBe(first!.id);

    const spec = parseDesignSpec({ ...home, pages: [first, second] });
    expect(spec.success).toBe(true);
  });

  it('createPageFromPreset devuelve null con ids desconocidos', () => {
    expect(createPageFromPreset('no-existe', [])).toBeNull();
  });
});
