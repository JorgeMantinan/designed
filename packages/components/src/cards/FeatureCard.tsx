'use client';

import { useMotion } from '@designed/animations';
import { useRef } from 'react';
import type { AnimationInput } from '@designed/schema';
import { cx } from '../cx';
import { Icon } from '../icons';

import s from './FeatureCard.module.scss';

export interface FeatureCardProps {
  id?: string;
  icon?: string;
  title: string;
  text: string;
  align?: 'left' | 'center' | 'right';
  href?: string;
  animation?: AnimationInput;
  className?: string;
}

/** Feature card with icon, title and description (optionally linked). */
export function FeatureCard({
  id,
  icon,
  title,
  text,
  align = 'left',
  href,
  animation,
  className,
}: FeatureCardProps) {
  const ref = useRef<HTMLElement>(null);
  const motion = useMotion(animation, ref);

  return (
    <article
      id={id}
      ref={ref}
      className={cx(s.card, s[align], motion.className, className)}
      style={motion.style}
      data-hover={motion.hoverType}
    >
      {icon && (
        <span className={s.iconWrap} aria-hidden="true">
          <Icon name={icon} size={24} />
        </span>
      )}
      <h3 className={s.title}>{title}</h3>
      <p className={s.text}>{text}</p>
      {href && <a className={s.stretched} href={href} aria-label={title} tabIndex={-1} />}
    </article>
  );
}
