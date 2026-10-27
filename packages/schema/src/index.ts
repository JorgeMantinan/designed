/**
 * DesignSpec: fuente de verdad del diseño.
 *
 * Todo lo que el usuario configura en el builder (layout, tokens, animaciones,
 * overlays) se serializa en un objeto validado por este esquema. De él salen:
 *  1. el preview en vivo,
 *  2. el proyecto exportado (codegen),
 *  3. en el futuro, otros emisores (Angular, HTML estático...).
 *
 * Versión del esquema. Al cambiar la forma del DesignSpec, incrementar para
 * poder migrar specs antiguas.
 */
export const DESIGN_SPEC_VERSION = 1 as const;

/** Tipo raíz del diseño. Se irá definiendo en la Fase 1. */
export type DesignSpecVersion = typeof DESIGN_SPEC_VERSION;
