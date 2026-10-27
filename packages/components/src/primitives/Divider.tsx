import { cx } from '../cx';

import s from './Divider.module.scss';

export interface DividerProps {
  id?: string;
  thicknessPx?: number;
  animated?: boolean;
  className?: string;
}

/** Horizontal rule separating blocks (optionally animated shimmer). */
export function Divider({ id, thicknessPx = 1, animated = false, className }: DividerProps) {
  return (
    <hr
      id={id}
      className={cx(s.divider, animated && s.animated, className)}
      style={{ height: `${thicknessPx}px` }}
    />
  );
}
