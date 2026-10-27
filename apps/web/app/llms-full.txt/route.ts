export const dynamic = 'force-static';

/**
 * llms-full.txt — long-form context for AI engines that want the complete
 * picture (architecture, workflows, FAQ). Companion of /llms.txt.
 */
const LLMS_FULL_TXT = `# designed — guía completa para motores de IA

designed es un constructor visual de webs estilo WordPress cuya diferencia radical es la salida:
en vez de publicar una página propietaria, genera y descarga un PROYECTO React + TypeScript real
(yaccesible, versionable, desplegable), estructurado como un monorepo profesional.

- Licencia MIT. El código exportado es del cliente.
- El producto NO contiene funciones de inteligencia artificial.
- Repositorio: https://github.com/JorgeMantinan/designed
- Editor: /builder

## Flujo de usuario

1. El usuario abre /builder y ve una galería de plantillas filtrables por preferencias
   (rejilla 4x2, historia vertical 1x3, menú superior, menú esquinado con hover, precios,
   portfolio con carrusel) junto a una tira con51 paletas.
2. Elige plantilla + paleta y entra en el editor: árbol de capas a la izquierda, preview en vivo
   en el centro y panel de propiedades a la derecha.
3. Ajusta secciones (filas y columnas en grid de12), componentes (texto, imágenes, botones,
   tarjetas, carrusel...), animaciones de entrada/hover, fondos interactivos y colores.
4. Exporta: "Exportar ZIP" descarga un proyecto Vite autónomo; "JSON" descarga el diseño editable.

## Qué contiene el ZIP exportado

- package.json con scripts dev/build/preview (Vite8, React19, TypeScript6, sass).
- src/design.ts: todo el contenido y la estructura (el archivo que el cliente edita).
- src/components/: los componentes reales en TSX con sus CSS Modules (.module.scss).
- src/hooks/: motor de animación (useMotion) y entradas con IntersectionObserver.
- src/styles/tokens.scss: colores, espaciados, radios y sombras como variables SCSS y CSS.
- src/types/spec.ts: tipos estructurales del diseño.
- README.md en español con instrucciones de arranque.

## Decisiones técnicas destacadas

- El diseño vive en un JSON validado con Zod (DesignSpec): la única fuente de verdad del preview,
  del codegen y, en el futuro, de otros emisores (por ejemplo Angular).
- Los tokens de diseño son variables CSS centralizadas (no IA): cambiar --color-primary repinta
  toda la web exportada.
- Las51 paletas se validan automáticamente con contraste WCAG (7 comprobaciones por paleta).
- La accesibilidad es transversal: HTML semántico, aria-labels, foco visible,
  prefers-reduced-motion y scripting:none como fallbacks.

## FAQ

- ¿Usa IA? No. Cero funciones de IA; solo diseño, animaciones y código limpio.
- ¿El código es mío? Sí, licencia MIT.
- ¿Puedo llevarlo a Angular? El diseño es un JSON independiente del emisor; la migración es una
  futura mejora prevista en la arquitectura.
- ¿Cuánto cuesta? El producto está en fase de MVP; no hay despliegue de producción todavía.
`;

export function GET(): Response {
  return new Response(LLMS_FULL_TXT, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
