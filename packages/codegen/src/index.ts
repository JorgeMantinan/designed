/**
 * Codegen: emisor que transforma un DesignSpec en un proyecto Vite + React +
 * TypeScript completo y funcional (estructura real de carpetas, SCSS con
 * tokens, hooks, README en español), listo para empaquetar en un ZIP.
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
