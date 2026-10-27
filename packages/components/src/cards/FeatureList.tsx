'use client';

import { useMotion } from '@designed/animations';
import { useRef } from 'react';
import type { AnimationInput } from '@designed/schema';
import type { CSSProperties } from 'react';
import { cx } from '../cx';
import { Icon } from '../icons';

import s from './FeatureList.module.scss';

export interface FeatureListItem {
  icon?: string;
  title: string;
  text: string;
}

export interface FeatureListProps {
  id?: string;
  items: FeatureListItem[];
  /** Number of columns (1-3 enforced by the schema). */
  columns?: number;
  animation?: AnimationInput;
  className?: string;
}

/** Icon + title + description list in up to3 columns. */
export function FeatureList({ id, items, columns = 3, animation, className }: FeatureListProps) {
  const ref = useRef<HTMLUListElement>(null);
  const motion = useMotion(animation, ref);

  return (
    <ul
      id={id}
      ref={ref}
      className={cx(s.grid, motion.className, className)}
      style={{ '--feature-columns': columns, ...motion.style } as CSSProperties}
    >
      {items.map((item, index) => (
        <li key={`${item.title}-${index}`} className={s.item}>
          {item.icon && (
            <span className={s.iconWrap} aria-hidden="true">
              <Icon name={item.icon} size={20} />
            </span>
          )}
          <div className={s.content}>
            <h3 className={s.title}>{item.title}</h3>
            <p className={s.text}>{item.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
