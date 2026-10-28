import { z } from 'zod';

import { animationSchema } from './animation';
import { alignSchema, cssUrlSchema, hexColorSchema, idSchema, pxSchema } from './common';
import { imageOverlaySchema } from './overlay';

/**
 * Components: the atoms the user drags into columns.
 *
 * This is a discriminated union on `type`: adding a new primitive to the
 * product = adding one member here + one renderer + one codegen emitter.
 * Every component carries a unique `id` and an optional animation slot.
 */

export const buttonVariantSchema = z.enum([
  'solid',
  'outline',
  'ghost',
  'gradient',
  'soft',
  'glass',
  'neon',
  'brutal',
]);
export const buttonSizeSchema = z.enum(['sm', 'md', 'lg']);
export const toneSchema = z.enum(['default', 'primary', 'muted', 'inverse']);
export const radiusSizeSchema = z.enum(['none', 'sm', 'md', 'lg', 'pill']);
export const shadowSizeSchema = z.enum(['none', 'sm', 'md', 'lg']);

/** A call-to-action button. Nested inside button groups, cards, pricing, header... */
export const buttonSchema = z.object({
  id: idSchema,
  label: z.string().min(1).max(60),
  href: cssUrlSchema.default('#'),
  variant: buttonVariantSchema.default('solid'),
  size: buttonSizeSchema.default('md'),
  /** Icon name from the icon set (e.g. "arrow-right"). */
  icon: z.string().min(1).max(40).optional(),
  newTab: z.boolean().default(false),
  /** Custom color; overrides the variant's palette color. */
  color: hexColorSchema.optional(),
  /** Custom color on hover; falls back to a darker mix of the color. */
  hoverColor: hexColorSchema.optional(),
  animation: animationSchema.optional(),
});

export const headingSchema = z.object({
  type: z.literal('heading'),
  id: idSchema,
  /** HTML heading level 1-6. */
  level: z.number().int().min(1).max(6).default(2),
  text: z.string().min(1).max(200),
  /** Visual size when you want to decouple it from the semantic level. */
  size: z.enum(['display', 'xl', 'lg', 'md', 'sm']).optional(),
  align: alignSchema.default('left'),
  tone: toneSchema.default('default'),
  animation: animationSchema.optional(),
});

export const textSchema = z.object({
  type: z.literal('text'),
  id: idSchema,
  text: z.string().min(1).max(2000),
  align: alignSchema.default('left'),
  tone: toneSchema.default('default'),
  /** Caps the paragraph width for readability (px). */
  maxWidthPx: pxSchema.max(1200).optional(),
  animation: animationSchema.optional(),
});

export const buttonGroupSchema = z.object({
  type: z.literal('buttonGroup'),
  id: idSchema,
  buttons: z.array(buttonSchema).min(1).max(5),
  direction: z.enum(['row', 'column']).default('row'),
  align: alignSchema.default('left'),
  gapPx: pxSchema.optional(),
  animation: animationSchema.optional(),
});

export const badgeSchema = z.object({
  type: z.literal('badge'),
  id: idSchema,
  label: z.string().min(1).max(40),
  tone: z.enum(['primary', 'secondary', 'accent', 'neutral']).default('primary'),
});

export const imageSchema = z.object({
  type: z.literal('image'),
  id: idSchema,
  src: cssUrlSchema,
  alt: z.string().max(200).default(''),
  overlay: imageOverlaySchema.optional(),
  radius: radiusSizeSchema.default('md'),
  shadow: shadowSizeSchema.default('none'),
  ratio: z.enum(['auto', '1:1', '4:3', '16:9', '3:4', '21:9']).default('auto'),
  animation: animationSchema.optional(),
});

export const featureCardSchema = z.object({
  type: z.literal('featureCard'),
  id: idSchema,
  /** Icon name from the icon set (e.g. "zap"). */
  icon: z.string().min(1).max(40).optional(),
  title: z.string().min(1).max(80),
  text: z.string().min(1).max(400),
  align: alignSchema.default('left'),
  href: cssUrlSchema.optional(),
  animation: animationSchema.optional(),
});

export const pricingCardSchema = z.object({
  type: z.literal('pricingCard'),
  id: idSchema,
  planName: z.string().min(1).max(40),
  price: z.string().min(1).max(20),
  currency: z.string().min(1).max(6).default('$'),
  period: z.string().max(24).default('/month'),
  features: z.array(z.string().min(1).max(120)).min(1).max(10),
  highlighted: z.boolean().default(false),
  cta: buttonSchema.optional(),
  animation: animationSchema.optional(),
});

export const testimonialCardSchema = z.object({
  type: z.literal('testimonialCard'),
  id: idSchema,
  quote: z.string().min(1).max(500),
  author: z.string().min(1).max(60),
  role: z.string().max(60).optional(),
  avatarUrl: cssUrlSchema.optional(),
  rating: z.number().int().min(0).max(5).default(5),
  animation: animationSchema.optional(),
});

