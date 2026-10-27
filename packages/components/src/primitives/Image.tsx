'use client';

import { useMotion } from '@designed/animations';
import { useRef } from 'react';
import type { AnimationInput, ImageOverlayInput } from '@designed/schema';
import type { CSSProperties } from 'react';
import { cx } from '../cx';

import s from './Image.module.scss';

export interface ImageProps {
  id?: string;
  src: string;
  alt?: string;
  overlay?: ImageOverlayInput;
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'pill';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  ratio?: 'auto' | '1:1' | '4:3' | '16:9' | '3:4' | '21:9';
  animation?: AnimationInput;
  className?: string;
}

/** Photo with optional aspect ratio, shadow, radius and shading overlay. */
export function Image({
  id,
  src,
  alt = '',
  overlay,
  radius = 'md',
  shadow = 'none',
  ratio = 'auto',
  animation,
  className,
}: ImageProps) {
  const ref = useRef<HTMLElement>(null);
  const motion = useMotion(animation, ref);
  const aspectRatio = ratio === 'auto' ? undefined : ratio.replace(':', ' / ');

  return (
    <figure
      id={id}
      ref={ref}
      className={cx(
        s.figure,
        radius !== 'none' && s[radius],
        shadow !== 'none' && s[`shadow-${shadow}`],
        motion.className,
        className,
      )}
      style={motion.style}
    >
      <div className={s.frame} style={aspectRatio ? { aspectRatio } : undefined}>
        <img className={s.img} src={src} alt={alt} loading="lazy" />
        {overlay && (
          <span
            className={cx(
              'dsg-overlay',
              `dsg-overlay--${overlay.direction}`,
              overlay.type !== 'gradient' && `dsg-overlay--${overlay.type}`,
            )}
            style={
              {
                '--overlay-color': overlay.color ?? '#000000',
                '--overlay-color-to': overlay.colorTo ?? overlay.color ?? '#000000',
                '--overlay-intensity': String(overlay.intensity ?? 0.5),
              } as CSSProperties
            }
          />
        )}
      </div>
    </figure>
  );
}
