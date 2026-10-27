'use client';

import { useMotion } from '@designed/animations';
import { useRef } from 'react';
import type { AnimationInput, ButtonInput } from '@designed/schema';
import { cx } from '../cx';
import { Icon } from '../icons';

import { Button } from '../primitives/Button';

import s from './PricingCard.module.scss';

export interface PricingCardProps {
  id?: string;
  planName: string;
  price: string;
  currency?: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
  cta?: ButtonInput;
  animation?: AnimationInput;
  className?: string;
}

/** Plan card for pricing tables; the highlighted one is visually promoted. */
export function PricingCard({
  id,
  planName,
  price,
  currency = '$',
  period = '/month',
  features,
  highlighted = false,
  cta,
  animation,
  className,
}: PricingCardProps) {
  const ref = useRef<HTMLElement>(null);
  const motion = useMotion(animation, ref);

  return (
    <article
      id={id}
      ref={ref}
      className={cx(s.card, highlighted && s.highlighted, motion.className, className)}
      style={motion.style}
      data-hover={motion.hoverType}
    >
      <header className={s.header}>
        <h3 className={s.plan}>{planName}</h3>
        <p className={s.price}>
          <span className={s.currency}>{currency}</span>
          <span className={s.amount}>{price}</span>
          <span className={s.period}>{period}</span>
        </p>
      </header>
      <ul className={s.features}>
        {features.map((feature) => (
          <li key={feature} className={s.feature}>
            <Icon name="check" size={16} className={s.check} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {cta && <Button {...cta} className={s.cta} />}
    </article>
  );
}
