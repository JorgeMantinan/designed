import { useEffect, useRef } from 'react';

import type { EffectProps } from './InteractiveBackground';
import { effectVars } from './InteractiveBackground';

import s from './backgrounds.module.scss';

const BAR_WIDTH = 14;
const BAR_GAP = 8;

/**
 * Equalizer: rounded bars along the bottom edge bouncing on layered
 * sine waves (like an audio visualizer). Canvas-driven.
 */
export function Equalizer({ effect }: EffectProps) {
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
    let bars = 1;

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

      bars = Math.max(1, Math.floor(width / (BAR_WIDTH + BAR_GAP)));
    };

    const draw = (): void => {
      context.clearRect(0, 0, width, height);
      if (!reduceMotion) time += 0.03 * speed;

      const maxHeight = height * 0.55 * (0.35 + effect.intensity * 0.65);
      context.fillStyle = color;

      for (let index = 0; index < bars; index += 1) {
        // Two layered sines + slow drift keep the motion organic.
        const wave =
          Math.sin(time * 2 + index * 0.55) * 0.5 +
          Math.sin(time * 1.1 + index * 0.23) * 0.35 +
          Math.sin(time * 0.6 + index * 0.09) * 0.15;
        const normalized = (wave + 1) / 2;
        const barHeight = 10 + normalized * maxHeight;

        const x = index * (BAR_WIDTH + BAR_GAP) + BAR_GAP / 2;
        context.globalAlpha = 0.25 + normalized * 0.6;
        context.beginPath();
        // Rounded-top bar (manual arc: canvas roundRect may be missing in older browsers).
        const top = height - barHeight;
        context.moveTo(x, height);
        context.lineTo(x, top + BAR_WIDTH / 2);
        context.arc(x + BAR_WIDTH / 2, top + BAR_WIDTH / 2, BAR_WIDTH / 2, Math.PI, 0);
        context.lineTo(x + BAR_WIDTH, height);
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
      data-effect="equalizer"
      aria-hidden="true"
      style={effectVars(effect)}
    />
  );
}
