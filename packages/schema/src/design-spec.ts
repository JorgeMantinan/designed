import { z } from 'zod';

import { footerSchema, headerSchema, DEFAULT_FOOTER, DEFAULT_HEADER } from './navigation';
import { sectionSchema } from './layout';
import { themeSchema } from './tokens';

/**
 * DesignSpec: the single source of truth of a design.
 *
 * Everything the user configures in the builder serializes to a JSON document
 * validated by this schema. Three consumers read it:
 *   1. the live preview inside the builder,
 *   2. the codegen that emits the exportable React project,
 *   3. future emitters (Angular, static HTML...).
 *
 * Bump DESIGN_SPEC_VERSION whenever the shape changes incompatibly so old
 * documents can be migrated.
 */

export const DESIGN_SPEC_VERSION = 1 as const;
export type DesignSpecVersion = typeof DESIGN_SPEC_VERSION;

export const designMetaSchema = z.object({
  name: z.string().min(1).max(80),
  description: z.string().max(300).optional(),
  /** UI language of the builder for this design. */
  lang: z.enum(['es', 'en']).default('es'),
});

export const designSpecSchema = z.object({
  version: z.literal(DESIGN_SPEC_VERSION),
  meta: designMetaSchema,
  theme: themeSchema,
  header: headerSchema.default({ ...DEFAULT_HEADER }),
  sections: z.array(sectionSchema).min(1).max(40),
  footer: footerSchema.default({ ...DEFAULT_FOOTER }),
});

export type DesignSpec = z.infer<typeof designSpecSchema>;
export type DesignMeta = z.infer<typeof designMetaSchema>;

/**
 * Recursively collects every `id` found in a parsed spec (sections, rows,
 * columns, components, nav items...). Any object with a string `id` counts.
 */
export function collectIds(value: unknown, out: string[] = []): string[] {
  if (Array.isArray(value)) {
    for (const item of value) collectIds(item, out);
    return out;
  }
  if (value !== null && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    if (typeof record.id === 'string') out.push(record.id);
    for (const item of Object.values(record)) collectIds(item, out);
  }
  return out;
}

/** Returns the ids that appear more than once, sorted alphabetically. */
export function findDuplicateIds(spec: unknown): string[] {
  const counts = new Map<string, number>();
  for (const id of collectIds(spec)) {
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([id]) => id)
    .sort();
}

export type ParseDesignSpecResult =
  { success: true; data: DesignSpec } | { success: false; errors: string[] };

/**
 * Validates an untrusted document (imported JSON, API payload...) and returns
 * either the typed spec or a list of human-readable errors in Spanish.
 *
 * Use this — not `designSpecSchema.parse` — as the entry point: it also
 * enforces global id uniqueness.
 */
export function parseDesignSpec(input: unknown): ParseDesignSpecResult {
  const parsed = designSpecSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.issues.map((issue) =>
        issue.path.length > 0 ? `${issue.path.join('.')}: ${issue.message}` : issue.message,
      ),
    };
  }

  const duplicates = findDuplicateIds(parsed.data);
  if (duplicates.length > 0) {
    return {
      success: false,
      errors: duplicates.map(
        (id) => `ids duplicados: "${id}" — todos los ids deben ser únicos en el diseño`,
      ),
    };
  }

  return { success: true, data: parsed.data };
}
