'use client';

import { useMotion } from '@designed/animations';
import { useRef } from 'react';
import type { AnimationInput } from '@designed/schema';
import { cx } from '../cx';
import { Icon } from '../icons';

import s from './Button.module.scss';

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'gradient';
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
  animation?: AnimationInput;
  className?: string;
}

/** CTA button: solid / outline / ghost / gradient with hover motion slot. */
export function Button({
  id,
  label,
  href = '#',
  variant = 'solid',
  size = 'md',
  icon,
  newTab = false,
  animation,
  className,
}: ButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const motion = useMotion(animation, ref);

  return (
    <a
      id={id}
      ref={ref}
      className={cx(s.button, s[variant], s[size], motion.className, className)}
      style={motion.style}
      data-hover={motion.hoverType}
      href={href}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
    >
      <span className={s.label}>{label}</span>
      {icon && <Icon name={icon} size={size === 'sm' ? 15 : 17} className={s.icon} />}
    </a>
  );
}
