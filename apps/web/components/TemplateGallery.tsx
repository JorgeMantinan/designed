'use client';

import { PALETTES } from '@designed/palettes';
import type { Palette } from '@designed/palettes';
import { useState } from 'react';

import { TEMPLATE_TAGS, TEMPLATES } from '../lib/templates';

import s from './builder.module.scss';

interface TemplateGalleryProps {
  savedDesignName?: string;
  onPick: (templateId: string, palette: Palette) => void;
  onBlank: (palette: Palette) => void;
  onResume?: () => void;
  onDiscardSaved?: () => void;
}

/**
 * First screen of the builder: templates filtered by preference tags plus a
 * palette strip (all51 palettes), with resume/discard for the local save.
 */
export function TemplateGallery({
  savedDesignName,
  onPick,
  onBlank,
  onResume,
  onDiscardSaved,
}: TemplateGalleryProps) {
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [paletteId, setPaletteId] = useState(PALETTES[0]?.id ?? '');

  const palette = PALETTES.find((item) => item.id === paletteId) ?? PALETTES[0]!;
  const visibleTemplates = TEMPLATES.filter((template) =>
    activeTags.every((tag) => template.tags.includes(tag)),
  );

  const toggleTag = (tag: string): void => {
    setActiveTags((tags) =>
      tags.includes(tag) ? tags.filter((item) => item !== tag) : [...tags, tag],
    );
  };

  return (
    <div className={s.gallery}>
      <header className={s.galleryHeader}>
        <span className={s.brand}>designed</span>
        <h1 className={s.galleryTitle}>Elige por dónde empezar</h1>
        <p className={s.gallerySubtitle}>
          Selecciona una plantilla y una paleta. Todo se puede cambiar después, sección por sección.
        </p>
      </header>

      {savedDesignName && onResume && (
        <div className={s.resumeCard}>
          <div>
            <strong>Tienes un diseño guardado:</strong> {savedDesignName}
          </div>
          <div className={s.buttonRow}>
            <button type="button" className={s.primaryButton} onClick={onResume}>
              Continuar
            </button>
            {onDiscardSaved && (
              <button type="button" className={s.ghostButton} onClick={onDiscardSaved}>
                Descartar
              </button>
            )}
          </div>
        </div>
      )}

      <section className={s.gallerySection}>
        <h2 className={s.gallerySectionTitle}>Paleta</h2>
        <div className={s.paletteStrip} role="listbox" aria-label="Paletas">
          {PALETTES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="option"
              aria-selected={item.id === palette.id}
              className={item.id === palette.id ? s.paletteDotActive : s.paletteDot}
              onClick={() => setPaletteId(item.id)}
              title={`${item.name} (${item.tags.join(', ')})`}
            >
              <span className={s.paletteDotSwatch}>
                <i style={{ background: item.colors.primary }} />
                <i style={{ background: item.colors.secondary }} />
                <i style={{ background: item.colors.accent }} />
                <i style={{ background: item.colors.background }} />
                <i style={{ background: item.colors.surface }} />
              </span>
            </button>
          ))}
        </div>
        <p className={s.galleryHint}>
          Paleta seleccionada: <strong>{palette.name}</strong>
        </p>
      </section>

      <section className={s.gallerySection}>
        <h2 className={s.gallerySectionTitle}>Plantillas</h2>

        <div className={s.tagRow}>
          {TEMPLATE_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={activeTags.includes(tag) ? s.tagActive : s.tag}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
          {activeTags.length > 0 && (
            <button type="button" className={s.tag} onClick={() => setActiveTags([])}>
              limpiar ✕
            </button>
          )}
        </div>

        <div className={s.templateGrid}>
          {visibleTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              className={s.templateCard}
              onClick={() => onPick(template.id, palette)}
            >
              <span className={s.templateName}>{template.name}</span>
              <span className={s.templateDescription}>{template.description}</span>
              <span className={s.templateTags}>
                {template.tags.map((tag) => (
                  <em key={tag}>{tag}</em>
                ))}
              </span>
            </button>
          ))}

          <button type="button" className={s.templateCardBlank} onClick={() => onBlank(palette)}>
            <span className={s.templateName}>⌗ Diseño en blanco</span>
            <span className={s.templateDescription}>
              Una sola sección con un título para empezar de cero.
            </span>
          </button>
        </div>

        {visibleTemplates.length === 0 && (
          <p className={s.galleryHint}>
            Ninguna plantilla cumple todas esas preferencias. Quita algún filtro.
          </p>
        )}
      </section>
    </div>
  );
}
