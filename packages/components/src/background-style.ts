import type { BackgroundSpec } from '@designed/schema';
import type { CSSProperties } from 'react';

/** Maps a schema background to inline CSS (colors, gradients, images). */
export function backgroundToStyle(background: BackgroundSpec | undefined): CSSProperties {
  if (!background) return {};

  switch (background.type) {
    case 'color':
      return { backgroundColor: background.color };

    case 'gradient': {
      const { type, angle, stops } = background.gradient;
      const stopsText = stops
        .map((stop) => `${stop.color}${stop.position != null ? ` ${stop.position}%` : ''}`)
        .join(', ');
      const image =
        type === 'radial'
          ? `radial-gradient(${stopsText})`
          : type === 'conic'
            ? `conic-gradient(from ${angle}deg, ${stopsText})`
            : `linear-gradient(${angle}deg, ${stopsText})`;
      return { backgroundImage: image };
    }

    case 'image':
      return {
        backgroundImage: `url(${background.src})`,
        backgroundSize: background.size,
        backgroundPosition: background.position,
        backgroundAttachment: background.fixed ? 'fixed' : 'scroll',
      };

    case 'interactive':
      // Effect layer arrives in the next phase; paint the base color now.
      return background.baseColor ? { backgroundColor: background.baseColor } : {};
  }
}
