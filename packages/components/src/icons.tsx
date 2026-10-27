/**
 * Built-in SVG icon set (stroke style,24×24). No icon-library dependency so
 * the exported project works offline out of the box.
 */

interface IconDefinition {
  path: string;
  filled?: boolean;
}

const ICONS: Record<string, IconDefinition> = {
  'arrow-right': { path: 'M5 12h14M12 5l7 7-7 7' },
  'arrow-left': { path: 'M19 12H5M12 19l-7-7 7-7' },
  'chevron-down': { path: 'm6 9 6 6 6-6' },
  'chevron-left': { path: 'm15 18-6-6 6-6' },
  'chevron-right': { path: 'm9 18 6-6-6-6' },
  check: { path: 'M20 6 9 17l-5-5' },
  star: {
    path: 'M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5L2.6 9.3l6.5-.9z',
    filled: true,
  },
  zap: { path: 'M13 2 3 14h9l-1 8 10-12h-9z' },
  shield: { path: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  palette: {
    path: 'M12 22a10 10 0 1 1 0-20c5.5 0 10 4 10 9a5 5 0 0 1-5 5h-1.5a1.5 1.5 0 0 0-1 2.6A1.5 1.5 0 0 1 12 22Z',
  },
  layout: { path: 'M3 3h18v18H3V3Zm0 6h18M9 21V9' },
  component: { path: 'm12 3 9 9-9 9-9-9 9-9Z' },
  sparkles: {
    path: 'M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Zm7 12 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z',
  },
  plus: { path: 'M12 5v14M5 12h14' },
  x: { path: 'M18 6 6 18M6 6l12 12' },
  menu: { path: 'M3 6h18M3 12h18M3 18h18' },
  mail: { path: 'M3 5h18v14H3V5Zm0 0 9 7 9-7' },
  phone: {
    path: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z',
  },
  'map-pin': {
    path: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Zm-9 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  },
  external: { path: 'M18 13v6H5V6h6M15 3h6v6M21 3l-9 9' },
  users: {
    path: 'M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm12 10v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  },
  github: {
    path: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.7A5.2 5.2 0 0 0 19.8 5a4.9 4.9 0 0 0-.1-3.6s-1.1-.3-3.7 1.4a12.6 12.6 0 0 0-6.6 0C6.8 1.1 5.7 1.4 5.7 1.4A4.9 4.9 0 0 0 5.6 5a5.2 5.2 0 0 0-1.4 3.6c0 5.2 3.2 6.4 6.2 6.7a3.4 3.4 0 0 0-.9 2.6V22',
  },
  x_social: { path: 'M4 4l16 16M20 4 4 20' },
  instagram: {
    path: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5Zm5.3-3h.01',
  },
  linkedin: {
    path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V9h4v1.5A6 6 0 0 1 16 8ZM2 9h4v12H2z',
  },
  youtube: {
    path: 'M22 12s0-4-1-5c-.6-.8-1.7-1-4-1H7c-2.3 0-3.4.2-4 1-1 1-1 5-1 5s0 4 1 5c.6.8 1.7 1 4 1h10c2.3 0 3.4-.2 4-1 1-1 1-5 1-5Zm-12 3V9l5 3-5 3Z',
  },
  tiktok: { path: 'M15 3v9.5a4.5 4.5 0 1 1-4-4.5M15 3c.5 2.5 2 4 4.5 4.5' },
  discord: {
    path: 'M7 6.5c2-1 8-1 10 0 2 2.5 2.5 7 2.5 10-1.5 1.5-3.5 2-4.5 2l-1-1.7M7 6.5C5 8 4.5 12.5 4.5 16c1.5 1.5 3.5 2 4.5 2l1-1.7M9.5 13h.01M14.5 13h.01',
  },
  facebook: { path: 'M14 8h3V4h-3a5 5 0 0 0-5 5v3H6v4h3v8h4v-8h3l1-4h-4V9a1 1 0 0 1 1-1Z' },
};

export interface IconProps {
  /** Icon name from the built-in set. Unknown names render nothing. */
  name: string;
  /** Rendered size in px (default20). */
  size?: number;
  className?: string;
  /** Force fill instead of the default stroke style. */
  filled?: boolean;
}

/** Decorative SVG icon (always aria-hidden; add visible labels around it). */
export function Icon({ name, size = 20, className, filled }: IconProps) {
  const definition = ICONS[name];
  if (!definition) return null;

  const isFilled = filled ?? definition.filled ?? false;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isFilled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={definition.path} />
    </svg>
  );
}
