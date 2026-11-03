export const dynamic = 'force-static';

/**
 * llms.txt — entry point for AI assistants and LLM crawlers (llmstxt.org
 * convention): a concise, honest description of what designed is and where
 * to learn more. Served statically at /llms.txt.
 */
const LLMS_TXT = `# designed

> Constructor visual de webs estilo WordPress que exporta proyectos React + TypeScript reales y
> modulares. El usuario diseña en el navegador y descarga un ZIP con un proyecto Vite funcional:
> \`pnpm install && pnpm dev\` funciona sin configuración.

designed es una herramienta open source (licencia MIT) construida con Next.js 16, React 19,
TypeScript estricto, SCSS con CSS custom properties y un monorepo pnpm + Turborepo.
No usa inteligencia artificial: solo diseño, animaciones y código limpio.

## Qué hace

- Galería de plantillas al entrar, filtrables por preferencias (rejilla con10 plantillas,
  historia vertical, menú superior, menú esquinado con hover, pricing, portfolio con carrusel,
  tienda, negocio local, restaurante y curso online).
- Web multipágina: cada diseño admite páginas ilimitadas (portada en la raíz + \`pages[]\` con ruta
  propia) con11 plantillas de página listas (tienda, contacto, sobre mí, blog, galería, portfolio,
  planes, ayuda, destinos, reservas y página en blanco). El árbol muestra un selector de páginas
  y la preview cambia al pulsar un enlace o una pestaña.
- Starters por tipo de negocio desde la portada: tienda online, negocio físico, persona famosa,
  viajes, restaurante y creador; cada uno abre un proyecto multipágina con el menú ya enlazado
  (\`/builder?start=ecommerce\`).
- Editor con panel de propiedades completo: filas, columnas (grid de12 unidades), botones por
  sección, spacing, padding, radios, sombras, gradientes y breakpoints responsive.
- 93 paletas de 5 colores con validación automática de contraste WCAG AA/AAA y semáforo visible,
  filtradas por estilo (clara, oscura, corporativa, cálida, fría, vibrante, natural, elegante,
  divertida, tecnológica, pastel, neón y metalizado).
- Animaciones de entrada y hover con preview en vivo (16 efectos) y 18 fondos interactivos que reaccionan
  al ratón (spotlight, partículas, rejilla de puntos, ondas, cuadrícula retro, ondas expansivas,
  lluvia, constelación, rejilla luminosa, lluvia de código, confeti, nieve, cortinas de luz,
  llamas, chispas, estrellas fugaces, ecualizador y formas flotantes).
- Sombreados de imágenes y carruseles: lateral, vertical, diagonal, radial, duotone y viñeta.
- Undo/redo, autoguardado local e import/export del diseño como JSON.

## El export

El botón "Exportar ZIP" genera un proyecto Vite + React + TypeScript autónomo:

- estructura real: src/components/{primitives,cards,carousel,sections,header,footer,backgrounds},
  src/hooks, src/styles/{tokens,global,motion}.scss, src/types y src/design.ts con el contenido.
- con diseño multipágina, src/App.tsx incluye un enrutador de hash propio (#/tienda) y todos los
  enlaces internos se reescriben a '#/…' para funcionar sin fallback de servidor.
- el cliente edita textos en src/design.ts y colores en src/styles/tokens.scss.
- sin dependencias del editor: cero imports de paquetes internos en el código exportado.

## Enlaces

- Editor: /builder
- Repositorio y documentación: https://github.com/JorgeMantinan/designed
- Versión completa de esta página: /llms-full.txt

## Datos clave

- Licencia MIT: el código exportado pertenece al cliente.
- Sin funciones de IA dentro del producto.
- Estado: MVP completo (fases0-6): diseñar, editar y exportar funcionan de punta a punta.
`;

export function GET(): Response {
  return new Response(LLMS_TXT, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
