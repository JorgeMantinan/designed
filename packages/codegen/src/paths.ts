import { existsSync } from 'node:fs';
import { dirname, join, posix, resolve } from 'node:path';

/**
 * Path helpers: locates the monorepo root (for reading the component
 * sources we emit) and computes POSIX-relative imports between emitted files.
 */

let cachedRoot: string | null = null;

/** Walks up from `startDir` until it finds pnpm-workspace.yaml. */
export function findRepoRoot(startDir: string): string {
  let current = resolve(startDir);
  for (;;) {
    if (existsSync(join(current, 'pnpm-workspace.yaml'))) return current;
    const parent = dirname(current);
    if (parent === current) {
      throw new Error(`No se encontró la raíz del monorepo desde: ${startDir}`);
    }
    current = parent;
  }
}

/** Cached repo root from the current working directory (works from apps/web or packages/*). */
export function repoRoot(): string {
  if (!cachedRoot) cachedRoot = findRepoRoot(process.cwd());
  return cachedRoot;
}

/** Relative import specifier between two emitted files (POSIX, extensionless). */
export function relativeImport(fromFile: string, toFile: string): string {
  const withoutExt = toFile.replace(/\.(ts|tsx)$/, '');
  const result = posix.relative(posix.dirname(fromFile), withoutExt);
  return result.startsWith('.') ? result : `./${result}`;
}
