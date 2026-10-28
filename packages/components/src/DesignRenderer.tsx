import { flattenTokens } from '@designed/tokens';
import type { DesignSpec } from '@designed/schema';
import type { CSSProperties } from 'react';

import { cx } from './cx';
import { Footer } from './footer/Footer';
import { Header } from './header/Header';
import { Section } from './sections/Section';

export interface DesignRendererProps {
  spec: DesignSpec;
}

/**
 * Renders a full design (header + sections + footer) from a DesignSpec.
 * Injects the theme as CSS custom properties on the root element, so the
 * preview restyles instantly when the user changes palette or tokens.
 *
 * Load the global stylesheets once in the app entry (tokens, base y motion).
 */
export function DesignRenderer({ spec }: DesignRendererProps) {
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
      <Header {...spec.header} />
      <main className="dsg-main">
        {spec.sections.map((section) => (
          <Section key={section.id} {...section} />
        ))}
      </main>
      <Footer {...spec.footer} />
    </div>
  );
}
