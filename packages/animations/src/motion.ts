import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';
import type { AnimationInput } from '@designed/schema';

/**
 * Motion engine: entrance (scroll/load) + hover slots for every component.
 *
 * - Entrance uses CSS keyframes triggered by an IntersectionObserver.
 * - Hover is driven by a `data-hover` attribute plus CSS custom properties
 *   for duration/easing/intensity, so one global stylesheet covers all
 *   components (buttons, cards, menu items...).
 *
 * Pattern: the component owns the ref (`useRef`) and passes it in — the hook
 * only returns render values, never a ref (keeps `react-hooks/refs` happy).
 * Accepts partial animations (input types) and fills defaults at runtime.
 */

export interface MotionValues {
  /** Entrance classes: `dsg-reveal dsg-entrance--<type> [is-revealed]`. */
  className?: string;
  /** CSS custom properties for entrance timing + hover intensity. */
  style?: CSSProperties;
  /** Value for the `data-hover` attribute (undefined when no hover effect). */
  hoverType?: string;
}

/** Pure: entrance classes for a given animation slot and reveal state. */
export function motionClassName(
  animation: AnimationInput | undefined,
  revealed: boolean,
): string | undefined {
  const entrance = animation?.entrance;
  if (!entrance) return undefined;
  return ['dsg-reveal', `dsg-entrance--${entrance.type}`, revealed ? 'is-revealed' : '']
    .filter(Boolean)
    .join(' ');
}

/** Pure: CSS custom properties for entrance timing and hover tuning. */
export function motionStyle(animation: AnimationInput | undefined): CSSProperties | undefined {
  if (!animation) return undefined;
  const variables: Record<string, string> = {};

  const entrance = animation.entrance;
  if (entrance) {
    variables['--entrance-duration'] = `${entrance.durationMs ?? 600}ms`;
    variables['--entrance-delay'] = `${entrance.delayMs ?? 0}ms`;
    variables['--entrance-easing'] = entrance.easing ?? 'ease-out';
  }

  const hover = animation.hover;
  if (hover && hover.type !== 'none') {
    variables['--hover-duration'] = `${hover.durationMs ?? 200}ms`;
    variables['--hover-easing'] = hover.easing ?? 'ease';
    variables['--hover-intensity'] = String(hover.intensity ?? 0.5);
  }

  return Object.keys(variables).length > 0 ? (variables as CSSProperties) : undefined;
}

/** Pure: the `data-hover` attribute value (undefined when none). */
export function hoverAttribute(animation: AnimationInput | undefined): string | undefined {
  const hover = animation?.hover;
  return hover && hover.type !== 'none' ? hover.type : undefined;
}

/**
 * Binds an animation slot to an element. The element ref is created by the
 * caller and passed in; the returned values are plain render data.
 *
 * Entrance reveals on scroll via IntersectionObserver (its callback is an
 * external subscription, so setState there is safe), or is marked revealed at
 * render time for `trigger: 'load'` (the CSS animation then plays on load —
 * identical on server and client, so hydration stays consistent).
 */
export function useMotion<T extends HTMLElement = HTMLDivElement>(
  animation: AnimationInput | undefined,
  ref: RefObject<T | null>,
): MotionValues {
  const [scrolled, setScrolled] = useState(false);
  const entrance = animation?.entrance;
  const loadRevealed = entrance?.trigger === 'load';

  useEffect(() => {
    if (!entrance || entrance.trigger === 'load') return;
    const element = ref.current;
    if (!element) return;

    // No IntersectionObserver (very old browser): reveal on the next frame so
    // the setState never happens synchronously inside the effect body.
    if (typeof IntersectionObserver === 'undefined') {
      const frame = requestAnimationFrame(() => setScrolled(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setScrolled(true);
            if (entrance.once) observer.unobserve(entry.target);
          } else if (!entrance.once) {
            setScrolled(false);
          }
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [entrance, ref]);

  const revealed = loadRevealed || scrolled;

  return {
    className: motionClassName(animation, revealed),
    style: motionStyle(animation),
    hoverType: hoverAttribute(animation),
  };
}

/** Convenience: creates the element ref a component passes to `useMotion`. */
export function useMotionRef<T extends HTMLElement = HTMLDivElement>(): RefObject<T | null> {
  return useRef<T | null>(null);
}
