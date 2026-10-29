import { useEffect, useRef } from 'react';

import type { EffectProps } from './InteractiveBackground';
import { effectVars } from './InteractiveBackground';

import s from './backgrounds.module.scss';

interface Streak {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  active: boolean;
}

/**
 * Shooting stars: bright streaks crossing the sky diagonally with a
 * fading tail, launched at random intervals. Canvas-driven.
 */
export function ShootingStars({ effect }: EffectProps) {
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

    let width = 1;
    let height = 1;
    let frame = 0;
    let cooldown = 40;
    let streaks: Streak[] = [];

    const launch = (): Streak => {
      const fromLeft = Math.random() > 0.5;
      const startX = fromLeft ? Math.random() * width * 0.5 : width * (0.5 + Math.random() * 0.5);
      const startY = Math.random() * height * 0.4;
      const vx = (fromLeft ? 1 : -1) * (4 + Math.random() * 4) * speed;
      const vy = (1.5 + Math.random() * 2.5) * speed;
      return { x: startX, y: startY, vx, vy, life: 0, maxLife: 70, active: true };
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

      streaks = [launch(), launch()];
      streaks[1]!.life = 40; // desfasada para que no crucen a la vez
    };

    const draw = (): void => {
      context.clearRect(0, 0, width, height);

      if (!reduceMotion) {
        cooldown -= 1;
        if (cooldown <= 0) {
          const idle = streaks.find((streak) => !streak.active);
          if (idle) Object.assign(idle, launch());
          cooldown = 90 + Math.random() * 140;
        }
      }

      for (const streak of streaks) {
        if (!reduceMotion && streak.active) {
          streak.x += streak.vx;
          streak.y += streak.vy;
          streak.life += 1;
          if (
            streak.life >= streak.maxLife ||
            streak.x < -120 ||
            streak.x > width + 120 ||
            streak.y > height + 60
          ) {
            streak.active = false;
          }
        }
        if (!streak.active) continue;

        const fade = 1 - streak.life / streak.maxLife;
        const tailX = streak.x - streak.vx * 22;
        const tailY = streak.y - streak.vy * 22;

        const gradient = context.createLinearGradient(streak.x, streak.y, tailX, tailY);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        context.strokeStyle = gradient;
        context.globalAlpha = fade * (0.6 + effect.intensity * 0.5);
        context.lineWidth = 3.5;
        context.lineCap = 'round';
        context.beginPath();
        context.moveTo(streak.x, streak.y);
        context.lineTo(tailX, tailY);
        context.stroke();

        // Bright head.
        context.fillStyle = color;
        context.globalAlpha = fade;
        context.beginPath();
        context.arc(streak.x, streak.y, 4, 0, Math.PI * 2);
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
      data-effect="shooting-stars"
      aria-hidden="true"
      style={effectVars(effect)}
    />
  );
}
