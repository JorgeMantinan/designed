# Contribuir a designed

Gracias por tu interés. Este proyecto mantiene estándares altos de calidad desde el día 1.

## Requisitos

- Node.js ≥ 22
- pnpm 11 (usa [corepack](https://nodejs.org/api/corepack.html): `corepack enable`)

## Flujo de trabajo

1. Crea una rama desde `main`: `git checkout -b feat/nombre-corto`
2. Haz tus cambios con **commits convencionales** (ver abajo)
3. Ejecuta la batería completa antes de abrir el PR:

   ```bash
   pnpm check   # format:check + lint + typecheck + test
   pnpm build   # build de producción
   ```

4. Abre un PR contra `main` rellenando la plantilla
5. El CI debe pasar en verde; se requiere revisión antes de mergear

## Commits convencionales

El hook `commit-msg` valida el formato con CommitLint:

```
tipo: descripción en minúsculas
```

Tipos permitidos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

Ejemplos:

```
feat(schema): añadir esquema Zod de layout por filas y columnas
fix(codegen): corregir rutas de imports en el proyecto exportado
ci: añadir paso de audit de seguridad al workflow
```

## Reglas del código

- **TypeScript estricto**: sin `any` salvo justificación documentada
- **Prettier** formatea automáticamente en el `pre-commit` (lint-staged)
- **Tests** para toda la lógica nueva de `packages/` (Vitest)
- Los componentes de `packages/components` deben consumir tokens vía
  **CSS custom properties**, nunca colores hardcodeados
- El código del monorepo y el **exportado** va en **inglés**; la UI del builder en **español**
- Nada de funciones de IA en el producto (decisión de alcance)

## Estructura de paquetes

| Paquete                | Responsabilidad                                     |
| ---------------------- | --------------------------------------------------- |
| `@designed/schema`     | DesignSpec (Zod): única fuente de verdad del diseño |
| `@designed/tokens`     | Design tokens → SCSS + CSS variables + TS           |
| `@designed/palettes`   | Paletas de 5 colores + validación WCAG              |
| `@designed/animations` | Animaciones y fondos interactivos                   |
| `@designed/components` | Primitivas headless (una entrada por primitiva)     |
| `@designed/codegen`    | Emisor DesignSpec → proyecto exportable             |
| `@designed/web`        | App Next.js (landing + builder + API)               |

Añadir una primitiva = **1 entrada en el schema + 1 componente + 1 emisor en codegen + tests**.
