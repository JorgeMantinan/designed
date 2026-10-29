'use client';

import { hoverAttribute, motionStyle } from '@designed/animations';
import type { ButtonInput, HeaderSpec, HoverAnimationInput } from '@designed/schema';
import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';

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
  brandColor,
  className,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!transparentOnTop) return;
    // El scroll puede ocurrir en el window O en un contenedor propio (el
    // preview del builder scrollea dentro de .previewArea): buscamos el
    // ancestro scrollable real para que el efecto cristal funcione allí.
    let scroller: Element | Window = window;
    const el = headerRef.current;
    if (el) {
      let parent = el.parentElement;
      while (parent) {
        const overflowY = getComputedStyle(parent).overflowY;
        if (overflowY === 'auto' || overflowY === 'scroll') {
          scroller = parent;
          break;
        }
        parent = parent.parentElement;
      }
    }
    const readScroll = (): number =>
      scroller === window ? window.scrollY : (scroller as Element).scrollTop;
    const onScroll = (): void => setScrolled(readScroll() > 8);
    onScroll();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', onScroll);
  }, [transparentOnTop]);

  const itemHover = hoverAttribute({ hover: itemAnimation ?? undefined });
  const itemStyle = motionStyle({ hover: itemAnimation ?? undefined });

  return (
    <header
      ref={headerRef}
      className={cx(
        s.header,
        s[layout],
        layout === 'sidebar' && (sidebarPosition === 'right' ? s.sideRight : s.sideLeft),
        sticky && s.sticky,
        // La barra inferior SIEMPRE lleva fondo (el cristal no tiene sentido ahí).
        transparentOnTop && layout !== 'bottom' && !scrolled && s.transparent,
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
          {layout === 'sidebar' && !brand.logoUrl && (
            <span className={s.brandInitial} aria-hidden="true">
              {brand.name.charAt(0)}
            </span>
          )}
          <span className={s.brandName} style={{ color: brandColor || undefined }}>
            {brand.name}
          </span>
        </a>

        {mobileMenu !== 'hidden' && (
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

        <nav
          id="dsg-nav"
          className={cx(s.nav, mobileMenu === 'hidden' && s.navHidden)}
          data-open={mobileMenu !== 'hidden' ? menuOpen : undefined}
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
