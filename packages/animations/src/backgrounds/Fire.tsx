import { useEffect, useRef } from 'react';

import type { EffectProps } from './InteractiveBackground';
import { effectVars } from './InteractiveBackground';

import s from './backgrounds.module.scss';

interface Flame {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  maxLife: number;
}

/**
 * Fire: flame particles spawning at the bottom edge, rising with jitter
 * and fading as they cool. Layered translucent circles give the glow
 * without additive blending (invisible on light backgrounds).
 */
export function Fire({ effect }: EffectProps) {
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
    const densityPerPx = 0.00003 + effect.intensity * 0.00006;

    let width = 1;
    let height = 1;
    let frame = 0;
    let flames: Flame[] = [];

    const makeFlame = (randomY: boolean): Flame => ({
      x: Math.random() * width,
      y: randomY ? height * (0.75 + Math.random() * 0.3) : height + 10,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (1.2 + Math.random() * 2) * speed,
      radius: 8 + Math.random() * 18,
      life: 0,
      maxLife: 70 + Math.random() * 70,
    });

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

      const count = Math.min(Math.round(width * height * densityPerPx), 160);
      flames = Array.from({ length: count }, () => makeFlame(true));
    };

    const draw = (): void => {
      context.clearRect(0, 0, width, height);

      for (const flame of flames) {
        if (!reduceMotion) {
          flame.life += 1;
          flame.x += flame.vx + Math.sin((flame.life + flame.x) * 0.08) * 0.6;
          flame.y -= flame.vy;
          if (flame.life >= flame.maxLife || flame.y < -40) {
            Object.assign(flame, makeFlame(false));
          }
        }

        const progress = flame.life / flame.maxLife;
        const radius = flame.radius * (1 - progress * 0.65);
        context.globalAlpha = (1 - progress) * (0.25 + effect.intensity * 0.45);
        context.fillStyle = color;
        context.beginPath();
        context.arc(flame.x, flame.y, Math.max(radius, 1), 0, Math.PI * 2);
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
      data-effect="fire"
      aria-hidden="true"
      style={effectVars(effect)}
    />
  );
}
