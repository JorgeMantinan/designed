import type { DesignSpec } from '@designed/schema';

import { copyComponentSources } from './copy';
import { staticFiles } from './static-files';
import type { ExportedFile, ExportedProject } from './index';

/**
 * DesignSpec → complete standalone Vite + React + TypeScript project.
 *
 * The result is a list of files ready to be zipped: the real component
 * sources (import-rewritten), baked tokens, structural types and the design
 * data. `pnpm install && pnpm dev` works with no workspace present.
 */
export async function generateProject(spec: DesignSpec): Promise<ExportedProject> {
  const files: ExportedFile[] = [...staticFiles(spec), ...(await copyComponentSources())];

  const seen = new Set<string>();
  for (const file of files) {
    if (seen.has(file.path)) throw new Error(`Ruta duplicada al generar: ${file.path}`);
    seen.add(file.path);
  }

  return files.sort((left, right) => left.path.localeCompare(right.path));
}
