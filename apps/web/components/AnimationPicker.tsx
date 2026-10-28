'use client';

import { animationsByFamily } from '@designed/animations';
import type { AnimationInput } from '@designed/schema';
import { useState } from 'react';

import { useBuilder } from '../lib/store';
import { SliderNumberField } from './controls';
import s from './builder.module.scss';
import { PanelSection, SelectField } from './ui';

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
  const { dispatch } = useBuilder();
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

              {/* Repite la animación de entrada en la vista previa. */}
              <button
                type="button"
                className={s.ghostButton}
                onClick={() => dispatch({ type: 'replay' })}
                title="Vuelve a ejecutar la animación de entrada en la vista previa"
              >
                ▶ Probar la entrada
              </button>

              {entrance && (
                <div className={s.paramGrid}>
                  <SliderNumberField
                    label="Duración"
                    value={entrance.durationMs}
                    min={100}
                    max={3000}
                    step={100}
                    unit=" ms"
                    onChange={(next) =>
                      onChange({
                        ...value,
                        entrance: { ...entrance, durationMs: Number(next ?? 600) },
                      })
                    }
                  />
                  <SliderNumberField
                    label="Retardo"
                    value={entrance.delayMs}
                    min={0}
                    max={3000}
                    step={50}
                    unit=" ms"
                    onChange={(next) =>
                      onChange({
                        ...value,
                        entrance: { ...entrance, delayMs: Number(next ?? 0) },
                      })
                    }
                  />
                  <SelectField
                    label="Al"
                    value={entrance.trigger}
                    options={[
                      { value: 'scroll', label: 'Hacer scroll' },
                      { value: 'load', label: 'Cargar la página' },
                    ]}
                    onChange={(next) =>
                      onChange({
                        ...value,
                        entrance: { ...entrance, trigger: next as 'scroll' | 'load' },
                      })
                    }
                  />
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
                  <SliderNumberField
                    label="Duración"
                    value={hover.durationMs}
                    min={50}
                    max={1000}
                    step={50}
                    unit=" ms"
                    onChange={(next) =>
                      onChange({ ...value, hover: { ...hover, durationMs: Number(next ?? 200) } })
                    }
                  />
                  <SliderNumberField
                    label="Intensidad"
                    value={hover.intensity}
                    min={0}
                    max={1}
                    step={0.05}
                    onChange={(next) =>
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
