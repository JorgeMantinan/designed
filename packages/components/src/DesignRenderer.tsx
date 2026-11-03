import { flattenTokens } from '@designed/tokens';
import type { DesignSpec } from '@designed/schema';
import type { CSSProperties } from 'react';

import { cx } from './cx';
import { Footer } from './footer/Footer';
import { Header } from './header/Header';
import { Section } from './sections/Section';

export interface DesignRendererProps {
  spec: DesignSpec;
  /** Extra page to render; omitted = home page (sections at the spec root). */
  pageId?: string;
}

/**
 * Renders a full design (header + sections + footer) from a DesignSpec.
 * Injects the theme as CSS custom properties on the root element, so the
 * preview restyles instantly when the user changes palette or tokens.
 *
 * Multi-page: `pageId` selects an entry of `spec.pages`; chrome (header +
 * footer) always comes from the spec root, so every page shares the menu.
 *
 * Load the global stylesheets once in the app entry (tokens, base y motion).
 */
export function DesignRenderer({ spec, pageId }: DesignRendererProps) {
  const page = pageId ? spec.pages.find((item) => item.id === pageId) : undefined;
  const sections = page?.sections ?? spec.sections;
  /** Public path of the rendered page ('/' = home): drives the active menu link. */
  const activePath = page ? page.path : '/';
  const tokens = flattenTokens(spec.theme);
  const cssVariables = Object.fromEntries(
    Object.entries(tokens).map(([name, value]) => [`--${name}`, value]),
  ) as CSSProperties;

  // Layout-aware root classes: fixed sidebars/bottom bar reserve space.
  const layoutClasses = cx(
    `dsg-nav-${spec.header.layout}`,
    spec.header.layout === 'sidebar' && `dsg-nav-sidebar-${spec.header.sidebarPosition ?? 'left'}`,
  );

  return (
    <div className={cx('dsg-root', layoutClasses)} style={cssVariables}>
      {/* El menú inferior se renderiza DESPUÉS del contenido: así
          position:sticky funciona (anclado al final del flujo). */}
      {/* Ruta pública de la página mostrada: resalta el enlace activo del menú. */}
      {spec.header.layout !== 'bottom' && <Header {...spec.header} activePath={activePath} />}
      <main className="dsg-main">
        {sections.map((section) => (
          <Section key={section.id} {...section} />
        ))}
      </main>
      {spec.header.layout === 'bottom' && <Header {...spec.header} activePath={activePath} />}
      <Footer {...spec.footer} />
    </div>
  );
}
