import { useEffect, useRef } from 'react';

import type { EffectProps } from './InteractiveBackground';
import { effectVars } from './InteractiveBackground';

import s from './backgrounds.module.scss';

interface Drop {
  x: number;
  y: number;
  /** Streak length in px (varies per drop for depth). */
  length: number;
  /** Fall speed in px/frame. */
  speed: number;
  /** Base opacity 0-1 (far drops are fainter). */
  opacity: number;
  /** Horizontal wind drift in px/frame. */
  drift: number;
}

/**
 * Realistic canvas rain: individual streaks with varied length, speed,
 * opacity and wind drift (two depth layers), DPR-aware, paused into a
 * single static frame when the user prefers reduced motion.
 */
export function Rain({ effect }: EffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
    const speedFactor = Math.max(effect.speed, 0.05);
    const densityPerPx = 0.00004 + effect.intensity * 0.0001;

    let width = 1;
    let height = 1;
    let frame = 0;
    let drops: Drop[] = [];

    const makeDrop = (randomY: boolean): Drop => {
      // Two depth layers: near drops are longer, faster and more opaque.
      const near = Math.random() > 0.45;
      return {
        x: Math.random() * (width + 120) - 60,
        y: randomY ? Math.random() * (height + 80) : -40 - Math.random() * 160,
        length: near ? 16 + Math.random() * 18 : 7 + Math.random() * 9,
        speed: (near ? 9 : 5) * speedFactor + Math.random() * 3,
        opacity: near ? 0.35 + Math.random() * 0.45 : 0.12 + Math.random() * 0.2,
        drift: 0.8 + Math.random() * 1.6,
      };
    };

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

      const count = Math.min(Math.round(width * height * densityPerPx), 220);
      drops = Array.from({ length: count }, () => makeDrop(true));
    };

    const draw = (): void => {
      context.clearRect(0, 0, width, height);
      context.lineCap = 'round';

      for (const drop of drops) {
        if (!reduceMotion) {
          drop.y += drop.speed;
          drop.x += drop.drift;
          // Recycle past the bottom (with wind drift) back to the top.
          if (drop.y - drop.length > height || drop.x - 60 > width) {
            Object.assign(drop, makeDrop(false));
          }
        }

        context.globalAlpha = drop.opacity;
        context.strokeStyle = color;
        context.lineWidth = drop.length > 14 ? 1.6 : 1;
        context.beginPath();
        context.moveTo(drop.x, drop.y);
        // Slight lean follows the wind drift.
        context.lineTo(drop.x - drop.drift * 4, drop.y - drop.length);
        context.stroke();
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
      data-effect="rain"
      aria-hidden="true"
      style={effectVars(effect)}
    />
  );
}
