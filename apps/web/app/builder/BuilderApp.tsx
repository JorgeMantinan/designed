'use client';

import type { Palette } from '@designed/palettes';
import type { DesignSpec } from '@designed/schema';
import { parseDesignSpec } from '@designed/schema';
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';

import { LayersTree } from '../../components/LayersTree';
import { Preview } from '../../components/Preview';
import { PropertiesPanel } from '../../components/PropertiesPanel';
import { TemplateGallery } from '../../components/TemplateGallery';
import { TopBar } from '../../components/TopBar';
import s from '../../components/builder.module.scss';
import {
  clearSaved,
  getSavedRaw,
  getSavedServerRaw,
  parseSaved,
  subscribeSaved,
  writeSaved,
} from '../../lib/savedDesign';
import { BuilderProvider, useBuilder } from '../../lib/store';
import { buildBlankDesign, buildTemplate } from '../../lib/templates';

function downloadJson(spec: DesignSpec): void {
  const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${spec.meta.name.toLowerCase().replace(/\s+/g, '-') || 'diseno'}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

/** Runs inside the provider: autosave, keyboard shortcuts, import/export. */
function EditorShell({ onGallery }: { onGallery: () => void }) {
  const { state, dispatch } = useBuilder();

  // Autosave (debounced) through the external store.
  useEffect(() => {
    const timer = window.setTimeout(() => writeSaved(state.spec), 300);
    return () => window.clearTimeout(timer);
  }, [state.spec]);

  // Undo / redo / replay shortcuts.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        dispatch({ type: event.shiftKey ? 'redo' : 'undo' });
      } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        dispatch({ type: 'redo' });
      } else if (event.key === 'Escape') {
        dispatch({ type: 'select', selection: { kind: 'global' } });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dispatch]);

  const handleImport = useCallback(
    async (file: File) => {
      try {
        const raw = JSON.parse(await file.text());
        const result = parseDesignSpec(raw);
        if (!result.success) {
          window.alert(
            `El archivo no es un diseño válido:\n${result.errors.slice(0, 6).join('\n')}`,
          );
          return;
        }
        dispatch({ type: 'load', spec: result.data });
      } catch {
        window.alert('No se pudo leer el archivo JSON.');
      }
    },
    [dispatch],
  );

  const handleExport = useCallback(() => downloadJson(state.spec), [state.spec]);

  return (
    <div className={s.builder}>
      <TopBar onGallery={onGallery} onImport={handleImport} onExport={handleExport} />
      <div className={s.body}>
        <aside className={s.leftPanel}>
          <LayersTree />
        </aside>
        <main className={s.center}>
          <Preview />
        </main>
        <aside className={s.rightPanel}>
          <PropertiesPanel />
        </aside>
      </div>
    </div>
  );
}

/** Root of /builder: gallery first, editor once a design is chosen. */
export function BuilderApp() {
  const savedRaw = useSyncExternalStore(subscribeSaved, getSavedRaw, getSavedServerRaw);
  const saved = useMemo(() => parseSaved(savedRaw), [savedRaw]);
  const [spec, setSpec] = useState<DesignSpec | null>(null);
  const [editing, setEditing] = useState(false);

  const start = (next: DesignSpec): void => {
    setSpec(next);
    setEditing(true);
  };

  const handlePick = (templateId: string, palette: Palette): void => {
    start(buildTemplate(templateId, palette));
  };

  const handleBlank = (palette: Palette): void => {
    start(buildBlankDesign(palette));
  };

  const handleResume = (): void => {
    if (saved) start(saved);
  };

  const handleGalleryBack = (): void => {
    setEditing(false);
  };

  if (editing && spec) {
    return (
      <BuilderProvider initialSpec={spec}>
        <EditorShell onGallery={handleGalleryBack} />
      </BuilderProvider>
    );
  }

  return (
    <TemplateGallery
      savedDesignName={saved?.meta.name}
      onPick={handlePick}
      onBlank={handleBlank}
      onResume={saved ? handleResume : undefined}
      onDiscardSaved={saved ? clearSaved : undefined}
    />
  );
}
