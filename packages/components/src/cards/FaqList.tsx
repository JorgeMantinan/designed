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
  animation?: AnimationInput;
  className?: string;
}

/** Accessible accordion built on native <details>/<summary> (no JS needed). */
export function FaqList({ id, items, animation, className }: FaqListProps) {
  const ref = useRef<HTMLDivElement>(null);
  const motion = useMotion(animation, ref);

  return (
    <div
      id={id}
      ref={ref}
      className={cx(s.list, motion.className, className)}
      data-hover={motion.hoverType}
      style={motion.style}
    >
      {items.map((item) => (
        <details key={item.question} className={s.item}>
          <summary className={s.question}>
            <span>{item.question}</span>
            <Icon name="chevron-down" size={20} className={s.chevron} />
          </summary>
          <p className={s.answer}>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
