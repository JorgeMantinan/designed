import type { EffectProps } from './InteractiveBackground';
import { effectVars, usePointerVars } from './InteractiveBackground';

import s from './backgrounds.module.scss';

/**
 * CSS-driven interactive backgrounds (no per-frame JS except pointer vars):
 * spotlight, dot grid, waves, retro grid and ripples.
 */

/** Two-period sine path (period360 units) so translateX(-360) loops seamlessly. */
const WAVE_PATH =
  'M0 100 Q 90 40 180 100 T 360 100 T 540 100 T 720 100 T 900 100 T 1080 100 ' +
  'T 1260 100 T 1440 100 T 1620 100 T 1800 100 L 1800 200 L 0 200 Z';

/** Light that follows the pointer (writes --spot-x/--spot-y on the layer). */
export function Spotlight({ effect, hostRef }: EffectProps) {
  const layerRef = usePointerVars(hostRef);

  return (
    <div
      ref={layerRef}
      className={`${s.layer} ${s.spotlight}`}
      data-effect="spotlight"
      style={effectVars(effect)}
    />
  );
}

/** Slow-drifting radial gradients tinted with the effect color. */
/** Dot grid revealed in a circle around the pointer. */
export function Dots({ effect, hostRef }: EffectProps) {
  const layerRef = usePointerVars(hostRef);

  return (
    <div
      ref={layerRef}
      className={`${s.layer} ${s.dots}`}
      data-effect="dots"
      style={effectVars(effect)}
    />
  );
}

/** Two overlapping sine waves sliding along the bottom of the section. */
export function Waves({ effect }: EffectProps) {
  return (
    <div className={`${s.layer} ${s.wavesWrap}`} data-effect="waves" style={effectVars(effect)}>
      <svg
        className={s.wavesSvg}
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path className={s.wave} d={WAVE_PATH} />
        <path className={s.waveAlt} d={WAVE_PATH} />
      </svg>
    </div>
  );
}

/** Retro synthwave grid scrolling in perspective from the horizon. */
export function RetroGrid({ effect }: EffectProps) {
  return (
    <div
      className={`${s.layer} ${s.retroGrid}`}
      data-effect="retro-grid"
      style={effectVars(effect)}
    />
  );
}

/** Rings that expand from the pointer position (uses --spot-x/--spot-y). */
export function Ripples({ effect, hostRef }: EffectProps) {
  const layerRef = usePointerVars(hostRef);

  return (
    <div
      ref={layerRef}
      className={`${s.layer} ${s.ripples}`}
      data-effect="ripples"
      style={effectVars(effect)}
    >
      <span className={s.rippleRing} />
      <span className={s.rippleRing} />
      <span className={s.rippleRing} />
    </div>
  );
}
