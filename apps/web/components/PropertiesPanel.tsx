'use client';

import { BACKGROUND_EFFECTS } from '@designed/animations';
import { SECTION_KINDS } from '@designed/schema';
import type { DesignSpec, ImageOverlayInput } from '@designed/schema';
import { useState } from 'react';

import { createDefaultComponent, newId } from '../lib/fields';
import { mergeDeep, normalizeAnimation, normalizeHover } from '../lib/normalize';
import { useBuilder } from '../lib/store';

import { AnimationPicker } from './AnimationPicker';
import { FieldsEditor } from './FieldsEditor';
import { PalettePanel } from './PalettePanel';
import s from './builder.module.scss';
import {
  ButtonRow,
  CheckboxField,
  ColorField,
  DangerButton,
  NumberField,
  PanelSection,
  SelectField,
  TextAreaField,
  TextField,
} from './ui';

type SectionDraft = DesignSpec['sections'][number];
type RowDraft = SectionDraft['rows'][number];
type ColumnDraft = RowDraft['columns'][number];

const SECTION_KIND_LABELS: Record<string, string> = {
  hero: 'Hero',
  features: 'Funciones',
  pricing: 'Precios',
  testimonials: 'Testimonios',
  faq: 'FAQ',
  cta: 'Llamada a la acción',
  logos: 'Logos',
  stats: 'Cifras',
  carousel: 'Carrusel',
  gallery: 'Galería',
  team: 'Equipo',
  blog: 'Blog',
  contact: 'Contacto',
  generic: 'Genérica',
};

const COMPONENT_TYPE_LABELS: Record<string, string> = {
  heading: 'Título',
  text: 'Texto',
  buttonGroup: 'Botones',
  badge: 'Etiqueta',
  image: 'Imagen',
  featureCard: 'Tarjeta de función',
  pricingCard: 'Tarjeta de precio',
  testimonialCard: 'Testimonio',
  stat: 'Cifra',
  featureList: 'Lista de funciones',
  faqList: 'Preguntas frecuentes',
  logoCloud: 'Nube de logos',
  carousel: 'Carrusel',
  divider: 'Separador',
  spacer: 'Espaciador',
};

const ANIMATABLE_TYPES = new Set(
  Object.keys(COMPONENT_TYPE_LABELS).filter(
    (type) => !['badge', 'divider', 'spacer'].includes(type),
  ),
);

/** Right panel: contextual editor for the current selection. */
export function PropertiesPanel() {
  const { state } = useBuilder();

  switch (state.selection.kind) {
    case 'global':
      return <GlobalPanel />;
    case 'header':
      return <HeaderForm />;
    case 'footer':
      return <FooterForm />;
    case 'section':
      return <SectionForm sectionId={state.selection.id} />;
    case 'row':
      return <RowForm sectionId={state.selection.sectionId} rowId={state.selection.id} />;
    case 'column':
      return <ColumnForm sectionId={state.selection.sectionId} columnId={state.selection.id} />;
    case 'component':
      return (
        <ComponentForm sectionId={state.selection.sectionId} componentId={state.selection.id} />
      );
    default:
      return null;
  }
}

function useUpdate(): (mutate: (draft: DesignSpec) => void) => void {
  const { dispatch } = useBuilder();
  return (mutate) => dispatch({ type: 'update', mutate });
}

function findSection(draft: DesignSpec, id: string): SectionDraft | undefined {
  return draft.sections.find((section) => section.id === id);
}

// ── Global: diseño + paletas ─────────────────────────────────────────────────

function GlobalPanel() {
  const [tab, setTab] = useState<'diseno' | 'paletas'>('diseno');

  return (
    <>
      <div className={s.tabRow}>
        <button
          type="button"
          className={tab === 'diseno' ? s.tabActive : s.tab}
          onClick={() => setTab('diseno')}
        >
          Diseño
        </button>
        <button
          type="button"
          className={tab === 'paletas' ? s.tabActive : s.tab}
          onClick={() => setTab('paletas')}
        >
          Paletas
        </button>
      </div>

      {tab === 'diseno' ? <DesignSettingsPanel /> : <PalettePanel />}
    </>
  );
}

