import { z } from 'zod';

import { hoverAnimationSchema } from './animation';
import { backgroundSchema } from './background';
import { buttonSchema } from './components';
import { cssUrlSchema, hexColorSchema, idSchema } from './common';

/**
 * Navigation chrome: header (top / angled / sidebar / minimal) and footer.
 *
 * The flagship "angled menu" is `layout: 'angled'`: diagonal items that
 * expand on hover, rendered by the AngledMenu component.
 */

export const navChildSchema = z.object({
  id: idSchema,
  label: z.string().min(1).max(40),
  href: cssUrlSchema.default('#'),
  badge: z.string().max(20).optional(),
});

export const navItemSchema = z.object({
  id: idSchema,
  label: z.string().min(1).max(40),
  href: cssUrlSchema.default('#'),
  /** Second navigation level (mega-menu / dropdown). */
  children: z.array(navChildSchema).max(8).default([]),
});

export const brandSchema = z.object({
  name: z.string().min(1).max(60).default('My site'),
  logoUrl: cssUrlSchema.optional(),
  href: cssUrlSchema.default('/'),
});

export const headerSchema = z.object({
  /** `angled` = diagonal items that expand on hover (flagship menu). */
  layout: z
    .enum(['top', 'angled', 'sidebar', 'minimal', 'corner', 'floating', 'bottom'])
    .default('top'),
  /** Side of the fixed sidebar layout (left or right). */
  sidebarPosition: z.enum(['left', 'right']).default('left'),
  sticky: z.boolean().default(true),
  /** Transparent over the hero, solid background once the user scrolls. */
  transparentOnTop: z.boolean().default(true),
  brand: brandSchema.default({ name: 'My site', href: '/' }),
  items: z.array(navItemSchema).max(10).default([]),
  cta: buttonSchema.optional(),
  /** Hover animation applied to every menu item. */
  itemAnimation: hoverAnimationSchema.optional(),
  mobileMenu: z.enum(['hamburger-overlay', 'dropdown', 'hidden']).default('hamburger-overlay'),
  /** Custom background color; overrides the palette surface. */
  backgroundColor: hexColorSchema.optional(),
  /** Custom link color; defaults to the text color. */
  linkColor: hexColorSchema.optional(),
  /** Custom color for the brand name/logo text. */
  brandColor: hexColorSchema.optional(),
});

export const footerLinkSchema = z.object({
  label: z.string().min(1).max(50),
  href: cssUrlSchema.default('#'),
});

export const footerColumnSchema = z.object({
  id: idSchema,
  title: z.string().min(1).max(40),
  links: z.array(footerLinkSchema).max(12).default([]),
  /** Horizontal alignment of the column content (title + links). */
  contentAlign: z.enum(['start', 'center', 'end']).default('start'),
});

export const SOCIAL_PLATFORMS = [
  'x',
  'github',
  'instagram',
  'linkedin',
  'youtube',
  'tiktok',
  'discord',
  'facebook',
] as const;

export const socialLinkSchema = z.object({
  platform: z.enum(SOCIAL_PLATFORMS),
  href: cssUrlSchema,
});

export const footerSchema = z.object({
  columns: z.array(footerColumnSchema).max(6).default([]),
  brandText: z.string().max(300).optional(),
  social: z.array(socialLinkSchema).max(8).default([]),
  newsletter: z.boolean().default(false),
  copyright: z.string().max(140).optional(),
  /** Overall visual layout of the footer. */
  layout: z.enum(['classic', 'centered', 'minimal']).default('classic'),
  /** Custom color for the column titles; defaults to text color. */
  titleColor: hexColorSchema.optional(),
  /** Custom color for the links; defaults to muted text. */
  linkColor: hexColorSchema.optional(),
  /** Hover animation applied to links and social icons. */
  itemAnimation: hoverAnimationSchema.optional(),
  background: backgroundSchema.optional(),
});

/** Default header used when a design spec does not define one. */
export const DEFAULT_HEADER = {
  layout: 'top',
  sidebarPosition: 'left',
  sticky: true,
  transparentOnTop: true,
  brand: { name: 'My site', href: '/' },
  // Example items so an empty menu is never mistaken for a broken editor.
  items: [
    { id: 'nav-inicio', label: 'Inicio', href: '#', children: [] },
    { id: 'nav-servicios', label: 'Servicios', href: '#servicios', children: [] },
    { id: 'nav-contacto', label: 'Contacto', href: '#contacto', children: [] },
  ],
  itemAnimation: { type: 'underline', durationMs: 200, easing: 'ease', intensity: 0.5 },
  mobileMenu: 'hamburger-overlay',
} as const satisfies z.input<typeof headerSchema>;

/** Default footer used when a design spec does not define one. */
export const DEFAULT_FOOTER = {
  columns: [
    {
      id: 'footer-producto',
      title: 'Producto',
      contentAlign: 'start',
      links: [
        { label: 'Funciones', href: '#funciones' },
        { label: 'Precios', href: '#precios' },
      ],
    },
    {
      id: 'footer-empresa',
      title: 'Empresa',
      contentAlign: 'start',
      links: [
        { label: 'Sobre nosotros', href: '#' },
        { label: 'Contacto', href: '#contacto' },
      ],
    },
  ],
  social: [],
  newsletter: false,
  layout: 'classic',
} as const satisfies z.input<typeof footerSchema>;

export type NavChild = z.infer<typeof navChildSchema>;
export type NavItem = z.infer<typeof navItemSchema>;
export type BrandSpec = z.infer<typeof brandSchema>;
export type HeaderSpec = z.infer<typeof headerSchema>;
export type HeaderLayout = HeaderSpec['layout'];
export type FooterLink = z.infer<typeof footerLinkSchema>;
export type FooterColumn = z.infer<typeof footerColumnSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];
export type FooterSpec = z.infer<typeof footerSchema>;
