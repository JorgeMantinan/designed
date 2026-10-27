'use client';

import type { ReactNode } from 'react';

import type { ComponentType } from '@designed/schema';

import { COMPONENT_FIELDS, getPath, setPath } from '../lib/fields';
import type { FieldDescriptor } from '../lib/fields';

import { SliderNumberField } from './controls';
import s from './builder.module.scss';
import {
  CheckboxField,
  ColorField,
  NumberField,
  PanelSection,
  SelectField,
  TextAreaField,
  TextField,
} from './ui';

/**
 * Generic property form driven by declarative field descriptors.
 *
 * - `FieldsForm` renders any descriptor list against any object (used for
 *   components, header menu items, footer columns...).
 * - Bounded numbers (min + max) render as VISUAL SLIDERS instead of raw
 *   inputs so non-technical clients can drag and see the value.
 * - `FieldsEditor` is the component-flavored wrapper with a titled section.
 */

export function FieldsForm({
  fields,
  value,
  onChange,
}: {
  fields: FieldDescriptor[];
  value: unknown;
  onChange: (next: unknown) => void;
}): ReactNode {
  const change = (path: string, next: unknown): void => {
    onChange(setPath(value, path, next));
  };

  const renderField = (field: FieldDescriptor): ReactNode => {
    const current = getPath(value, field.key);

    switch (field.kind) {
      case 'text':
        return (
          <TextField
            key={field.key}
            label={field.label}
            value={current as string | undefined}
            placeholder={field.placeholder}
            onCommit={(next) => change(field.key, next)}
          />
        );

      case 'textarea':
        return (
          <TextAreaField
            key={field.key}
            label={field.label}
            value={current as string | undefined}
            rows={field.rows ?? 3}
            onCommit={(next) => change(field.key, next)}
          />
        );

      case 'number':
        // Acotados → slider visual; el resto → número libre.
        if (field.min != null && field.max != null) {
          return (
            <SliderNumberField
              key={field.key}
              label={field.label}
              value={current as number | undefined}
              min={field.min}
              max={field.max}
              step={field.step ?? 1}
              onChange={(next) => change(field.key, next)}
            />
          );
        }
        return (
          <NumberField
            key={field.key}
            label={field.label}
            value={current as number | undefined}
            onCommit={(next) => change(field.key, next)}
          />
        );

      case 'color':
        return (
          <ColorField
            key={field.key}
            label={field.label}
            value={current as string | undefined}
            onCommit={(next) => change(field.key, next)}
          />
        );

      case 'select':
        return (
          <SelectField
            key={field.key}
            label={field.label}
            value={current as string | undefined}
            options={field.options}
            onChange={(next) => change(field.key, next)}
          />
        );

      case 'checkbox':
        return (
          <CheckboxField
            key={field.key}
            label={field.label}
            checked={Boolean(current)}
            onChange={(next) => change(field.key, next)}
          />
        );

      case 'list':
        return (
          <ListEditor
            key={field.key}
            path={field.key}
            field={field}
            value={(current as unknown[]) ?? []}
            onChange={(next) => change(field.key, next)}
          />
        );

      case 'optional-object':
        return (
          <OptionalObjectEditor
            key={field.key}
            field={field}
            value={current}
            onChange={(next) => change(field.key, next)}
          />
        );

      default:
        return null;
    }
  };

  return <>{fields.map((field) => renderField(field))}</>;
}

