'use client';

import { useMotion } from '@designed/animations';
import { useRef } from 'react';
import type { AnimationInput } from '@designed/schema';
import { cx } from '../cx';

import s from './Heading.module.scss';

export interface HeadingProps {
  id?: string;
  /** HTML level 1-6 (schema enforces the range). */
  level?: number;
  text: string;
  size?: 'display' | 'xl' | 'lg' | 'md' | 'sm';
  align?: 'left' | 'center' | 'right';
  tone?: 'default' | 'primary' | 'muted' | 'inverse';
  animation?: AnimationInput;
  className?: string;
}

const TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

/** Semantic heading with independent visual size, tone and motion. */
export function Heading({
  id,
  level = 2,
  text,
  size,
  align = 'left',
  tone = 'default',
  animation,
  className,
}: HeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const motion = useMotion(animation, ref);
  const index = Math.min(Math.max(level, 1), 6) - 1;
  const Tag = TAGS[index] ?? 'h2';

  return (
    <Tag
      id={id}
      ref={ref}
      className={cx(s.heading, size && s[size], s[tone], s[align], motion.className, className)}
      style={motion.style}
    >
      {text}
    </Tag>
  );
}
