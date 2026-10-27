'use client';

import { useRef } from 'react';

import { useBuilder } from '../lib/store';

import s from './builder.module.scss';
import { TextField } from './ui';

interface TopBarProps {
  onGallery: () => void;
  onImport: (file: File) => void;
  onExportJson: () => void;
  onExportZip: () => void;
}

/** Builder chrome: back, design name, undo/redo, replay, import/export. */
export function TopBar({ onGallery, onImport, onExportJson, onExportZip }: TopBarProps) {
  const { state, dispatch } = useBuilder();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <header className={s.topbar}>
      <button type="button" className={s.ghostButton} onClick={onGallery}>
        ← Plantillas
      </button>

      <span className={s.brand}>designed</span>

      <div className={s.topbarName}>
        <TextField
          label=""
          value={state.spec.meta.name}
          placeholder="Nombre del diseño"
          onCommit={(value) => {
            if (typeof value !== 'string' || value.length === 0) return;
            dispatch({ type: 'update', mutate: (draft) => void (draft.meta.name = value) });
          }}
        />
      </div>

      <div className={s.topbarSpacer} />

      <button
        type="button"
        className={s.iconButton}
        onClick={() => dispatch({ type: 'undo' })}
        disabled={state.past.length === 0}
        title="Deshacer (Ctrl+Z)"
      >
        ↶
      </button>
      <button
        type="button"
        className={s.iconButton}
        onClick={() => dispatch({ type: 'redo' })}
        disabled={state.future.length === 0}
        title="Rehacer (Ctrl+Shift+Z)"
      >
        ↷
      </button>
      <button
        type="button"
        className={s.iconButton}
        onClick={() => dispatch({ type: 'replay' })}
        title="Repetir animaciones de entrada"
      >
        ▶
      </button>

      <span className={s.divider} />

      <button type="button" className={s.ghostButton} onClick={() => fileInputRef.current?.click()}>
        Importar
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onImport(file);
          event.target.value = '';
        }}
      />
      <button type="button" className={s.ghostButton} onClick={onExportJson}>
        JSON
      </button>
      <button type="button" className={s.primaryButton} onClick={onExportZip}>
        ↓ Exportar ZIP
      </button>
    </header>
  );
}
