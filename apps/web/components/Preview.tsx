'use client';

import { DesignRenderer } from '@designed/components';
import type { Selection } from '../lib/store';

import { useBuilder } from '../lib/store';

import s from './builder.module.scss';

/**
 * Live preview of the current design. Anchor clicks are intercepted so
 * navigation never leaves the builder, while hovers/animations stay active.
 * Every editable node (section/row/column/component) carries data-node
 * attributes so clicking it selects it directly in the panels — no need to
 * hunt for the element in the left tree. `previewKey` remounts the page to
 * replay entrance animations on demand.
 */
export function Preview() {
  const { state, dispatch } = useBuilder();

  return (
    <div
      className={s.previewArea}
      onClickCapture={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest('a')) event.preventDefault();

        // Los controles interactivos (burger del menú, flechas del carrusel,
        // preguntas del FAQ...) conservan SU clic: el click-to-select no los
        // intercepta (antes les robaba el evento y no abrían nada).
        if (target.closest('button, input, select, textarea, summary, label')) return;

        // Click-to-edit: map the closest data-node to a builder selection.
        const node = target.closest('[data-node]');
        if (!node) return;
        const kind = node.getAttribute('data-node');
        const nodeId = node.getAttribute('data-id');
        const sectionId = node.getAttribute('data-section');

        // Header/footer are single editable zones (no ids needed).
        if (kind === 'header') {
          event.stopPropagation();
          dispatch({ type: 'select', selection: { kind: 'header' } });
          return;
        }
        if (kind === 'footer') {
          event.stopPropagation();
          dispatch({ type: 'select', selection: { kind: 'footer' } });
          return;
        }
        if (!nodeId) return;

        let selection: Selection | null = null;
        if (kind === 'section') selection = { kind: 'section', id: nodeId };
        else if (kind === 'row' && sectionId) selection = { kind: 'row', sectionId, id: nodeId };
        else if (kind === 'column' && sectionId)
          selection = { kind: 'column', sectionId, id: nodeId };
        else if (kind === 'component' && sectionId)
          selection = { kind: 'component', sectionId, id: nodeId };

        if (selection) {
          event.stopPropagation();
          dispatch({ type: 'select', selection });
        }
      }}
    >
      <div className={s.previewFrame}>
        <DesignRenderer key={state.previewKey} spec={state.spec} />
      </div>
    </div>
  );
}
