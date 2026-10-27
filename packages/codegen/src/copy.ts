import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

import { relativeImport, repoRoot } from './paths';
import type { ExportedFile } from './index';

/**
 * Copies the REAL component/hook sources from the monorepo into the exported
 * project, rewriting `@designed/*` imports to relative paths so the result is
 * a standalone Vite project with zero workspace dependencies.
 *
 * - `@designed/schema`   → `src/types/spec` (structural type mirror)
 * - `@designed/animations` → `src/hooks/animations` (aggregate re-export)
 * - `@designed/tokens`   → `src/styles/tokens` (baked token map + shim)
 */

const COMPONENTS_SRC = 'packages/components/src';
const ANIMATIONS_SRC = 'packages/animations/src';

/** Files that exist for the monorepo's own tooling and must not ship. */
const SKIP_FILES = new Set(['index.ts', 'index.test.ts', 'scss.d.ts', 'test-helpers.ts']);
const SKIP_PATTERN = /\.test\.(ts|tsx)$/;

/** Explicit copies for files that live outside the components folder. */
const EXPLICIT_COPIES: ReadonlyArray<{ from: string; to: string; rewrite: boolean }> = [
  { from: `${ANIMATIONS_SRC}/styles/motion.scss`, to: 'src/styles/motion.scss', rewrite: false },
  { from: `${COMPONENTS_SRC}/styles/global.scss`, to: 'src/styles/global.scss', rewrite: false },
  { from: `${ANIMATIONS_SRC}/motion.ts`, to: 'src/hooks/motion.ts', rewrite: true },
];

/** Strips editor directives and rewrites workspace imports to relative ones. */
export function rewriteSource(content: string, outFile: string): string {
  const schemaPath = relativeImport(outFile, 'src/types/spec.ts');
  const animationsPath = relativeImport(outFile, 'src/hooks/animations.ts');
  const tokensPath = relativeImport(outFile, 'src/styles/tokens.ts');

  return content
    .replace(/^'use client';\n+/, '')
    .replace(/from '@designed\/schema'/g, `from '${schemaPath}'`)
    .replace(/from '@designed\/animations'/g, `from '${animationsPath}'`)
    .replace(/from '@designed\/tokens'/g, `from '${tokensPath}'`);
}

async function walk(root: string, base = ''): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const relative = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...(await walk(join(root, entry.name), relative)));
    } else {
      files.push(relative);
    }
  }

  return files;
}

/** Reads the component sources and returns them with rewritten imports. */
export async function copyComponentSources(): Promise<ExportedFile[]> {
  const root = repoRoot();
  const files: ExportedFile[] = [];

  const componentFiles = await walk(join(root, COMPONENTS_SRC));
  for (const relative of componentFiles) {
    // Global styles are re-mapped to src/styles/ via EXPLICIT_COPIES.
    if (relative.startsWith('styles/')) continue;
    if (SKIP_FILES.has(relative) || SKIP_PATTERN.test(relative)) continue;

    const outFile = `src/components/${relative}`;
    const raw = await readFile(join(root, COMPONENTS_SRC, relative), 'utf8');
    const isSource = relative.endsWith('.ts') || relative.endsWith('.tsx');

    files.push({ path: outFile, content: isSource ? rewriteSource(raw, outFile) : raw });
  }

  // Interactive background effects live in the animations package but ship
  // inside the project's components folder (hooks/animations re-exports them).
  const backgroundFiles = await walk(join(root, ANIMATIONS_SRC, 'backgrounds'));
  for (const relative of backgroundFiles) {
    if (SKIP_PATTERN.test(relative)) continue;

    const outFile = `src/components/backgrounds/${relative}`;
    const raw = await readFile(join(root, ANIMATIONS_SRC, 'backgrounds', relative), 'utf8');
    const isSource = relative.endsWith('.ts') || relative.endsWith('.tsx');

    files.push({ path: outFile, content: isSource ? rewriteSource(raw, outFile) : raw });
  }

  for (const copy of EXPLICIT_COPIES) {
    const raw = await readFile(join(root, copy.from), 'utf8');
    files.push({
      path: copy.to,
      content: copy.rewrite ? rewriteSource(raw, copy.to) : raw,
    });
  }

  return files;
}
