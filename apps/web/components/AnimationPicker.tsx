'use client';

import { animationsByFamily } from '@designed/animations';
import type { AnimationInput } from '@designed/schema';
import { useState } from 'react';

import s from './builder.module.scss';
import { NumberField, PanelSection } from './ui';

interface AnimationPickerProps {
  value: AnimationInput | undefined;
  onChange: (next: AnimationInput | undefined) => void;
  allowEntrance?: boolean;
  allowHover?: boolean;
}

/**
 * Entrance + hover picker fed by the animation catalog (Spanish labels).
 * Selecting a type applies schema defaults; params are editable afterwards.
 */
export function AnimationPicker({
  value,
  onChange,
  allowEntrance = true,
  allowHover = true,
}: AnimationPickerProps) {
  const [open, setOpen] = useState(false);
  const entrance = value?.entrance;
  const hover = value?.hover;

  const setEntranceType = (type: string | undefined): void => {
    if (!type) {
      const next = { ...value, entrance: undefined };
      onChange(next.entrance || next.hover ? next : undefined);
      return;
    }
    onChange({ ...value, entrance: { ...(entrance ?? {}), type: type as never } });
  };

  const setHoverType = (type: string | undefined): void => {
    if (!type) {
      const next = { ...value, hover: undefined };
      onChange(next.entrance || next.hover ? next : undefined);
      return;
    }
    onChange({ ...value, hover: { ...(hover ?? {}), type: type as never } });
  };

  const hasEntrance = allowEntrance && animationsByFamily('entrance').length > 0;
  const hasHover = allowHover;

  return (
    <div className={s.animationPicker}>
      <button type="button" className={s.ghostButton} onClick={() => setOpen((v) => !v)}>
        ✨ Animaciones {value ? '·' : ''} {open ? '▴' : '▾'}
      </button>

      {open && (
        <>
          {hasEntrance && (
            <PanelSection title="Entrada (al aparecer)">
              <div className={s.chipGrid}>
                <button
                  type="button"
                  className={!entrance ? s.chipActive : s.chip}
                  onClick={() => setEntranceType(undefined)}
                >
                  ninguna
                </button>
                {animationsByFamily('entrance').map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    className={entrance?.type === entry.id ? s.chipActive : s.chip}
                    title={entry.description}
                    onClick={() => setEntranceType(entry.id)}
                  >
                    {entry.name}
                  </button>
                ))}
              </div>

              {entrance && (
                <div className={s.paramGrid}>
                  <NumberField
                    label="Duración (ms)"
                    value={entrance.durationMs}
                    onCommit={(next) =>
                      onChange({
                        ...value,
                        entrance: { ...entrance, durationMs: Number(next ?? 600) },
                      })
                    }
                  />
                  <NumberField
                    label="Retardo (ms)"
                    value={entrance.delayMs}
                    onCommit={(next) =>
                      onChange({
                        ...value,
                        entrance: { ...entrance, delayMs: Number(next ?? 0) },
                      })
                    }
                  />
                  <div className={s.field}>
                    <span className={s.fieldLabel}>Al</span>
                    <select
                      className={s.select}
                      value={entrance.trigger}
                      onChange={(event) =>
                        onChange({
                          ...value,
                          entrance: { ...entrance, trigger: event.target.value as never },
                        })
                      }
                    >
                      <option value="scroll">Hacer scroll</option>
                      <option value="load">Cargar la página</option>
                    </select>
                  </div>
                </div>
              )}
            </PanelSection>
          )}

          {hasHover && (
            <PanelSection title="Hover (al pasar el ratón)">
              <div className={s.chipGrid}>
                <button
                  type="button"
                  className={!hover || hover.type === 'none' ? s.chipActive : s.chip}
                  onClick={() => setHoverType('none')}
                >
                  ninguno
                </button>
                {animationsByFamily('hover')
                  .filter((entry) => entry.id !== 'none')
                  .map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      className={hover?.type === entry.id ? s.chipActive : s.chip}
                      title={entry.description}
                      onClick={() => setHoverType(entry.id)}
                    >
                      {entry.name}
                    </button>
                  ))}
              </div>

              {hover && hover.type !== 'none' && (
                <div className={s.paramGrid}>
                  <NumberField
                    label="Duración (ms)"
                    value={hover.durationMs}
                    onCommit={(next) =>
                      onChange({ ...value, hover: { ...hover, durationMs: Number(next ?? 200) } })
                    }
                  />
                  <NumberField
                    label="Intensidad (0-1)"
                    value={hover.intensity}
                    onCommit={(next) =>
                      onChange({
                        ...value,
                        hover: { ...hover, intensity: Number(next ?? 0.5) },
                      })
                    }
                  />
                </div>
              )}
            </PanelSection>
          )}
        </>
      )}
    </div>
  );
}
