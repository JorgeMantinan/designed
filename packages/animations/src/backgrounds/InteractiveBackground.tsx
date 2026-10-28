import type { InteractiveBackgroundSpec } from '@designed/schema';
import type { CSSProperties, RefObject } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import { Dots, RetroGrid, Ripples, Spotlight, Waves } from './CssEffects';
import { AuroraCurtains } from './AuroraCurtains';
import { Confetti } from './Confetti';
import { Constellation } from './Constellation';
import { Equalizer } from './Equalizer';
import { Fire } from './Fire';
import { GridGlow } from './GridGlow';
import { Matrix } from './Matrix';
import { Particles } from './Particles';
import { Rain } from './Rain';
import { Shapes } from './Shapes';
import { ShootingStars } from './ShootingStars';
import { Snow } from './Snow';
import { Sparks } from './Sparks';

export interface EffectProps {
  effect: InteractiveBackgroundSpec;
  /** Section element used to track the pointer (optional for SSR). */
  hostRef?: RefObject<HTMLElement | null>;
}

export interface InteractiveBackgroundProps {
  /** The parsed interactive background spec from the section. */
  background: InteractiveBackgroundSpec;
  hostRef?: RefObject<HTMLElement | null>;
}

/**
 * Subscribes to `pointermove` on the section host and forwards the
 * coordinates (relative to the host) to `onMove`. Handlers should write CSS
 * custom properties directly on the layer — no React re-renders per frame.
 */
export function useHostPointer(
  hostRef: RefObject<HTMLElement | null> | undefined,
  onMove: (x: number, y: number, rect: DOMRect) => void,
): void {
  useEffect(() => {
    const host = hostRef?.current;
    if (!host) return;

    const handler = (event: PointerEvent): void => {
      onMove(event.clientX, event.clientY, host.getBoundingClientRect());
    };
    host.addEventListener('pointermove', handler, { passive: true });
    return () => host.removeEventListener('pointermove', handler);
  }, [hostRef, onMove]);
}

/**
 * Shared pointer tracking for effects that follow the cursor: writes
 * `--spot-x` / `--spot-y` (px, relative to the layer) and returns the layer ref.
 */
export function usePointerVars(
  hostRef?: RefObject<HTMLElement | null>,
): RefObject<HTMLDivElement | null> {
  const layerRef = useRef<HTMLDivElement | null>(null);

  const onMove = useCallback((x: number, y: number, rect: DOMRect) => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.style.setProperty('--spot-x', `${x - rect.left}px`);
    layer.style.setProperty('--spot-y', `${y - rect.top}px`);
  }, []);

  useHostPointer(hostRef, onMove);
  return layerRef;
}

/** CSS custom properties shared by every effect (color, intensity, speed). */
export function effectVars(effect: InteractiveBackgroundSpec): CSSProperties {
  return {
    '--effect-color': effect.effectColor ?? 'var(--color-primary)',
    '--effect-intensity': String(effect.intensity),
    '--effect-speed': String(Math.max(effect.speed, 0.05)),
  } as CSSProperties;
}

/** Dispatches the effect layer that matches an interactive background. */
export function InteractiveBackground({ background, hostRef }: InteractiveBackgroundProps) {
  const props: EffectProps = { effect: background, hostRef };

  switch (background.effect) {
    case 'spotlight':
      return <Spotlight {...props} />;
    case 'particles':
      return <Particles {...props} />;
    case 'dots':
      return <Dots {...props} />;
    case 'waves':
      return <Waves {...props} />;
    case 'retro-grid':
      return <RetroGrid {...props} />;
    case 'ripples':
      return <Ripples {...props} />;
    case 'rain':
      return <Rain {...props} />;
    case 'constellation':
      return <Constellation {...props} />;
    case 'grid-glow':
      return <GridGlow {...props} />;
    case 'matrix':
      return <Matrix {...props} />;
    case 'confetti':
      return <Confetti {...props} />;
    case 'snow':
      return <Snow {...props} />;
    case 'aurora-curtains':
      return <AuroraCurtains {...props} />;
    case 'fire':
      return <Fire {...props} />;
    case 'sparks':
      return <Sparks {...props} />;
    case 'shooting-stars':
      return <ShootingStars {...props} />;
    case 'equalizer':
      return <Equalizer {...props} />;
    case 'shapes':
      return <Shapes {...props} />;
    default:
      return null;
  }
}
