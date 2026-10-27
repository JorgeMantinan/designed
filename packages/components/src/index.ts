/**
 * @designed/components — headless-ish primitives for rendered designs.
 *
 * Consume tokens via CSS custom properties (never hardcoded colors); motion
 * via @designed/animations; structure via @designed/schema types. The codegen
 * emits these same files into the exported project, split by folder:
 * primitives/, cards/, carousel/, sections/, header/, footer/.
 *
 * Global styles (load once):
 *   import '@designed/animations/styles.css';
 *   import '@designed/components/styles.css';
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

export { cx } from './cx';
export type { ClassValue } from './cx';
export { Icon } from './icons';
export type { IconProps } from './icons';
export { backgroundToStyle } from './background-style';

export { Button } from './primitives/Button';
export type { ButtonProps, ButtonSize, ButtonVariant } from './primitives/Button';
export { ButtonGroup } from './primitives/ButtonGroup';
export type { ButtonGroupProps } from './primitives/ButtonGroup';
export { Badge } from './primitives/Badge';
export type { BadgeProps } from './primitives/Badge';
export { Heading } from './primitives/Heading';
export type { HeadingProps } from './primitives/Heading';
export { BodyText } from './primitives/BodyText';
export type { BodyTextProps } from './primitives/BodyText';
export { Image } from './primitives/Image';
export type { ImageProps } from './primitives/Image';
export { Divider } from './primitives/Divider';
export type { DividerProps } from './primitives/Divider';
export { Spacer } from './primitives/Spacer';
export type { SpacerProps } from './primitives/Spacer';

export { FeatureCard } from './cards/FeatureCard';
export type { FeatureCardProps } from './cards/FeatureCard';
export { PricingCard } from './cards/PricingCard';
export type { PricingCardProps } from './cards/PricingCard';
export { TestimonialCard } from './cards/TestimonialCard';
export type { TestimonialCardProps } from './cards/TestimonialCard';
export { Stat } from './cards/Stat';
export type { StatProps } from './cards/Stat';
export { FeatureList } from './cards/FeatureList';
export type { FeatureListItem, FeatureListProps } from './cards/FeatureList';
export { FaqList } from './cards/FaqList';
export type { FaqItem, FaqListProps } from './cards/FaqList';
export { LogoCloud } from './cards/LogoCloud';
export type { LogoCloudItem, LogoCloudProps } from './cards/LogoCloud';

export { Carousel } from './carousel/Carousel';
export type { CarouselProps, CarouselSlideData } from './carousel/Carousel';

export { Section } from './sections/Section';
export type { SectionProps } from './sections/Section';

export { Header } from './header/Header';
export type { HeaderProps } from './header/Header';

export { Footer } from './footer/Footer';
export type { FooterProps } from './footer/Footer';

export { SpecRenderer } from './renderer';
export type { SpecRendererProps } from './renderer';
export { DesignRenderer } from './DesignRenderer';
export type { DesignRendererProps } from './DesignRenderer';
