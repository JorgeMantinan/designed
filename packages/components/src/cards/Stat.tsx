'use client';

import { useMotion } from '@designed/animations';
import { useRef } from 'react';
import type { AnimationInput } from '@designed/schema';
import { cx } from '../cx';

import s from './Stat.module.scss';

export interface StatProps {
  id?: string;
  value: string;
  label: string;
  suffix?: string;
  animation?: AnimationInput;
  className?: string;
}

/** Big number with label (counters section). */
export function Stat({ id, value, label, suffix, animation, className }: StatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const motion = useMotion(animation, ref);

  return (
    <div id={id} ref={ref} className={cx(s.stat, motion.className, className)} style={motion.style}>
      <p className={s.value}>
        {value}
        {suffix && <span className={s.suffix}>{suffix}</span>}
      </p>
      <p className={s.label}>{label}</p>
    </div>
  );
}
