import { useCallback, useEffect, useRef } from 'react';

import type { EffectProps } from './InteractiveBackground';
import { effectVars, useHostPointer } from './InteractiveBackground';

import s from './backgrounds.module.scss';

const CELL = 26;
/** Radius (px) around the pointer where squares light up. */
const GLOW_RADIUS = 165;

/**
 * Grid glow: a full grid of small squares that brighten and grow near
 * the pointer, with a subtle diagonal wave drifting across the grid.
 * Canvas-driven for smooth per-frame updates without layout work.
 */
export function GridGlow({ effect, hostRef }: EffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointer = useRef({ x: -9999, y: -9999 });

  const track = useCallback((x: number, y: number, rect: DOMRect) => {
    pointer.current = { x: x - rect.left, y: y - rect.top };
  }, []);
  useHostPointer(hostRef, track);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const color =
      effect.effectColor?.trim() ||
      getComputedStyle(canvas).getPropertyValue('--color-primary').trim() ||
      '#6c5ce7';
    const speed = Math.max(effect.speed, 0.05);

    let width = 1;
    let height = 1;
    let frame = 0;
    let time = 0;

    const resize = (): void => {
      const rect = host.getBoundingClientRect();
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (): void => {
      context.clearRect(0, 0, width, height);
      if (!reduceMotion) time += 0.03 * speed;

      const px = pointer.current.x;
      const py = pointer.current.y;
      const base = 0.06 + effect.intensity * 0.06;

      for (let y = CELL / 2; y < height; y += CELL) {
        for (let x = CELL / 2; x < width; x += CELL) {
          const distance = Math.hypot(x - px, y - py);
          const glow = distance < GLOW_RADIUS ? 1 - distance / GLOW_RADIUS : 0;
          // Faint diagonal wave keeps the grid alive without the pointer.
          const wave = reduceMotion ? 0 : Math.sin(time - (x + y) * 0.012) * 0.5 + 0.5;
          const alpha = base + wave * 0.1 * effect.intensity + glow * glow * 0.8;
          context.globalAlpha = Math.min(1, alpha);
          context.fillStyle = color;
          const size = 4 + glow * 7;
          context.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }
      context.globalAlpha = 1;

      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    draw();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [effect]);

  return (
    <canvas
      ref={canvasRef}
      className={`${s.layer} ${s.canvas}`}
      data-effect="grid-glow"
      aria-hidden="true"
      style={effectVars(effect)}
    />
  );
}
