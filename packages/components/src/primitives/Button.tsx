'use client';

import { useMotion } from '@designed/animations';
import { useRef } from 'react';
import type { AnimationInput } from '@designed/schema';
import type { CSSProperties } from 'react';
import { cx } from '../cx';
import { Icon } from '../icons';

import s from './Button.module.scss';

export type ButtonVariant =
  'solid' | 'outline' | 'ghost' | 'gradient' | 'soft' | 'glass' | 'neon' | 'brutal';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonShape = 'theme' | 'rect' | 'rounded' | 'pill' | 'circle' | 'tag' | 'bubble';

export interface ButtonProps {
  id?: string;
  label: string;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Fixed shape; 'theme' follows the global corner radius. */
  shape?: ButtonShape;
  /** Icon name from the built-in set (e.g. "arrow-right"). */
  icon?: string;
  newTab?: boolean;
  /** Custom color overriding the variant's palette color. */
  color?: string;
  /** Custom hover color (falls back to a darker/lighter mix). */
  hoverColor?: string;
  /** Hover color opacity (0-1). Only applies with a custom color. */
  hoverOpacity?: number;
  animation?: AnimationInput;
  className?: string;
}

/** Readable label color (near-black/near-white) for a custom background. */
function readableText(hex: string): string {
  const raw = hex.replace('#', '');
  if (!/^(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(raw)) return '#ffffff';
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((char) => char + char)
          .join('')
      : raw;
  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);
  // Perceived luminance (Rec. 601): > 0.55 reads better with dark text.
  const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
  return luminance > 0.55 ? '#14161a' : '#ffffff';
}

/** #rrggbb → `rgb(r g b / a)` for the hover custom property. */
function withOpacity(hex: string, opacity: number): string | undefined {
  const raw = hex.replace('#', '');
  if (!/^(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(raw)) return undefined;
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((char) => char + char)
          .join('')
      : raw;
  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);
  return `rgb(${r} ${g} ${b} / ${Math.min(1, Math.max(0, opacity))})`;
}

/** CTA button: solid / outline / ghost / gradient + soft/glass/neon/brutal. */
export function Button({
  id,
  label,
  href = '#',
  variant = 'solid',
  size = 'md',
  shape = 'theme',
  icon,
  newTab = false,
  color,
  hoverColor,
  hoverOpacity,
  animation,
  className,
}: ButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const motion = useMotion(animation, ref);

  // Filled variants flip the label color when a custom color would make
  // the palette's on-primary unreadable.
  const filled = variant === 'solid' || variant === 'brutal' || variant === 'gradient';
  const labelColor = color && filled ? readableText(color) : undefined;

  // Hover color: explicit hex, or hex + opacity when opacity is set.
  const hoverBase = hoverColor ?? color;
  const hoverVar =
    hoverOpacity != null && hoverBase ? withOpacity(hoverBase, hoverOpacity) : hoverColor;

  return (
    <a
      id={id}
      ref={ref}
      className={cx(
        s.button,
        s[variant],
        s[size],
        shape !== 'theme' && s[shape],
        motion.className,
        className,
      )}
      data-hover={motion.hoverType}
      style={
        {
          '--btn-color': color,
          '--btn-hover-color': hoverVar,
          color: labelColor,
          ...motion.style,
        } as CSSProperties
      }
      href={href}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
    >
      <span className={s.label}>{label}</span>
      {icon && <Icon name={icon} size={size === 'sm' ? 15 : 17} className={s.icon} />}
    </a>
  );
}
