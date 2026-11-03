import type { DesignSpec } from '@designed/schema';

/**
 * Multi-page helpers: the home page lives at the spec root, extra pages in
 * `spec.pages`. Every mutation that touches "the sections the user sees"
 * must go through these helpers so it lands on the ACTIVE page instead of
 * always hitting the home page.
 */

type Sections = DesignSpec['sections'];
type Page = DesignSpec['pages'][number];

/** Sections of the active page (home = spec root; unknown page falls back home). */
export function activeSections(spec: DesignSpec, pageId: string | null): Sections {
  if (!pageId) return spec.sections;
  return spec.pages.find((page) => page.id === pageId)?.sections ?? spec.sections;
}

/** The active page object, or null when editing the home page. */
export function activePage(spec: DesignSpec, pageId: string | null): Page | null {
  if (!pageId) return null;
  return spec.pages.find((page) => page.id === pageId) ?? null;
}

/** Finds a section by id across home AND every page (ids are globally unique). */
export function findSectionAnywhere(spec: DesignSpec, id: string): Sections[number] | undefined {
  const root = spec.sections.find((section) => section.id === id);
  if (root) return root;
  for (const page of spec.pages) {
    const found = page.sections.find((section) => section.id === id);
    if (found) return found;
  }
  return undefined;
}

/**
 * The mutable array (home or page) that owns a section — use inside
 * `update` to move/duplicate/delete sections of any page.
 * Undefined when the section no longer exists.
 */
export function sectionsOwner(draft: DesignSpec, sectionId: string): Sections | undefined {
  if (draft.sections.some((section) => section.id === sectionId)) return draft.sections;
  for (const page of draft.pages) {
    if (page.sections.some((section) => section.id === sectionId)) return page.sections;
  }
  return undefined;
}

/** Normalizes a page path: '/Sobre mí' → '/sobre-mi' (always starts with '/'). */
export function normalizePagePath(input: string): string {
  const slug = input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9/]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  const withSlash = slug.startsWith('/') ? slug : `/${slug}`;
  return withSlash === '/' ? '/pagina' : withSlash;
}

/** Returns `path`, or `path-2`, `path-3`… until it is unique among `taken`. */
export function uniquePagePath(path: string, taken: readonly string[]): string {
  if (!taken.includes(path)) return path;
  for (let suffix = 2; suffix < 100; suffix += 1) {
    const candidate = `${path}-${suffix}`;
    if (!taken.includes(candidate)) return candidate;
  }
  return `${path}-${Date.now()}`;
}
