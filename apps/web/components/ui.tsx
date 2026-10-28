'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

import s from './builder.module.scss';

/**
 * Small form primitives for the property panels. Text/number/color inputs
 * keep local state and commit on blur (or Enter) so a single edit = a single
 * undo step instead of one per keystroke.
 */

export function FieldRow({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className={s.field}>
      <span className={s.fieldLabel}>{label}</span>
      {children}
      {hint && <small className={s.fieldHint}>{hint}</small>}
    </label>
  );
}

export function PanelSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={s.panelSection}>
      <h3 className={s.panelSectionTitle}>{title}</h3>
      {children}
    </section>
  );
}

/**
 * Local editing state that re-syncs when the external value changes.
 * Uses React's "adjusting state during render" pattern (guarded, so no
 * cascading effect renders and no `set-state-in-effect` violation).
 */
export function useLocalValue(value: string | number | undefined): [string, (v: string) => void] {
  const stringified = value == null ? '' : String(value);
  const [local, setLocal] = useState(stringified);
  const [previous, setPrevious] = useState(stringified);

  if (stringified !== previous) {
    setPrevious(stringified);
    setLocal(stringified);
  }

  return [local, setLocal];
}

export interface CommitFieldProps {
  label: string;
  value: string | number | undefined;
  onCommit: (value: string | number | undefined) => void;
  placeholder?: string;
  hint?: string;
}

export function TextField({ label, value, onCommit, placeholder, hint }: CommitFieldProps) {
  const [local, setLocal] = useLocalValue(value);

  const commit = (): void => {
    if (local === (value == null ? '' : String(value))) return;
    onCommit(local === '' ? undefined : local);
  };

  return (
    <FieldRow label={label}>
      <input
        className={s.input}
        type="text"
        value={local}
        placeholder={placeholder}
        onChange={(event) => setLocal(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.currentTarget.blur();
        }}
      />
      {hint && <small className={s.fieldHint}>{hint}</small>}
    </FieldRow>
  );
}

export function TextAreaField({
  label,
  value,
  onCommit,
  rows = 3,
}: CommitFieldProps & { rows?: number }) {
  const [local, setLocal] = useLocalValue(value);

  const commit = (): void => {
    if (local === (value == null ? '' : String(value))) return;
    onCommit(local === '' ? undefined : local);
  };

  return (
    <FieldRow label={label}>
      <textarea
        className={s.textarea}
        rows={rows}
        value={local}
        onChange={(event) => setLocal(event.target.value)}
        onBlur={commit}
      />
    </FieldRow>
  );
}

export function NumberField({ label, value, onCommit, placeholder }: CommitFieldProps) {
  const [local, setLocal] = useLocalValue(value);

  const commit = (): void => {
    if (local === (value == null ? '' : String(value))) return;
    if (local === '') {
      onCommit(undefined);
      return;
    }
    const parsed = Number(local);
    onCommit(Number.isNaN(parsed) ? undefined : parsed);
  };

  return (
    <FieldRow label={label}>
      <input
        className={s.input}
        type="number"
        value={local}
        placeholder={placeholder}
        onChange={(event) => setLocal(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.currentTarget.blur();
        }}
      />
    </FieldRow>
  );
}

export function ColorField({ label, value, onCommit, hint }: CommitFieldProps) {
  const hex = typeof value === 'string' ? value : '#000000';
  const [local, setLocal] = useState(hex);
  const [previous, setPrevious] = useState(hex);

  if (hex !== previous) {
    setPrevious(hex);
    setLocal(hex);
  }

  const commit = (): void => {
    if (local === hex) return;
    onCommit(local);
  };

  return (
    <FieldRow label={label}>
      <span className={s.colorRow}>
        <input
          className={s.colorSwatch}
          type="color"
          value={local.slice(0, 7)}
          onChange={(event) => setLocal(event.target.value)}
          onBlur={commit}
        />
        <input
          className={s.input}
          type="text"
          value={local}
          onChange={(event) => setLocal(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur();
          }}
        />
      </span>
      {hint && <small className={s.fieldHint}>{hint}</small>}
    </FieldRow>
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
  hint,
  hintStrong,
}: {
  label: string;
  value: string | undefined;
  options: readonly { value: string; label: string }[];
  onChange: (value: string | undefined) => void;
  hint?: string;
  hintStrong?: boolean;
}) {
  return (
    <FieldRow label={label}>
      <select
        className={s.select}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value === '' ? undefined : event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && <small className={hintStrong ? s.fieldHintStrong : s.fieldHint}>{hint}</small>}
    </FieldRow>
  );
}

export function CheckboxField({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
}) {
  return (
    <label className={s.checkboxRow}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>
        {label}
        {hint && <small className={s.fieldHint}>{hint}</small>}
      </span>
    </label>
  );
}

export function ButtonRow({ children }: { children: ReactNode }) {
  return <div className={s.buttonRow}>{children}</div>;
}

export function DangerButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" className={s.dangerButton} onClick={onClick}>
      {children}
    </button>
  );
}
