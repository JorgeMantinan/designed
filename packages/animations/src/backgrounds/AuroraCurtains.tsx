import { useEffect, useRef } from 'react';

import type { EffectProps } from './InteractiveBackground';
import { effectVars } from './InteractiveBackground';

import s from './backgrounds.module.scss';

interface Curtain {
  x: number;
  width: number;
  amplitude: number;
  frequency: number;
  phase: number;
  speed: number;
  alpha: number;
}

/**
 * Aurora curtains: vertical light bands whose edges follow sine waves,
 * painted with vertical alpha gradients so they fade at top and bottom.
 * Canvas-driven (the old CSS version was too subtle to perceive).
 */
export function AuroraCurtains({ effect }: EffectProps) {
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
    let time = 0;
    let curtains: Curtain[] = [];

    const makeCurtains = (): Curtain[] => {
      const count = 4;
      return Array.from({ length: count }, (_, index) => ({
        x: (width / (count + 1)) * (index + 1) - 60 + Math.random() * 60,
        width: 70 + Math.random() * 90,
        amplitude: 40 + Math.random() * 70,
        frequency: 0.004 + Math.random() * 0.004,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.7,
        alpha: 0.22 + Math.random() * 0.2,
      }));
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

      curtains = makeCurtains();
    };

    const draw = (): void => {
      context.clearRect(0, 0, width, height);
      if (!reduceMotion) time += 0.016 * speed;

      const step = 10;
      for (const curtain of curtains) {
        const gradient = context.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.3, color);
        gradient.addColorStop(0.65, color);
        gradient.addColorStop(1, 'transparent');
        context.fillStyle = gradient;
        context.globalAlpha = curtain.alpha * (0.5 + effect.intensity * 0.8);

        context.beginPath();
        for (let y = 0; y <= height; y += step) {
          const x =
            curtain.x +
            Math.sin(y * curtain.frequency + time * curtain.speed + curtain.phase) *
              curtain.amplitude;
          if (y === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        for (let y = height; y >= 0; y -= step) {
          const x =
            curtain.x +
            curtain.width +
            Math.sin(y * curtain.frequency + time * curtain.speed + curtain.phase + 0.9) *
              curtain.amplitude *
              0.7;
          context.lineTo(x, y);
        }
        context.closePath();
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
      data-effect="aurora-curtains"
      aria-hidden="true"
      style={effectVars(effect)}
    />
  );
}
