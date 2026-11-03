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
        const anchor = target.closest('a');
        if (anchor) event.preventDefault();

        // Navegación entre páginas del diseño: un enlace a /tienda (o #/tienda)
        // cambia la página activa en el propio editor, sin salir de la preview.
        if (anchor) {
          const href = anchor.getAttribute('href') ?? '';
          const path = href.startsWith('#/') ? href.slice(1) : href.startsWith('/') ? href : null;
          if (path !== null) {
            const page = state.spec.pages.find((item) => item.path === path);
            event.stopPropagation();
            if (path === '/') dispatch({ type: 'page', pageId: null });
            else if (page) dispatch({ type: 'page', pageId: page.id });
            return;
          }
        }

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
        <DesignRenderer
          key={state.previewKey}
          spec={state.spec}
          pageId={state.activePageId ?? undefined}
        />
      </div>
    </div>
  );
}
