import type { Palette } from '@designed/palettes';
import { PALETTES } from '@designed/palettes';
import type { DesignSpec } from '@designed/schema';
import { parseDesignSpec } from '@designed/schema';

import { newId } from './fields';
import { createPageFromPreset } from './page-presets';
import { buildTemplate } from './templates';

/**
 * Site starters offered on the landing page: a full multi-page design in
 * one click (home template + pre-built pages + menu links). Each starter
 * uses a palette that fits its sector — the user can switch palettes later
 * from the builder.
 */

export interface SiteType {
  id: string;
  label: string;
  icon: string;
  description: string;
  /** Palette applied when starting from the landing. */
  paletteId: string;
  /** Home page template (from the template gallery). */
  templateId: string;
  /** Page presets appended as extra pages, in menu order. */
  pagePresetIds: string[];
  /** Name of the whole design (site brand). */
  siteName: string;
}

export const SITE_TYPES: readonly SiteType[] = [
  {
    id: 'ecommerce',
    label: 'Tienda online',
    icon: '🛍️',
    description: 'Catálogo, precios y contacto: vende desde el primer día.',
    paletteId: 'azul-corporativo',
    templateId: 'tienda-online',
    pagePresetIds: ['tienda', 'planes', 'contacto'],
    siteName: 'Mi tienda',
  },
  {
    id: 'negocio',
    label: 'Negocio físico',
    icon: '🏪',
    description: 'Restaurante, peluquería o clínica: hora, dirección y reservas.',
    paletteId: 'esmeralda',
    templateId: 'negocio-local',
    pagePresetIds: ['reservas', 'contacto', 'ayuda'],
    siteName: 'Mi negocio',
  },
  {
    id: 'famoso',
    label: 'Página de famoso',
    icon: '⭐',
    description: 'Bio, cifras, prensa y blog personal con mucho impacto.',
    paletteId: 'fucsia-neon',
    templateId: 'historia-vertical',
    pagePresetIds: ['sobre-mi', 'blog', 'galeria'],
    siteName: 'Mi marca',
  },
  {
    id: 'viajes',
    label: 'Viajes y destinos',
    icon: '✈️',
    description: 'Inspiración, galerías de lugares y testimonios de viajeros.',
    paletteId: 'turquesa-playa',
    templateId: 'grid-cuatro-dos',
    pagePresetIds: ['destinos', 'blog', 'contacto'],
    siteName: 'Rumbo viajes',
  },
  {
    id: 'restaurante',
    label: 'Restaurante',
    icon: '🍽️',
    description: 'Carta, reservas y galería de platos con ambiente propio.',
    paletteId: 'bordeos',
    templateId: 'restaurante',
    pagePresetIds: ['reservas', 'galeria', 'contacto'],
    siteName: 'Mi restaurante',
  },
  {
    id: 'creador',
    label: 'Creador / freelance',
    icon: '🎨',
    description: 'Portfolio, servicios y blog para trabajar por tu cuenta.',
    paletteId: 'morado-creativo',
    templateId: 'portfolio-carrusel',
    pagePresetIds: ['portfolio', 'planes', 'blog'],
    siteName: 'Yo studio',
  },
];

/**
 * Builds the full multi-page spec for a site starter: home template +
 * one page per preset + header links pointing at each page.
 */
export function buildSiteType(siteTypeId: string): DesignSpec {
  const site = SITE_TYPES.find((item) => item.id === siteTypeId);
  if (!site) throw new Error(`Tipo de sitio desconocido: ${siteTypeId}`);

  const palette: Palette = PALETTES.find((item) => item.id === site.paletteId) ?? PALETTES[0]!;
  const spec = buildTemplate(site.templateId, palette);

  const takenPaths: string[] = [];
  for (const presetId of site.pagePresetIds) {
    const page = createPageFromPreset(presetId, takenPaths);
    if (!page) continue;
    takenPaths.push(page.path);
    spec.pages.push(page as (typeof spec.pages)[number]);
    spec.header.items.push({
      id: newId('nav'),
      label: page.name,
      href: page.path,
      children: [],
    });
  }

  spec.meta.name = site.siteName;
  spec.meta.description = `${site.label} — web multipágina creada con designed.`;

  const result = parseDesignSpec(spec);
  if (!result.success) {
    throw new Error(`Starter inválido "${siteTypeId}":\n${result.errors.join('\n')}`);
  }
  return result.data;
}
