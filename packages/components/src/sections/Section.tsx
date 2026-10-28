'use client';

import { InteractiveBackground, useMotion } from '@designed/animations';
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
      data-node="section"
      data-id={id}
      style={{
        ...backgroundToStyle(background as BackgroundSpec),
        ...paddingStyle(padding),
        ...motion.style,
      }}
    >
      {background?.type === 'interactive' && (
        <div className={s.effectLayer} data-effect-layer="" aria-hidden="true">
          <InteractiveBackground background={background} hostRef={ref} />
        </div>
      )}
      <div className={s.inner}>
        {rows.map((row) => (
          <div
            key={row.id}
            className={s.row}
            data-node="row"
            data-id={row.id}
            data-section={id}
            data-stack={row.stackBelow === 'never' ? undefined : row.stackBelow}
            style={row.gapPx != null ? { gap: `${row.gapPx}px` } : undefined}
          >
            {row.columns.map((column) => (
              <div
                key={column.id}
                className={s.column}
                data-node="column"
                data-id={column.id}
                data-section={id}
                data-hide={column.hideOn.length > 0 ? column.hideOn.join(' ') : undefined}
                style={{
                  gridColumn: `span ${column.span}`,
                  alignItems:
                    column.contentAlign === 'center'
                      ? 'center'
                      : column.contentAlign === 'start'
                        ? 'flex-start'
                        : column.contentAlign === 'end'
                          ? 'flex-end'
                          : 'stretch',
                  alignSelf:
                    column.verticalAlign === 'start'
                      ? 'stretch'
                      : column.verticalAlign === 'center'
                        ? 'center'
                        : 'end',
                }}
              >
                {column.components.map((component) => (
                  // display:contents ⇒ el wrapper no altera el layout pero
                  // permite clic-selección y guías en el preview del builder.
                  <div
                    key={component.id}
                    data-node="component"
                    data-id={component.id}
                    data-section={id}
                    style={{ display: 'contents' }}
                  >
                    <SpecRenderer spec={component} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
