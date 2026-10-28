import type { CSSProperties } from 'react';

import { cx } from '../cx';

import s from './Divider.module.scss';

export interface DividerProps {
  id?: string;
  thicknessPx?: number;
  style?: 'solid' | 'dashed' | 'dotted' | 'double' | 'gradient';
  color?: string;
  animated?: boolean;
  className?: string;
}

/** Horizontal rule separating blocks (solid/dashed/dotted/double/gradient). */
export function Divider({
  id,
  thicknessPx = 1,
  style = 'solid',
  color,
  animated = false,
  className,
}: DividerProps) {
  return (
    <hr
      id={id}
      className={cx(s.divider, style !== 'solid' && s[style], animated && s.animated, className)}
      style={
        {
          height: `${style === 'double' ? thicknessPx * 2 + 2 : thicknessPx}px`,
          '--divider-color': color,
          '--divider-thickness': `${thicknessPx}px`,
        } as CSSProperties
      }
    />
  );
}
