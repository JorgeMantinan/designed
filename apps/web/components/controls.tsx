'use client';

import type { ReactNode } from 'react';

import { TextField, useLocalValue } from './ui';

import s from './builder.module.scss';

/**
 * Visual, non-technical controls for the properties panel: sliders with live
 * values, preset cards with previews, curated font stacks and quick color
 * swatches. Everything here writes plain values into the design spec — no
 * code knowledge required from the client.
 */

// ── Slider + valor ──────────────────────────────────────────────────────────

export interface SliderNumberFieldProps {
  label: string;
  value: number | undefined;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  hint?: string;
  onChange: (value: number | undefined) => void;
}

/**
 * Range slider with a live readout. Commits on release (pointerup / keyup /
 * blur) so one drag = one undo step.
 */
export function SliderNumberField({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  hint,
  onChange,
}: SliderNumberFieldProps) {
  const [local, setLocal] = useLocalValue(value ?? min);

  const commit = (): void => {
    const next = Number(local);
    const clamped = Math.min(max, Math.max(min, Number.isNaN(next) ? min : next));
    if (clamped === (value ?? min)) return;
    onChange(clamped);
  };

  return (
    <label className={s.field}>
      <span className={s.fieldLabelRow}>
        <span className={s.fieldLabel}>{label}</span>
        <output className={s.sliderValue}>
          {local}
          {unit}
        </output>
      </span>
      <input
        className={s.slider}
        type="range"
        min={min}
        max={max}
        step={step}
        value={local}
        onChange={(event) => setLocal(event.target.value)}
        onPointerUp={commit}
        onKeyUp={commit}
        onBlur={commit}
      />
      {hint && <small className={s.fieldHint}>{hint}</small>}
    </label>
  );
}

// ── Fila de presets con preview ─────────────────────────────────────────────

export interface PresetOption {
  id: string;
  label: string;
}

