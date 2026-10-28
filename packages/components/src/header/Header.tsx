'use client';

import { hoverAttribute, motionStyle } from '@designed/animations';
import type { ButtonInput, HeaderSpec, HoverAnimationInput } from '@designed/schema';
import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';

import { cx } from '../cx';
import { Icon } from '../icons';

import { Button } from '../primitives/Button';

import s from './Header.module.scss';

export interface HeaderProps extends Omit<HeaderSpec, 'cta' | 'itemAnimation'> {
  cta?: ButtonInput;
  /** Hover animation applied to every menu item. */
  itemAnimation?: HoverAnimationInput;
  className?: string;
}

/**
 * Site header with4 layouts: top, angled (diagonal items that expand on
 * hover), sidebar and minimal. Sticky + transparent-until-scroll are
 * configurable; the mobile menu is a toggleable panel.
 */
export function Header({
  layout,
  sidebarPosition = 'left',
  sticky,
  transparentOnTop,
  brand,
  items,
  cta,
  itemAnimation,
  mobileMenu,
  backgroundColor,
  linkColor,
  className,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!transparentOnTop) return;
    const onScroll = (): void => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [transparentOnTop]);

  const itemHover = hoverAttribute({ hover: itemAnimation ?? undefined });
  const itemStyle = motionStyle({ hover: itemAnimation ?? undefined });

  return (
    <header
      className={cx(
        s.header,
        s[layout],
        layout === 'sidebar' && (sidebarPosition === 'right' ? s.sideRight : s.sideLeft),
        sticky && s.sticky,
        transparentOnTop && !scrolled && s.transparent,
        menuOpen && s.menuOpen,
        className,
      )}
      data-layout={layout}
      data-mobile={mobileMenu}
      data-node="header"
      style={
        {
          backgroundColor: backgroundColor || undefined,
          '--header-link-color': linkColor || undefined,
        } as CSSProperties
      }
    >
      <div className={s.inner}>
        <a className={s.brand} href={brand.href}>
          {brand.logoUrl && <img className={s.logo} src={brand.logoUrl} alt="" />}
          <span className={s.brandName}>{brand.name}</span>
        </a>

        {/* El menú en esquina lleva SU propio botón (nunca la hamburguesa:
            antes se renderizaban los dos y parecían dos menús). */}
        {mobileMenu !== 'hidden' && layout !== 'corner' && (
          <button
            type="button"
            className={s.burger}
            aria-expanded={menuOpen}
            aria-controls="dsg-nav"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? 'x' : 'menu'} size={22} />
          </button>
        )}

        {layout === 'corner' && (
          <button
            type="button"
            className={s.cornerToggle}
            aria-expanded={menuOpen}
            aria-controls="dsg-nav"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? 'x' : 'menu'} size={22} />
          </button>
        )}

        <nav
          id="dsg-nav"
          className={cx(s.nav, mobileMenu === 'hidden' && s.navHidden)}
          data-open={layout === 'corner' || mobileMenu !== 'hidden' ? menuOpen : undefined}
          aria-label="Principal"
        >
          <ul className={s.list}>
            {items.map((item) => (
              <li key={item.id} className={cx(s.item, layout === 'angled' && s.itemAngled)}>
                <a
                  className={s.link}
                  href={item.href}
                  data-hover={itemHover}
                  style={{ color: linkColor || undefined, ...itemStyle }}
                >
                  {item.label}
                </a>
                {item.children.length > 0 && (
                  <ul className={s.dropdown}>
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <a className={s.dropdownLink} href={child.href}>
                          {child.label}
                          {child.badge && <span className={s.dropdownBadge}>{child.badge}</span>}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {cta && (
          <div className={s.ctaWrap}>
            <Button {...cta} />
          </div>
        )}
      </div>
    </header>
  );
}
