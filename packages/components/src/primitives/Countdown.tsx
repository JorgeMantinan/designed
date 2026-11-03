'use client';

import { useMotion } from '@designed/animations';
import { useEffect, useRef, useState } from 'react';
import type { AnimationInput } from '@designed/schema';

import { cx } from '../cx';

import s from './Countdown.module.scss';

export interface CountdownProps {
  id?: string;
  /** Local target: '2026-12-31T23:59'. Invalid or past → expired state. */
  target: string;
  label?: string;
  expiredText?: string;
  animation?: AnimationInput;
  className?: string;
}

const UNITS: ReadonlyArray<{ key: string; text: string }> = [
  { key: 'd', text: 'Días' },
  { key: 'h', text: 'Horas' },
  { key: 'm', text: 'Min' },
  { key: 's', text: 'Seg' },
];

/** [days, hours, minutes, seconds] left, or null when expired/invalid. */
function remaining(target: string, now: number): number[] | null {
  const time = Date.parse(target);
  if (Number.isNaN(time)) return null;
  const diff = time - now;
  if (diff <= 0) return null;
  const seconds = Math.floor(diff / 1000);
  return [
    Math.floor(seconds / 86400),
    Math.floor(seconds / 3600) % 24,
    Math.floor(seconds / 60) % 60,
    seconds % 60,
  ];
}

const pad = (value: number): string => String(value).padStart(2, '0');

/** Live countdown clock (ticking every second) with an accessible status. */
export function Countdown({
  id,
  target,
  label,
  expiredText = '¡Ha terminado!',
  animation,
  className,
}: CountdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const motion = useMotion(animation, ref);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const left = remaining(target, now);

  return (
    <div
      id={id}
      ref={ref}
      className={cx(s.countdown, motion.className, className)}
      data-hover={motion.hoverType}
      style={motion.style}
    >
      {label && <p className={s.label}>{label}</p>}
      {left === null ? (
        <p className={s.expired} role="status">
          {expiredText}
        </p>
      ) : (
        <div className={s.clock} role="timer" aria-label={label ?? 'Cuenta atrás'}>
          {UNITS.map((unit, index) => (
            <div key={unit.key} className={s.block}>
              <span className={s.value}>
                {index === 0 ? String(left[index]) : pad(left[index] ?? 0)}
              </span>
              <span className={s.unit}>{unit.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
