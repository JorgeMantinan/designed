import type { ThemeSpec } from '@designed/schema';

import { flattenTokens } from './build';

/**
 * Emits the tokens as a `:root` block of CSS custom properties — the format
 * used by the live preview and by the exported project's base stylesheet.
 */
export function toCssVariables(theme: ThemeSpec): string {
  const lines = Object.entries(flattenTokens(theme)).map(
    ([name, value]) => `  --${name}: ${value};`,
  );
  return `:root {\n${lines.join('\n')}\n}\n`;
}
