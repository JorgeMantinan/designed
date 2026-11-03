'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

import type { ComponentSpec } from '@designed/schema';

import { reassignIds } from '../lib/fields';
import { activeSections, sectionsOwner } from '../lib/pages';
import { PAGE_PRESETS, createPageFromPreset } from '../lib/page-presets';
import { useBuilder } from '../lib/store';
import type { Selection } from '../lib/store';
import { SECTION_PRESETS, createSectionFromPreset } from '../lib/section-presets';

import s from './builder.module.scss';

function componentLabel(component: ComponentSpec): string {
  switch (component.type) {
    case 'heading':
      return component.text;
    case 'text':
      return component.text.slice(0, 32);
    case 'buttonGroup':
      return component.buttons.map((button) => button.label).join(' · ');
    case 'badge':
      return component.label;
    case 'featureCard':
      return component.title;
    case 'pricingCard':
      return component.planName;
    case 'testimonialCard':
      return component.author;
    case 'stat':
      return `${component.value} ${component.label}`;
    case 'faqList':
      return `${component.items.length} preguntas`;
    case 'logoCloud':
      return `${component.logos.length} logos`;
    case 'carousel':
      return `${component.slides.length} diapositivas`;
    case 'featureList':
      return `${component.items.length} elementos`;
    case 'contactForm':
      return component.buttonText;
    case 'countdown':
      return component.target;
    default:
      return component.type;
  }
}

const TYPE_LABELS: Record<string, string> = {
  heading: 'Título',
  text: 'Texto',
  buttonGroup: 'Botones',
  badge: 'Etiqueta',
  image: 'Imagen',
  featureCard: 'Tarjeta',
  pricingCard: 'Precio',
  testimonialCard: 'Testimonio',
  stat: 'Cifra',
  featureList: 'Lista',
  faqList: 'FAQ',
  logoCloud: 'Logos',
  carousel: 'Carrusel',
  divider: 'Separador',
  spacer: 'Espaciador',
  contactForm: 'Formulario',
  countdown: 'Cuenta atrás',
};

function isSelected(selection: Selection, target: Selection): boolean {
  return JSON.stringify(selection) === JSON.stringify(target);
}

/**
 * Left panel: the whole design as a tree (header → sections → rows →
 * columns → components) with selection, reorder, delete and add actions.
 */
