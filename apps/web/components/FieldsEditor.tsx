'use client';

import type { ReactNode } from 'react';

import type { ComponentType } from '@designed/schema';

import { COMPONENT_FIELDS, getPath, setPath } from '../lib/fields';
import type { FieldDescriptor } from '../lib/fields';

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

interface FieldsEditorProps {
  componentType: ComponentType;
  value: unknown;
  onChange: (next: unknown) => void;
}

/**
 * Generic property form: renders inputs from the declarative field
 * descriptors of the component type. Paths support `a.b` and `list[i].key`.
 */
export function FieldsEditor({ componentType, value, onChange }: FieldsEditorProps) {
  const fields = COMPONENT_FIELDS[componentType];

  const change = (path: string, next: unknown): void => {
    onChange(setPath(value, path, next));
  };

  const renderField = (field: FieldDescriptor, pathPrefix = ''): ReactNode => {
    const path = pathPrefix ? `${pathPrefix}.${field.key}` : field.key;
    const current = getPath(value, path);

    switch (field.kind) {
      case 'text':
        return (
          <TextField
            key={path}
            label={field.label}
            value={current as string | undefined}
            placeholder={field.placeholder}
            onCommit={(next) => change(path, next)}
          />
        );

      case 'textarea':
        return (
          <TextAreaField
            key={path}
            label={field.label}
            value={current as string | undefined}
            rows={field.rows ?? 3}
            onCommit={(next) => change(path, next)}
          />
        );

      case 'number':
        return (
          <NumberField
            key={path}
            label={field.label}
            value={current as number | undefined}
            onCommit={(next) => change(path, next)}
          />
        );

      case 'color':
        return (
          <ColorField
            key={path}
            label={field.label}
            value={current as string | undefined}
            onCommit={(next) => change(path, next)}
          />
        );

      case 'select':
        return (
          <SelectField
            key={path}
            label={field.label}
            value={current as string | undefined}
            options={field.options}
            onChange={(next) => change(path, next)}
          />
        );

      case 'checkbox':
        return (
          <CheckboxField
            key={path}
            label={field.label}
            checked={Boolean(current)}
            onChange={(next) => change(path, next)}
          />
        );

      case 'list':
        return (
          <ListEditor
            key={path}
            path={path}
            field={field}
            value={(current as unknown[]) ?? []}
            onChange={(next) => change(path, next)}
          />
        );

      case 'optional-object':
        return (
          <OptionalObjectEditor
            key={path}
            path={path}
            field={field}
            value={current}
            onChange={(next) => change(path, next)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <PanelSection title="Propiedades">{fields.map((field) => renderField(field))}</PanelSection>
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
  path,
  field,
  value,
  onChange,
}: {
  path: string;
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
        <ChildField
          key={child.key}
          field={child}
          value={(value as Record<string, unknown>)[child.key]}
          onChange={(next) =>
            onChange({ ...(value as Record<string, unknown>), [child.key]: next })
          }
        />
      ))}
      <span className={s.fieldHint}>Ruta: {path}</span>
    </div>
  );
}

/** Child fields of an optional object reuse the committed primitives. */
function ChildField({
  field,
  value,
  onChange,
}: {
  field: FieldDescriptor;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  switch (field.kind) {
    case 'number':
      return (
        <NumberField label={field.label} value={value as number | undefined} onCommit={onChange} />
      );
    case 'select':
      return (
        <SelectField
          label={field.label}
          value={value as string | undefined}
          options={field.options}
          onChange={onChange}
        />
      );
    case 'color':
      return (
        <ColorField label={field.label} value={value as string | undefined} onCommit={onChange} />
      );
    case 'checkbox':
      return (
        <CheckboxField
          label={field.label}
          checked={Boolean(value)}
          onChange={(next) => onChange(next)}
        />
      );
    case 'textarea':
      return (
        <TextAreaField
          label={field.label}
          value={value as string | undefined}
          rows={field.rows ?? 2}
          onCommit={onChange}
        />
      );
    default:
      return (
        <TextField
          label={field.label}
          value={value as string | undefined}
          placeholder={'placeholder' in field ? field.placeholder : undefined}
          onCommit={onChange}
        />
      );
  }
}