function DesignSettingsPanel() {
  const { state } = useBuilder();
  const update = useUpdate();
  const theme = state.spec.theme;

  return (
    <>
      <PanelSection title="Tipografía">
        <TextField
          label="Fuente de títulos"
          value={theme.typography.headingFont}
          onCommit={(value) =>
            typeof value === 'string' &&
            update((draft) => void (draft.theme.typography.headingFont = value))
          }
        />
        <TextField
          label="Fuente de texto"
          value={theme.typography.bodyFont}
          onCommit={(value) =>
            typeof value === 'string' &&
            update((draft) => void (draft.theme.typography.bodyFont = value))
          }
        />
        <SelectField
          label="Escala tipográfica"
          value={theme.typography.scale}
          options={[
            { value: 'compact', label: 'Compacta' },
            { value: 'normal', label: 'Normal' },
            { value: 'large', label: 'Amplia' },
          ]}
          onChange={(value) =>
            update(
              (draft) =>
                void (draft.theme.typography.scale = value as 'compact' | 'normal' | 'large'),
            )
          }
        />
        <NumberField
          label="Tamaño base (px)"
          value={theme.typography.baseFontSizePx}
          onCommit={(value) =>
            update((draft) => void (draft.theme.typography.baseFontSizePx = Number(value ?? 16)))
          }
        />
        <NumberField
          label="Peso de títulos"
          value={theme.typography.headingWeight}
          onCommit={(value) =>
            update((draft) => void (draft.theme.typography.headingWeight = Number(value ?? 700)))
          }
        />
        <NumberField
          label="Peso de texto"
          value={theme.typography.bodyWeight}
          onCommit={(value) =>
            update((draft) => void (draft.theme.typography.bodyWeight = Number(value ?? 400)))
          }
        />
      </PanelSection>

      <PanelSection title="Espaciado">
        <div className={s.twoCols}>
          <NumberField
            label="XS"
            value={theme.spacing.xs}
            onCommit={(v) => update((d) => void (d.theme.spacing.xs = Number(v ?? 4)))}
          />
          <NumberField
            label="SM"
            value={theme.spacing.sm}
            onCommit={(v) => update((d) => void (d.theme.spacing.sm = Number(v ?? 8)))}
          />
          <NumberField
            label="MD"
            value={theme.spacing.md}
            onCommit={(v) => update((d) => void (d.theme.spacing.md = Number(v ?? 16)))}
          />
          <NumberField
            label="LG"
            value={theme.spacing.lg}
            onCommit={(v) => update((d) => void (d.theme.spacing.lg = Number(v ?? 24)))}
          />
          <NumberField
            label="XL"
            value={theme.spacing.xl}
            onCommit={(v) => update((d) => void (d.theme.spacing.xl = Number(v ?? 40)))}
          />
          <NumberField
            label="XXL"
            value={theme.spacing.xxl}
            onCommit={(v) => update((d) => void (d.theme.spacing.xxl = Number(v ?? 64)))}
          />
          <NumberField
            label="Sección Y"
            value={theme.spacing.sectionYPx}
            onCommit={(v) => update((d) => void (d.theme.spacing.sectionYPx = Number(v ?? 64)))}
          />
          <NumberField
            label="Sección X"
            value={theme.spacing.sectionXPx}
            onCommit={(v) => update((d) => void (d.theme.spacing.sectionXPx = Number(v ?? 16)))}
          />
        </div>
      </PanelSection>

      <PanelSection title="Esquinas y sombras">
        <div className={s.twoCols}>
          <NumberField
            label="Radio SM"
            value={theme.radius.sm}
            onCommit={(v) => update((d) => void (d.theme.radius.sm = Number(v ?? 4)))}
          />
          <NumberField
            label="Radio MD"
            value={theme.radius.md}
            onCommit={(v) => update((d) => void (d.theme.radius.md = Number(v ?? 8)))}
          />
          <NumberField
            label="Radio LG"
            value={theme.radius.lg}
            onCommit={(v) => update((d) => void (d.theme.radius.lg = Number(v ?? 16)))}
          />
          <NumberField
            label="Radio píldora"
            value={theme.radius.pill}
            onCommit={(v) => update((d) => void (d.theme.radius.pill = Number(v ?? 999)))}
          />
        </div>
        <TextField
          label="Sombra SM"
          value={theme.shadow.sm}
          onCommit={(v) => typeof v === 'string' && update((d) => void (d.theme.shadow.sm = v))}
        />
        <TextField
          label="Sombra MD"
          value={theme.shadow.md}
          onCommit={(v) => typeof v === 'string' && update((d) => void (d.theme.shadow.md = v))}
        />
        <TextField
          label="Sombra LG"
          value={theme.shadow.lg}
          onCommit={(v) => typeof v === 'string' && update((d) => void (d.theme.shadow.lg = v))}
        />
      </PanelSection>
    </>
  );
}

