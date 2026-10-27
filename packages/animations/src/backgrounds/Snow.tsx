import { useEffect, useRef } from 'react';

import type { EffectProps } from './InteractiveBackground';
import { effectVars } from './InteractiveBackground';

import s from './backgrounds.module.scss';

interface Flake {
  x: number;
  y: number;
  radius: number;
  vy: number;
  sway: number;
  phase: number;
  alpha: number;
}

/**
 * Snow: soft flakes falling with a sine sway, varied size and depth for
 * parallax. Canvas-driven, DPR-aware, static frame under
 * prefers-reduced-motion.
 */
export function Snow({ effect }: EffectProps) {
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
    const speed = Math.max(effect.speed, 0.05);
    const densityPerPx = 0.00002 + effect.intensity * 0.00005;

    let width = 1;
    let height = 1;
    let frame = 0;
    let time = 0;
    let flakes: Flake[] = [];

    const makeFlake = (randomY: boolean): Flake => {
      const near = Math.random() > 0.5;
      return {
        x: Math.random() * width,
        y: randomY ? Math.random() * height : -10 - Math.random() * 60,
        radius: near ? 2.4 + Math.random() * 2.4 : 1 + Math.random() * 1.6,
        vy: (near ? 0.9 : 0.45) * speed + Math.random() * 0.4,
        sway: 14 + Math.random() * 30,
        phase: Math.random() * Math.PI * 2,
        alpha: near ? 0.65 + Math.random() * 0.35 : 0.25 + Math.random() * 0.3,
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

      const count = Math.min(Math.round(width * height * densityPerPx), 120);
      flakes = Array.from({ length: count }, () => makeFlake(true));
    };

    const draw = (): void => {
      context.clearRect(0, 0, width, height);
      if (!reduceMotion) time += 0.012 * speed;

      context.fillStyle = color;
      for (const flake of flakes) {
        if (!reduceMotion) {
          flake.y += flake.vy;
          if (flake.y - flake.radius > height) Object.assign(flake, makeFlake(false));
        }

        const swayX = Math.sin(time + flake.phase) * flake.sway;
        context.globalAlpha = flake.alpha;
        context.beginPath();
        context.arc(flake.x + swayX, flake.y, flake.radius, 0, Math.PI * 2);
        context.fill();
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
      data-effect="snow"
      aria-hidden="true"
      style={effectVars(effect)}
    />
  );
}
