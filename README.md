# designed

[![CI](https://github.com/JorgeMantinan/designed/actions/workflows/ci.yml/badge.svg)](https://github.com/JorgeMantinan/designed/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![pnpm](https://img.shields.io/badge/pnpm-11-orange.svg)](https://pnpm.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-blue.svg)](https://www.typescriptlang.org)

> Constructor visual de webs estilo WordPress **que exporta proyectos React + TypeScript reales y modulares**.
> El usuario diseña en el navegador (plantillas, paletas, animaciones, sombreados) y descarga un ZIP
> con una estructura de proyecto profesional lista para `pnpm install && pnpm dev`.

## ✨ Visión

- **Galería de plantillas** al entrar, filtradas por preferencias (4×2, 1 columna ×3 filas, menú superior,
  menú esquinado ampliable con hover...).
- **Panel de propiedades completo**: botones por sección, columnas, spacing, padding, radios, sombras,
  bordes, gradientes, breakpoints.
- **Catálogo de animaciones** con preview en vivo (botones, menús, entradas) y **fondos interactivos**
  (spotlight, malla de gradiente, partículas, parallax).
- **Paletas de 5 colores** con etiquetas y validación de contraste **WCAG AA/AAA**.
- **Sombreados de imágenes/carousel**: lateral, vertical, diagonal, radial, duotone.
- **Export real**: el código llega separado en `components/`, `hooks/`, `styles/` (cards, sections,
  panels, header, footer...), con SCSS + CSS custom properties y README en español.

## 🧠 Concepto clave: "el diseño es un archivo de datos"

Todo lo que el usuario configura se serializa en un **`design-spec.json` validado con Zod**
(`packages/schema`). De esa única fuente de verdad salen:

1. el **preview en vivo** dentro del builder,
2. el **proyecto exportado** (`packages/codegen`),
3. en el futuro, otros emisores (Angular, HTML estático...).

> **Nota:** "design tokens" = variables de diseño centralizadas (colores, espaciados, sombras...).
> No tiene relación con IA. Este proyecto **no incluye ninguna función de IA**.

## 🛠 Stack

| Capa     | Tecnología                                           |
| -------- | ---------------------------------------------------- |
| Monorepo | pnpm workspaces + Turborepo                          |
| App      | Next.js 16 (App Router) + React 19                   |
| Lenguaje | TypeScript (estricto)                                |
| Estilos  | SCSS + CSS custom properties                         |
| Schema   | Zod                                                  |
| Tests    | Vitest + Playwright (E2E, fase posterior)            |
| Calidad  | ESLint 10 (flat config) + Prettier + CommitLint      |
| CI       | GitHub Actions (lint, typecheck, test, build, audit) |

## 📁 Estructura

```
designed/
├── apps/web/               # Next.js: landing (SEO) + builder + API de export
├── packages/
│   ├── schema/             # DesignSpec (Zod): layout, tokens, animaciones, overlays
│   ├── tokens/             # Pipeline de design tokens → SCSS + CSS vars + TS
│   ├── palettes/           # Catálogo de paletas de 5 colores + validador WCAG
│   ├── animations/         # Catálogo de animaciones y fondos interactivos
│   ├── components/         # Primitivas headless (Button, Card, Header, Section...)
│   └── codegen/            # DesignSpec → proyecto Vite+React+TS exportable
├── .github/workflows/      # CI
└── turbo.json · pnpm-workspace.yaml · tsconfig.base.json
```

## 🚀 Comandos

```bash
pnpm install        # instalar dependencias
pnpm dev            # desarrollo (Turbo)
pnpm build          # build de producción
pnpm lint           # ESLint en todos los paquetes
pnpm typecheck      # tsc --noEmit en todos los paquetes
pnpm test           # Vitest en todos los paquetes
pnpm check          # format:check + lint + typecheck + test
pnpm format         # formatear todo con Prettier
```

## 🗺 Roadmap

- [x] **Fase 0** — Repo + monorepo + CI + hooks de Git
- [ ] **Fase 1** — `schema`: DesignSpec (el corazón)
- [ ] **Fase 2** — `tokens` + `palettes` (SCSS/CSS vars + WCAG)
- [ ] **Fase 3** — `components`: primitivas ★★★
- [ ] **Fase 4** — `animations`: catálogo + fondos interactivos
- [ ] **Fase 5** — Builder UI (galería, paneles, preview en vivo)
- [ ] **Fase 6** — `codegen` + export ZIP
- [ ] **Fase 7** — SEO/LLMO + tests E2E
- [ ] **Fase 8** — Security audit completo

## 🤝 Contribuir

Lee [CONTRIBUTING.md](CONTRIBUTING.md). Resumen: convencional commits, ramas `feat/*` + PRs,
`pnpm check` en verde antes de mergear.

## 📄 Licencia

[MIT](LICENSE) © 2026 Jorge Mantinán Montero
