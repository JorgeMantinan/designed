import { describe, expect, it } from 'vitest';

import type { ExportedFile, ExportedProject } from './index';

describe('codegen types', () => {
  it('ExportedProject es un array de archivos con ruta y contenido', () => {
    const file: ExportedFile = { path: 'src/App.tsx', content: 'export default function App() {}' };
    const project: ExportedProject = [file];

    expect(project).toHaveLength(1);
    expect(project[0]?.path).toBe('src/App.tsx');
  });
});
