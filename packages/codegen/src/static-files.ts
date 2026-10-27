import type { DesignSpec } from '@designed/schema';
import { flattenTokens, toScssVariables } from '@designed/tokens';

import { TYPES_SPEC } from './types-spec';
import type { ExportedFile } from './index';

/** Kebab/ascii slug for package and file names. */
export function slugify(name: string): string {
  const combiningDiacritics = new RegExp('[\\u0300-\\u036f]', 'g');
  return (
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(combiningDiacritics, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'mi-web'
  );
}

function packageJson(spec: DesignSpec): string {
  const slug = slugify(spec.meta.name);
  return `${JSON.stringify(
    {
      name: slug,
      version: '0.1.0',
      private: true,
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc --noEmit && vite build',
        preview: 'vite preview',
      },
      dependencies: {
        react: '^19.3.1',
        'react-dom': '^19.3.1',
      },
      devDependencies: {
        '@types/react': '^19',
        '@types/react-dom': '^19',
        '@vitejs/plugin-react': '^6.1.2',
        sass: '^1',
        typescript: '^6.0.3',
        vite: '^8.3.5',
      },
      engines: {
        node: '>=22',
      },
    },
    null,
    2,
  )}\n`;
}

const VITE_CONFIG = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`;

const TSCONFIG = `{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noEmit": true
  },
  "include": ["src", "vite.config.ts"]
}
`;

const VITE_ENV = `/// <reference types="vite/client" />
`;

const GITIGNORE = `node_modules/
dist/
*.local
.DS_Store
`;

const PNPM_WORKSPACE = `# Aprobación de scripts de build de dependencias (pnpm 11 los bloquea
# por defecto). Revisa cada entrada antes de ampliarla.
allowBuilds:
  "@parcel/watcher": true
  esbuild: true
`;

const MAIN_TSX = `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './styles/tokens.scss';
import './styles/global.scss';
import './styles/motion.scss';

const container = document.getElementById('root');
if (!container) throw new Error('No se encontró el elemento #root');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`;

function appTsx(): string {
  return `import { DesignRenderer } from './components/DesignRenderer';
import { design } from './design';

export default function App() {
  return <DesignRenderer spec={design} />;
}
`;
}

function designTs(spec: DesignSpec): string {
  return `import type { DesignSpec } from './types/spec';

// Tu diseño, exportado desde designed. Todo el contenido vive aquí:
// textos, imágenes, colores y estructura de secciones.
export const design: DesignSpec = ${JSON.stringify(spec, null, 2)};
`;
}

/** Baked CSS variables: the flat token map + a flattenTokens-compatible shim. */
function tokensTs(spec: DesignSpec): string {
  return `// Tokens de diseño (generados por designed).
// Valores congelados en el momento de exportar; edítalos aquí o en tokens.scss.

export const designTokens: Record<string, string> = ${JSON.stringify(flattenTokens(spec.theme), null, 2)};

/** Compatible con la API del editor: los tokens ya vienen horneados. */
export function flattenTokens(_theme: unknown): Record<string, string> {
  return designTokens;
}
`;
}

/** Aggregate entry so component sources keep a single import specifier. */
function hooksAnimationsTs(): string {
  return `// Motor de animación (generado por designed).
export { useMotion, motionClassName, motionStyle, hoverAttribute, useMotionRef } from './motion';
export type { MotionValues } from './motion';
export { InteractiveBackground } from '../components/backgrounds/InteractiveBackground';
export type {
  EffectProps,
  InteractiveBackgroundProps,
} from '../components/backgrounds/InteractiveBackground';
`;
}

function indexHtml(spec: DesignSpec): string {
  const title = spec.meta.name.replace(/[<>&"]/g, '');
  return `<!doctype html>
<html lang="${spec.meta.lang ?? 'es'}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${(spec.meta.description ?? title).replace(/[<>&"]/g, '')}" />
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

function readme(spec: DesignSpec): string {
  return `# ${spec.meta.name}

${spec.meta.description ?? 'Web generada con [designed](https://github.com/JorgeMantinan/designed).'}

## 🚀 Arranque rápido

\`\`\`bash
pnpm install    # o npm install
pnpm dev        # servidor de desarrollo (Vite)
pnpm build      # typecheck + build de producción
\`\`\`

## 📁 Estructura

\`\`\`
src/
├── App.tsx                  # Composición: renderiza tu diseño
├── design.ts                # 👈 TODO tu contenido y estructura viven aquí
├── components/
│   ├── primitives/          # Button, Heading, BodyText, Image...
│   ├── cards/               # FeatureCard, PricingCard, TestimonialCard...
│   ├── carousel/            # Carrusel con overlays
│   ├── sections/            # Secciones (grid de12, fondos, responsive)
│   ├── header/              # Menú superior / esquinado / lateral
│   ├── footer/              # Pie de página
│   └── backgrounds/         # Fondos interactivos (spotlight, ondas...)
├── hooks/                   # useMotion + motor de animación
├── styles/
│   ├── tokens.scss          # 👈 Colores, espaciados, radios y sombras
│   ├── global.scss          # Estilos base + overlays de imágenes
│   └── motion.scss          # Animaciones de entrada y hover
└── types/spec.ts            # Tipos estructurales del diseño
\`\`\`

## ✏️ Qué editar

- **Textos e imágenes** → \`src/design.ts\`
- **Colores y espaciados** → \`src/styles/tokens.scss\` (o \`src/styles/tokens.ts\` para JS)
- **Animaciones** → slots \`animation\` dentro de \`design.ts\` (entrada/hover)

## 🎨 Personalización

Los componentes usan CSS custom properties (\`var(--color-primary)\`...), así que
cambiar un token en \`:root\` repinta toda la web. Cada componente tiene su
\`*.module.scss\` junto al \`.tsx\` para ajustes finos.

MIT · Generado con designed.
`;
}

/** Static, spec-dependent project files. */
export function staticFiles(spec: DesignSpec): ExportedFile[] {
  return [
    { path: 'package.json', content: packageJson(spec) },
    { path: 'vite.config.ts', content: VITE_CONFIG },
    { path: 'tsconfig.json', content: TSCONFIG },
    { path: '.gitignore', content: GITIGNORE },
    { path: 'pnpm-workspace.yaml', content: PNPM_WORKSPACE },
    { path: 'index.html', content: indexHtml(spec) },
    { path: 'README.md', content: readme(spec) },
    { path: 'src/vite-env.d.ts', content: VITE_ENV },
    { path: 'src/main.tsx', content: MAIN_TSX },
    { path: 'src/App.tsx', content: appTsx() },
    { path: 'src/design.ts', content: designTs(spec) },
    { path: 'src/styles/tokens.ts', content: tokensTs(spec) },
    { path: 'src/styles/tokens.scss', content: toScssVariables(spec.theme) },
    { path: 'src/types/spec.ts', content: TYPES_SPEC },
    { path: 'src/hooks/animations.ts', content: hooksAnimationsTs() },
  ];
}
