import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

import { parseDesignSpec } from '@designed/schema';
import { exampleDesignSpec } from '@designed/schema/fixtures';
import { describe, expect, it } from 'vitest';

import { generateProject } from './generate';
import { slugify } from './static-files';
import type { ExportedProject } from './index';

const parsed = (() => {
  const result = parseDesignSpec(exampleDesignSpec);
  if (!result.success) throw new Error(result.errors.join('\n'));
  return result.data;
})();

const KEY_FILES = [
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'index.html',
  'README.md',
  '.gitignore',
  'pnpm-workspace.yaml',
  'src/main.tsx',
  'src/App.tsx',
  'src/design.ts',
  'src/vite-env.d.ts',
  'src/styles/tokens.ts',
  'src/styles/tokens.scss',
  'src/styles/motion.scss',
  'src/styles/global.scss',
  'src/types/spec.ts',
  'src/hooks/motion.ts',
  'src/hooks/animations.ts',
  'src/components/DesignRenderer.tsx',
  'src/components/renderer.tsx',
  'src/components/cx.ts',
  'src/components/icons.tsx',
  'src/components/background-style.ts',
  'src/components/primitives/Button.tsx',
  'src/components/primitives/Button.module.scss',
  'src/components/cards/PricingCard.tsx',
  'src/components/sections/Section.tsx',
  'src/components/header/Header.tsx',
  'src/components/footer/Footer.tsx',
  'src/components/carousel/Carousel.tsx',
  'src/components/backgrounds/InteractiveBackground.tsx',
  'src/components/backgrounds/backgrounds.module.scss',
];

function contentOf(files: ExportedProject, path: string): string {
  const file = files.find((candidate) => candidate.path === path);
  expect(file, `Falta el archivo ${path}`).toBeDefined();
  return file!.content;
}

describe('generateProject', () => {
  it('genera los archivos clave del proyecto', async () => {
    const files = await generateProject(parsed);
    const paths = new Set(files.map((file) => file.path));

    for (const expected of KEY_FILES) {
      expect(paths.has(expected), `Falta ${expected}`).toBe(true);
    }
    expect(files.length).toBeGreaterThan(60);
  });

  it('emite rutas únicas y ordenadas', async () => {
    const files = await generateProject(parsed);
    const paths = files.map((file) => file.path);

    expect(new Set(paths).size).toBe(paths.length);
    expect(paths).toEqual([...paths].sort((a, b) => a.localeCompare(b)));
  });

  it('el package.json usa el slug del diseño y scripts reales', async () => {
    const files = await generateProject(parsed);
    const pkg = JSON.parse(contentOf(files, 'package.json')) as {
      name: string;
      scripts: Record<string, string>;
      dependencies: Record<string, string>;
    };

    expect(slugify('Nébula Studio')).toBe('nebula-studio');
    expect(pkg.name).toBe('nebula-studio');
    expect(pkg.scripts.dev).toBe('vite');
    expect(pkg.scripts.build).toContain('tsc --noEmit');
    expect(pkg.dependencies.react).toBeDefined();
  });

  it('CERO imports de @designed en el código emitido (proyecto autónomo)', async () => {
    const files = await generateProject(parsed);
    const offenders = files
      .filter((file) => /\.(ts|tsx|scss)$/.test(file.path))
      .filter((file) => file.content.includes('@designed/'));

    expect(offenders.map((file) => file.path)).toEqual([]);
  });

  it('sin directivas de editor (use client) en el proyecto Vite', async () => {
    const files = await generateProject(parsed);
    const offenders = files.filter(
      (file) => file.path.endsWith('.tsx') && file.content.includes("'use client'"),
    );

    expect(offenders.map((file) => file.path)).toEqual([]);
  });

  it('design.ts contiene el spec completo con su versión', async () => {
    const files = await generateProject(parsed);
    const design = contentOf(files, 'src/design.ts');

    expect(design).toContain("import type { DesignSpec } from './types/spec'");
    expect(design).toContain('"version": 1');
    expect(design).toContain('Diseña tu web sin límites');
    expect(design).toContain('"layout": "angled"');
  });

  it('los tokens van horneados en SCSS y en TS', async () => {
    const files = await generateProject(parsed);

    const scss = contentOf(files, 'src/styles/tokens.scss');
    expect(scss).toContain(':root {');
    expect(scss).toContain('$color_primary:');
    expect(scss).toContain('--color-primary: #{$color_primary}');

    const tokens = contentOf(files, 'src/styles/tokens.ts');
    expect(tokens).toContain('export const designTokens');
    expect(tokens).toContain('export function flattenTokens');
    expect(tokens).toContain('"color-primary"');
  });

  it('reescribe los imports a rutas relativas correctas', async () => {
    const files = await generateProject(parsed);

    expect(contentOf(files, 'src/components/DesignRenderer.tsx')).toContain(
      "from '../styles/tokens'",
    );
    expect(contentOf(files, 'src/components/sections/Section.tsx')).toContain(
      "from '../../hooks/animations'",
    );
    expect(contentOf(files, 'src/components/primitives/Button.tsx')).toContain(
      "from '../../types/spec'",
    );
    expect(contentOf(files, 'src/hooks/motion.ts')).toContain("from '../types/spec'");
  });

  it('es determinista: dos generaciones idénticas', async () => {
    const [first, second] = await Promise.all([generateProject(parsed), generateProject(parsed)]);

    expect(first).toEqual(second);
  });
});

// ── Verificación end-to-end (local, opt-in) ─────────────────────────────────
// Ejecutar con: VERIFY_EXPORT=1 pnpm --filter @designed/codegen test
// Genera el proyecto en un temporal y comprueba `pnpm install && pnpm build`.

const verify = Boolean(process.env.VERIFY_EXPORT);

it.runIf(verify)(
  'el proyecto generado instala y compila de verdad',
  { timeout: 600_000 },
  async () => {
    const files = await generateProject(parsed);
    const dir = await mkdtemp(join(tmpdir(), 'designed-export-'));

    for (const file of files) {
      const target = join(dir, ...file.path.split('/'));
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, file.content, 'utf8');
    }

    const install = spawnSync('pnpm', ['install'], { cwd: dir, shell: true, encoding: 'utf8' });
    expect(install.status, `pnpm install falló:\n${install.stdout}\n${install.stderr}`).toBe(0);

    const build = spawnSync('pnpm', ['run', 'build'], { cwd: dir, shell: true, encoding: 'utf8' });
    expect(build.status, `pnpm build falló:\n${build.stdout}\n${build.stderr}`).toBe(0);
  },
);

describe('slugify', () => {
  it('normaliza acentos y espacios', () => {
    expect(slugify('¡Mi Web Increíble!')).toBe('mi-web-increible');
    expect(slugify('   ')).toBe('mi-web');
    expect(slugify('123abc')).toBe('123abc');
  });
});
