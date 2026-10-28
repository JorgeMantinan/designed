'use client';

import { useMotion } from '@designed/animations';
import { useRef } from 'react';
import type { AnimationInput } from '@designed/schema';
import { cx } from '../cx';

import s from './LogoCloud.module.scss';

export interface LogoCloudItem {
  src: string;
  alt?: string;
}

export interface LogoCloudProps {
  id?: string;
  logos: LogoCloudItem[];
  grayscale?: boolean;
  animation?: AnimationInput;
  className?: string;
}

/** "Trusted by" logo row. */
export function LogoCloud({ id, logos, grayscale = true, animation, className }: LogoCloudProps) {
  const ref = useRef<HTMLUListElement>(null);
  const motion = useMotion(animation, ref);

  return (
    <ul
      id={id}
      ref={ref}
      className={cx(s.cloud, motion.className, className)}
      data-hover={motion.hoverType}
      style={motion.style}
    >
      {logos.map((logo, index) => (
        <li key={`${logo.src}-${index}`} className={s.item}>
          <img
            className={cx(s.logo, grayscale && s.grayscale)}
            src={logo.src}
            alt={logo.alt ?? ''}
            loading="lazy"
          />
        </li>
      ))}
    </ul>
  );
}
