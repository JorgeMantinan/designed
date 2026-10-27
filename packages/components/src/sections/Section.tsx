'use client';

import { useMotion } from '@designed/animations';
import { useRef } from 'react';
import type { BackgroundSpec, SectionPadding, SectionSpec } from '@designed/schema';
import type { CSSProperties } from 'react';

import { backgroundToStyle } from '../background-style';
import { cx } from '../cx';
import { SpecRenderer } from '../renderer';

import s from './Section.module.scss';

export interface SectionProps extends SectionSpec {
  className?: string;
}

function paddingStyle(padding: SectionPadding | undefined): CSSProperties {
  const style: CSSProperties = {};
  if (padding?.topBottomPx != null) {
    style.paddingTop = `${padding.topBottomPx}px`;
    style.paddingBottom = `${padding.topBottomPx}px`;
  }
  if (padding?.leftRightPx != null) {
    style.paddingLeft = `${padding.leftRightPx}px`;
    style.paddingRight = `${padding.leftRightPx}px`;
  }
  return style;
}

/**
 * Semantic section: rows → columns (12-unit grid) → components.
 * Handles backgrounds (color/gradient/image/interactive), responsive
 * stacking (`stackBelow`), column hiding (`hideOn`) and entrance motion.
 */
export function Section({
  id,
  kind,
  rows,
  background,
  padding,
  width,
  animation,
  className,
}: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const motion = useMotion(animation, ref);
  const interactiveEffect =
    background && background.type === 'interactive' ? background.effect : undefined;

  return (
    <section
      id={id}
      ref={ref}
      className={cx(s.section, width === 'full' && s.full, motion.className, className)}
      data-kind={kind}
      data-effect={interactiveEffect}
      style={{
        ...backgroundToStyle(background as BackgroundSpec),
        ...paddingStyle(padding),
        ...motion.style,
      }}
    >
      <div className={s.inner}>
        {rows.map((row) => (
          <div
            key={row.id}
            className={s.row}
            data-stack={row.stackBelow === 'never' ? undefined : row.stackBelow}
            style={row.gapPx != null ? { gap: `${row.gapPx}px` } : undefined}
          >
            {row.columns.map((column) => (
              <div
                key={column.id}
                className={s.column}
                data-hide={column.hideOn.length > 0 ? column.hideOn.join(' ') : undefined}
                style={{
                  gridColumn: `span ${column.span}`,
                  alignSelf:
                    column.verticalAlign === 'start'
                      ? 'stretch'
                      : column.verticalAlign === 'center'
                        ? 'center'
                        : 'end',
                }}
              >
                {column.components.map((component) => (
                  <SpecRenderer key={component.id} spec={component} />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
