'use client';

import type { ReactNode } from 'react';

import type { ComponentSpec } from '@designed/schema';

import { createDefaultComponent, newId } from '../lib/fields';
import { useBuilder } from '../lib/store';
import type { Selection } from '../lib/store';

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

  const select = (target: Selection): void => dispatch({ type: 'select', selection: target });

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
    dispatch({
      type: 'update',
      mutate: (draft) => {
        const target = index + delta;
        if (target < 0 || target >= draft.sections.length) return;
        const [moved] = draft.sections.splice(index, 1);
        if (moved) draft.sections.splice(target, 0, moved);
      },
    });
  };

  const removeSection = (id: string): void => {
    dispatch({
      type: 'update',
      mutate: (draft) => {
        draft.sections = draft.sections.filter((section) => section.id !== id);
      },
    });
    if (selection.kind === 'section' && selection.id === id) select({ kind: 'global' });
  };

  const addSection = (): void => {
    const id = newId('seccion');
    dispatch({
      type: 'update',
      mutate: (draft) => {
        draft.sections.push({
          id,
          kind: 'generic',
          width: 'contained',
          rows: [
            {
              id: newId('fila'),
              columns: [
                {
                  id: newId('columna'),
                  span: 12,
                  hideOn: [],
                  verticalAlign: 'start',
                  components: [createDefaultComponent('heading'), createDefaultComponent('text')],
                },
              ],
              stackBelow: 'mobile',
            },
          ],
        });
      },
    });
    select({ kind: 'section', id });
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

      <button
        type="button"
        className={isSelected(selection, { kind: 'header' }) ? s.treeItemActive : s.treeItem}
        onClick={() => select({ kind: 'header' })}
      >
        ☰ Menú superior
      </button>

      <div className={s.treeGroup}>
        <span className={s.treeGroupLabel}>Secciones</span>
        {spec.sections.map((section, index) => {
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
                <span>
                  {section.kind} · {section.id}
                </span>
                <span className={s.treeMiniRow}>
                  {rowButton('↑', () => moveSection(index, -1))}
                  {rowButton('↓', () => moveSection(index, 1))}
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
        <button type="button" className={s.ghostButton} onClick={addSection}>
          + Añadir sección
        </button>{' '}
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