export function LayersTree() {
  const { state, dispatch } = useBuilder();
  const { spec, selection } = state;
  const sections = activeSections(spec, state.activePageId);

  const select = (target: Selection): void => dispatch({ type: 'select', selection: target });

  /** Mutates the section list of the ACTIVE page (home = spec root). */
  const mutateSections = (mutate: (list: typeof sections) => void): void => {
    dispatch({
      type: 'update',
      mutate: (draft) => mutate(activeSections(draft, state.activePageId)),
    });
  };

  const rowButton = (label: string, onClick: () => void, danger = false): ReactNode => (
    <button
      type="button"
      className={danger ? s.treeMiniDanger : s.treeMini}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      title={label}
    >
      {label}
    </button>
  );

  const moveSection = (index: number, delta: number): void => {
    mutateSections((list) => {
      const target = index + delta;
      if (target < 0 || target >= list.length) return;
      const [moved] = list.splice(index, 1);
      if (moved) list.splice(target, 0, moved);
    });
  };

  const removeSection = (id: string): void => {
    mutateSections((list) => {
      const index = list.findIndex((section) => section.id === id);
      if (index >= 0) list.splice(index, 1);
    });
    if (selection.kind === 'section' && selection.id === id) select({ kind: 'global' });
  };

  /** Copies a section (with fresh ids) right after the original. */
  const duplicateSection = (id: string): void => {
    let clonedId: string | null = null;
    dispatch({
      type: 'update',
      mutate: (draft) => {
        const sections = sectionsOwner(draft, id);
        if (!sections) return;
        const index = sections.findIndex((section) => section.id === id);
        const source = sections[index];
        if (!source) return;
        const clone = structuredClone(source);
        // Regenera todos los ids: parseDesignSpec exige unicidad global.
        reassignIds(clone);
        clonedId = clone.id;
        sections.splice(index + 1, 0, clone);
      },
    });
    if (clonedId) select({ kind: 'section', id: clonedId });
  };

  const [showPresets, setShowPresets] = useState(false);
  const [showPagePresets, setShowPagePresets] = useState(false);

  /** Adds a rich, pre-designed section from the preset catalog. */
  const addSection = (presetId: string): void => {
    const section = createSectionFromPreset(presetId);
    if (!section) return;
    mutateSections((list) => {
      list.push(section as (typeof list)[number]);
    });
    select({ kind: 'section', id: section.id });
    setShowPresets(false);
  };

  /** Adds a complete pre-built page and switches the editor to it. */
  const addPage = (presetId: string): void => {
    const page = createPageFromPreset(
      presetId,
      spec.pages.map((item) => item.path),
    );
    if (!page) return;
    dispatch({
      type: 'update',
      mutate: (draft) => {
        draft.pages.push(page as (typeof draft.pages)[number]);
      },
    });
    dispatch({ type: 'page', pageId: page.id });
    setShowPagePresets(false);
  };

  const movePage = (index: number, delta: number): void => {
    dispatch({
      type: 'update',
      mutate: (draft) => {
        const target = index + delta;
        if (target < 0 || target >= draft.pages.length) return;
        const [moved] = draft.pages.splice(index, 1);
        if (moved) draft.pages.splice(target, 0, moved);
      },
    });
  };

  const removePage = (id: string): void => {
    if (!window.confirm('¿Eliminar esta página? Sus secciones se perderán.')) return;
    dispatch({
      type: 'update',
      mutate: (draft) => {
        draft.pages = draft.pages.filter((page) => page.id !== id);
      },
    });
    // Si era la página activa, volvemos a la portada.
    if (state.activePageId === id) dispatch({ type: 'page', pageId: null });
    else if (selection.kind === 'page' && selection.id === id) select({ kind: 'global' });
  };

  return (
    <nav className={s.tree} aria-label="Estructura del diseño">
      <button
        type="button"
        className={isSelected(selection, { kind: 'global' }) ? s.treeItemActive : s.treeItem}
        onClick={() => select({ kind: 'global' })}
      >
        🎨 Diseño — {spec.meta.name}
      </button>

      <div className={s.treeGroup}>
        <span className={s.treeGroupLabel}>Páginas</span>
        <button
          type="button"
          className={
            state.activePageId === null && selection.kind !== 'page' ? s.treeItemActive : s.treeItem
          }
          onClick={() => dispatch({ type: 'page', pageId: null })}
        >
          🏠 Inicio <span className={s.treeGroupLabel}>/</span>
        </button>
        {spec.pages.map((page, index) => {
          const pageSelected = state.activePageId === page.id;
          const goToPage = (): void => dispatch({ type: 'page', pageId: page.id });
          return (
            <div
              key={page.id}
              role="button"
              tabIndex={0}
              className={pageSelected ? s.treeItemActive : s.treeItem}
              title={`${page.name} — ${page.path}`}
              onClick={goToPage}
              onKeyDown={(event) => {
                if (event.key === 'Enter') goToPage();
              }}
            >
              <span>
                📄 {page.name} <span className={s.treeGroupLabel}>{page.path}</span>
              </span>
              <span className={s.treeMiniRow}>
                {rowButton('↑', () => movePage(index, -1))}
                {rowButton('↓', () => movePage(index, 1))}
                {rowButton('✕', () => removePage(page.id), true)}
              </span>
            </div>
          );
        })}
        <button
          type="button"
          className={s.ghostButton}
          onClick={() => setShowPagePresets((visible) => !visible)}
        >
          {showPagePresets ? '✕ Cerrar' : '+ Añadir página'}
        </button>
        {showPagePresets && (
          <div className={s.chipGrid} role="group" aria-label="Tipos de página">
            {PAGE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={s.chip}
                title={preset.description}
                onClick={() => addPage(preset.id)}
              >
                <span aria-hidden="true">{preset.icon}</span> {preset.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        className={isSelected(selection, { kind: 'header' }) ? s.treeItemActive : s.treeItem}
        onClick={() => select({ kind: 'header' })}
      >
        ☰ Menú superior
      </button>

      <div className={s.treeGroup}>
        <span className={s.treeGroupLabel}>
          Secciones
          {state.activePageId !== null
            ? ` · ${spec.pages.find((page) => page.id === state.activePageId)?.name ?? ''}`
            : ''}
        </span>
        {sections.map((section, index) => {
          const sectionSelected = isSelected(selection, { kind: 'section', id: section.id });
          return (
            <div key={section.id} className={s.treeBlock}>
              <div
                role="button"
                tabIndex={0}
                className={sectionSelected ? s.treeItemActive : s.treeItem}
                onClick={() => select({ kind: 'section', id: section.id })}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') select({ kind: 'section', id: section.id });
                }}
              >
                <span title={section.id}>Sección {index + 1}</span>
                <span className={s.treeMiniRow}>
                  {rowButton('↑', () => moveSection(index, -1))}
                  {rowButton('↓', () => moveSection(index, 1))}
                  {rowButton('⧉', () => duplicateSection(section.id))}
                  {rowButton('✕', () => removeSection(section.id), true)}
                </span>
              </div>

              {sectionSelected ||
              (selection.kind === 'row' && selection.sectionId === section.id) ||
              (selection.kind === 'column' && selection.sectionId === section.id) ||
              (selection.kind === 'component' && selection.sectionId === section.id) ? (
                <div className={s.treeChildren}>
                  {section.rows.map((row) => (
                    <div key={row.id}>
                      <div
                        role="button"
                        tabIndex={0}
                        className={
                          isSelected(selection, { kind: 'row', sectionId: section.id, id: row.id })
                            ? s.treeItemActive
                            : s.treeItem
                        }
                        onClick={() => select({ kind: 'row', sectionId: section.id, id: row.id })}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter')
                            select({ kind: 'row', sectionId: section.id, id: row.id });
                        }}
                      >
                        <span>Fila · {row.columns.length} col.</span>
                      </div>

                      {row.columns.map((column) => (
                        <div key={column.id}>
                          <div
                            role="button"
                            tabIndex={0}
                            className={
                              isSelected(selection, {
                                kind: 'column',
                                sectionId: section.id,
                                id: column.id,
                              })
                                ? s.treeItemActive
                                : s.treeItem
                            }
                            onClick={() =>
                              select({ kind: 'column', sectionId: section.id, id: column.id })
                            }
                            onKeyDown={(event) => {
                              if (event.key === 'Enter')
                                select({ kind: 'column', sectionId: section.id, id: column.id });
                            }}
                          >
                            <span>Columna · {column.span}/12</span>
                          </div>

                          <div className={s.treeChildren}>
                            {column.components.map((component) => (
                              <div
                                key={component.id}
                                role="button"
                                tabIndex={0}
                                className={
                                  isSelected(selection, {
                                    kind: 'component',
                                    sectionId: section.id,
                                    id: component.id,
                                  })
                                    ? s.treeItemActive
                                    : s.treeItem
                                }
                                onClick={() =>
                                  select({
                                    kind: 'component',
                                    sectionId: section.id,
                                    id: component.id,
                                  })
                                }
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter')
                                    select({
                                      kind: 'component',
                                      sectionId: section.id,
                                      id: component.id,
                                    });
                                }}
                              >
                                <span>
                                  {TYPE_LABELS[component.type] ?? component.type}:{' '}
                                  {componentLabel(component)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
        <button
          type="button"
          className={s.ghostButton}
          onClick={() => setShowPresets((visible) => !visible)}
        >
          {showPresets ? '✕ Cerrar' : '+ Añadir sección'}
        </button>
        {showPresets && (
          <div className={s.chipGrid} role="group" aria-label="Tipos de sección">
            {SECTION_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={s.chip}
                title={preset.description}
                onClick={() => addSection(preset.id)}
              >
                <span aria-hidden="true">{preset.icon}</span> {preset.label}
              </button>
            ))}
          </div>
        )}{' '}
      </div>

      <button
        type="button"
        className={isSelected(selection, { kind: 'footer' }) ? s.treeItemActive : s.treeItem}
        onClick={() => select({ kind: 'footer' })}
      >
        ▤ Pie de página
      </button>
    </nav>
  );
}
