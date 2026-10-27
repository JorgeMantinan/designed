/**
 * Primitivas headless del builder: Button, Card, Header, Nav, Section,
 * Carousel, Footer, Panel...
 *
 * Cada primitiva consume los tokens vía CSS custom properties y expone
 * variantes (radio, sombra, borde, gradiente, animación, overlay). El codegen
 * emite el componente TSX + su SCSS por separado en el proyecto del cliente.
 */

/** Categorías de primitivas del catálogo. */
export const PRIMITIVE_KINDS = [
  'layout', // Section, Container, Grid, Split, Masonry
  'navigation', // Header, TopNav, AngledMenu, MegaMenu, Sidebar...
  'hero', // Hero centrado / lateral / fullscreen
  'card', // Feature, Pricing, Testimonial, Product, Blog...
  'content', // Features, FAQ, CTA, Steps, Tabs, Forms...
  'carousel', // Carruseles de imágenes, cards, marquee
  'footer', // Footer multicolumna, barra legal, redes
  'element', // Button, Badge, Avatar, Divider, ProgressBar...
  'background', // Spotlight, malla, partículas, blobs, ondas...
] as const;

export type PrimitiveKind = (typeof PRIMITIVE_KINDS)[number];