export function PresetRow({
  options,
  value,
  onSelect,
  renderPreview,
  label,
}: {
  options: PresetOption[];
  value: string | null;
  onSelect: (id: string) => void;
  renderPreview?: (id: string) => ReactNode;
  label?: string;
}) {
  return (
    <div className={s.field}>
      {label && <span className={s.fieldLabel}>{label}</span>}
      <div className={s.presetRow} role="radiogroup" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={value === option.id}
            className={value === option.id ? s.presetActive : s.preset}
            onClick={() => onSelect(option.id)}
            title={option.label}
          >
            {renderPreview?.(option.id)}
            <span className={s.presetLabel}>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Preset de sombras (aplica el trío sm/md/lg de golpe) ───────────────────

export interface ShadowPreset extends PresetOption {
  sm: string;
  md: string;
  lg: string;
}

export const SHADOW_PRESETS: readonly ShadowPreset[] = [
  { id: 'none', label: 'Sin sombra', sm: 'none', md: 'none', lg: 'none' },
  {
    id: 'sutil',
    label: 'Sutil',
    sm: '0 1px 2px rgb(0 0 0 / 0.06)',
    md: '0 2px 6px rgb(0 0 0 / 0.08)',
    lg: '0 8px 24px rgb(0 0 0 / 0.10)',
  },
  {
    id: 'equilibrada',
    label: 'Equilibrada',
    sm: '0 1px 2px rgb(0 0 0 / 0.08)',
    md: '0 4px 12px rgb(0 0 0 / 0.10)',
    lg: '0 12px 32px rgb(0 0 0 / 0.14)',
  },
  {
    id: 'profunda',
    label: 'Profunda',
    sm: '0 2px 4px rgb(0 0 0 / 0.12)',
    md: '0 8px 20px rgb(0 0 0 / 0.16)',
    lg: '0 20px 48px rgb(0 0 0 / 0.22)',
  },
];

export function currentShadowPresetId(
  shadow: { sm: string; md: string; lg: string } | undefined,
): string | null {
  if (!shadow) return null;
  return (
    SHADOW_PRESETS.find(
      (preset) => preset.sm === shadow.sm && preset.md === shadow.md && preset.lg === shadow.lg,
    )?.id ?? null
  );
}

// ── Preset de densidad (aplica la escala de espaciado completa) ─────────────

export interface DensityPreset extends PresetOption {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  sectionYPx: number;
  sectionXPx: number;
}

export const DENSITY_PRESETS: readonly DensityPreset[] = [
  {
    id: 'compacta',
    label: 'Compacta',
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 20,
    xxl: 32,
    sectionYPx: 40,
    sectionXPx: 16,
  },
  {
    id: 'normal',
    label: 'Normal',
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 40,
    xxl: 64,
    sectionYPx: 64,
    sectionXPx: 16,
  },
  {
    id: 'amplia',
    label: 'Amplia',
    xs: 6,
    sm: 10,
    md: 20,
    lg: 30,
    xl: 48,
    xxl: 80,
    sectionYPx: 88,
    sectionXPx: 24,
  },
  {
    id: 'generosa',
    label: 'Generosa',
    xs: 8,
    sm: 14,
    md: 24,
    lg: 36,
    xl: 56,
    xxl: 96,
    sectionYPx: 112,
    sectionXPx: 32,
  },
];

export function currentDensityPresetId(spacing: {
  xs: number;
  md: number;
  lg: number;
  sectionYPx: number;
}): string | null {
  return (
    DENSITY_PRESETS.find(
      (preset) =>
        preset.xs === spacing.xs &&
        preset.md === spacing.md &&
        preset.lg === spacing.lg &&
        preset.sectionYPx === spacing.sectionYPx,
    )?.id ?? null
  );
}

// ── Preset de esquinas ──────────────────────────────────────────────────────

export interface RadiusPreset extends PresetOption {
  sm: number;
  md: number;
  lg: number;
}

export const RADIUS_PRESETS: readonly RadiusPreset[] = [
  { id: 'recto', label: 'Recto', sm: 0, md: 0, lg: 0 },
  { id: 'sutil', label: 'Sutil', sm: 4, md: 8, lg: 12 },
  { id: 'suave', label: 'Suave', sm: 6, md: 12, lg: 20 },
  { id: 'redondeado', label: 'Redondeado', sm: 10, md: 20, lg: 32 },
  { id: 'muy-redondeado', label: 'Muy redondeado', sm: 16, md: 28, lg: 44 },
];

export function currentRadiusPresetId(radius: {
  sm: number;
  md: number;
  lg: number;
}): string | null {
  return (
    RADIUS_PRESETS.find(
      (preset) => preset.sm === radius.sm && preset.md === radius.md && preset.lg === radius.lg,
    )?.id ?? null
  );
}

// ── Tipografías curadas ─────────────────────────────────────────────────────

export interface FontOption extends PresetOption {
  value: string;
}

export const FONT_OPTIONS: readonly FontOption[] = [
  {
    id: 'sistema',
    label: 'Sistema (moderna)',
    value: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  { id: 'clasica', label: 'Clásica (Arial)', value: 'Arial, Helvetica, sans-serif' },
  { id: 'elegante', label: 'Elegante (Georgia)', value: "Georgia, 'Times New Roman', serif" },
  { id: 'editorial', label: 'Editorial (Palatino)', value: "'Palatino Linotype', Palatino, serif" },
  { id: 'redondeada', label: 'Redondeada (Trebuchet)', value: "'Trebuchet MS', sans-serif" },
  { id: 'tecnica', label: 'Técnica (Consolas)', value: "Consolas, 'Courier New', monospace" },
  { id: 'personalizada', label: 'Personalizada…', value: '' },
];

export function currentFontId(font: string): string {
  return FONT_OPTIONS.find((option) => option.value === font)?.id ?? 'personalizada';
}

export const WEIGHT_OPTIONS: readonly PresetOption[] = [
  { id: '300', label: 'Ligera (300)' },
  { id: '400', label: 'Normal (400)' },
  { id: '500', label: 'Media (500)' },
  { id: '600', label: 'Seminegrita (600)' },
  { id: '700', label: 'Negrita (700)' },
  { id: '800', label: 'Extra (800)' },
];

// ── Colores rápidos de la paleta actual ─────────────────────────────────────

/** Curated font picker: preset stacks plus an escape hatch for custom CSS. */
export function FontField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const selectedId = currentFontId(value);

  return (
    <>
      <label className={s.field}>
        <span className={s.fieldLabel}>{label}</span>
        <select
          className={s.select}
          value={selectedId}
          onChange={(event) => {
            const option = FONT_OPTIONS.find((item) => item.id === event.target.value);
            if (option?.value) onChange(option.value);
          }}
        >
          {FONT_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      {selectedId === 'personalizada' && (
        <TextField
          label={`Pila de ${label.toLowerCase()} (CSS)`}
          value={value}
          placeholder="Georgia, serif"
          onCommit={(next) => typeof next === 'string' && onChange(next)}
        />
      )}
    </>
  );
}

/** Quick-pick row: the current palette colors as one-click options. */
export function PaletteSwatches({
  colors,
  onPick,
  label,
}: {
  colors: string[];
  onPick: (value: string) => void;
  label?: string;
}) {
  return (
    <div className={s.field}>
      {label && <span className={s.fieldLabel}>{label}</span>}
      <div className={s.swatchRow}>
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            className={s.swatchButton}
            style={{ background: color }}
            onClick={() => onPick(color)}
            title={color}
            aria-label={`Usar el color ${color}`}
          />
        ))}
      </div>
    </div>
  );
}
