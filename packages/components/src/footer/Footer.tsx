'use client';

import type { FooterSpec } from '@designed/schema';

import { backgroundToStyle } from '../background-style';
import { cx } from '../cx';
import { Icon } from '../icons';

import s from './Footer.module.scss';

export interface FooterProps extends FooterSpec {
  className?: string;
}

/** Multi-column footer with optional newsletter form and social links. */
export function Footer({
  columns,
  brandText,
  social,
  newsletter,
  copyright,
  background,
  className,
}: FooterProps) {
  const hasTop = columns.length > 0 || Boolean(brandText) || newsletter;

  return (
    <footer className={cx(s.footer, className)} style={backgroundToStyle(background)}>
      <div className={s.inner}>
        {hasTop && (
          <div className={s.top}>
            {brandText && <p className={s.brandText}>{brandText}</p>}

            {columns.length > 0 && (
              <div className={s.columns}>
                {columns.map((column) => (
                  <nav
                    key={column.id}
                    className={cx(
                      s.column,
                      column.contentAlign === 'center' && s.columnCenter,
                      column.contentAlign === 'end' && s.columnEnd,
                    )}
                    aria-label={column.title}
                  >
                    <h3 className={s.columnTitle}>{column.title}</h3>
                    <ul className={s.linkList}>
                      {column.links.map((link) => (
                        <li key={link.label}>
                          <a className={s.link} href={link.href} data-hover="underline">
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                ))}
              </div>
            )}

            {newsletter && (
              <form
                className={s.newsletter}
                onSubmit={(event) => {
                  event.preventDefault();
                }}
              >
                <label className={s.newsletterLabel} htmlFor="dsg-newsletter">
                  Recibe novedades
                </label>
                <div className={s.newsletterRow}>
                  <input
                    id="dsg-newsletter"
                    className={s.input}
                    type="email"
                    placeholder="tu@email.com"
                    required
                  />
                  <button className={s.submit} type="submit">
                    Suscribirme
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className={s.bottom}>
          {social.length > 0 && (
            <ul className={s.social}>
              {social.map((link) => (
                <li key={link.platform}>
                  <a
                    className={s.socialLink}
                    href={link.href}
                    aria-label={link.platform}
                    data-hover="scale"
                  >
                    <Icon name={link.platform === 'x' ? 'x_social' : link.platform} size={18} />
                  </a>
                </li>
              ))}
            </ul>
          )}
          {copyright && <p className={s.copyright}>{copyright}</p>}
        </div>
      </div>
    </footer>
  );
}
