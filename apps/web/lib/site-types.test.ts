import { describe, expect, it } from 'vitest';

import { PALETTES } from '@designed/palettes';

import { SITE_TYPES, buildSiteType } from './site-types';

describe('SITE_TYPES', () => {
  it('cada starter genera un diseño multi-página válido', () => {
    expect(SITE_TYPES.length).toBeGreaterThanOrEqual(6);

    for (const site of SITE_TYPES) {
      const spec = buildSiteType(site.id);

      expect(spec.version, site.id).toBe(1);
      expect(spec.pages.length, site.id).toBeGreaterThan(0);
      expect(spec.sections.length, site.id).toBeGreaterThan(0);

      // Cada página enlazada desde el menú superior.
      const pageHrefs = spec.header.items.map((item) => item.href);
      for (const page of spec.pages) {
        expect(pageHrefs, `${site.id} → ${page.path}`).toContain(page.path);
      }

      // Rutas únicas y nunca '/' en las páginas extra.
      const paths = spec.pages.map((page) => page.path);
      expect(new Set(paths).size, site.id).toBe(paths.length);
      expect(paths, site.id).not.toContain('/');

      // Paleta aplicada (la del sector o la de respaldo).
      const palette = PALETTES.find((item) => item.id === site.paletteId);
      expect(palette, site.id).toBeDefined();
      expect(spec.theme.palette.primary, site.id).toBe(palette!.colors.primary);
    }
  });

  it('los starters no comparten la misma portada (plantillas variadas)', () => {
    const templates = SITE_TYPES.map((site) => site.templateId);
    expect(new Set(templates).size).toBeGreaterThanOrEqual(4);
  });

  it('lanza con ids desconocidos', () => {
    expect(() => buildSiteType('no-existe')).toThrow('desconocido');
  });
});
