'use client';

import { DesignRenderer } from '@designed/components';

import { useBuilder } from '../lib/store';

import s from './builder.module.scss';

/**
 * Live preview of the current design. Anchor clicks are intercepted so
 * navigation never leaves the builder, while hovers/animations stay active.
 * `previewKey` remounts the page to replay entrance animations on demand.
 */
export function Preview() {
  const { state } = useBuilder();

  return (
    <div
      className={s.previewArea}
      onClickCapture={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest('a')) event.preventDefault();
      }}
    >
      <div className={s.previewFrame}>
        <DesignRenderer key={state.previewKey} spec={state.spec} />
      </div>
    </div>
  );
}
