/**
 * Shadow string ⇄ editable parts. The theme stores shadows as CSS strings
 * ("0 4px 12px rgb(0 0 0 / 0.1)"); the visual editor needs numbers, so we
 * parse them here and build the CSS back after every slider change.
 */

export interface ShadowParts {
  x: number;
  y: number;
  blur: number;
  spread: number;
  /** Hex color without alpha (#000000). */
  color: string;
  /** Alpha 0-1. */
  opacity: number;
}

export const DEFAULT_SHADOW_PARTS: ShadowParts = {
  x: 0,
  y: 4,
  blur: 12,
  spread: 0,
  color: '#000000',
  opacity: 0.1,
};

/** Parses "0 4px 12px rgb(0 0 0 / 0.1)". Returns null for 'none'/garbage. */
export function parseShadow(css: string | undefined): ShadowParts | null {
  if (!css || css === 'none') return null;
  // CSS permite "0" sin unidad para los offsets, hence (?:px)? en cada valor.
  const match = css
    .trim()
    .match(
      /^(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?(?:\s+(-?[\d.]+)(?:px)?)?\s+(.+)$/,
    );
  if (!match) return null;
  const [, x, y, blur, spread, colorText = ''] = match;
  const color = parseShadowColor(colorText.trim());
  if (!color) return null;
  return {
    x: Number(x),
    y: Number(y),
    blur: Number(blur),
    spread: spread != null ? Number(spread) : 0,
    ...color,
  };
}

/** Hex + alpha from `rgb(r g b / a)`, `rgba(r,g,b,a)` or #rgb/#rrggbb. */
function parseShadowColor(text: string): { color: string; opacity: number } | null {
  const rgb = text.match(
    /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/,
  );
  if (rgb) {
    const alphaText = rgb[4];
    const alpha =
      alphaText == null
        ? 1
        : alphaText.endsWith('%')
          ? Number(alphaText.slice(0, -1)) / 100
          : Number(alphaText);
    const hex = (part: string): string => Math.round(Number(part)).toString(16).padStart(2, '0');
    return { color: `#${hex(rgb[1]!)}${hex(rgb[2]!)}${hex(rgb[3]!)}`, opacity: alpha };
  }
  if (/^#[0-9a-fA-F]{6}$/.test(text)) return { color: text.toLowerCase(), opacity: 1 };
  if (/^#[0-9a-fA-F]{3}$/.test(text)) {
    const lower = text.toLowerCase();
    return {
      color: `#${lower[1]}${lower[1]}${lower[2]}${lower[2]}${lower[3]}${lower[3]}`,
      opacity: 1,
    };
  }
  return null;
}

/** Builds the CSS string back from editable parts. */
export function buildShadow(parts: ShadowParts): string {
  const hex = parts.color.replace('#', '');
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  const alpha = Math.round(Math.min(1, Math.max(0, parts.opacity)) * 100) / 100;
  return `${parts.x}px ${parts.y}px ${parts.blur}px ${parts.spread}px rgb(${r} ${g} ${b} / ${alpha})`;
}