/** Component-flavored wrapper: titled section around the generic form. */
export function FieldsEditor({
  componentType,
  value,
  onChange,
}: {
  componentType: ComponentType;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  return (
    <PanelSection title="Propiedades">
      <FieldsForm fields={COMPONENT_FIELDS[componentType]} value={value} onChange={onChange} />
    </PanelSection>
  );
}

function ListEditor({
  path,
  field,
  value,
  onChange,
}: {
  path: string;
  field: Extract<FieldDescriptor, { kind: 'list' }>;
  value: unknown[];
  onChange: (next: unknown[]) => void;
}) {
  const canAdd = !field.maxItems || value.length < field.maxItems;

  return (
    <div className={s.listEditor} aria-label={field.label}>
      <span className={s.fieldLabel}>
        {field.label} ({value.length})
      </span>

      {value.map((item, index) => (
        <div key={`${path}-${index}`} className={s.listItem}>
          <div className={s.listItemHeader}>
            <span className={s.listItemIndex}>#{index + 1}</span>
            <button
              type="button"
              className={s.treeMiniDanger}
              onClick={() => onChange(value.filter((_, position) => position !== index))}
              title="Quitar"
            >
              ✕
            </button>
          </div>

          {field.itemKind === 'text' ? (
            <TextField
              label=""
              value={item as string}
              onCommit={(next) =>
                onChange(
                  value.map((current, position) => (position === index ? (next ?? '') : current)),
                )
              }
            />
          ) : (
            field.itemFields.map((itemField) => (
              <ItemField
                key={itemField.key}
                field={itemField}
                item={item as Record<string, unknown>}
                onChange={(nextItem) =>
                  onChange(
                    value.map((current, position) => (position === index ? nextItem : current)),
                  )
                }
              />
            ))
          )}
        </div>
      ))}

      {canAdd && (
        <button
          type="button"
          className={s.ghostButton}
          onClick={() => onChange([...value, field.createItem()])}
        >
          + {field.addLabel}
        </button>
      )}
    </div>
  );
}

/** Renders one descriptor against a plain object item (no path juggling). */
function ItemField({
  field,
  item,
  onChange,
}: {
  field: FieldDescriptor;
  item: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  const current = item[field.key];

  switch (field.kind) {
    case 'textarea':
      return (
        <TextAreaField
          label={field.label}
          value={current as string | undefined}
          rows={field.rows ?? 2}
          onCommit={(next) => onChange({ ...item, [field.key]: next })}
        />
      );
    case 'number':
      if (field.min != null && field.max != null) {
        return (
          <SliderNumberField
            label={field.label}
            value={current as number | undefined}
            min={field.min}
            max={field.max}
            step={field.step ?? 1}
            onChange={(next) => onChange({ ...item, [field.key]: next })}
          />
        );
      }
      return (
        <NumberField
          label={field.label}
          value={current as number | undefined}
          onCommit={(next) => onChange({ ...item, [field.key]: next })}
        />
      );
    case 'select':
      return (
        <SelectField
          label={field.label}
          value={current as string | undefined}
          options={field.options}
          onChange={(next) => onChange({ ...item, [field.key]: next })}
        />
      );
    case 'color':
      return (
        <ColorField
          label={field.label}
          value={current as string | undefined}
          onCommit={(next) => onChange({ ...item, [field.key]: next })}
        />
      );
    case 'checkbox':
      return (
        <CheckboxField
          label={field.label}
          checked={Boolean(current)}
          onChange={(next) => onChange({ ...item, [field.key]: next })}
        />
      );
    case 'list':
      // Sub-listas (p. ej. el submenú de un elemento de navegación).
      return (
        <ListEditor
          path={`${field.key}[]`}
          field={field}
          value={(current as unknown[]) ?? []}
          onChange={(next) => onChange({ ...item, [field.key]: next })}
        />
      );
    default:
      return (
        <TextField
          label={field.label}
          value={current as string | undefined}
          placeholder={'placeholder' in field ? field.placeholder : undefined}
          onCommit={(next) => onChange({ ...item, [field.key]: next })}
        />
      );
  }
}

function OptionalObjectEditor({
  field,
  value,
  onChange,
}: {
  field: Extract<FieldDescriptor, { kind: 'optional-object' }>;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  if (value == null || typeof value !== 'object') {
    return (
      <div className={s.listEditor}>
        <span className={s.fieldLabel}>{field.label}</span>
        <button type="button" className={s.ghostButton} onClick={() => onChange(field.create())}>
          + Añadir {field.label.toLowerCase()}
        </button>
      </div>
    );
  }

  return (
    <div className={s.listEditor} aria-label={field.label}>
      <div className={s.listItemHeader}>
        <span className={s.fieldLabel}>{field.label}</span>
        <button
          type="button"
          className={s.treeMiniDanger}
          onClick={() => onChange(undefined)}
          title="Quitar"
        >
          ✕
        </button>
      </div>
      {field.fields.map((child) => (
        <ItemField
          key={child.key}
          field={child}
          item={value as Record<string, unknown>}
          onChange={onChange}
        />
      ))}
    </div>
  );
}
