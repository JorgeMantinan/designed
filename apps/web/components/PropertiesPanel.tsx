'use client';

import { BACKGROUND_EFFECTS } from '@designed/animations';
import { SECTION_KINDS } from '@designed/schema';
import type { DesignSpec, ImageOverlayInput, NavItem } from '@designed/schema';
import { useState } from 'react';

import {
  createDefaultComponent,
  FOOTER_FIELDS,
  HEADER_MENU_FIELDS,
  newId,
  reassignIds,
} from '../lib/fields';
import { BUTTON_VARIANT_OPTIONS } from '../lib/fields';
import { mergeDeep, normalizeAnimation, normalizeHover } from '../lib/normalize';
import { useBuilder } from '../lib/store';

import { AnimationPicker } from './AnimationPicker';
import {
  currentDensityPresetId,
  currentRadiusPresetId,
  currentShadowPresetId,
  DENSITY_PRESETS,
  FontField,
  IconField,
  PaletteSwatches,
  PresetRow,
  RADIUS_PRESETS,
  SHADOW_PRESETS,
  ShadowEditor,
  SliderNumberField,
  WEIGHT_OPTIONS,
} from './controls';
import { FieldsEditor, FieldsForm } from './FieldsEditor';
import { PalettePanel } from './PalettePanel';
import s from './builder.module.scss';
import {
  ButtonRow,
  CheckboxField,
  ColorField,
  DangerButton,
  PanelSection,
  SelectField,
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

/** Advances an item inside an array (reorder helper). */
function moveItem<T>(items: T[], index: number, delta: number): void {
  const target = index + delta;
  if (index < 0 || target < 0 || target >= items.length) return;
  const [moved] = items.splice(index, 1);
  if (moved) items.splice(target, 0, moved);
}

// ── Global: diseño visual + paletas ─────────────────────────────────────────

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
  const [shadowLevel, setShadowLevel] = useState<'sm' | 'md' | 'lg'>('md');
  const theme = state.spec.theme;
  const typo = theme.typography;
  const spacing = theme.spacing;
  const radius = theme.radius;
  const shadow = theme.shadow;

  const number =
    (key: 'baseFontSizePx' | 'headingWeight' | 'bodyWeight', fallback: number) =>
    (value: string | number | undefined) =>
      update((draft) => void (draft.theme.typography[key] = Number(value ?? fallback)));

  const spacingField = (key: keyof typeof spacing, fallback: number, label: string, max = 120) => (
    <SliderNumberField
      label={label}
      value={spacing[key]}
      min={0}
      max={max}
      unit=" px"
      onChange={(value) =>
        update((draft) => void (draft.theme.spacing[key] = Number(value ?? fallback)))
      }
    />
  );

  const radiusField = (key: 'sm' | 'md' | 'lg', label: string) => (
    <SliderNumberField
      label={label}
      value={radius[key]}
      min={0}
      max={60}
      unit=" px"
      onChange={(value) => update((draft) => void (draft.theme.radius[key] = Number(value ?? 8)))}
    />
  );

  return (
    <>
      <PanelSection title="Tipografía">
        <FontField
          label="Fuente de títulos"
          value={typo.headingFont}
          onChange={(value) => update((draft) => void (draft.theme.typography.headingFont = value))}
        />
        <FontField
          label="Fuente de texto"
          value={typo.bodyFont}
          onChange={(value) => update((draft) => void (draft.theme.typography.bodyFont = value))}
        />
        <SelectField
          label="Grosor de títulos"
          value={String(typo.headingWeight)}
          options={WEIGHT_OPTIONS.map((option) => ({ value: option.id, label: option.label }))}
          onChange={(value) => number('headingWeight', 700)(value ?? '700')}
        />
        <SelectField
          label="Grosor de texto"
          value={String(typo.bodyWeight)}
          options={WEIGHT_OPTIONS.map((option) => ({ value: option.id, label: option.label }))}
          onChange={(value) => number('bodyWeight', 400)(value ?? '400')}
        />
        <SelectField
          label="Escala tipográfica"
          value={typo.scale}
          options={[
            { value: 'compact', label: 'Compacta (más información)' },
            { value: 'normal', label: 'Normal (recomendada)' },
            { value: 'large', label: 'Amplia (más impacto)' },
          ]}
          onChange={(value) =>
            update(
              (draft) =>
                void (draft.theme.typography.scale = value as 'compact' | 'normal' | 'large'),
            )
          }
        />
        <SliderNumberField
          label="Tamaño base del texto"
          value={typo.baseFontSizePx}
          min={14}
          max={22}
          unit=" px"
          hint="Punto de partida del que derivan todos los tamaños."
          onChange={(value) => number('baseFontSizePx', 16)(value)}
        />
      </PanelSection>

      <PanelSection title="Espaciado">
        <PresetRow
          label="Densidad"
          options={DENSITY_PRESETS.map((preset) => ({ id: preset.id, label: preset.label }))}
          value={currentDensityPresetId(spacing)}
          onSelect={(id) => {
            const preset = DENSITY_PRESETS.find((item) => item.id === id);
            if (!preset) return;
            update((draft) =>
              Object.assign(draft.theme.spacing, {
                xs: preset.xs,
                sm: preset.sm,
                md: preset.md,
                lg: preset.lg,
                xl: preset.xl,
                xxl: preset.xxl,
                sectionYPx: preset.sectionYPx,
                sectionXPx: preset.sectionXPx,
              }),
            );
          }}
        />
        <div className={s.twoCols}>
          {spacingField('sectionYPx', 64, 'Altura de secciones', 240)}
          {spacingField('sectionXPx', 16, 'Ancho de secciones', 120)}
        </div>
        <details className={s.advanced}>
          <summary>Avanzado: escala de huecos (XS…XXL)</summary>
          <div className={s.advancedBody}>
            <p className={s.fieldHint}>
              Tamaños de hueco que usan los bloques por defecto: XS casi invisible, XXL enorme. Si
              no lo necesitas, ajústalos con la «Densidad» de arriba.
            </p>
            {spacingField('xs', 4, 'Hueco mínimo (XS)')}
            {spacingField('sm', 8, 'Hueco pequeño (SM)')}
            {spacingField('md', 16, 'Hueco normal (MD)')}
            {spacingField('lg', 24, 'Hueco grande (LG)')}
            {spacingField('xl', 40, 'Hueco muy grande (XL)')}
            {spacingField('xxl', 64, 'Hueco enorme (XXL)')}
          </div>
        </details>
      </PanelSection>

      <PanelSection title="Esquinas de los elementos">
        <PresetRow
          label="Redondeo"
          options={RADIUS_PRESETS.map((preset) => ({ id: preset.id, label: preset.label }))}
          value={currentRadiusPresetId(radius)}
          renderPreview={(id) => {
            const preset = RADIUS_PRESETS.find((item) => item.id === id);
            return <span className={s.presetPreview} style={{ borderRadius: preset?.md ?? 8 }} />;
          }}
          onSelect={(id) => {
            const preset = RADIUS_PRESETS.find((item) => item.id === id);
            if (!preset) return;
            update((draft) =>
              Object.assign(draft.theme.radius, {
                sm: preset.sm,
                md: preset.md,
                lg: preset.lg,
                pill: 999,
              }),
            );
          }}
        />
        <details className={s.advanced}>
          <summary>Avanzado: radios individuales</summary>
          <div className={s.advancedBody}>
            {radiusField('sm', 'Radio pequeño')}
            {radiusField('md', 'Radio medio')}
            {radiusField('lg', 'Radio grande')}
          </div>
        </details>
      </PanelSection>

      <PanelSection title="Sombras">
        <PresetRow
          label="Estilo de sombra"
          options={SHADOW_PRESETS.map((preset) => ({ id: preset.id, label: preset.label }))}
          value={currentShadowPresetId(shadow)}
          renderPreview={(id) => {
            const preset = SHADOW_PRESETS.find((item) => item.id === id);
            return <span className={s.presetPreview} style={{ boxShadow: preset?.lg ?? 'none' }} />;
          }}
          onSelect={(id) => {
            const preset = SHADOW_PRESETS.find((item) => item.id === id);
            if (!preset) return;
            update(
              (draft) =>
                void (draft.theme.shadow = { sm: preset.sm, md: preset.md, lg: preset.lg }),
            );
          }}
        />
        <details className={s.advanced}>
          <summary>Avanzado: editar la sombra a tu gusto</summary>
          <div className={s.advancedBody}>
            <SelectField
              label="Qué sombra editar"
              value={shadowLevel}
              options={[
                { value: 'sm', label: 'Pequeña (elementos sueltos)' },
                { value: 'md', label: 'Media (tarjetas)' },
                { value: 'lg', label: 'Grande (bloques destacados)' },
              ]}
              onChange={(value) => setShadowLevel((value ?? 'md') as 'sm' | 'md' | 'lg')}
            />
            <ShadowEditor
              value={shadow[shadowLevel]}
              onChange={(css) => update((draft) => void (draft.theme.shadow[shadowLevel] = css))}
            />
          </div>
        </details>
      </PanelSection>
    </>
  );
}

