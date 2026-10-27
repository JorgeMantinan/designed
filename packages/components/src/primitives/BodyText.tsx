'use client';

import { useMotion } from '@designed/animations';
import { useRef } from 'react';
import type { AnimationInput } from '@designed/schema';
import { cx } from '../cx';

import s from './BodyText.module.scss';

export interface BodyTextProps {
  id?: string;
  text: string;
  align?: 'left' | 'center' | 'right';
  tone?: 'default' | 'primary' | 'muted' | 'inverse';
  maxWidthPx?: number;
  animation?: AnimationInput;
  className?: string;
}

/** Paragraph with optional readability cap and tone. */
export function BodyText({
  id,
  text,
  align = 'left',
  tone = 'default',
  maxWidthPx,
  animation,
  className,
}: BodyTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const motion = useMotion(animation, ref);

  return (
    <p
      id={id}
      ref={ref}
      className={cx(s.text, s[tone], s[align], motion.className, className)}
      style={{
        maxWidth: maxWidthPx != null ? `${maxWidthPx}px` : undefined,
        ...motion.style,
      }}
    >
      {text}
    </p>
  );
}
