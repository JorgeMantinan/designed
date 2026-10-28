'use client';

import { PALETTES, validatePalette } from '@designed/palettes';
import type { Palette, PaletteTag } from '@designed/palettes';
import { useState } from 'react';

import { PaletteSwatches } from './controls';
import { useBuilder } from '../lib/store';

import s from './builder.module.scss';
import { ColorField, PanelSection } from './ui';

const FILTERABLE_TAGS: PaletteTag[] = [
  'clara',
  'oscura',
  'corporativa',
  'calida',
  'fria',
  'vibrante',
  'natural',
  'elegante',
  'divertida',
  'tecnologica',
  'pastel',
  'neon',
  'metalizado',
];

/** Spanish display names for every style tag (raw ids are jargon). */
const TAG_LABELS: Record<PaletteTag, string> = {
  clara: 'Clara',
  oscura: 'Oscura',
  corporativa: 'Corporativa',
  calida: 'Cálida',
  fria: 'Fría',
  vibrante: 'Vibrante',
  natural: 'Natural',
  elegante: 'Elegante',
  divertida: 'Divertida',
  tecnologica: 'Tecnológica',
  neutra: 'Neutra',
  pastel: 'Pastel',
  neon: 'Neón',
  metalizado: 'Metalizado',
};

/**
 * Palette tab: filterable grid of the51 palettes with their WCAG level
 * badge, plus manual editing of the five current colors.
 */
export function PalettePanel() {
  const { state, dispatch } = useBuilder();
  const [activeTags, setActiveTags] = useState<PaletteTag[]>([]);

  const palette = state.spec.theme.palette;
  const currentLevel = validatePalette({
    id: 'actual',
    name: 'Actual',
    tags: [],
    colors: {
      primary: palette.primary,
      secondary: palette.secondary,
      accent: palette.accent,
      background: palette.background,
      surface: palette.surface,
    },
  }).level;

  const visible = PALETTES.filter((item) => activeTags.every((tag) => item.tags.includes(tag)));

  const applyPalette = (item: Palette): void => {
    dispatch({
      type: 'update',
      mutate: (draft) => {
        draft.theme.palette = { ...item.colors };
      },
    });
  };

  const setColor =
    (role: 'primary' | 'secondary' | 'accent' | 'background' | 'surface') =>
    (value: string | number | undefined) => {
      if (typeof value !== 'string') return;
      dispatch({
        type: 'update',
        mutate: (draft) => {
          draft.theme.palette[role] = value;
          // Text overrides may clash with a new background: drop them so the
          // accessible defaults get derived again.
          if (role === 'background') {
            delete draft.theme.palette.text;
            delete draft.theme.palette.textMuted;
          }
        },
      });
    };

  const toggleTag = (tag: PaletteTag): void => {
    setActiveTags((tags) =>
      tags.includes(tag) ? tags.filter((item) => item !== tag) : [...tags, tag],
    );
  };

  return (
    <>
      <PanelSection title={`Paleta actual · WCAG ${currentLevel}`}>
        <div className={s.currentPalette}>
          {[
            palette.primary,
            palette.secondary,
            palette.accent,
            palette.background,
            palette.surface,
          ].map((color, index) => (
            <span
              key={`${color}-${index}`}
              className={s.currentSwatch}
              style={{ background: color }}
            />
          ))}
        </div>
        <ColorField label="Primario" value={palette.primary} onCommit={setColor('primary')} />
        <ColorField label="Secundario" value={palette.secondary} onCommit={setColor('secondary')} />
        <ColorField label="Acento" value={palette.accent} onCommit={setColor('accent')} />
        <ColorField
          label="Fondo de la página"
          value={palette.background}
          onCommit={setColor('background')}
        />
        <PaletteSwatches
          label="Usar un color de la paleta como fondo"
          colors={[palette.primary, palette.secondary, palette.accent, palette.surface]}
          onPick={(color) => setColor('background')(color)}
        />
        <p className={s.hint}>
          Cada paleta trae su propio fondo teñido; cámbialo aquí o directamente en el editor de la
          sección.
        </p>
        <ColorField
          label="Superficie (tarjetas)"
          value={palette.surface}
          onCommit={setColor('surface')}
        />
      </PanelSection>

      <PanelSection title="Filtrar por estilo">
        <div className={s.chipGrid}>
          {FILTERABLE_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={activeTags.includes(tag) ? s.chipActive : s.chip}
              onClick={() => toggleTag(tag)}
            >
              {TAG_LABELS[tag] ?? tag}
            </button>
          ))}
          {activeTags.length > 0 && (
            <button type="button" className={s.chip} onClick={() => setActiveTags([])}>
              limpiar ✕
            </button>
          )}
        </div>
      </PanelSection>

      <PanelSection title={`Paletas (${visible.length})`}>
        <div className={s.paletteGrid}>
          {visible.map((item) => {
            const level = validatePalette(item).level;
            const isCurrent =
              item.colors.primary === palette.primary &&
              item.colors.background === palette.background &&
              item.colors.surface === palette.surface;

            return (
              <button
                key={item.id}
                type="button"
                className={isCurrent ? s.paletteCardActive : s.paletteCard}
                onClick={() => applyPalette(item)}
                title={`${item.name} · ${item.tags.join(', ')} · WCAG ${level}`}
              >
                <span className={s.paletteCardBars}>
                  <i style={{ background: item.colors.primary }} />
                  <i style={{ background: item.colors.secondary }} />
                  <i style={{ background: item.colors.accent }} />
                  <i style={{ background: item.colors.background }} />
                  <i style={{ background: item.colors.surface }} />
                </span>
                <span className={s.paletteCardName}>{item.name}</span>
                <span className={level === 'AAA' ? s.levelAAA : s.levelAA}>{level}</span>
              </button>
            );
          })}
        </div>
      </PanelSection>
    </>
  );
}
