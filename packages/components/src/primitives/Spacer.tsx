import { cx } from '../cx';

import s from './Spacer.module.scss';

export interface SpacerProps {
  id?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
}

/** Vertical rhythm helper mapped to the spacing scale. */
export function Spacer({ id, size = 'md', className }: SpacerProps) {
  return <div id={id} className={cx(s.spacer, className)} data-size={size} aria-hidden="true" />;
}
