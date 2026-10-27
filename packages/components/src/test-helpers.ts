import type { DesignSpec } from '@designed/schema';
import { parseDesignSpec } from '@designed/schema';

/**
 * Test-only helper: parses a spec document like the builder does and throws
 * with readable errors when the fixture is invalid.
 */
export function mustParse(input: unknown): DesignSpec {
  const result = parseDesignSpec(input);
  if (!result.success) {
    throw new Error(`Spec inválido en test:\n${result.errors.join('\n')}`);
  }
  return result.data;
}