// ── Header ───────────────────────────────────────────────────────────────────

function HeaderForm() {
  const { state } = useBuilder();
  const update = useUpdate();
  const header = state.spec.header;
  const palette = state.spec.theme.palette;

  return (
    <>
      <PanelSection title="Menú superior">
        <SelectField
          label="Composición"
          value={header.layout}
          options={[
            { value: 'top', label: 'Superior horizontal' },
            { value: 'floating', label: 'Barra flotante (tipo app)' },
            { value: 'angled', label: 'Esquinado (hover)' },
            { value: 'corner', label: 'Esquina (menú que se despliega)' },
            { value: 'sidebar', label: 'Lateral fijo' },
            { value: 'bottom', label: 'Inferior (estilo barra del sistema)' },
            { value: 'minimal', label: 'Mínimo' },
          ]}
          onChange={(value) =>
            update((draft) => void (draft.header.layout = value as typeof draft.header.layout))
          }
        />
        {header.layout === 'sidebar' && (
          <SelectField
            label="Posición del lateral"
            value={header.sidebarPosition}
            options={[
              { value: 'left', label: 'Izquierda' },
              { value: 'right', label: 'Derecha' },
            ]}
            onChange={(value) =>
              update(
                (draft) =>
                  void (draft.header.sidebarPosition =
                    value as typeof draft.header.sidebarPosition),
              )
            }
          />
        )}
        <CheckboxField
          label="Pegajoso al hacer scroll"
          checked={header.sticky}
          onChange={(checked) => update((draft) => void (draft.header.sticky = checked))}
        />
        <CheckboxField
          label="Transparente al principio de la página"
          hint="El menú empieza sin fondo (se ve el hero por detrás) y gana fondo sólido al hacer el primer scroll."
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

      <PanelSection title="Elementos del menú">
        <FieldsForm
          fields={HEADER_MENU_FIELDS}
          value={{ items: header.items }}
          onChange={(next) =>
            update((draft) => {
              draft.header.items = (next as { items: NavItem[] }).items;
            })
          }
        />
        <p className={s.hint}>
          En cada elemento puedes añadir un <strong>submenú</strong>. Usa enlaces como
          {' #precios'} para saltos dentro de la página.
        </p>
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
              options={BUTTON_VARIANT_OPTIONS.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
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
            <SelectField
              label="Forma"
              value={header.cta.shape ?? 'theme'}
              options={[
                { value: 'theme', label: 'Del tema (radio global)' },
                { value: 'rect', label: 'Rectangular' },
                { value: 'rounded', label: 'Redondeado' },
                { value: 'pill', label: 'Píldora' },
                { value: 'circle', label: 'Circular (ideal con icono)' },
                { value: 'tag', label: 'Etiqueta' },
                { value: 'bubble', label: 'Burbuja' },
              ]}
              onChange={(value) =>
                update(
                  (d) =>
                    d.header.cta &&
                    void (d.header.cta.shape = value as NonNullable<typeof d.header.cta>['shape']),
                )
              }
            />
            <ColorField
              label="Color del botón"
              hint="Así se ve hoy. Vacío = color de tu paleta (sigue los cambios automáticamente)."
              value={header.cta.color ?? palette.primary}
              onCommit={(v) =>
                typeof v === 'string' &&
                update((d) => d.header.cta && void (d.header.cta.color = v))
              }
            />
            <ColorField
              label="Color al pasar el ratón"
              hint="Así se ve hoy. Vacío = oscurece el color del botón automáticamente."
              value={header.cta.hoverColor ?? header.cta.color ?? palette.primary}
              onCommit={(v) =>
                typeof v === 'string' &&
                update((d) => d.header.cta && void (d.header.cta.hoverColor = v))
              }
            />
            <SliderNumberField
              label="Opacidad del color al pasar el ratón"
              hint="100% = color sólido; menos = se ve el fondo a través del hover."
              value={Math.round((header.cta.hoverOpacity ?? 1) * 100)}
              min={10}
              max={100}
              step={5}
              unit=" %"
              onChange={(v) =>
                update((d) => {
                  if (!d.header.cta) return;
                  const pct = Number(v ?? 100);
                  if (pct >= 100) delete d.header.cta.hoverOpacity;
                  else d.header.cta.hoverOpacity = Math.round(pct) / 100;
                })
              }
            />
            <PaletteSwatches
              label="Colores de tu paleta para el botón"
              colors={[palette.primary, palette.secondary, palette.accent]}
              onPick={(color) => update((d) => d.header.cta && void (d.header.cta.color = color))}
            />
            <ButtonRow>
              <button
                type="button"
                className={s.ghostButton}
                title="Vuelve a los colores de la paleta"
                onClick={() =>
                  update((d) => {
                    if (!d.header.cta) return;
                    delete d.header.cta.color;
                    delete d.header.cta.hoverColor;
                    delete d.header.cta.hoverOpacity;
                  })
                }
              >
                ↺ Restablecer colores (paleta)
              </button>
            </ButtonRow>
            <IconField
              label="Icono del botón"
              value={header.cta.icon}
              onChange={(v) => update((d) => d.header.cta && void (d.header.cta.icon = v))}
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
                      shape: 'theme',
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

  return (
    <PanelSection title="Pie de página">
      <FieldsForm
        fields={FOOTER_FIELDS}
        value={state.spec.footer}
        onChange={(next) =>
          update((draft) => {
            draft.footer = next as typeof draft.footer;
          })
        }
      />
      <p className={s.hint}>
        Cada columna puede tener varios enlaces; el newsletter usa el email como campo de ejemplo
        (sin envío hasta conectar un servicio).
      </p>
    </PanelSection>
  );
}

// ── Section ──────────────────────────────────────────────────────────────────

function SectionForm({ sectionId }: { sectionId: string }) {
  const { state, dispatch } = useBuilder();
  const update = useUpdate();
  const section = state.spec.sections.find((item) => item.id === sectionId);
  const sectionNumber = state.spec.sections.findIndex((item) => item.id === sectionId) + 1;

  if (!section) return null;

  const patch = (mutate: (target: SectionDraft) => void): void => {
    update((draft) => {
      const target = findSection(draft, sectionId);
      if (target) mutate(target);
    });
  };

  const move = (delta: number): void => {
    update((draft) =>
      moveItem(
        draft.sections,
        draft.sections.findIndex((i) => i.id === sectionId),
        delta,
      ),
    );
  };

  const moveRow = (index: number, delta: number): void => {
    patch((target) => moveItem(target.rows, index, delta));
  };

  const removeRow = (rowId: string): void => {
    if (section.rows.length <= 1) {
      window.alert(
        'No se puede eliminar: la sección necesita al menos una fila. Si quieres eliminarla, usa «Eliminar» en la propia sección.',
      );
      return;
    }
    update((draft) => {
      const target = findSection(draft, sectionId);
      if (target) target.rows = target.rows.filter((item) => item.id !== rowId);
    });
  };

  const duplicate = (): void => {
    let clonedId: string | null = null;
    update((draft) => {
      const index = draft.sections.findIndex((item) => item.id === sectionId);
      const source = draft.sections[index];
      if (!source) return;
      const clone = structuredClone(source);
      // Regenera TODOS los ids (incluidos los anidados, p. ej. los botones de
      // un grupo): sin esto parseDesignSpec rechaza la mutación en silencio.
      reassignIds(clone);
      clonedId = clone.id;
      draft.sections.splice(index + 1, 0, clone);
    });
    // Selecciona la copia para que el usuario vea al instante qué ha duplicado.
    if (clonedId) dispatch({ type: 'select', selection: { kind: 'section', id: clonedId } });
  };

  const remove = (): void => {
    update((draft) => {
      draft.sections = draft.sections.filter((item) => item.id !== sectionId);
    });
  };

  return (
    <>
      <PanelSection
        title={`Sección ${sectionNumber} · ${SECTION_KIND_LABELS[section.kind] ?? section.kind}`}
      >
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
          <SliderNumberField
            label="Altura interna"
            value={section.padding?.topBottomPx}
            min={0}
            max={240}
            unit=" px"
            hint="Vacío = usa el espaciado global."
            onChange={(v) =>
              patch((target) => {
                target.padding = { ...target.padding, topBottomPx: v as number | undefined };
              })
            }
          />
          <SliderNumberField
            label="Ancho interno"
            value={section.padding?.leftRightPx}
            min={0}
            max={160}
            unit=" px"
            onChange={(v) =>
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

      <PanelSection title={`Filas (${section.rows.length})`}>
        <div className={s.rowList}>
          {section.rows.map((row, index) => (
            <div key={row.id} className={s.rowListItem}>
              <button
                type="button"
                className={s.rowListItemName}
                onClick={() =>
                  dispatch({ type: 'select', selection: { kind: 'row', sectionId, id: row.id } })
                }
              >
                Fila {index + 1} · {row.columns.length} col.
              </button>
              <button
                type="button"
                className={s.treeMini}
                title="Añadir columna a esta fila"
                onClick={() =>
                  patch((target) => {
                    const targetRow = target.rows[index];
                    if (!targetRow) return;
                    targetRow.columns.push({
                      id: newId('columna'),
                      span: 12,
                      hideOn: [],
                      verticalAlign: 'start',
                      contentAlign: 'stretch',
                      components: [createDefaultComponent('text')],
                    });
                  })
                }
              >
                +col
              </button>
              <button
                type="button"
                className={s.treeMini}
                title="Subir fila"
                onClick={() => moveRow(index, -1)}
              >
                ↑
              </button>
              <button
                type="button"
                className={s.treeMini}
                title="Bajar fila"
                onClick={() => moveRow(index, 1)}
              >
                ↓
              </button>
              <button
                type="button"
                className={s.treeMiniDanger}
                title="Eliminar fila"
                onClick={() => removeRow(row.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
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
                      contentAlign: 'stretch',
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
      </PanelSection>

      <AnimationPicker
        allowHover={false}
        value={section.animation}
        onChange={(next) => patch((target) => void (target.animation = normalizeAnimation(next)))}
      />
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
  const { state } = useBuilder();
  const palette = state.spec.theme.palette;
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

  const quickColors = [
    palette.primary,
    palette.secondary,
    palette.accent,
    palette.background,
    palette.surface,
  ];

  return (
    <PanelSection title="Fondo de la sección — color, degradado, imagen o interactivo">
      <SelectField
        label="Tipo de fondo"
        value={type}
        options={[
          { value: '', label: 'Heredar de la página' },
          { value: 'color', label: 'Color plano' },
          { value: 'gradient', label: 'Degradado' },
          { value: 'image', label: 'Imagen' },
          { value: 'interactive', label: '¡Interactivo con el ratón!' },
        ]}
        onChange={(value) => {
          if (!value) {
            setBackground(undefined);
            return;
          }
          if (value === 'color') {
            setBackground({ type: 'color', color: palette.surface });
          } else if (value === 'gradient') {
            setBackground({
              type: 'gradient',
              gradient: {
                type: 'linear',
                angle: 135,
                stops: [{ color: palette.primary }, { color: palette.accent, position: 100 }],
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
        <>
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
          <PaletteSwatches
            label="Colores de tu paleta"
            colors={quickColors}
            onPick={(color) =>
              patchBackground((bg) => {
                if (bg.type !== 'color') return;
                bg.color = color;
              })
            }
          />
        </>
      )}

      {background?.type === 'gradient' && (
        <>
          <SelectField
            label="Forma"
            value={background.gradient.type}
            options={[
              { value: 'linear', label: 'Lineal' },
              { value: 'radial', label: 'Radial (desde el centro)' },
              { value: 'conic', label: 'Cónica (giratoria)' },
            ]}
            onChange={(value) =>
              patchBackground((bg) => {
                if (bg.type !== 'gradient') return;
                bg.gradient.type = value as 'linear' | 'radial' | 'conic';
              })
            }
          />
          {background.gradient.type !== 'radial' && (
            <SliderNumberField
              label="Ángulo"
              value={background.gradient.angle}
              min={0}
              max={360}
              unit="°"
              onChange={(v) =>
                patchBackground((bg) => {
                  if (bg.type !== 'gradient') return;
                  bg.gradient.angle = Number(v ?? 135);
                })
              }
            />
          )}
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
          <PaletteSwatches
            label="Colores de tu paleta"
            colors={quickColors}
            onPick={(color) =>
              patchBackground((bg) => {
                if (bg.type !== 'gradient' || !bg.gradient.stops[0]) return;
                bg.gradient.stops[0].color = color;
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
          <div className={s.twoCols}>
            <SelectField
              label="Encaje"
              value={background.size}
              options={[
                { value: 'cover', label: 'Cubrir (recorta)' },
                { value: 'contain', label: 'Contener (cabe entera)' },
              ]}
              onChange={(value) =>
                patchBackground((bg) => {
                  if (bg.type !== 'image') return;
                  bg.size = value as 'cover' | 'contain';
                })
              }
            />
            <SelectField
              label="Posición"
              value={background.position}
              options={[
                { value: 'center', label: 'Centro' },
                { value: 'top', label: 'Arriba' },
                { value: 'bottom', label: 'Abajo' },
                { value: 'left', label: 'Izquierda' },
                { value: 'right', label: 'Derecha' },
              ]}
              onChange={(value) =>
                patchBackground((bg) => {
                  if (bg.type !== 'image') return;
                  bg.position = value ?? 'center';
                })
              }
            />
          </div>
          <CheckboxField
            label="Efecto fijo (parallax)"
            checked={background.fixed}
            onChange={(checked) =>
              patchBackground((bg) => {
                if (bg.type !== 'image') return;
                bg.fixed = checked;
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
            <SliderNumberField
              label="Intensidad"
              value={background.intensity}
              min={0}
              max={1}
              step={0.05}
              onChange={(v) =>
                patchBackground((bg) => {
                  if (bg.type !== 'interactive') return;
                  bg.intensity = Number(v ?? 0.5);
                })
              }
            />
            <SliderNumberField
              label="Velocidad"
              value={background.speed}
              min={0}
              max={1}
              step={0.05}
              onChange={(v) =>
                patchBackground((bg) => {
                  if (bg.type !== 'interactive') return;
                  bg.speed = Number(v ?? 0.5);
                })
              }
            />
          </div>
          <ColorField
            label="Color del efecto (luces, puntos, ondas…)"
            value={background.effectColor ?? palette.primary}
            onCommit={(v) =>
              typeof v === 'string' &&
              patchBackground((bg) => {
                if (bg.type !== 'interactive') return;
                bg.effectColor = v;
              })
            }
          />
          {background.effectColor !== undefined && (
            <button
              type="button"
              className={s.ghostButton}
              title="Vuelve al color principal de la paleta, que cambia solo al cambiar de paleta"
              onClick={() =>
                patchBackground((bg) => {
                  if (bg.type !== 'interactive') return;
                  delete bg.effectColor;
                })
              }
            >
              ↺ Seguir la paleta (automático)
            </button>
          )}
          <ColorField
            label="Color de fondo del efecto (detrás de todo)"
            hint="Pintado bajo el efecto. Útil si el efecto se ve poco sobre el fondo de la página."
            value={background.baseColor ?? ''}
            onCommit={(v) =>
              typeof v === 'string' &&
              patchBackground((bg) => {
                if (bg.type !== 'interactive') return;
                bg.baseColor = v;
              })
            }
          />
          {background.baseColor !== undefined && (
            <button
              type="button"
              className={s.ghostButton}
              title="Quita el color de fondo para que se vea el de la página"
              onClick={() =>
                patchBackground((bg) => {
                  if (bg.type !== 'interactive') return;
                  delete bg.baseColor;
                })
              }
            >
              ↺ Sin color de fondo (hereda la página)
            </button>
          )}
          <PaletteSwatches
            label="Colores de tu paleta"
            colors={quickColors}
            onPick={(color) =>
              patchBackground((bg) => {
                if (bg.type !== 'interactive') return;
                bg.effectColor = color;
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
      <SliderNumberField
        label="Intensidad del sombreado"
        value={current.intensity ?? 0.5}
        min={0}
        max={1}
        step={0.05}
        onChange={(value) => onChange({ ...current, intensity: Number(value ?? 0.5) })}
      />
    </>
  );
}

// ── Row ──────────────────────────────────────────────────────────────────────

function RowForm({ sectionId, rowId }: { sectionId: string; rowId: string }) {
  const { state, dispatch } = useBuilder();
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

  const moveColumn = (index: number, delta: number): void => {
    patch((target) => moveItem(target.columns, index, delta));
  };

  return (
    <>
      <PanelSection title="Fila">
        <div className={s.twoCols}>
          <SliderNumberField
            label="Separación entre columnas"
            value={row.gapPx}
            min={0}
            max={80}
            unit=" px"
            hint="Vacío = usa el espaciado global."
            onChange={(v) => patch((target) => void (target.gapPx = v as number | undefined))}
          />
          <SelectField
            label="Apilar en pantallas"
            value={row.stackBelow}
            options={[
              { value: 'never', label: 'Nunca (siempre en fila)' },
              { value: 'tablet', label: 'Tablet y móvil' },
              { value: 'mobile', label: 'Solo móvil' },
            ]}
            onChange={(value) =>
              patch((target) => void (target.stackBelow = value as RowDraft['stackBelow']))
            }
          />
        </div>

        <div className={s.rowList}>
          {row.columns.map((column, index) => (
            <div key={column.id} className={s.rowListItem}>
              <button
                type="button"
                className={s.rowListItemName}
                onClick={() =>
                  dispatch({
                    type: 'select',
                    selection: { kind: 'column', sectionId, id: column.id },
                  })
                }
              >
                Columna {index + 1} · ancho {column.span}/12
              </button>
              <button
                type="button"
                className={s.treeMini}
                title="Subir columna"
                onClick={() => moveColumn(index, -1)}
              >
                ↑
              </button>
              <button
                type="button"
                className={s.treeMini}
                title="Bajar columna"
                onClick={() => moveColumn(index, 1)}
              >
                ↓
              </button>
            </div>
          ))}
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
                  contentAlign: 'stretch',
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
        <SliderNumberField
          label="Ancho de la columna"
          value={column.span}
          min={1}
          max={12}
          hint="12 = ancho completo · 6 = mitad · 4 = un tercio."
          onChange={(v) => patch((target) => void (target.span = Number(v ?? 12)))}
        />
        <SelectField
          label="Alineación del contenido horizontal"
          hint="«Centro» deja el contenido en el centro de la columna: si la columna ocupa poco ancho, el contenido se queda en el centro de esa columna, no de la página."
          hintStrong
          value={column.contentAlign}
          options={[
            { value: 'stretch', label: 'Estirado (rellena la columna)' },
            { value: 'start', label: 'Izquierda' },
            { value: 'center', label: 'Centro de la columna' },
            { value: 'end', label: 'Derecha' },
          ]}
          onChange={(value) =>
            patch(
              (target) =>
                void (target.contentAlign = (value ?? 'stretch') as ColumnDraft['contentAlign']),
            )
          }
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
            onClick={() => {
              if (row.columns.length <= 1) {
                window.alert(
                  'No se puede eliminar: la fila necesita al menos una columna. Puedes cambiar su ancho o su contenido en su lugar.',
                );
                return;
              }
              update((draft) => {
                const target = findSection(draft, sectionId)?.rows.find(
                  (item) => item.id === row.id,
                );
                if (target) target.columns = target.columns.filter((item) => item.id !== columnId);
              });
            }}
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
      <PanelSection title={`${COMPONENT_TYPE_LABELS[component.type] ?? component.type}`}>
        <ButtonRow>
          <DangerButton
            onClick={() => {
              if (column.components.length <= 1) {
                window.alert(
                  'No se puede eliminar: la columna necesita al menos un componente. Cambia el componente por el que quieras, o elimina la columna o la sección entera.',
                );
                return;
              }
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
