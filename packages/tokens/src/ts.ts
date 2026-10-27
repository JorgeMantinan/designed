import type { ThemeSpec } from '@designed/schema';

import { flattenTokens } from './build';

/**
 * Emits the tokens as a TypeScript constants module (same names as the CSS
 * variables, flat) for code that needs token values in JS/TS — e.g. canvas
 * animations or tests in the exported project.
 */
export function toTsConstants(theme: ThemeSpec): string {
  const tokens = flattenTokens(theme);
  const body = JSON.stringify(tokens, null, 2);
  return `// Generado por designed — no editar a mano.\n\nexport const tokens = ${body} as const;\n`;
}
