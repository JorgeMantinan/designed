'use client';

import { useMotion } from '@designed/animations';
import { useRef } from 'react';
import type { AnimationInput } from '@designed/schema';
import { cx } from '../cx';
import { Icon } from '../icons';

import s from './TestimonialCard.module.scss';

export interface TestimonialCardProps {
  id?: string;
  quote: string;
  author: string;
  role?: string;
  avatarUrl?: string;
  rating?: number;
  animation?: AnimationInput;
  className?: string;
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

/** Social proof card: rating stars, quote and author. */
export function TestimonialCard({
  id,
  quote,
  author,
  role,
  avatarUrl,
  rating = 5,
  animation,
  className,
}: TestimonialCardProps) {
  const ref = useRef<HTMLElement>(null);
  const motion = useMotion(animation, ref);

  return (
    <article
      id={id}
      ref={ref}
      className={cx(s.card, motion.className, className)}
      style={motion.style}
      data-hover={motion.hoverType}
    >
      <div className={s.stars} aria-label={`${rating} de 5 estrellas`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name="star"
            size={16}
            className={star <= rating ? s.starOn : s.starOff}
          />
        ))}
      </div>
      <blockquote className={s.quote}>“{quote}”</blockquote>
      <footer className={s.author}>
        {avatarUrl ? (
          <img className={s.avatar} src={avatarUrl} alt="" loading="lazy" />
        ) : (
          <span className={s.avatarFallback} aria-hidden="true">
            {initialsOf(author)}
          </span>
        )}
        <div className={s.identity}>
          <cite className={s.name}>{author}</cite>
          {role && <p className={s.role}>{role}</p>}
        </div>
      </footer>
    </article>
  );
}
