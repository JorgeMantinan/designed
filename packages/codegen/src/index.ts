/**
 * @designed/codegen — DesignSpec → proyecto Vite + React + TypeScript
 * exportable en ZIP.
 *
 * En el futuro, el mismo spec podrá emitirse a Angular u HTML estático
 * añadiendo un emisor nuevo sin tocar el resto del sistema.
 */

/** Tipo de archivo del proyecto exportado. */
export interface ExportedFile {
  /** Ruta relativa dentro del proyecto, con `/` como separador. */
  path: string;
  /** Contenido completo del archivo. */
  content: string;
}

/** Estructura completa de un proyecto exportado. */
export type ExportedProject = ExportedFile[];

export { generateProject } from './generate';
export { slugify } from './static-files';
export { rewriteSource, copyComponentSources } from './copy';
export { relativeImport, repoRoot, findRepoRoot } from './paths';
