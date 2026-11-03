import { useEffect, useRef } from 'react';

import type { EffectProps } from './InteractiveBackground';
import { effectVars } from './InteractiveBackground';

import s from './backgrounds.module.scss';

interface Bubble {
  x: number;
  y: number;
  radius: number;
  speed: number;
  /** Horizontal wobble phase (radians). */
  phase: number;
  wobble: number;
  alpha: number;
}

/**
 * Bubbles: translucent circles rising from the bottom with a gentle
 * horizontal wobble, like air in water. Canvas-driven.
 */
export function Bubbles({ effect }: EffectProps) {
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
    let bubbles: Bubble[] = [];

    const makeBubble = (randomY = true): Bubble => ({
      x: Math.random() * width,
      y: randomY ? Math.random() * height : height + 20,
      radius: 4 + Math.random() * 14,
      speed: (0.4 + Math.random() * 0.9) * (0.5 + speed),
      phase: Math.random() * Math.PI * 2,
      wobble: 0.4 + Math.random() * 0.8,
      alpha: 0.12 + Math.random() * 0.25,
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

      const count = Math.round(Math.min(40, Math.max(12, width / 28)));
      bubbles = Array.from({ length: count }, () => makeBubble(true));
    };

    const draw = (): void => {
      context.clearRect(0, 0, width, height);
      const intensity = 0.4 + effect.intensity * 0.6;

      for (const bubble of bubbles) {
        if (!reduceMotion) {
          bubble.y -= bubble.speed;
          bubble.phase += 0.02;
          if (bubble.y + bubble.radius < -10) Object.assign(bubble, makeBubble(false));
        }

        const x = bubble.x + Math.sin(bubble.phase) * bubble.wobble * 12;

        // Body: soft translucent fill.
        context.globalAlpha = bubble.alpha * intensity;
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, bubble.y, bubble.radius, 0, Math.PI * 2);
        context.fill();

        // Rim: brighter outline + highlight dot.
        context.globalAlpha = bubble.alpha * 1.8 * intensity;
        context.strokeStyle = color;
        context.lineWidth = 1.2;
        context.stroke();

        context.globalAlpha = 0.5 * intensity;
        context.fillStyle = '#ffffff';
        context.beginPath();
        context.arc(
          x - bubble.radius * 0.35,
          bubble.y - bubble.radius * 0.35,
          Math.max(1, bubble.radius * 0.18),
          0,
          Math.PI * 2,
        );
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
      data-effect="bubbles"
      aria-hidden="true"
      style={effectVars(effect)}
    />
  );
}