export const statSchema = z.object({
  type: z.literal('stat'),
  id: idSchema,
  value: z.string().min(1).max(12),
  label: z.string().min(1).max(60),
  suffix: z.string().max(8).optional(),
  animation: animationSchema.optional(),
});

export const featureListItemSchema = z.object({
  icon: z.string().min(1).max(40).optional(),
  title: z.string().min(1).max(60),
  text: z.string().min(1).max(300),
});

export const featureListSchema = z.object({
  type: z.literal('featureList'),
  id: idSchema,
  items: z.array(featureListItemSchema).min(1).max(12),
  columns: z.number().int().min(1).max(3).default(3),
  animation: animationSchema.optional(),
});

export const faqItemSchema = z.object({
  question: z.string().min(1).max(160),
  answer: z.string().min(1).max(600),
});

export const faqListSchema = z.object({
  type: z.literal('faqList'),
  id: idSchema,
  items: z.array(faqItemSchema).min(1).max(20),
  animation: animationSchema.optional(),
});

export const logoCloudSchema = z.object({
  type: z.literal('logoCloud'),
  id: idSchema,
  logos: z
    .array(z.object({ src: cssUrlSchema, alt: z.string().max(80).default('') }))
    .min(1)
    .max(24),
  grayscale: z.boolean().default(true),
  animation: animationSchema.optional(),
});

export const carouselSlideSchema = z.object({
  src: cssUrlSchema,
  alt: z.string().max(200).default(''),
  title: z.string().max(80).optional(),
  text: z.string().max(300).optional(),
  overlay: imageOverlaySchema.optional(),
});

export const carouselSchema = z.object({
  type: z.literal('carousel'),
  id: idSchema,
  slides: z.array(carouselSlideSchema).min(1).max(12),
  /** Overlay applied to every slide that does not define its own. */
  overlay: imageOverlaySchema.optional(),
  autoplay: z.boolean().default(true),
  intervalMs: z.number().int().min(2000).max(15000).default(5000),
  showDots: z.boolean().default(true),
  showArrows: z.boolean().default(true),
  ratio: z.enum(['16:9', '4:3', '3:2', '21:9']).default('16:9'),
  animation: animationSchema.optional(),
});

export const dividerSchema = z.object({
  type: z.literal('divider'),
  id: idSchema,
  thicknessPx: z.number().int().min(1).max(10).default(1),
  animated: z.boolean().default(false),
});

export const spacerSchema = z.object({
  type: z.literal('spacer'),
  id: idSchema,
  size: z.enum(['xs', 'sm', 'md', 'lg', 'xl', 'xxl']).default('md'),
});

/**
 * Every component that can live inside a column.
 * Keep the MVP set here (★★★ primitives) and extend additively.
 */
export const componentSchema = z.discriminatedUnion('type', [
  headingSchema,
  textSchema,
  buttonGroupSchema,
  badgeSchema,
  imageSchema,
  featureCardSchema,
  pricingCardSchema,
  testimonialCardSchema,
  statSchema,
  featureListSchema,
  faqListSchema,
  logoCloudSchema,
  carouselSchema,
  dividerSchema,
  spacerSchema,
]);

export type ButtonSpec = z.infer<typeof buttonSchema>;
/** Partial-friendly input variant (labels + href are enough to start). */
export type ButtonInput = z.input<typeof buttonSchema>;
export type ComponentSpec = z.infer<typeof componentSchema>;
export type ComponentType = ComponentSpec['type'];
export type HeadingSpec = z.infer<typeof headingSchema>;
export type TextSpec = z.infer<typeof textSchema>;
export type ButtonGroupSpec = z.infer<typeof buttonGroupSchema>;
export type BadgeSpec = z.infer<typeof badgeSchema>;
export type ImageSpec = z.infer<typeof imageSchema>;
export type FeatureCardSpec = z.infer<typeof featureCardSchema>;
export type PricingCardSpec = z.infer<typeof pricingCardSchema>;
export type TestimonialCardSpec = z.infer<typeof testimonialCardSchema>;
export type StatSpec = z.infer<typeof statSchema>;
export type FeatureListSpec = z.infer<typeof featureListSchema>;
export type FaqListSpec = z.infer<typeof faqListSchema>;
export type LogoCloudSpec = z.infer<typeof logoCloudSchema>;
export type CarouselSpec = z.infer<typeof carouselSchema>;
export type CarouselSlide = z.infer<typeof carouselSlideSchema>;
export type DividerSpec = z.infer<typeof dividerSchema>;
export type SpacerSpec = z.infer<typeof spacerSchema>;
