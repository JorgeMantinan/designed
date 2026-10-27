import { cx } from '../cx';

import s from './Badge.module.scss';

export interface BadgeProps {
  id?: string;
  label: string;
  tone?: 'primary' | 'secondary' | 'accent' | 'neutral';
  className?: string;
}

/** Small pill label: "Nuevo", "Pro", counters... */
export function Badge({ id, label, tone = 'primary', className }: BadgeProps) {
  return (
    <span id={id} className={cx(s.badge, s[tone], className)}>
      {label}
    </span>
  );
}
