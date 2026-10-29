'use client';

import { useMotion } from '@designed/animations';
import { useRef } from 'react';
import type { AnimationInput } from '@designed/schema';
import { cx } from '../cx';
import { Icon } from '../icons';

import s from './FaqList.module.scss';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqListProps {
  id?: string;
  items: FaqItem[];
  radius?: 'sm' | 'md' | 'lg' | 'pill';
  /** Accent color for the question rows (text + hover tint). */
  color?: string;
  /** Custom background color of the items. */
  backgroundColor?: string;
  /** Second background color: with `backgroundColor` forms a gradient. */
  backgroundTo?: string;
  animation?: AnimationInput;
  className?: string;
}

/** Accessible accordion built on native <details>/<summary> (no JS needed). */
export function FaqList({
  id,
  items,
  radius = 'md',
  color,
  backgroundColor,
  backgroundTo,
  animation,
  className,
}: FaqListProps) {
  const ref = useRef<HTMLDivElement>(null);
  const motion = useMotion(animation, ref);

  const itemStyle =
    backgroundColor && backgroundTo
      ? { background: `linear-gradient(135deg, ${backgroundColor}, ${backgroundTo})` }
      : backgroundColor
        ? { backgroundColor }
        : undefined;

  return (
    <div
      id={id}
      ref={ref}
      className={cx(s.list, s[radius], motion.className, className)}
      data-hover={motion.hoverType}
      style={motion.style}
    >
      {items.map((item) => (
        <details key={item.question} className={s.item} style={itemStyle}>
          <summary className={s.question} style={color ? { color } : undefined}>
            <span>{item.question}</span>
            <Icon name="chevron-down" size={20} className={s.chevron} />
          </summary>
          <p className={s.answer}>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
