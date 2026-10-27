import type {
  AnimationInput,
  AnimationSpec,
  EntranceAnimationInput,
  EntranceAnimationSpec,
  HoverAnimationInput,
  HoverAnimationSpec,
} from '@designed/schema';

/**
 * The builder edits animations as partial inputs (only the picked type), but
 * the stored spec is fully normalized — these helpers fill the schema
 * defaults before writing into the draft.
 */

export function normalizeEntrance(
  input: EntranceAnimationInput | undefined,
): EntranceAnimationSpec | undefined {
  if (!input) return undefined;
  return {
    type: input.type,
    durationMs: input.durationMs ?? 600,
    delayMs: input.delayMs ?? 0,
    easing: input.easing ?? 'ease-out',
    trigger: input.trigger ?? 'scroll',
    once: input.once ?? true,
  };
}

export function normalizeHover(
  input: HoverAnimationInput | undefined,
): HoverAnimationSpec | undefined {
  if (!input) return undefined;
  return {
    type: input.type,
    durationMs: input.durationMs ?? 200,
    easing: input.easing ?? 'ease',
    intensity: input.intensity ?? 0.5,
  };
}

export function normalizeAnimation(input: AnimationInput | undefined): AnimationSpec | undefined {
  if (!input) return undefined;
  const entrance = normalizeEntrance(input.entrance);
  const hover = normalizeHover(input.hover);
  if (!entrance && !hover) return undefined;
  return { entrance, hover };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Deep merge used by the field editor: partial updates (from `setPath`) are
 * merged onto the existing node so untouched defaults are preserved.
 * `undefined` values remove the key (clearing optional fields).
 */
export function mergeDeep<T>(target: T, source: unknown): T {
  if (!isPlainObject(source)) return target;

  const result = structuredClone(target) as Record<string, unknown>;
  for (const [key, value] of Object.entries(source)) {
    if (value === undefined) {
      delete result[key];
    } else if (isPlainObject(value) && isPlainObject(result[key])) {
      result[key] = mergeDeep(result[key], value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}
