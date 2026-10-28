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

export interface ButtonProps {
  id?: string;
  label: string;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon name from the built-in set (e.g. "arrow-right"). */
  icon?: string;
  newTab?: boolean;
  /** Custom color overriding the variant's palette color. */
  color?: string;
  /** Custom hover color (falls back to a darker/lighter mix). */
  hoverColor?: string;
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

/** CTA button: solid / outline / ghost / gradient + soft/glass/neon/brutal. */
export function Button({
  id,
  label,
  href = '#',
  variant = 'solid',
  size = 'md',
  icon,
  newTab = false,
  color,
  hoverColor,
  animation,
  className,
}: ButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const motion = useMotion(animation, ref);

  // Filled variants flip the label color when a custom color would make
  // the palette's on-primary unreadable.
  const filled = variant === 'solid' || variant === 'brutal' || variant === 'gradient';
  const labelColor = color && filled ? readableText(color) : undefined;

  return (
    <a
      id={id}
      ref={ref}
      className={cx(s.button, s[variant], s[size], motion.className, className)}
      data-hover={motion.hoverType}
      style={
        {
          '--btn-color': color,
          '--btn-hover-color': hoverColor,
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