// ── Header ───────────────────────────────────────────────────────────────────

function HeaderForm() {
  const { state } = useBuilder();
  const update = useUpdate();
  const header = state.spec.header;

  return (
    <>
      <PanelSection title="Menú superior">
        <SelectField
          label="Composición"
          value={header.layout}
          options={[
            { value: 'top', label: 'Superior horizontal' },
            { value: 'angled', label: 'Esquinado (hover)' },
            { value: 'sidebar', label: 'Lateral' },
            { value: 'minimal', label: 'Mínimo' },
          ]}
          onChange={(value) =>
            update((draft) => void (draft.header.layout = value as typeof draft.header.layout))
          }
        />
        <CheckboxField
          label="Pegajoso al hacer scroll"
          checked={header.sticky}
          onChange={(checked) => update((draft) => void (draft.header.sticky = checked))}
        />
        <CheckboxField
          label="Transparente al inicio"
          checked={header.transparentOnTop}
          onChange={(checked) => update((draft) => void (draft.header.transparentOnTop = checked))}
        />
        <SelectField
          label="Menú móvil"
          value={header.mobileMenu}
          options={[
            { value: 'hamburger-overlay', label: 'Hamburguesa con panel' },
            { value: 'dropdown', label: 'Desplegable' },
            { value: 'hidden', label: 'Oculto' },
          ]}
          onChange={(value) =>
            update(
              (draft) => void (draft.header.mobileMenu = value as typeof draft.header.mobileMenu),
            )
          }
        />
      </PanelSection>

      <PanelSection title="Marca">
        <TextField
          label="Nombre"
          value={header.brand.name}
          onCommit={(v) => typeof v === 'string' && update((d) => void (d.header.brand.name = v))}
        />
        <TextField
          label="Enlace"
          value={header.brand.href}
          onCommit={(v) => typeof v === 'string' && update((d) => void (d.header.brand.href = v))}
        />
        <TextField
          label="URL del logo (opcional)"
          value={header.brand.logoUrl}
          onCommit={(v) => update((d) => void (d.header.brand.logoUrl = v as string | undefined))}
        />
      </PanelSection>

      <PanelSection title="Botón de acción">
        {header.cta ? (
          <>
            <TextField
              label="Texto"
              value={header.cta.label}
              onCommit={(v) =>
                typeof v === 'string' &&
                update((d) => d.header.cta && void (d.header.cta.label = v))
              }
            />
            <TextField
              label="Enlace"
              value={header.cta.href}
              onCommit={(v) =>
                typeof v === 'string' && update((d) => d.header.cta && void (d.header.cta.href = v))
              }
            />
            <SelectField
              label="Estilo"
              value={header.cta.variant}
              options={[
                { value: 'solid', label: 'Sólido' },
                { value: 'outline', label: 'Contorno' },
                { value: 'ghost', label: 'Fantasma' },
                { value: 'gradient', label: 'Degradado' },
              ]}
              onChange={(value) =>
                update(
                  (d) =>
                    d.header.cta &&
                    void (d.header.cta.variant = value as NonNullable<
                      typeof d.header.cta
                    >['variant']),
                )
              }
            />
            <ButtonRow>
              <DangerButton onClick={() => update((d) => void (d.header.cta = undefined))}>
                Quitar botón
              </DangerButton>
            </ButtonRow>
          </>
        ) : (
          <ButtonRow>
            <button
              type="button"
              className={s.ghostButton}
              onClick={() =>
                update(
                  (d) =>
                    void (d.header.cta = {
                      id: newId('cta'),
                      label: 'Empezar',
                      href: '#',
                      variant: 'solid',
                      size: 'md',
                      newTab: false,
                    }),
                )
              }
            >
              + Añadir botón
            </button>
          </ButtonRow>
        )}
      </PanelSection>

      <AnimationPicker
        allowEntrance={false}
        value={header.itemAnimation ? { hover: header.itemAnimation } : undefined}
        onChange={(next) =>
          update((d) => void (d.header.itemAnimation = normalizeHover(next?.hover)))
        }
      />
    </>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────

function FooterForm() {
  const { state } = useBuilder();
  const update = useUpdate();
  const footer = state.spec.footer;

  return (
    <PanelSection title="Pie de página">
      <CheckboxField
        label="Formulario de newsletter"
        checked={footer.newsletter}
        onChange={(checked) => update((d) => void (d.footer.newsletter = checked))}
      />
      <TextAreaField
        label="Texto de marca"
        value={footer.brandText}
        rows={2}
        onCommit={(v) => update((d) => void (d.footer.brandText = v as string | undefined))}
      />
      <TextField
        label="Copyright"
        value={footer.copyright}
        onCommit={(v) => update((d) => void (d.footer.copyright = v as string | undefined))}
      />
    </PanelSection>
  );
}

// ── Section ──────────────────────────────────────────────────────────────────

function SectionForm({ sectionId }: { sectionId: string }) {
  const { state } = useBuilder();
  const update = useUpdate();
  const section = state.spec.sections.find((item) => item.id === sectionId);

  if (!section) return null;

  const patch = (mutate: (target: SectionDraft) => void): void => {
    update((draft) => {
      const target = findSection(draft, sectionId);
      if (target) mutate(target);
    });
  };

  const move = (delta: number): void => {
    update((draft) => {
      const index = draft.sections.findIndex((item) => item.id === sectionId);
      const target = index + delta;
      if (index < 0 || target < 0 || target >= draft.sections.length) return;
      const [moved] = draft.sections.splice(index, 1);
      if (moved) draft.sections.splice(target, 0, moved);
    });
  };

  const duplicate = (): void => {
    update((draft) => {
      const index = draft.sections.findIndex((item) => item.id === sectionId);
      const source = draft.sections[index];
      if (!source) return;
      const clone = structuredClone(source);
      clone.id = newId('seccion');
      for (const row of clone.rows) {
        row.id = newId('fila');
        for (const column of row.columns) {
          column.id = newId('columna');
          for (const component of column.components) {
            component.id = newId(component.type);
          }
        }
      }
      draft.sections.splice(index + 1, 0, clone);
    });
  };

  const remove = (): void => {
    update((draft) => {
      draft.sections = draft.sections.filter((item) => item.id !== sectionId);
    });
  };

  return (
    <>
      <PanelSection title={`Sección · ${section.kind}`}>
        <SelectField
          label="Tipo"
          value={section.kind}
          options={SECTION_KINDS.map((kind) => ({
            value: kind,
            label: SECTION_KIND_LABELS[kind] ?? kind,
          }))}
          onChange={(value) =>
            patch((target) => void (target.kind = value as SectionDraft['kind']))
          }
        />
        <SelectField
          label="Ancho"
          value={section.width}
          options={[
            { value: 'contained', label: 'Contenido (con tope)' },
            { value: 'full', label: 'A todo el ancho' },
          ]}
          onChange={(value) =>
            patch((target) => void (target.width = value as SectionDraft['width']))
          }
        />
        <div className={s.twoCols}>
          <NumberField
            label="Padding Y (px)"
            value={section.padding?.topBottomPx}
            onCommit={(v) =>
              patch((target) => {
                target.padding = { ...target.padding, topBottomPx: v as number | undefined };
              })
            }
          />
          <NumberField
            label="Padding X (px)"
            value={section.padding?.leftRightPx}
            onCommit={(v) =>
              patch((target) => {
                target.padding = { ...target.padding, leftRightPx: v as number | undefined };
              })
            }
          />
        </div>
        <ButtonRow>
          <button type="button" className={s.iconButton} onClick={() => move(-1)} title="Subir">
            ↑
          </button>
          <button type="button" className={s.iconButton} onClick={() => move(1)} title="Bajar">
            ↓
          </button>
          <button type="button" className={s.ghostButton} onClick={duplicate}>
            Duplicar
          </button>
          <DangerButton onClick={remove}>Eliminar</DangerButton>
        </ButtonRow>
      </PanelSection>

      <BackgroundEditor section={section} onPatch={patch} />

      <AnimationPicker
        allowHover={false}
        value={section.animation}
        onChange={(next) => patch((target) => void (target.animation = normalizeAnimation(next)))}
      />

      <PanelSection title="Filas">
        <ButtonRow>
          <button
            type="button"
            className={s.ghostButton}
            onClick={() =>
              patch((target) => {
                target.rows.push({
                  id: newId('fila'),
                  stackBelow: 'mobile',
                  columns: [
                    {
                      id: newId('columna'),
                      span: 12,
                      hideOn: [],
                      verticalAlign: 'start',
                      components: [createDefaultComponent('heading')],
                    },
                  ],
                });
              })
            }
          >
            + Añadir fila
          </button>
        </ButtonRow>
        <p className={s.hint}>
          {section.rows.length} fila(s) · selecciona una fila en el árbol para editarla.
        </p>
      </PanelSection>
    </>
  );
}

// ── Background editor ────────────────────────────────────────────────────────

function BackgroundEditor({
  section,
  onPatch,
}: {
  section: SectionDraft;
  onPatch: (mutate: (target: SectionDraft) => void) => void;
}) {
  const background = section.background;
  const type = background?.type ?? '';

  const setBackground = (next: SectionDraft['background']): void => {
    onPatch((target) => void (target.background = next));
  };

  const patchBackground = (
    mutate: (draft: NonNullable<SectionDraft['background']>) => void,
  ): void => {
    onPatch((target) => {
      if (target.background) mutate(target.background);
    });
  };

  return (
    <PanelSection title="Fondo">
      <SelectField
        label="Tipo de fondo"
        value={type}
        options={[
          { value: '', label: 'Sin fondo (hereda)' },
          { value: 'color', label: 'Color plano' },
          { value: 'gradient', label: 'Degradado' },
          { value: 'image', label: 'Imagen' },
          { value: 'interactive', label: 'Interactivo (ratón)' },
        ]}
        onChange={(value) => {
          if (!value) {
            setBackground(undefined);
            return;
          }
          if (value === 'color') {
            setBackground({ type: 'color', color: '#000000' });
          } else if (value === 'gradient') {
            setBackground({
              type: 'gradient',
              gradient: {
                type: 'linear',
                angle: 135,
                stops: [{ color: '#6C5CE7' }, { color: '#FD79A8', position: 100 }],
              },
            });
          } else if (value === 'image') {
            setBackground({
              type: 'image',
              src: 'https://placehold.co/1600x900',
              size: 'cover',
              position: 'center',
              fixed: false,
            });
          } else {
            setBackground({
              type: 'interactive',
              effect: 'spotlight',
              intensity: 0.5,
              speed: 0.5,
            });
          }
        }}
      />

      {background?.type === 'color' && (
        <ColorField
          label="Color"
          value={background.color}
          onCommit={(v) =>
            typeof v === 'string' &&
            patchBackground((bg) => {
              if (bg.type !== 'color') return;
              bg.color = v;
            })
          }
        />
      )}

      {background?.type === 'gradient' && (
        <>
          <NumberField
            label="Ángulo (0-360)"
            value={background.gradient.angle}
            onCommit={(v) =>
              patchBackground((bg) => {
                if (bg.type !== 'gradient') return;
                bg.gradient.angle = Number(v ?? 135);
              })
            }
          />
          <ColorField
            label="Color inicial"
            value={background.gradient.stops[0]?.color}
            onCommit={(v) =>
              typeof v === 'string' &&
              patchBackground((bg) => {
                if (bg.type !== 'gradient' || !bg.gradient.stops[0]) return;
                bg.gradient.stops[0].color = v;
              })
            }
          />
          <ColorField
            label="Color final"
            value={background.gradient.stops[1]?.color}
            onCommit={(v) =>
              typeof v === 'string' &&
              patchBackground((bg) => {
                if (bg.type !== 'gradient' || !bg.gradient.stops[1]) return;
                bg.gradient.stops[1].color = v;
              })
            }
          />
        </>
      )}

      {background?.type === 'image' && (
        <>
          <TextField
            label="URL de la imagen"
            value={background.src}
            onCommit={(v) =>
              typeof v === 'string' &&
              patchBackground((bg) => {
                if (bg.type !== 'image') return;
                bg.src = v;
              })
            }
          />
          <OverlayFields
            overlay={background.overlay}
            onChange={(overlay) =>
              patchBackground((bg) => {
                if (bg.type !== 'image') return;
                bg.overlay = overlay
                  ? {
                      type: overlay.type ?? 'gradient',
                      direction: overlay.direction ?? 'to-right',
                      color: overlay.color ?? '#000000',
                      intensity: overlay.intensity ?? 0.5,
                      colorTo: overlay.colorTo,
                    }
                  : undefined;
              })
            }
          />
        </>
      )}

      {background?.type === 'interactive' && (
        <>
          <SelectField
            label="Efecto"
            value={background.effect}
            options={BACKGROUND_EFFECTS.map((entry) => ({
              value: entry.id,
              label: `${entry.name} — ${entry.description}`,
            }))}
            onChange={(value) =>
              patchBackground((bg) => {
                if (bg.type !== 'interactive') return;
                bg.effect = value as InteractiveEffect;
              })
            }
          />
          <div className={s.twoCols}>
            <NumberField
              label="Intensidad (0-1)"
              value={background.intensity}
              onCommit={(v) =>
                patchBackground((bg) => {
                  if (bg.type !== 'interactive') return;
                  bg.intensity = Number(v ?? 0.5);
                })
              }
            />
            <NumberField
              label="Velocidad (0-1)"
              value={background.speed}
              onCommit={(v) =>
                patchBackground((bg) => {
                  if (bg.type !== 'interactive') return;
                  bg.speed = Number(v ?? 0.5);
                })
              }
            />
          </div>
          <ColorField
            label="Color del efecto"
            value={background.effectColor}
            onCommit={(v) =>
              typeof v === 'string' &&
              patchBackground((bg) => {
                if (bg.type !== 'interactive') return;
                bg.effectColor = v;
              })
            }
          />
        </>
      )}
    </PanelSection>
  );
}

type InteractiveEffect = (typeof BACKGROUND_EFFECTS)[number]['id'];

function OverlayFields({
  overlay,
  onChange,
}: {
  overlay: ImageOverlayInput | undefined;
  onChange: (next: ImageOverlayInput | undefined) => void;
}) {
  const current: ImageOverlayInput = overlay ?? {};

  return (
    <>
      <SelectField
        label="Sombreado"
        value={current.type ?? 'gradient'}
        options={[
          { value: 'gradient', label: 'Degradado' },
          { value: 'duotone', label: 'Duotono' },
          { value: 'vignette', label: 'Viñeta' },
        ]}
        onChange={(value) =>
          onChange({ ...current, type: (value ?? 'gradient') as ImageOverlayInput['type'] })
        }
      />
      <SelectField
        label="Dirección"
        value={current.direction ?? 'to-right'}
        options={[
          { value: 'to-right', label: 'Lateral →' },
          { value: 'to-left', label: '← Lateral' },
          { value: 'to-bottom', label: 'Vertical ↓' },
          { value: 'to-top', label: '↑ Vertical' },
          { value: 'to-bottom-right', label: 'Diagonal ↘' },
          { value: 'to-bottom-left', label: 'Diagonal ↙' },
          { value: 'to-top-right', label: 'Diagonal ↗' },
          { value: 'to-top-left', label: 'Diagonal ↖' },
          { value: 'center', label: 'Radial' },
        ]}
        onChange={(value) =>
          onChange({
            ...current,
            direction: (value ?? 'to-right') as ImageOverlayInput['direction'],
          })
        }
      />
      <ColorField
        label="Color del sombreado"
        value={current.color ?? '#000000'}
        onCommit={(value) => typeof value === 'string' && onChange({ ...current, color: value })}
      />
      <NumberField
        label="Intensidad (0-1)"
        value={current.intensity ?? 0.5}
        onCommit={(value) => onChange({ ...current, intensity: Number(value ?? 0.5) })}
      />
    </>
  );
}

// ── Row ──────────────────────────────────────────────────────────────────────

function RowForm({ sectionId, rowId }: { sectionId: string; rowId: string }) {
  const { state } = useBuilder();
  const update = useUpdate();
  const section = state.spec.sections.find((item) => item.id === sectionId);
  const row = section?.rows.find((item) => item.id === rowId);

  if (!section || !row) return null;

  const patch = (mutate: (target: RowDraft) => void): void => {
    update((draft) => {
      const target = findSection(draft, sectionId)?.rows.find((item) => item.id === rowId);
      if (target) mutate(target);
    });
  };

  return (
    <>
      <PanelSection title="Fila">
        <div className={s.twoCols}>
          <NumberField
            label="Gap (px)"
            value={row.gapPx}
            onCommit={(v) => patch((target) => void (target.gapPx = v as number | undefined))}
          />
          <SelectField
            label="Apilar en"
            value={row.stackBelow}
            options={[
              { value: 'never', label: 'Nunca' },
              { value: 'tablet', label: 'Tablet (≤1023px)' },
              { value: 'mobile', label: 'Móvil (≤639px)' },
            ]}
            onChange={(value) =>
              patch((target) => void (target.stackBelow = value as RowDraft['stackBelow']))
            }
          />
        </div>
        <ButtonRow>
          <button
            type="button"
            className={s.ghostButton}
            onClick={() =>
              patch((target) => {
                target.columns.push({
                  id: newId('columna'),
                  span: 12,
                  hideOn: [],
                  verticalAlign: 'start',
                  components: [createDefaultComponent('text')],
                });
              })
            }
          >
            + Añadir columna
          </button>
          <DangerButton
            onClick={() =>
              update((draft) => {
                const target = findSection(draft, sectionId);
                if (target) target.rows = target.rows.filter((item) => item.id !== rowId);
              })
            }
          >
            Eliminar fila
          </DangerButton>
        </ButtonRow>
        <p className={s.hint}>{row.columns.length} columna(s) en esta fila.</p>
      </PanelSection>
    </>
  );
}

// ── Column ───────────────────────────────────────────────────────────────────

function ColumnForm({ sectionId, columnId }: { sectionId: string; columnId: string }) {
  const { state, dispatch } = useBuilder();
  const update = useUpdate();
  const section = state.spec.sections.find((item) => item.id === sectionId);
  const row = section?.rows.find((item) => item.columns.some((c) => c.id === columnId));
  const column = row?.columns.find((item) => item.id === columnId);

  if (!section || !row || !column) return null;

  const patch = (mutate: (target: ColumnDraft) => void): void => {
    update((draft) => {
      const target = findSection(draft, sectionId)
        ?.rows.flatMap((item) => item.columns)
        .find((item) => item.id === columnId);
      if (target) mutate(target);
    });
  };

  const addComponent = (type: Parameters<typeof createDefaultComponent>[0]): void => {
    const component = createDefaultComponent(type);
    patch((target) => target.components.push(component));
    dispatch({
      type: 'select',
      selection: { kind: 'component', sectionId, id: component.id },
    });
  };

  const toggleHideOn = (breakpoint: 'tablet' | 'mobile'): void => {
    patch((target) => {
      target.hideOn = target.hideOn.includes(breakpoint)
        ? target.hideOn.filter((item) => item !== breakpoint)
        : [...target.hideOn, breakpoint];
    });
  };

  return (
    <>
      <PanelSection title="Columna">
        <div className={s.twoCols}>
          <NumberField
            label="Ancho (1-12)"
            value={column.span}
            onCommit={(v) => patch((target) => void (target.span = Number(v ?? 12)))}
          />
          <SelectField
            label="Alineación vertical"
            value={column.verticalAlign}
            options={[
              { value: 'start', label: 'Arriba' },
              { value: 'center', label: 'Centro' },
              { value: 'end', label: 'Abajo' },
            ]}
            onChange={(value) =>
              patch((target) => void (target.verticalAlign = value as ColumnDraft['verticalAlign']))
            }
          />
        </div>
        <CheckboxField
          label="Ocultar en tablet"
          checked={column.hideOn.includes('tablet')}
          onChange={() => toggleHideOn('tablet')}
        />
        <CheckboxField
          label="Ocultar en móvil"
          checked={column.hideOn.includes('mobile')}
          onChange={() => toggleHideOn('mobile')}
        />
        <ButtonRow>
          <DangerButton
            onClick={() =>
              update((draft) => {
                const target = findSection(draft, sectionId)?.rows.find(
                  (item) => item.id === row.id,
                );
                if (target) target.columns = target.columns.filter((item) => item.id !== columnId);
              })
            }
          >
            Eliminar columna
          </DangerButton>
        </ButtonRow>
      </PanelSection>

      <PanelSection title={`Componentes (${column.components.length})`}>
        <div className={s.chipGrid}>
          {Object.entries(COMPONENT_TYPE_LABELS).map(([type, label]) => (
            <button
              key={type}
              type="button"
              className={s.chip}
              onClick={() => addComponent(type as Parameters<typeof createDefaultComponent>[0])}
            >
              + {label}
            </button>
          ))}
        </div>
      </PanelSection>
    </>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

function ComponentForm({ sectionId, componentId }: { sectionId: string; componentId: string }) {
  const { state, dispatch } = useBuilder();
  const update = useUpdate();

  const column = state.spec.sections
    .find((item) => item.id === sectionId)
    ?.rows.flatMap((item) => item.columns)
    .find((item) => item.components.some((component) => component.id === componentId));
  const component = column?.components.find((item) => item.id === componentId);

  if (!column || !component) return null;

  const replace = (next: unknown): void => {
    update((draft) => {
      const target = draft.sections
        .find((item) => item.id === sectionId)
        ?.rows.flatMap((item) => item.columns)
        .find((item) => item.id === column.id);
      if (!target) return;
      const index = target.components.findIndex((item) => item.id === componentId);
      const current = target.components[index];
      if (index < 0 || !current) return;
      target.components[index] = mergeDeep(current, next);
    });
  };

  return (
    <>
      <PanelSection
        title={`${COMPONENT_TYPE_LABELS[component.type] ?? component.type} · ${component.id}`}
      >
        <ButtonRow>
          <DangerButton
            onClick={() => {
              update((draft) => {
                const target = draft.sections
                  .find((item) => item.id === sectionId)
                  ?.rows.flatMap((item) => item.columns)
                  .find((item) => item.id === column.id);
                if (target) {
                  target.components = target.components.filter((item) => item.id !== componentId);
                }
              });
              dispatch({ type: 'select', selection: { kind: 'column', sectionId, id: column.id } });
            }}
          >
            Eliminar componente
          </DangerButton>
        </ButtonRow>
      </PanelSection>

      <FieldsEditor componentType={component.type} value={component} onChange={replace} />

      {ANIMATABLE_TYPES.has(component.type) && (
        <AnimationPicker
          value={'animation' in component ? component.animation : undefined}
          onChange={(next) => replace({ animation: normalizeAnimation(next) })}
        />
      )}
    </>
  );
}
