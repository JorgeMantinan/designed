import type { ThemeSpec } from '@designed/schema';

import { flattenTokens } from './build';

function scssName(cssName: string): string {
  return cssName.replaceAll('-', '_');
}

/**
 * Emits a `_tokens.scss` partial:
 *  - SCSS variables (`$color_primary`) for use inside mixins/functions
 *  - a `:root` block fed by those variables so CSS vars stay in sync
 *
 * The generated file is what lands in the exported project's
 * `src/styles/tokens/_tokens.scss`.
 */
export function toScssVariables(theme: ThemeSpec): string {
  const entries = Object.entries(flattenTokens(theme));
  const scssLines = entries.map(([name, value]) => `$${scssName(name)}: ${value};`);
  const cssLines = entries.map(([name]) => {
    const variable = scssName(name);
    return `  --${name}: #{$${variable}};`;
  });

  return [
    '// Generado por @designed/tokens — no editar a mano.',
    '',
    ...scssLines,
    '',
    ':root {',
    ...cssLines,
    '}',
    '',
  ].join('\n');
}
