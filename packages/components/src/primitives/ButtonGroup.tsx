'use client';

import { useMotion } from '@designed/animations';
import { useRef } from 'react';
import type { AnimationInput, ButtonInput } from '@designed/schema';
import { cx } from '../cx';

import { Button } from './Button';

import s from './ButtonGroup.module.scss';

export interface ButtonGroupProps {
  id?: string;
  buttons: ButtonInput[];
  direction?: 'row' | 'column';
  align?: 'left' | 'center' | 'right';
  gapPx?: number;
  animation?: AnimationInput;
  className?: string;
}

/** Row/column of CTA buttons with consistent gap and alignment. */
export function ButtonGroup({
  id,
  buttons,
  direction = 'row',
  align = 'left',
  gapPx,
  animation,
  className,
}: ButtonGroupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const motion = useMotion(animation, ref);
  const justify = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';
  const alignItems = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';

  return (
    <div
      id={id}
      ref={ref}
      className={cx(s.group, s[direction], motion.className, className)}
      style={{
        gap: gapPx != null ? `${gapPx}px` : undefined,
        justifyContent: direction === 'row' ? justify : undefined,
        alignItems: direction === 'column' ? alignItems : undefined,
        ...motion.style,
      }}
    >
      {buttons.map((button) => (
        <Button key={button.id} {...button} />
      ))}
    </div>
  );
}
